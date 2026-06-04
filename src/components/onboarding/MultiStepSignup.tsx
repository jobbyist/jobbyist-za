// Huzzle-inspired multi-step onboarding with job preferences,
// WhatsApp opt-in, plan selection and verification-email handoff.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Upload, FileText, Crown, Sparkles, User, Mail, Lock,
  MapPin, Phone, Loader2, Check, Briefcase, MessageCircle, Star, X
} from "lucide-react";
import welcomeHero from "@/assets/welcome-hero.png";

const TOTAL = 7;
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbD9BMXD8SE7HzhEEr24";

const POPULAR_INDUSTRIES = [
  "Finance & Banking", "Mining & Resources", "Retail & FMCG", "Technology & IT",
  "Healthcare", "Education", "Government & Public Sector", "Tourism & Hospitality",
  "Construction", "Telecommunications", "Manufacturing", "Agriculture",
  "Logistics & Transport", "Energy & Utilities", "Media & Marketing", "Legal",
];
const POPULAR_SA = new Set([
  "Finance & Banking", "Mining & Resources", "Retail & FMCG", "Government & Public Sector",
  "Telecommunications", "Tourism & Hospitality",
]);
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Learnership", "Remote", "Hybrid", "On-site", "Freelance"];

const MultiStepSignup = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showCheckEmailModal, setShowCheckEmailModal] = useState(false);

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

  // Step 4 — Preferences (industries / types / titles)
  const [industries, setIndustries] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [titleInput, setTitleInput] = useState("");

  // Step 5 — WhatsApp
  const [waJoined, setWaJoined] = useState(false);
  const [waNumber, setWaNumber] = useState("");

  // Step 6 — Plan
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | null>(null);
  const proInterest = selectedPlan === "pro";

  // Step 7 — account
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggle = (list: string[], setter: (x: string[]) => void, value: string, max?: number) => {
    if (list.includes(value)) setter(list.filter(v => v !== value));
    else {
      if (max && list.length >= max) { toast.error(`Maximum ${max} selections`); return; }
      setter([...list, value]);
    }
  };

  const addTitle = () => {
    const v = titleInput.trim();
    if (!v) return;
    if (jobTitles.length >= 5) { toast.error("Up to 5 job titles"); return; }
    if (jobTitles.includes(v)) return;
    setJobTitles([...jobTitles, v]); setTitleInput("");
  };

  const handleAvatar = (f: File) => {
    if (f.size > 3 * 1024 * 1024) { toast.error("Image must be under 3MB"); return; }
    setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f));
  };
  const handleResume = (f: File) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) { toast.error("PDF or Word only"); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    setResumeFile(f);
  };

  const validateStep = (s: number) => {
    if (s === 1 && (!firstName.trim() || !lastName.trim() || !location.trim())) {
      toast.error("Name and city are required"); return false;
    }
    if (s === 4 && (industries.length === 0 || jobTypes.length === 0 || jobTitles.length === 0)) {
      toast.error("Pick at least one industry, job type and job title"); return false;
    }
    if (s === 6 && !selectedPlan) {
      toast.error("Please choose a plan to continue"); return false;
    }
    if (s === 7 && (!email.trim() || !password.trim() || password.length < 8 || !username.trim())) {
      toast.error("Username, email and 8+ char password required"); return false;
    }
    return true;
  };

  const next = async () => {
    if (!validateStep(step)) return;
    if (step === TOTAL) { await createAccountAndPersist(); return; }
    setStep(s => Math.min(s + 1, TOTAL));
  };
  const back = () => setStep(s => Math.max(1, s - 1));

  const handleGoogleSignUp = async () => {
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) toast.error(result.error.message || "Google sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  async function createAccountAndPersist() {
    setSubmitting(true);
    try {
      const { error: suErr } = await signUp(email, password, firstName, lastName);
      if (suErr) {
        if (suErr.message.toLowerCase().includes("already")) {
          await signIn(email, password);
        } else {
          throw suErr;
        }
      }

      // Try to capture session if we already have one (auto-confirm off => no session).
      const { data: { user: u } } = await supabase.auth.getUser();

      if (u) {
        // Upload avatar
        let avatar_url: string | null = null;
        if (avatarFile) {
          const ext = avatarFile.name.split(".").pop();
          const path = `${u.id}/avatar.${ext}`;
          const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
          if (!error) avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
        }
        let resume_path: string | null = null;
        if (resumeFile) {
          const ext = resumeFile.name.split(".").pop();
          resume_path = `${u.id}/resume.${ext}`;
          await supabase.storage.from("resumes").upload(resume_path, resumeFile, { upsert: true });
        }
        await supabase.from("profiles").update({
          first_name: firstName, last_name: lastName,
          phone: phone || null, address: address || null,
          location, country: "ZA",
          username: username.toLowerCase(),
          avatar_url, resume_url: resume_path,
          pro_interest: proInterest,
          preferred_industries: industries,
          preferred_job_types: jobTypes,
          preferred_job_titles: jobTitles,
          whatsapp_joined: waJoined,
          whatsapp_number: waNumber || null,
          onboarding_completed_at: new Date().toISOString(),
        } as never).eq("user_id", u.id);
        if (proInterest) {
          await supabase.from("subscriptions").insert({
            user_id: u.id, subscription_type: "jobseeker_pro",
            plan_tier: "premium", status: "pending",
          });
        }
      } else {
        // Stash preferences locally so we can persist after verification.
        try {
          localStorage.setItem("jobbyist:pending-onboarding", JSON.stringify({
            firstName, lastName, phone, address, location, username,
            industries, jobTypes, jobTitles, waJoined, waNumber, proInterest,
          }));
        } catch { /* ignore */ }
      }

      setShowCheckEmailModal(true);
    } catch (e: any) {
      toast.error(e.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (showCheckEmailModal) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center px-4">
        <img src={welcomeHero} alt="Welcome to Jobbyist" loading="eager" className="w-full max-w-md mb-6 rounded-lg" />
        <div className="rounded-full bg-primary/10 p-4 mb-4"><Mail className="h-8 w-8 text-primary" /></div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Check your email to verify your account</h2>
        <p className="text-muted-foreground mb-2 max-w-md">
          We've sent a verification link to <span className="font-medium text-foreground">{email}</span>.
        </p>
        <p className="text-muted-foreground mb-6 max-w-md text-sm">
          Click the link to activate your account, then sign in to access your dashboard.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>Back to home</Button>
          <Button className="gradient-brand" onClick={() => navigate("/auth")}>Sign in <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </div>
    );
  }

  const titleMap: Record<number, string> = {
    1: "About you", 2: "Profile picture", 3: "Your CV",
    4: "Job preferences", 5: "WhatsApp alerts", 6: "Choose your plan", 7: "Login details",
  };
  const subMap: Record<number, string> = {
    1: "Let's start with the basics",
    2: "Add a friendly face",
    3: "Upload your CV",
    4: "Personalise your job listings & alerts",
    5: "Get daily job updates on WhatsApp",
    6: "Pick the plan that fits — you can upgrade anytime",
    7: "Pick a username and a strong password",
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h2 className="text-xl font-semibold">{titleMap[step]}</h2>
          <span className="text-sm text-muted-foreground">Step {step} of {TOTAL}</span>
        </div>
        <Progress value={(step / TOTAL) * 100} className="h-2" />
      </div>

      {step === 1 && (
        <div className="mb-4">
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={submitting}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            Continue with Google
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or sign up with email</span></div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Let's start with the basics"}
            {step === 2 && "Add a friendly face"}
            {step === 3 && "Upload your CV"}
            {step === 4 && "What are you looking for?"}
            {step === 5 && "Join our WhatsApp channel"}
            {step === 6 && "Choose your plan"}
            {step === 7 && "Create your account"}
          </CardTitle>
          <CardDescription>{subMap[step]}</CardDescription>
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
            <div className="space-y-5">
              <div>
                <Label className="flex items-center gap-1 mb-2"><Briefcase className="h-3 w-3" /> Industries</Label>
                <p className="text-xs text-muted-foreground mb-2">Pick industries you're interested in. <Star className="inline h-3 w-3 text-amber-500" /> are popular in South Africa.</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_INDUSTRIES.map(i => (
                    <button key={i} type="button" onClick={() => toggle(industries, setIndustries, i)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${industries.includes(i) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}>
                      {POPULAR_SA.has(i) && <Star className="inline h-3 w-3 mr-1 text-amber-500" />}{i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Job types</Label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => toggle(jobTypes, setJobTypes, t)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${jobTypes.includes(t) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Job titles (up to 5)</Label>
                <div className="flex gap-2">
                  <Input value={titleInput} onChange={e => setTitleInput(e.target.value)}
                    placeholder="e.g. Marketing Manager"
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTitle(); } }} />
                  <Button type="button" variant="outline" onClick={addTitle}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {jobTitles.map(t => (
                    <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => setJobTitles(jobTitles.filter(x => x !== t))}>
                      {t} <X className="inline h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950/20 flex items-start gap-3">
                <MessageCircle className="h-6 w-6 text-green-600 mt-1 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Daily job updates on WhatsApp</p>
                  <p className="text-muted-foreground mt-1">
                    Get fresh SA job listings, special offers and important announcements — and, for Jobbyist Pro members, <span className="font-medium">personalised job alerts</span> straight to your WhatsApp.
                  </p>
                </div>
              </div>
              <a href={WHATSAPP_CHANNEL} target="_blank" rel="noopener noreferrer" className="block">
                <Button type="button" variant="outline" className="w-full" onClick={() => setWaJoined(true)}>
                  <MessageCircle className="h-4 w-4 mr-2 text-green-600" /> Join WhatsApp channel
                </Button>
              </a>
              <div className="flex items-center gap-2 text-sm">
                <Checkbox id="wa-joined" checked={waJoined} onCheckedChange={v => setWaJoined(!!v)} />
                <label htmlFor="wa-joined">I've joined the channel</label>
              </div>
              <div>
                <Label className="text-sm">WhatsApp number for personalised alerts (Pro)</Label>
                <Input value={waNumber} onChange={e => setWaNumber(e.target.value)} placeholder="+27 ..." />
                <p className="text-xs text-muted-foreground mt-1">Optional. Only Jobbyist Pro members receive personalised alerts.</p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <button type="button" onClick={() => setSelectedPlan("free")}
                className={`w-full text-left rounded-lg border-2 p-5 transition-all ${selectedPlan === "free" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Jobbyist Free</h3>
                    <p className="text-2xl font-bold mt-1">R0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  </div>
                  {selectedPlan === "free" && <Check className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground mb-3">Browse and apply to a limited number of jobs each month.</p>
                <ul className="text-sm space-y-1.5">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />Browse all SA job listings</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />Up to 10 applications / month</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />Save jobs to your shortlist</li>
                  <li className="flex items-start gap-2 text-muted-foreground"><span className="h-4 w-4 mt-0.5 shrink-0">•</span>Contains ads</li>
                </ul>
              </button>
              <button type="button" onClick={() => setSelectedPlan("pro")}
                className={`w-full text-left rounded-lg border-2 p-5 transition-all relative overflow-hidden ${selectedPlan === "pro" ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}>
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                <div className="flex items-start justify-between mb-2 mt-1">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500" />Jobbyist Pro</h3>
                    <p className="text-2xl font-bold mt-1">R99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  </div>
                  {selectedPlan === "pro" && <Check className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground mb-3">Unlimited access, premium features, ad-free browsing.</p>
                <ul className="text-sm space-y-1.5">
                  <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />Unlimited applications</li>
                  <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />AI job matching tuned to your CV</li>
                  <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />Personalised WhatsApp job alerts</li>
                  <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />Application tracker on your dashboard</li>
                  <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />Ad-free browsing experience</li>
                </ul>
              </button>
              <p className="text-xs text-muted-foreground text-center pt-1">No payment required now — Pro members will receive a checkout link by email.</p>
            </div>
          )}

          {step === 7 && (
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
                <>{step === TOTAL ? "Create account" : "Next"} <ArrowRight className="h-4 w-4 ml-1" /></>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepSignup;
