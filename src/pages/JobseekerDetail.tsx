import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useFollows } from '@/hooks/useFollows';
import MessagingComponent from '@/components/MessagingComponent';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  MapPin, 
  Briefcase, 
  Star,
  Lock,
  Crown,
  UserPlus,
  UserMinus,
  MessageCircle,
  FileText,
  LinkIcon,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface JobseekerProfile {
  id: string;
  user_id: string;
  profile_id: string;
  is_public: boolean;
  available_for_hire: boolean;
  expected_salary_min: number | null;
  expected_salary_max: number | null;
  views_count: number;
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    country: string | null;
    avatar_url: string | null;
    resume_url: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
    skills: string[];
    years_of_experience: number;
    verification_status: string;
    education: any[];
    work_experience: any[];
  };
}

const JobseekerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const { isFollowing, followUser, unfollowUser } = useFollows();
  
  const [jobseeker, setJobseeker] = useState<JobseekerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMessaging, setShowMessaging] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobseeker();
      incrementViewCount();
    }
  }, [id]);

  const fetchJobseeker = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('jobseeker_profiles')
        .select(`
          *,
          profile:profiles(
            first_name,
            last_name,
            email,
            phone,
            headline,
            bio,
            location,
            country,
            avatar_url,
            resume_url,
            linkedin_url,
            portfolio_url,
            skills,
            years_of_experience,
            verification_status,
            education,
            work_experience
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setJobseeker(data);
    } catch (error: any) {
      console.error('Error fetching jobseeker:', error);
      toast.error('Failed to load profile');
      navigate('/jobseekers');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    if (!id) return;

    try {
      await supabase.rpc('increment_jobseeker_views', { jobseeker_id: id });
    } catch (error: any) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error('Please sign in to follow');
      return;
    }

    if (!jobseeker) return;

    if (isFollowing(jobseeker.user_id)) {
      await unfollowUser(jobseeker.user_id);
    } else {
      await followUser(jobseeker.user_id);
    }
  };

  const canViewFullProfile = () => {
    return user && isPremium();
  };

  const canMessage = () => {
    if (!user || !jobseeker) return false;
    return isPremium() && isFollowing(jobseeker.user_id);
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'JS';
  };

  const formatSalaryRange = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `R${(min / 1000).toFixed(0)}k - R${(max / 1000).toFixed(0)}k`;
    if (min) return `From R${(min / 1000).toFixed(0)}k`;
    if (max) return `Up to R${(max / 1000).toFixed(0)}k`;
    return 'Not specified';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!jobseeker) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={jobseeker.profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(jobseeker.profile.first_name, jobseeker.profile.last_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold">
                          {canViewFullProfile() 
                            ? `${jobseeker.profile.first_name} ${jobseeker.profile.last_name}`
                            : `${jobseeker.profile.first_name} ${jobseeker.profile.last_name?.[0]}.`
                          }
                        </h1>
                        {jobseeker.profile.verification_status === 'approved' && (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      {jobseeker.profile.headline && (
                        <p className="text-lg text-muted-foreground mb-2">
                          {jobseeker.profile.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {jobseeker.profile.location && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {jobseeker.profile.location}
                      </Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {jobseeker.profile.years_of_experience}+ years
                    </Badge>
                    {jobseeker.available_for_hire && (
                      <Badge className="bg-green-500">Available for Hire</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {user && user.id !== jobseeker.user_id && (
                      <Button onClick={handleFollowToggle} variant={isFollowing(jobseeker.user_id) ? 'outline' : 'default'}>
                        {isFollowing(jobseeker.user_id) ? (
                          <>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    )}

                    {canMessage() && (
                      <Dialog open={showMessaging} onOpenChange={setShowMessaging}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Direct Message</DialogTitle>
                            <DialogDescription>
                              Send a message to {jobseeker.profile.first_name}
                            </DialogDescription>
                          </DialogHeader>
                          <MessagingComponent
                            otherUserId={jobseeker.user_id}
                            otherUserName={`${jobseeker.profile.first_name} ${jobseeker.profile.last_name}`}
                            otherUserAvatar={jobseeker.profile.avatar_url}
                          />
                        </DialogContent>
                      </Dialog>
                    )}

                    {!canViewFullProfile() && (
                      <Button onClick={() => navigate('/pro')} variant="default">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade for Full Access
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobseeker.profile.bio ? (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {canViewFullProfile() 
                        ? jobseeker.profile.bio 
                        : jobseeker.profile.bio.length > 200 
                          ? `${jobseeker.profile.bio.substring(0, 200)}... (Upgrade to view full profile)`
                          : jobseeker.profile.bio
                      }
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">No bio provided</p>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {jobseeker.profile.skills && jobseeker.profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {jobseeker.profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Work Experience */}
              {canViewFullProfile() && jobseeker.profile.work_experience && jobseeker.profile.work_experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {jobseeker.profile.work_experience.map((exp: any, index: number) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div>
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {exp.start_date} - {exp.end_date || 'Present'}
                          </p>
                          {exp.description && (
                            <p className="text-sm mt-2">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {canViewFullProfile() && jobseeker.profile.education && jobseeker.profile.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {jobseeker.profile.education.map((edu: any, index: number) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {edu.start_year} - {edu.end_year || 'Present'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Expected Salary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Expected Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  {canViewFullProfile() ? (
                    <p className="font-semibold">
                      {formatSalaryRange(jobseeker.expected_salary_min, jobseeker.expected_salary_max)}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">Premium access required</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              {canViewFullProfile() && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {jobseeker.profile.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${jobseeker.profile.email}`} className="text-primary hover:underline">
                          {jobseeker.profile.email}
                        </a>
                      </div>
                    )}
                    {jobseeker.profile.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${jobseeker.profile.phone}`} className="text-primary hover:underline">
                          {jobseeker.profile.phone}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobseeker.profile.linkedin_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a href={jobseeker.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {jobseeker.profile.portfolio_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a href={jobseeker.profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        Portfolio
                      </a>
                    </div>
                  )}
                  {canViewFullProfile() && jobseeker.profile.resume_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a href={jobseeker.profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View Resume/CV
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile Views</span>
                    <span className="font-medium">{jobseeker.views_count}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobseekerDetail;
