
-- Subscriptions table for Pro paygate
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_type TEXT NOT NULL DEFAULT 'jobseeker_pro',
  plan_tier TEXT NOT NULL DEFAULT 'premium',
  status TEXT NOT NULL DEFAULT 'active',
  features JSONB DEFAULT '{}'::jsonb,
  price_paid NUMERIC,
  currency TEXT DEFAULT 'ZAR',
  provider TEXT,
  provider_subscription_id TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins manage all subscriptions"
  ON public.subscriptions FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Blog posts table for SEO content automation
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT DEFAULT 'Jobbyist Editorial',
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  reading_minutes INT DEFAULT 5,
  views_count INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts viewable by everyone"
  ON public.blog_posts FOR SELECT TO public
  USING (is_published = true);

CREATE POLICY "Admins manage blog posts"
  ON public.blog_posts FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes for SEO + filtering
CREATE INDEX IF NOT EXISTS idx_jobs_status_posted ON public.jobs(status, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_location_lower ON public.jobs(LOWER(location));
CREATE INDEX IF NOT EXISTS idx_jobs_country_remote ON public.jobs(country, is_remote);
