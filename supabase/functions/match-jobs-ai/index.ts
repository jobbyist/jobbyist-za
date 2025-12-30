import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration constants
const CLAUDE_MODEL = 'claude-3-sonnet-20240229';
const JOBS_BATCH_SIZE = 5;

interface MatchJobsRequest {
  resumeText?: string;
  parsedResume?: any;
  jobPreferences: {
    job_titles?: string[];
    locations?: string[];
    remote_preference?: string;
    salary_min?: number;
    salary_max?: number;
    industries?: string[];
    job_types?: string[];
  };
  action: 'parse_resume' | 'match_jobs' | 'generate_cover_letter';
  jobId?: string;
}

interface JobMatch {
  job: any;
  match_score: number;
  match_reasons: {
    skills_matched: string[];
    experience_fit: string;
    location_match: boolean;
    salary_match: boolean;
    overall_reasoning: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body: MatchJobsRequest = await req.json();
    const { action, resumeText, parsedResume, jobPreferences, jobId } = body;

    switch (action) {
      case 'parse_resume':
        return await parseResume(resumeText!, anthropicKey);
      
      case 'match_jobs':
        return await matchJobs(user.id, parsedResume, jobPreferences, supabase, anthropicKey);
      
      case 'generate_cover_letter':
        if (!jobId) throw new Error('Job ID required for cover letter generation');
        return await generateCoverLetter(jobId, parsedResume, supabase, anthropicKey);
      
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function parseResume(resumeText: string, anthropicKey: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Parse this resume and extract structured information. Return ONLY valid JSON with no additional text.

Resume:
${resumeText}

Extract the following information:
{
  "personal_info": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string"
  },
  "summary": "string",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "start_date": "string",
      "end_date": "string",
      "description": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "years_of_experience": number
}`
      }]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${data.error?.message || 'Unknown error'}`);
  }

  let parsedData;
  try {
    const content = data.content[0].text;
    parsedData = JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse AI response:', data.content[0].text);
    throw new Error('Failed to parse resume data from AI response');
  }

  return new Response(
    JSON.stringify({ success: true, parsed_resume: parsedData }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function matchJobs(
  userId: string,
  parsedResume: any,
  jobPreferences: any,
  supabase: any,
  anthropicKey: string
) {
  // Fetch active jobs from database based on preferences
  let query = supabase
    .from('jobs')
    .select('*, companies(*)')
    .eq('status', 'active')
    .limit(50);

  // Apply filters based on preferences
  if (jobPreferences.locations && jobPreferences.locations.length > 0) {
    query = query.in('location', jobPreferences.locations);
  }

  if (jobPreferences.remote_preference === 'remote') {
    query = query.eq('is_remote', true);
  }

  const { data: jobs, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }

  if (!jobs || jobs.length === 0) {
    return new Response(
      JSON.stringify({ success: true, matches: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Score jobs using Claude AI (in batches to avoid token limits)
  const batchSize = JOBS_BATCH_SIZE;
  const matches: JobMatch[] = [];

  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are a job matching expert. Analyze the candidate's resume and score each job listing.

Candidate Resume:
${JSON.stringify(parsedResume, null, 2)}

Job Preferences:
${JSON.stringify(jobPreferences, null, 2)}

Jobs to evaluate:
${JSON.stringify(batch.map(j => ({
  id: j.id,
  title: j.title,
  description: j.description,
  qualifications: j.qualifications,
  skills: j.skills,
  experience_level: j.experience_level,
  location: j.location,
  is_remote: j.is_remote,
  salary_min: j.salary_min,
  salary_max: j.salary_max,
  company: j.companies?.name
})), null, 2)}

For each job, return ONLY valid JSON with no additional text:
{
  "matches": [
    {
      "job_id": "uuid",
      "match_score": number (0-100),
      "skills_matched": ["skill1", "skill2"],
      "experience_fit": "explanation of experience alignment",
      "location_match": boolean,
      "salary_match": boolean,
      "overall_reasoning": "brief explanation of match quality"
    }
  ]
}`
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Anthropic API error:', data);
      continue; // Skip this batch on error
    }

    try {
      const content = data.content[0].text;
      const result = JSON.parse(content);
      
      // Map scores to jobs
      for (const match of result.matches) {
        const job = batch.find(j => j.id === match.job_id);
        if (job) {
          matches.push({
            job,
            match_score: match.match_score,
            match_reasons: {
              skills_matched: match.skills_matched,
              experience_fit: match.experience_fit,
              location_match: match.location_match,
              salary_match: match.salary_match,
              overall_reasoning: match.overall_reasoning
            }
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse AI batch response:', e);
      continue;
    }
  }

  // Sort by match score
  matches.sort((a, b) => b.match_score - a.match_score);

  // Store matches in database
  for (const match of matches) {
    await supabase
      .from('job_matches')
      .upsert({
        user_id: userId,
        job_id: match.job.id,
        match_score: match.match_score,
        match_reasons: match.match_reasons,
        status: 'new'
      }, {
        onConflict: 'user_id,job_id'
      });
  }

  return new Response(
    JSON.stringify({ success: true, matches }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateCoverLetter(
  jobId: string,
  parsedResume: any,
  supabase: any,
  anthropicKey: string
) {
  // Fetch job details
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*, companies(*)')
    .eq('id', jobId)
    .single();

  if (error || !job) {
    throw new Error('Job not found');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Generate a professional cover letter for this job application.

Candidate Information:
${JSON.stringify(parsedResume, null, 2)}

Job Details:
Title: ${job.title}
Company: ${job.companies?.name}
Description: ${job.description}
Requirements: ${job.qualifications}

Write a compelling cover letter that:
1. Highlights relevant experience and skills
2. Shows enthusiasm for the role
3. Explains why the candidate is a great fit
4. Is professional and concise (3-4 paragraphs)
5. Can be customized by the user

Return only the cover letter text, no additional formatting or explanations.`
      }]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Failed to generate cover letter: ${data.error?.message}`);
  }

  const coverLetter = data.content[0].text;

  return new Response(
    JSON.stringify({ success: true, cover_letter: coverLetter }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
