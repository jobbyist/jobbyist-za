import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  structuredData?: object;
  noindex?: boolean;
}

export const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://lovable.dev/opengraph-image-p98pqg.png',
  ogType = 'website',
  keywords = [],
  structuredData,
  noindex = false,
}: SEOHeadProps) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    if (keywords.length > 0) {
      updateMeta('keywords', keywords.join(', '));
    }

    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:image', ogImage, true);
    if (canonicalUrl) {
      updateMeta('og:url', canonicalUrl, true);
    }

    // Twitter
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);

    // Robots
    if (noindex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    } else if (canonical) {
      canonical.remove();
    }

    // Structured data (JSON-LD)
    const existingScript = document.querySelector('script[type="application/ld+json"][data-seo="true"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup structured data on unmount
      const script = document.querySelector('script[type="application/ld+json"][data-seo="true"]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, canonicalUrl, ogImage, ogType, keywords, structuredData, noindex]);

  return null;
};

// Generate JobPosting structured data for Google Jobs
export const generateJobPostingSchema = (job: {
  id: string;
  title: string;
  description: string;
  company: { name: string; logo_url?: string | null };
  location: string;
  country: string;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  job_type: string;
  posted_at: string;
  application_deadline?: string | null;
  is_remote: boolean;
}) => {
  const countryNames: Record<string, string> = {
    ZA: 'South Africa',
    NG: 'Nigeria',
    KE: 'Kenya',
    SZ: 'eSwatini',
    BW: 'Botswana',
    ZM: 'Zambia',
    ZW: 'Zimbabwe',
    MZ: 'Mozambique',
    NA: 'Namibia',
    MW: 'Malawi',
    TZ: 'Tanzania',
  };

  const employmentTypeMap: Record<string, string> = {
    'Full-time': 'FULL_TIME',
    'Part-time': 'PART_TIME',
    'Contract': 'CONTRACTOR',
    'Internship': 'INTERN',
    'Temporary': 'TEMPORARY',
  };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: job.company.name,
      value: job.id,
    },
    datePosted: job.posted_at,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      ...(job.company.logo_url && { logo: job.company.logo_url }),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: job.country,
      },
    },
    employmentType: employmentTypeMap[job.job_type] || 'FULL_TIME',
  };

  // Add remote work info
  if (job.is_remote) {
    schema.jobLocationType = 'TELECOMMUTE';
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: countryNames[job.country] || job.country,
    };
  }

  // Add salary info if available
  if (job.salary_min && job.salary_max) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.salary_currency || 'ZAR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: 'MONTH',
      },
    };
  }

  // Add application deadline if available
  if (job.application_deadline) {
    schema.validThrough = job.application_deadline;
  }

  return schema;
};

// Generate ItemList structured data for job listings
export const generateJobListSchema = (jobs: Array<{
  id: string;
  title: string;
  description: string;
  company: { name: string; logo_url?: string | null } | null;
  location: string;
  country: string;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  job_type: string;
  posted_at: string;
  application_deadline?: string | null;
  is_remote: boolean;
}>) => {
  const employmentTypeMap: Record<string, string> = {
    'Full-time': 'FULL_TIME',
    'Part-time': 'PART_TIME',
    'Contract': 'CONTRACTOR',
    'Internship': 'INTERN',
    'Temporary': 'TEMPORARY',
  };

  return {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    itemListElement: jobs
      .filter(job => job.company) // Only include jobs with valid company information
      .map((job, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: generateJobPostingSchema({
          ...job,
          company: job.company!,
        })
      })),
  };
};

// Generate JobSearch structured data for country pages
export const generateJobSearchSchema = (country: { name: string; code: string }, jobCount: number) => ({
  '@context': 'https://schema.org/',
  '@type': 'WebPage',
  name: `Jobs in ${country.name} - Jobbyist Africa`,
  description: `Find ${jobCount}+ job opportunities in ${country.name}. Browse the latest vacancies from top employers.`,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [],
    numberOfItems: jobCount,
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jobbyist.co.za',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Jobs',
        item: 'https://jobbyist.co.za/jobs',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: country.name,
        item: `https://jobbyist.co.za/jobs/${country.code.toLowerCase()}`,
      },
    ],
  },
});

export default SEOHead;
