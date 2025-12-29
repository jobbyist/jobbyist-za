-- Add company claim functionality
ALTER TABLE public.companies
ADD COLUMN claimed_by UUID REFERENCES auth.users(id),
ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN claim_status TEXT DEFAULT 'unclaimed' CHECK (claim_status IN ('unclaimed', 'pending', 'approved', 'rejected')),
ADD COLUMN claim_notes TEXT;

-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for company logos
CREATE POLICY "Company logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload company logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Admins can manage company logos"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'company-logos' AND public.is_admin(auth.uid()));

-- Index for faster claim queries
CREATE INDEX idx_companies_claimed_by ON public.companies(claimed_by);
CREATE INDEX idx_companies_claim_status ON public.companies(claim_status);
