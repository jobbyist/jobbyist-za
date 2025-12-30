import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MatchScoreBadge } from './MatchScoreBadge';
import { JobMatch } from '@/hooks/useJobMatcher';
import { MapPin, Briefcase, DollarSign, Clock, Building2, ExternalLink, Bookmark, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface MatchedJobCardProps {
  match: JobMatch;
  onStatusChange: (matchId: string, status: JobMatch['status']) => void;
  onApply?: (jobId: string) => void;
}

export function MatchedJobCard({ match, onStatusChange, onApply }: MatchedJobCardProps) {
  const navigate = useNavigate();
  const job = match.job;

  if (!job) return null;

  const handleViewDetails = () => {
    onStatusChange(match.id, 'viewed');
    navigate(`/job/${job.id}`);
  };

  const handleSave = () => {
    onStatusChange(match.id, match.status === 'saved' ? 'viewed' : 'saved');
  };

  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    }
    onStatusChange(match.id, 'applied');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4" />
              {job.companies?.name || 'Company Name'}
            </CardDescription>
          </div>
          <MatchScoreBadge score={match.match_score} size="lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
            {job.is_remote && <Badge variant="secondary">Remote</Badge>}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>{job.job_type}</span>
          </div>
          {(job.salary_min || job.salary_max) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>
                {job.salary_min && job.salary_max
                  ? `R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}`
                  : job.salary_min
                  ? `From R${job.salary_min.toLocaleString()}`
                  : `Up to R${job.salary_max?.toLocaleString()}`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Match Reasons */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Why this matches:</h4>
          <div className="space-y-1 text-sm">
            {match.match_reasons.skills_matched && match.match_reasons.skills_matched.length > 0 && (
              <div>
                <span className="font-medium">Skills matched: </span>
                <span className="text-muted-foreground">
                  {match.match_reasons.skills_matched.slice(0, 5).join(', ')}
                  {match.match_reasons.skills_matched.length > 5 && ` +${match.match_reasons.skills_matched.length - 5} more`}
                </span>
              </div>
            )}
            {match.match_reasons.experience_fit && (
              <div>
                <span className="font-medium">Experience: </span>
                <span className="text-muted-foreground">{match.match_reasons.experience_fit}</span>
              </div>
            )}
            {match.match_reasons.overall_reasoning && (
              <p className="text-muted-foreground italic">{match.match_reasons.overall_reasoning}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 8).map((skill: string) => (
                <Badge
                  key={skill}
                  variant={match.match_reasons.skills_matched?.includes(skill) ? 'default' : 'outline'}
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 8 && (
                <Badge variant="secondary">+{job.skills.length - 8} more</Badge>
              )}
            </div>
          </div>
        )}

        {/* Status Badge */}
        {match.status !== 'new' && (
          <div className="flex items-center gap-2">
            <Badge variant={match.status === 'applied' || match.status === 'auto_applied' ? 'default' : 'secondary'}>
              {match.status === 'auto_applied' ? 'Auto Applied' : match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </Badge>
            {match.applied_at && (
              <span className="text-xs text-muted-foreground">
                Applied {formatDistanceToNow(new Date(match.applied_at), { addSuffix: true })}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleViewDetails} variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button 
            onClick={handleSave} 
            variant={match.status === 'saved' ? 'default' : 'outline'}
            size="icon"
          >
            <Bookmark className="w-4 h-4" />
          </Button>
          {match.status !== 'applied' && match.status !== 'auto_applied' && (
            <Button onClick={handleApply} className="flex-1">
              Apply Now
            </Button>
          )}
          {job.external_url && (
            <Button variant="outline" size="icon" asChild>
              <a href={job.external_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
