// Edge function to send job application emails via Resend
// Sends to zajobs@jobbyist.africa with CC to support@jobbyist.africa
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobApplication {
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter?: string;
  resumeUrl?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured - email delivery disabled');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured',
          message: 'Application saved but email not sent'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const application: JobApplication = await req.json();

    // Create Supabase client to get resume signed URL if needed
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let resumeDownloadUrl = application.resumeUrl;
    if (application.resumeUrl && !application.resumeUrl.startsWith('http')) {
      // Generate signed URL for resume (valid for 7 days)
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(application.resumeUrl, 604800); // 7 days
      
      if (!error && data) {
        resumeDownloadUrl = data.signedUrl;
      }
    }

    // Prepare email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f8f9fa; padding: 30px 20px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .info-row { margin: 10px 0; }
    .label { font-weight: 600; color: #667eea; }
    .value { color: #333; margin-top: 5px; }
    .cover-letter { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 New Job Application</h1>
      <p style="margin: 10px 0 0 0;">You have a new application from Jobbyist</p>
    </div>
    
    <div class="content">
      <div class="info-box">
        <div class="info-row">
          <div class="label">Position Applied For</div>
          <div class="value">${application.jobTitle}</div>
        </div>
        <div class="info-row">
          <div class="label">Company</div>
          <div class="value">${application.companyName}</div>
        </div>
        <div class="info-row">
          <div class="label">Applicant Name</div>
          <div class="value">${application.applicantName}</div>
        </div>
        <div class="info-row">
          <div class="label">Applicant Email</div>
          <div class="value"><a href="mailto:${application.applicantEmail}">${application.applicantEmail}</a></div>
        </div>
        ${resumeDownloadUrl ? `
        <div class="info-row">
          <div class="label">Resume/CV</div>
          <div class="value"><a href="${resumeDownloadUrl}" class="button">Download Resume</a></div>
        </div>
        ` : ''}
      </div>

      ${application.coverLetter ? `
      <div class="info-box">
        <div class="label" style="margin-bottom: 10px;">Cover Letter</div>
        <div class="cover-letter">${application.coverLetter}</div>
      </div>
      ` : ''}

      <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px;">
        <p><strong>What's Next?</strong></p>
        <p>Review the application and reach out to the candidate directly at <a href="mailto:${application.applicantEmail}">${application.applicantEmail}</a></p>
        <p><a href="https://za.jobbyist.africa/job/${application.jobId}" class="button">View Job Listing</a></p>
      </div>
    </div>

    <div class="footer">
      <p>Jobbyist ZA - South Africa's #1 Job Board</p>
      <p>This application was submitted via <a href="https://za.jobbyist.africa">za.jobbyist.africa</a></p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jobbyist Applications <noreply@jobbyist.africa>',
        to: ['zajobs@jobbyist.africa'],
        cc: ['support@jobbyist.africa'],
        reply_to: application.applicantEmail,
        subject: `New Application: ${application.jobTitle} - ${application.applicantName}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend API error:', emailData);
      throw new Error(`Failed to send email: ${JSON.stringify(emailData)}`);
    }

    console.log('Application email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application email sent successfully',
        emailId: emailData.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending application email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
