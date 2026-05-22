// New Huzzle-inspired multi-step onboarding flow.
// Steps: Basics → Profile picture → Resume → Pro plan → Account → Welcome
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Upload, FileText, Crown, Sparkles, User, Mail, Lock, MapPin, Phone, Loader2, Check } from "lucide-react";
import welcomeHero from "@/assets/welcome-hero.png";
const TOTAL = 5;

const MultiStepSignup = () => {
  const navigate = useNavigate();
  const { signUp, signIn, user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1 — basics
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");

  // Step 2 — avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Step 3 — resume
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Step 4 — Pro
  const [proInterest, setProInterest] = useState(false);

  // Step 5 — account
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [interviewDone, setInterviewDone] = useState(false);

  const handleAvatar = (f: File) => {
    if (f.size > 3 * 1024 * 1024) { toast.error("Image must be under 3MB"); return; }
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleResume = (f: File) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) { toast.error("PDF or Word only"); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    setResumeFile(f);
  };

  const validateStep = (s: number) => {
    if (s === 1) {
      if (!firstName.trim() || !lastName.trim() || !location.trim()) {
        toast.error("Name and city are required"); return false;
      }
    }
    if (s === 5) {
      if (!email.trim() || !password.trim() || password.length < 8 || !username.trim()) {
        toast.error("Username, email and 8+ char password required"); return false;
      }
    }
    return true;
  };

  const next = async () => {
    if (!validateStep(step)) return;
    if (step === 5) {
      // create account and complete onboarding
      await createAccountAndPersist();
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  async function createAccountAndPersist() {
    setSubmitting(true);
    try {
      const { error: suErr } = await signUp(email, password, firstName, lastName);
      if (suErr) {
        if (suErr.message.includes("already registered")) {
          // attempt sign-in instead
          const { error: siErr } = await signIn(email, password);
          if (siErr) throw siErr;
        } else {
          throw suErr;
        }
      }
      // wait briefly for session
      await new Promise(r => setTimeout(r, 1500));
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) throw new Error("Auth session not ready — please verify your email and sign in.");

      // Upload avatar
      let avatar_url: string | null = null;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${u.id}/avatar.${ext}`;
        const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
        if (!error) {
          avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
        }
      }

      // Upload resume (private bucket)
      let resume_path: string | null = null;
      if (resumeFile) {
        const ext = resumeFile.name.split(".").pop();
        resume_path = `${u.id}/resume.${ext}`;
        await supabase.storage.from("resumes").upload(resume_path, resumeFile, { upsert: true });
      }

      // Persist profile
      await supabase.from("profiles").update({
        first_name: firstName, last_name: lastName,
        phone: phone || null, address: address || null,
        location, country: "ZA",
        username: username.toLowerCase(),
        avatar_url, resume_url: resume_path,
        pro_interest: proInterest,
      }).eq("user_id", u.id);

      // Optional Pro subscription marker (no payment yet)
      if (proInterest) {
        await supabase.from("subscriptions").insert({
          user_id: u.id, subscription_type: "jobseeker_pro",
          plan_tier: "premium", status: "pending",
        });
      }

      await supabase.from("profiles").update({
        onboarding_completed_at: new Date().toISOString(),
      }).eq("user_id", u.id);
      toast.success("Account created successfully.");
      setInterviewDone(true);
    } catch (e: any) {
      toast.error(e.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  // ===== Welcome screen (final) =====
  if (interviewDone) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center px-4">
        <img src={welcomeHero} alt="Welcome to Jobbyist" loading="eager"
          className="w-full max-w-md mb-6 rounded-lg" />
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Thanks for joining South Africa's fastest growing community of job seekers and working professionals.
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Check your email for further details and click the link to verify your email and activate your account.
        </p>
        <Button size="lg" className="gradient-brand" onClick={() => navigate("/profile")}>
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h2 className="text-xl font-semibold">
            {step === 1 && "About you"}
            {step === 2 && "Profile picture"}
            {step === 3 && "Your CV"}
            {step === 4 && "Jobbyist Pro"}
            {step === 5 && "Login details"}
          </h2>
          <span className="text-sm text-muted-foreground">Step {step} of {TOTAL}</span>
        </div>
        <Progress value={(step / TOTAL) * 100} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Let's start with the basics"}
            {step === 2 && "Add a friendly face"}
            {step === 3 && "Upload your CV"}
            {step === 4 && "Become a Pro (optional)"}
            {step === 5 && "Create your account"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Help SA employers find you"}
            {step === 2 && "Profiles with photos are 14× more likely to be viewed"}
            {step === 3 && "We'll auto-fill your skills and experience from this"}
            {step === 4 && "Unlock Pro tools — you can subscribe later"}
            {step === 5 && "Pick a username and a strong password"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>First name</Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Thando" /></div>
                <div><Label>Last name</Label><Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Mokoena" /></div>
              </div>
              <div><Label className="flex items-center gap-1"><Phone className="h-3 w-3" />Phone</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 ..." /></div>
              <div><Label className="flex items-center gap-1"><MapPin className="h-3 w-3" />City</Label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Johannesburg" /></div>
              <div><Label>Address (optional)</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Suburb, province" /></div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar className="h-32 w-32">
                {avatarPreview ? <AvatarImage src={avatarPreview} /> : <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>}
              </Avatar>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleAvatar(e.target.files[0])} />
                <Button asChild variant="outline"><span><Upload className="h-4 w-4 mr-2" /> {avatarFile ? "Change photo" : "Upload photo"}</span></Button>
              </label>
              <p className="text-xs text-muted-foreground">Optional — JPG/PNG up to 3MB</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50">
                <input type="file" accept=".pdf,.doc,.docx" hidden onChange={e => e.target.files?.[0] && handleResume(e.target.files[0])} />
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                {resumeFile ? (
                  <div className="text-sm"><Check className="h-4 w-4 inline text-green-500 mr-1" />{resumeFile.name}</div>
                ) : (
                  <div><p className="font-medium">Click to upload your CV</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF or Word, up to 5MB</p></div>
                )}
              </label>
              <p className="text-xs text-muted-foreground text-center">You can skip this and upload later from your profile.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg p-5 gradient-brand text-primary-foreground">
                <Crown className="h-6 w-6 mb-2" />
                <h3 className="font-semibold text-lg">Jobbyist Pro — R99/month</h3>
                <ul className="text-sm space-y-1 mt-2 opacity-90">
                  <li>• Apply directly to verified employers</li>
                  <li>• AI job matching tuned to your CV</li>
                  <li>• Priority profile visibility</li>
                  <li>• Resume builder & career coaching</li>
                </ul>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div><p className="font-medium">Interested in Pro?</p>
                  <p className="text-xs text-muted-foreground">No payment now — we'll send you a link when checkout is ready</p></div>
                <Switch checked={proInterest} onCheckedChange={setProInterest} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <div><Label>Username</Label>
                <Input value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))} placeholder="thando_m" /></div>
              <div><Label className="flex items-center gap-1"><Mail className="h-3 w-3" />Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
              <div><Label className="flex items-center gap-1"><Lock className="h-3 w-3" />Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" /></div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={back} disabled={step === 1}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={next} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> :
                <>{step === 5 ? "Create account" : "Next"} <ArrowRight className="h-4 w-4 ml-1" /></>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepSignup;
