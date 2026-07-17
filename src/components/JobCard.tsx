"use client";

import { UpworkJob } from '@/types/upwork';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface JobCardProps {
  job: UpworkJob;
}

/**
 * Interactive Client Component for displaying Upwork job listings.
 * Features:
 * - Clean UI with job title, budget badge, and truncated description
 * - "View on Upwork" button with analytics tracking
 * - Secure external link opening with noopener and noreferrer
 */
export default function JobCard({ job }: JobCardProps) {
  const handleViewJob = () => {
    // Analytics tracking placeholder
    console.log('Job viewed:', {
      jobId: job.id,
      jobTitle: job.title,
      timestamp: new Date().toISOString()
    });

    // Safely redirect to Upwork with security flags
    window.open(job.jobUrl, '_blank', 'noopener,noreferrer');
  };

  // Truncate description to 150 characters
  const truncatedDescription = job.description.length > 150 
    ? `${job.description.substring(0, 150)}...` 
    : job.description;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {job.budget}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">
          {truncatedDescription}
        </CardDescription>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleViewJob} className="w-full" variant="default">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Upwork
        </Button>
      </CardFooter>
    </Card>
  );
}

