import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { Mail, Lock, User, Briefcase, MapPin, FileText, Upload, Sparkles, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  country: string;
  headline: string;
  bio: string;
  yearsOfExperience: string;
  skills: string;
  resumeFile: File | null;
}

const MultiStepSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { updateProfile, uploadResume } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    country: 'ZA',
    headline: '',
    bio: '',
    yearsOfExperience: '0',
    skills: '',
    resumeFile: null,
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateField = (field: keyof SignupData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    try {
      emailSchema.parse(formData.email);
    } catch (err: any) {
      newErrors.email = 'Invalid email address';
    }

    try {
      passwordSchema.parse(formData.password);
    } catch (err: any) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.headline.trim()) {
      newErrors.headline = 'Professional headline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      
      updateField('resumeFile', file);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create user account
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          toast.error('An account with this email already exists');
        } else {
          toast.error(signUpError.message);
        }
        setCurrentStep(1);
        return;
      }

      // Wait a moment for the user to be created and session established
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Update profile with additional information
      if (formData.location || formData.headline || formData.bio) {
        await updateProfile({
          phone: formData.phone || null,
          location: formData.location || null,
          country: formData.country || 'ZA',
          headline: formData.headline || null,
          bio: formData.bio || null,
          years_of_experience: parseInt(formData.yearsOfExperience) || 0,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        });
      }

      // Step 3: Upload resume if provided
      if (formData.resumeFile) {
        await uploadResume(formData.resumeFile);
      }

      toast.success('Account created successfully! Please check your email to verify your account.');
      navigate('/profile');
    } catch (error: any) {
      toast.error('An error occurred during signup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const aiSuggestions = {
    headline: [
      "Senior Software Engineer with 5+ years in React and Node.js",
      "Marketing Professional specializing in Digital Strategy",
      "Data Analyst with expertise in Python and SQL",
    ],
    bio: [
      "Passionate about building scalable web applications",
      "Results-driven professional with a track record of success",
      "Innovative thinker with strong problem-solving skills",
    ],
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Create Your Account</h2>
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Account Information"}
              {currentStep === 2 && "Professional Profile"}
              {currentStep === 3 && "Resume & Career Tools"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Let's start with your basic information"}
              {currentStep === 2 && "Tell us about your professional background"}
              {currentStep === 3 && "Upload your resume and explore our AI-powered tools"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-2">
                      First Name
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Your legal first name as it appears on official documents</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                      />
                    </div>
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-2">
                      Last Name
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Your legal last name as it appears on official documents</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                    />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email Address
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">We'll send a verification link to this email. Use a professional email address for best results.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    Password
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Choose a strong password with at least 8 characters, including uppercase, lowercase, and numbers</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                    />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    Phone Number (Optional)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Employers may contact you via phone for interview opportunities</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Professional Profile */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    Location
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Your current city helps match you with local opportunities</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Cape Town, Western Cape"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    />
                  </div>
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => updateField('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZA">South Africa</SelectItem>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                      <SelectItem value="GH">Ghana</SelectItem>
                      <SelectItem value="EG">Egypt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline" className="flex items-center gap-2">
                    Professional Headline
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">A brief title that describes your professional identity (e.g., "Senior Software Engineer")</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="headline"
                      placeholder="e.g., Senior Software Engineer"
                      className="pl-10"
                      value={formData.headline}
                      onChange={(e) => updateField('headline', e.target.value)}
                    />
                  </div>
                  {errors.headline && <p className="text-sm text-destructive">{errors.headline}</p>}
                  
                  <div className="flex items-start gap-2 p-3 bg-brand-pink/10 rounded-lg border border-brand-pink/20">
                    <Sparkles className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-brand-pink">AI Suggestions:</p>
                      <div className="space-y-1">
                        {aiSuggestions.headline.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateField('headline', suggestion)}
                            className="block text-xs text-left text-muted-foreground hover:text-foreground transition-colors"
                          >
                            • {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience" className="flex items-center gap-2">
                    Years of Experience
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Total years of professional work experience in your field</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select value={formData.yearsOfExperience} onValueChange={(value) => updateField('yearsOfExperience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Entry Level (0-1 years)</SelectItem>
                      <SelectItem value="2">Junior (2-3 years)</SelectItem>
                      <SelectItem value="4">Mid-Level (4-6 years)</SelectItem>
                      <SelectItem value="7">Senior (7-10 years)</SelectItem>
                      <SelectItem value="10">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="flex items-center gap-2">
                    Key Skills (Optional)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Separate multiple skills with commas (e.g., "Python, React, SQL")</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="skills"
                    placeholder="e.g., Python, React, SQL, Project Management"
                    value={formData.skills}
                    onChange={(e) => updateField('skills', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-2">
                    Professional Bio (Optional)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">A brief summary of your professional background and career goals</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your professional journey and what you're looking for..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Resume Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resume" className="flex items-center gap-2">
                    Upload Your Resume/CV (Optional)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Upload a PDF or Word document. Maximum file size: 5MB</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-brand-pink/50 transition-colors">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {formData.resumeFile ? formData.resumeFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-muted-foreground">PDF or DOC/DOCX (max. 5MB)</p>
                    </div>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById('resume')?.click()}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                {/* Resume Builder Upsell */}
                <Card className="border-brand-pink bg-gradient-to-br from-brand-pink/5 to-brand-purple/5">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-brand-pink" />
                        <CardTitle className="text-lg">Upgrade to Pro: AI Resume Builder</CardTitle>
                      </div>
                    </div>
                    <CardDescription>
                      Don't have a resume or want to create a better one? Our AI-powered Resume Builder helps you create professional, ATS-optimized resumes in minutes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-brand-pink mt-0.5">✓</span>
                        <span>AI-powered content suggestions tailored to your industry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-pink mt-0.5">✓</span>
                        <span>Professional templates designed by career experts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-pink mt-0.5">✓</span>
                        <span>ATS optimization to pass applicant tracking systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-pink mt-0.5">✓</span>
                        <span>Real-time feedback and improvement suggestions</span>
                      </li>
                    </ul>
                    <Button 
                      variant="brand" 
                      className="w-full mt-4"
                      onClick={() => window.open('/pro', '_blank')}
                      type="button"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade to Pro - Start Free Trial
                    </Button>
                  </CardContent>
                </Card>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">What happens next?</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Check your email to verify your account</li>
                    <li>• Complete your profile to increase visibility</li>
                    <li>• Browse thousands of job opportunities</li>
                    <li>• Get matched with relevant positions</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Complete Signup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/auth')}
            className="text-brand-pink hover:underline font-medium"
            type="button"
          >
            Sign in here
          </button>
        </p>
      </div>
    </TooltipProvider>
  );
};

export default MultiStepSignup;
