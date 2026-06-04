-- Programmatic SEO helper RPCs for Jobbyist ZA.
-- These functions are optional because the repository also includes scripts/generate-programmatic-seo.mjs.
-- They are useful when you want Supabase to return metrics for /jobs/[category]/[city] pages directly.

create or replace function public.get_programmatic_job_combo(
  p_category_keywords text[],
  p_city_aliases text[],
  p_city_slug text,
  p_limit integer default 10
)
returns table (
  total_jobs bigint,
  top_jobs jsonb,
  top_companies jsonb,
  average_salary numeric
)
language sql
stable
as $$
  with matched_jobs as (
    select
      j.id,
      j.title,
      j.description,
      j.location,
      j.country,
      j.is_remote,
      j.job_type,
      j.employment_type,
      j.salary_min,
      j.salary_max,
      j.salary_currency,
      j.salary_period,
      j.posted_at,
      j.expires_at,
      j.application_deadline,
      j.skills,
      c.id as company_id,
      c.name as company_name,
      c.logo_url as company_logo_url,
      c.industry as company_industry,
      c.website as company_website,
      c.is_verified as company_is_verified
    from public.jobs j
    left join public.companies c on c.id = j.company_id
    where j.status = 'active'
      and j.country = 'ZA'
      and (
        (p_city_slug = 'remote' and j.is_remote = true)
        or (
          p_city_slug <> 'remote'
          and exists (
            select 1
            from unnest(p_city_aliases) as city_alias
            where j.location ilike '%' || city_alias || '%'
          )
        )
      )
      and exists (
        select 1
        from unnest(p_category_keywords) as keyword
        where lower(
          concat_ws(' ',
            j.title,
            j.description,
            j.job_type,
            j.employment_type,
            array_to_string(j.skills, ' '),
            c.name,
            c.industry
          )
        ) like '%' || lower(keyword) || '%'
      )
  ),
  company_counts as (
    select
      company_id,
      coalesce(company_name, 'Confidential Company') as name,
      max(company_logo_url) as logo_url,
      max(company_industry) as industry,
      max(company_website) as website,
      count(*) as open_roles
    from matched_jobs
    group by company_id, coalesce(company_name, 'Confidential Company')
    order by open_roles desc, name asc
    limit 3
  ),
  salary_values as (
    select
      case
        when salary_min is not null and salary_max is not null then (salary_min + salary_max) / 2.0
        when salary_min is not null then salary_min::numeric
        when salary_max is not null then salary_max::numeric
        else null
      end as midpoint
    from matched_jobs
  )
  select
    (select count(*) from matched_jobs) as total_jobs,
    coalesce((
      select jsonb_agg(to_jsonb(job_row) order by job_row.posted_at desc)
      from (
        select * from matched_jobs order by posted_at desc nulls last limit p_limit
      ) job_row
    ), '[]'::jsonb) as top_jobs,
    coalesce((
      select jsonb_agg(to_jsonb(company_counts))
      from company_counts
    ), '[]'::jsonb) as top_companies,
    (select round(avg(midpoint)) from salary_values where midpoint is not null) as average_salary;
$$;

-- Example:
-- select * from public.get_programmatic_job_combo(
--   array['software developer', 'developer', 'software engineer', 'react', 'typescript'],
--   array['johannesburg', 'joburg', 'jhb', 'sandton'],
--   'johannesburg',
--   10
-- );
