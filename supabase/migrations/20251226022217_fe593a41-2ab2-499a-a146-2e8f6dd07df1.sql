-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('active', 'paused', 'closed', 'draft');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired');

-- Create enum for supported countries
CREATE TYPE public.country_code AS ENUM ('ZA', 'NG', 'KE', 'SZ', 'BW', 'ZM', 'ZW', 'MZ', 'NA', 'MW', 'TZ');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Profiles table for job seekers
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    headline TEXT,
    bio TEXT,
    location TEXT,
    country country_code,
    avatar_url TEXT,
    resume_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    years_of_experience INTEGER DEFAULT 0,
    skills TEXT[] DEFAULT '{}',
    education JSONB DEFAULT '[]',
    work_experience JSONB DEFAULT '[]',
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verification_notes TEXT,
    profile_completion INTEGER NOT NULL DEFAULT 0,
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Companies table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    industry TEXT,
    size TEXT,
    location TEXT,
    country country_code NOT NULL,
    founded_year INTEGER,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Jobs table (following Google Jobs Schema guidelines)
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    qualifications TEXT,
    job_type TEXT NOT NULL, -- Full-time, Part-time, Contract, etc.
    employment_type TEXT, -- FULL_TIME, PART_TIME, CONTRACTOR, etc. (Google schema)
    experience_level TEXT, -- Entry, Mid, Senior, etc.
    location TEXT NOT NULL,
    country country_code NOT NULL,
    is_remote BOOLEAN NOT NULL DEFAULT false,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'ZAR',
    salary_period TEXT DEFAULT 'month', -- hour, day, week, month, year
    skills TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    application_deadline TIMESTAMP WITH TIME ZONE,
    external_url TEXT,
    source_url TEXT, -- Original scraped URL
    source_name TEXT, -- Where it was scraped from
    status job_status NOT NULL DEFAULT 'active',
    views_count INTEGER NOT NULL DEFAULT 0,
    applications_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Job applications table
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    status application_status NOT NULL DEFAULT 'submitted',
    notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(job_id, user_id) -- One application per job per user
);

-- Waiting list for countries not yet active
CREATE TABLE public.waiting_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    country country_code NOT NULL,
    user_type TEXT NOT NULL DEFAULT 'job_seeker', -- job_seeker or employer
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(email, country)
);

-- Saved jobs (bookmarks)
CREATE TABLE public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, job_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'admin')
$$;

-- Function to calculate profile completion
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(_profile profiles)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    score INTEGER := 0;
    total INTEGER := 10;
BEGIN
    IF _profile.first_name IS NOT NULL AND _profile.first_name != '' THEN score := score + 1; END IF;
    IF _profile.last_name IS NOT NULL AND _profile.last_name != '' THEN score := score + 1; END IF;
    IF _profile.phone IS NOT NULL AND _profile.phone != '' THEN score := score + 1; END IF;
    IF _profile.headline IS NOT NULL AND _profile.headline != '' THEN score := score + 1; END IF;
    IF _profile.bio IS NOT NULL AND _profile.bio != '' THEN score := score + 1; END IF;
    IF _profile.location IS NOT NULL AND _profile.location != '' THEN score := score + 1; END IF;
    IF _profile.resume_url IS NOT NULL AND _profile.resume_url != '' THEN score := score + 2; END IF; -- Resume is worth 2 points
    IF array_length(_profile.skills, 1) > 0 THEN score := score + 1; END IF;
    IF jsonb_array_length(_profile.work_experience) > 0 THEN score := score + 1; END IF;
    
    RETURN (score * 100 / total);
END;
$$;

-- Trigger to update profile completion
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.profile_completion := public.calculate_profile_completion(NEW);
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_profile_completion_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_completion();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name'
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for companies
CREATE POLICY "Companies are viewable by everyone"
ON public.companies FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage companies"
ON public.companies FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for jobs
CREATE POLICY "Active jobs are viewable by everyone"
ON public.jobs FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can manage all jobs"
ON public.jobs FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for job_applications
CREATE POLICY "Users can view their own applications"
ON public.job_applications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create applications"
ON public.job_applications FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all applications"
ON public.job_applications FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for waiting_list (public insert, admin read)
CREATE POLICY "Anyone can join waiting list"
ON public.waiting_list FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view waiting list"
ON public.waiting_list FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for saved_jobs
CREATE POLICY "Users can view their saved jobs"
ON public.saved_jobs FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their saved jobs"
ON public.saved_jobs FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Storage policies for resumes
CREATE POLICY "Users can upload their own resume"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resume"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resume"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes' AND public.is_admin(auth.uid()));

-- Storage policies for avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes for performance
CREATE INDEX idx_jobs_country ON public.jobs(country);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_company ON public.jobs(company_id);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_applications_user ON public.job_applications(user_id);
CREATE INDEX idx_applications_job ON public.job_applications(job_id);
CREATE INDEX idx_profiles_user ON public.profiles(user_id);
CREATE INDEX idx_companies_country ON public.companies(country);