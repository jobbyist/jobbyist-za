import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, Globe, Lock, CheckCircle2 } from "lucide-react";
import { CandidateProfile } from "@/data/professionalProfiles";

interface CandidateProfileCardProps {
  profile: CandidateProfile;
  onUnlockClick: (profileId: string) => void;
}

export const CandidateProfileCard = ({ profile, onUnlockClick }: CandidateProfileCardProps) => {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-slate-200"
      itemScope 
      itemType="https://schema.org/Person"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div 
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center font-bold text-sm text-primary"
            aria-hidden="true"
          >
            {getInitials(profile.name)}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
            <CheckCircle2 className="h-3 w-3" />
            <span>Verified</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono mb-1">{profile.id}</p>
        
        <h3 className="text-lg font-bold text-slate-900 leading-tight" itemProp="name">
          {profile.name}
        </h3>
        <p className="text-sm font-semibold text-primary mt-1" itemProp="jobTitle">
          {profile.role}
        </p>

        <p className="text-sm text-slate-600 mt-2 line-clamp-2" itemProp="description">
          {profile.publicSummary}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span itemProp="address">{profile.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>{profile.experience}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>{profile.availability}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>{profile.workPreference}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {profile.verificationBadges.map((badge) => (
            <span 
              key={badge}
              className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Full profile access required
              </p>
              <p className="text-xs text-slate-600 mb-3">
                Contact details, full CV, references and work history require an active Jobbyist Pro or Recruitment Suite account.
              </p>
              <Button
                size="sm"
                variant="default"
                onClick={() => onUnlockClick(profile.id)}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                aria-label={`View access options for ${profile.name}`}
              >
                View Access Options
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
