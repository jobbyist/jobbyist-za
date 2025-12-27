import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Bell, MapPin, Users, Briefcase } from 'lucide-react';
import { getCountryByCode, waitingListCountries, type CountryCode } from '@/lib/countries';
import logoImage from '@/assets/jobbyist-logo.jpeg';

const WaitingList = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const country = countryCode ? getCountryByCode(countryCode.toUpperCase() as CountryCode) : null;
  
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    userType: 'job_seeker',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country) return;

    // Client-side validation
    const email = form.email.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const userType = form.userType;

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (email.length > 255) {
      toast.error('Email is too long (max 255 characters)');
      return;
    }

    // Validate name lengths
    if (firstName.length > 50) {
      toast.error('First name is too long (max 50 characters)');
      return;
    }

    if (lastName.length > 50) {
      toast.error('Last name is too long (max 50 characters)');
      return;
    }

    // Validate user type
    if (!['job_seeker', 'employer'].includes(userType)) {
      toast.error('Invalid user type selected');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('waiting_list').insert({
        email: email,
        first_name: firstName || null,
        last_name: lastName || null,
        country: country.code,
        user_type: userType,
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already on the waiting list!');
        } else if (error.code === '23514') {
          toast.error('Please check your input and try again.');
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
        toast.success('You\'ve been added to the waiting list!');
      }
    } catch (error: any) {
      console.error('Error joining waiting list:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Country Not Found</CardTitle>
            <CardDescription>
              The country you're looking for is not available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">{country.flag}</div>
            <CardTitle className="text-2xl">You're on the list!</CardTitle>
            <CardDescription>
              We'll notify you when Jobbyist launches in {country.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">
                Explore Jobs in Active Countries
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <img src={logoImage} alt="Jobbyist" className="h-12 mx-auto mb-4" />
            <div className="text-6xl mb-4">{country.flag}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Coming Soon to {country.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              We're expanding across Africa! Join the waiting list to be the first to know when we launch in {country.name}.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Join the Waiting List
              </CardTitle>
              <CardDescription>
                Be among the first to access job opportunities in {country.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>I am a:</Label>
                  <RadioGroup
                    value={form.userType}
                    onValueChange={(value) => setForm({ ...form, userType: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="job_seeker" id="job_seeker" />
                      <Label htmlFor="job_seeker" className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-4 w-4" />
                        Job Seeker
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employer" id="employer" />
                      <Label htmlFor="employer" className="flex items-center gap-2 cursor-pointer">
                        <Briefcase className="h-4 w-4" />
                        Employer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Joining...' : 'Join Waiting List'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Currently available in:
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/?country=ZA" className="px-4 py-2 bg-card rounded-lg border hover:border-primary transition-colors">
                🇿🇦 South Africa
              </Link>
              <Link to="/?country=NG" className="px-4 py-2 bg-card rounded-lg border hover:border-primary transition-colors">
                🇳🇬 Nigeria
              </Link>
              <Link to="/?country=KE" className="px-4 py-2 bg-card rounded-lg border hover:border-primary transition-colors">
                🇰🇪 Kenya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
