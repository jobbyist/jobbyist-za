#!/usr/bin/env node

/**
 * Test script to validate remote jobs data
 * This script checks the structure and content of the generated remote jobs
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'remote-jobs-international.json');

interface JobListing {
  source_url: string;
  job_title: string;
  hiring_organization: { name: string };
  date_posted: string;
  employment_type: string;
  location: string;
  description_summary: string;
  source_domain: string;
}

interface JobsData {
  job_listings: JobListing[];
}

function validateJobs() {
  console.log('🔍 Validating remote jobs data...\n');

  // Read the file
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  const jobsData: JobsData = JSON.parse(data);

  if (!jobsData.job_listings || !Array.isArray(jobsData.job_listings)) {
    console.error('❌ Invalid data structure: job_listings array not found');
    process.exit(1);
  }

  const jobs = jobsData.job_listings;
  console.log(`✅ Total jobs found: ${jobs.length}\n`);

  // Validate each job has required fields
  const requiredFields = [
    'source_url',
    'job_title',
    'hiring_organization',
    'date_posted',
    'employment_type',
    'location',
    'description_summary',
  ];

  let validJobs = 0;
  let invalidJobs = 0;

  jobs.forEach((job, index) => {
    const missingFields = requiredFields.filter(field => !job[field as keyof JobListing]);
    if (missingFields.length > 0) {
      console.error(`❌ Job ${index + 1} missing fields: ${missingFields.join(', ')}`);
      invalidJobs++;
    } else {
      validJobs++;
    }
  });

  console.log(`\n✅ Valid jobs: ${validJobs}`);
  if (invalidJobs > 0) {
    console.log(`❌ Invalid jobs: ${invalidJobs}`);
  }

  // Statistics
  console.log('\n📊 Statistics:');

  // Count by company
  const companyCounts = new Map<string, number>();
  jobs.forEach(job => {
    const company = job.hiring_organization.name;
    companyCounts.set(company, (companyCounts.get(company) || 0) + 1);
  });
  console.log(`\n🏢 Unique companies: ${companyCounts.size}`);
  const topCompanies = Array.from(companyCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  console.log('Top 10 companies by job count:');
  topCompanies.forEach(([company, count]) => {
    console.log(`   - ${company}: ${count} jobs`);
  });

  // Count by employment type
  const employmentTypes = new Map<string, number>();
  jobs.forEach(job => {
    const type = job.employment_type;
    employmentTypes.set(type, (employmentTypes.get(type) || 0) + 1);
  });
  console.log('\n💼 Employment types:');
  Array.from(employmentTypes.entries()).forEach(([type, count]) => {
    console.log(`   - ${type}: ${count} jobs`);
  });

  // Count by location pattern
  const locationPatterns = new Map<string, number>();
  jobs.forEach(job => {
    const location = job.location;
    let pattern = 'Other';
    if (location.includes('Remote - South Africa')) pattern = 'Remote - South Africa';
    else if (location.includes('Remote (South Africa)')) pattern = 'Remote (South Africa)';
    else if (location.includes('Anywhere')) pattern = 'Anywhere';
    else if (location.includes('EMEA')) pattern = 'EMEA';
    else if (location === 'Remote') pattern = 'Remote';
    else if (location.includes('Cape Town')) pattern = 'Cape Town';
    else if (location.includes('Johannesburg')) pattern = 'Johannesburg';
    
    locationPatterns.set(pattern, (locationPatterns.get(pattern) || 0) + 1);
  });
  console.log('\n🌍 Location patterns:');
  Array.from(locationPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([pattern, count]) => {
      console.log(`   - ${pattern}: ${count} jobs`);
    });

  // Extract job titles to see categories
  const jobRoles = new Map<string, number>();
  jobs.forEach(job => {
    const title = job.job_title;
    // Extract base role (simplified)
    let role = 'Other';
    if (title.includes('Engineer') || title.includes('Developer')) role = 'Engineering';
    else if (title.includes('Designer') || title.includes('UX') || title.includes('UI')) role = 'Design';
    else if (title.includes('Manager') || title.includes('Director') || title.includes('Lead')) role = 'Management';
    else if (title.includes('Analyst') || title.includes('Data') || title.includes('Scientist')) role = 'Analytics';
    else if (title.includes('Marketing')) role = 'Marketing';
    else if (title.includes('Sales') || title.includes('Account')) role = 'Sales';
    else if (title.includes('Customer') || title.includes('Support')) role = 'Customer Success';
    else if (title.includes('Product')) role = 'Product';
    else if (title.includes('HR') || title.includes('Recruiter') || title.includes('People')) role = 'HR';
    else if (title.includes('Writer') || title.includes('Content')) role = 'Content';
    else if (title.includes('Finance') || title.includes('Accountant')) role = 'Finance';
    else if (title.includes('Legal') || title.includes('Compliance')) role = 'Legal';
    
    jobRoles.set(role, (jobRoles.get(role) || 0) + 1);
  });
  console.log('\n👔 Job categories:');
  Array.from(jobRoles.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([role, count]) => {
      console.log(`   - ${role}: ${count} jobs`);
    });

  // Sample jobs
  console.log('\n📝 Sample jobs (first 5):');
  jobs.slice(0, 5).forEach((job, index) => {
    console.log(`\n${index + 1}. ${job.job_title} at ${job.hiring_organization.name}`);
    console.log(`   Location: ${job.location}`);
    console.log(`   Type: ${job.employment_type}`);
    console.log(`   Posted: ${job.date_posted}`);
    console.log(`   Description: ${job.description_summary.substring(0, 100)}...`);
  });

  console.log('\n\n✨ Validation complete!\n');
  
  if (invalidJobs > 0) {
    process.exit(1);
  }
}

// Run validation
try {
  validateJobs();
} catch (error) {
  console.error('❌ Error during validation:', error);
  process.exit(1);
}
