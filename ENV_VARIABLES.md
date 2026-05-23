# Environment Variables Configuration

This document lists all environment variables required for the Jobbyist ZA application.

## Frontend Environment Variables (.env)

These variables are used by the Vite frontend application and must be prefixed with `VITE_`.

```bash
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID="vkwnhhwacizjiwusbmcm"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key-here"
VITE_SUPABASE_URL="https://vkwnhhwacizjiwusbmcm.supabase.co"

# Whitepaper access endpoint override (optional)
VITE_WHITEPAPER_ACCESS_REQUEST_ENDPOINT="https://your-form-handler.example.com/whitepaper"
```

**How to find these values:**
1. Go to your Supabase Dashboard
2. Navigate to Project Settings → API
3. Copy the Project URL → `VITE_SUPABASE_URL`
4. Copy the anon/public key → `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Project ID is in the URL → `VITE_SUPABASE_PROJECT_ID`

## Supabase Edge Function Environment Variables

These variables are set in the Supabase Dashboard and are used by Edge Functions.

### Required Secrets

Set these in: **Supabase Dashboard → Project Settings → Edge Functions → Manage secrets**

```bash
# Core Supabase (Always Required)
SUPABASE_URL="https://vkwnhhwacizjiwusbmcm.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Email Service (Required for job application emails)
RESEND_API_KEY="re_your_resend_api_key"

# Lead form transactional email routing (optional, used by send-lead-form edge function)
LEAD_FORMS_FROM="Jobbyist Forms <noreply@jobbyist.africa>"
LEAD_FORMS_TO="support@jobbyist.africa"
LEAD_FORMS_CC="privacy@jobbyist.africa,partnerships@jobbyist.africa"

# AI Features (Optional - for AI job matching and interview)
ANTHROPIC_API_KEY="sk-ant-your-anthropic-api-key"

# Job Scraping (Optional - for automated job ingestion)
FIRECRAWL_API_KEY="fc-your-firecrawl-api-key"

# SEO & Indexing (Optional - for Google Jobs integration)
GOOGLE_INDEXING_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project",...}'

# Payment Processing (Required for Pro subscriptions)
# Option 1: PayFast (Recommended for South Africa)
PAYFAST_MERCHANT_ID="your-merchant-id"
PAYFAST_MERCHANT_KEY="your-merchant-key"
PAYFAST_PASSPHRASE="your-passphrase"

# Option 2: Stripe (International fallback)
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

### How to Set Edge Function Secrets

```bash
# Using Supabase CLI
supabase secrets set RESEND_API_KEY=re_your_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Or via Dashboard
# 1. Go to Project Settings → Edge Functions
# 2. Click "Manage secrets"
# 3. Add each secret individually
```

## Service Setup Instructions

### 1. Resend (Email Service)

**Purpose**: Send job application emails to zajobs@jobbyist.africa

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain: `jobbyist.africa`
3. Add DNS records (SPF, DKIM, DMARC)
4. Create API key
5. Set `RESEND_API_KEY` in Supabase Edge Functions
6. Configure sender: `noreply@jobbyist.africa`

**DNS Records Required:**
```
TXT @ "v=spf1 include:amazonses.com include:resend.com ~all"
TXT resend._domainkey "..." (provided by Resend)
TXT _dmarc "v=DMARC1; p=none; rua=mailto:support@jobbyist.africa"
```

### 2. PayFast (Payment Processing)

**Purpose**: Process Pro subscription payments

1. Sign up at [payfast.co.za](https://www.payfast.co.za)
2. Complete business verification
3. Get credentials from Integration → API Credentials
4. Set test/live mode appropriately
5. Configure webhooks: `https://vkwnhhwacizjiwusbmcm.supabase.co/functions/v1/payfast-webhook`

**Required Settings:**
- Merchant ID
- Merchant Key
- Passphrase (set in security settings)
- ITN (Instant Transaction Notification) enabled

### 3. Google Indexing API (SEO)

**Purpose**: Rapid indexing of new/updated job listings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Indexing API"
4. Create a Service Account
5. Download JSON key file
6. Add service account email to Google Search Console with "Owner" permission
7. Copy entire JSON content to `GOOGLE_INDEXING_SERVICE_ACCOUNT` secret

**Service Account JSON Format:**
```json
{
  "type": "service_account",
  "project_id": "your-project-123456",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "indexing@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### 4. Anthropic (AI Features)

**Purpose**: AI job matching and interview questions

1. Sign up at [anthropic.com](https://console.anthropic.com)
2. Create API key
3. Set billing limits
4. Set `ANTHROPIC_API_KEY` secret

**Optional**: Only needed if using AI-powered features

### 5. Firecrawl (Job Scraping)

**Purpose**: Automated job listing scraping

1. Sign up at [firecrawl.dev](https://firecrawl.dev)
2. Get API key
3. Set `FIRECRAWL_API_KEY` secret

**Optional**: Only needed for automated job ingestion

## Email Addresses

Configure these email addresses at your email provider:

```
noreply@jobbyist.africa   → No-reply sender (configured in Resend)
zajobs@jobbyist.africa    → Main job applications inbox
support@jobbyist.africa   → Customer support (CC'd on applications)
privacy@jobbyist.africa   → Privacy inquiries
legal@jobbyist.africa     → Legal inquiries
partnerships@jobbyist.africa → Business partnerships
```

**Email Forwarding Setup:**
- Forward all addresses to your main support inbox
- Or use Google Workspace / Microsoft 365 for proper email accounts

## Verification Checklist

### Frontend
- [ ] `.env` file created with VITE_* variables
- [ ] Application connects to Supabase
- [ ] No console errors on startup

### Edge Functions
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `RESEND_API_KEY` set (test email sending)
- [ ] Payment secrets set (if using Pro features)
- [ ] Google Indexing secret set (if using SEO features)

### Email Service
- [ ] Domain verified in Resend
- [ ] DNS records configured
- [ ] Test email sent successfully
- [ ] Email received at zajobs@jobbyist.africa

### Payment Service
- [ ] PayFast account verified
- [ ] Webhooks configured
- [ ] Test payment processed
- [ ] Subscription created in database

### SEO Service
- [ ] Service account created
- [ ] Added to Search Console
- [ ] Test URL submission successful

## Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use different keys for dev/staging/production**
3. **Rotate secrets regularly** (every 90 days)
4. **Use environment-specific Supabase projects** (dev vs prod)
5. **Enable Supabase RLS policies** for all tables
6. **Monitor Edge Function logs** for errors
7. **Set up Supabase Edge Function rate limiting**

## Troubleshooting

### "Failed to send email"
- Check `RESEND_API_KEY` is set correctly
- Verify domain is verified in Resend
- Check Edge Function logs for detailed error

### "Payment failed"
- Verify PayFast credentials are correct
- Check webhook URL is accessible
- Review PayFast transaction logs

### "Google Indexing failed"
- Verify service account JSON is valid
- Check service account has Search Console access
- Review quota limits in Google Cloud Console

### "Cannot connect to Supabase"
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Check Supabase project is active
- Review browser console for CORS errors

## Support

For environment variable questions or setup issues:
- Email: support@jobbyist.africa
- Check Edge Function logs in Supabase Dashboard
- Review application logs in browser console

---

**Last Updated**: 2026-05-22
**Maintained By**: Jobbyist Development Team
