import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { toast } from 'sonner';
import { Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import MultiStepSignup from '@/components/onboarding/MultiStepSignup';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

const GoogleIcon = () => (
  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [magicEmail, setMagicEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [magicStatus, setMagicStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'sent'; email: string; at: number }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' });
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
      if (result.error) toast.error(result.error.message || 'Google sign-in failed');
    } finally { setIsSubmitting(false); }
  };

  const resolveEmail = async (id: string): Promise<string> => {
    if (id.includes('@')) return id;
    const { data } = await supabase.from('profiles').select('email').eq('username', id.toLowerCase()).maybeSingle();
    if (!data?.email) throw new Error('No account found for that username');
    return data.email;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try {
      const email = await resolveEmail(identifier.trim());
      emailSchema.parse(email);
      passwordSchema.parse(password);
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) toast.error('Invalid email/username or password');
        else if (error.message.includes('Email not confirmed')) toast.error('Please verify your email before signing in');
        else toast.error(error.message);
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(e => { newErrors[e.path[0] as string] = e.message; });
        setErrors(newErrors);
      } else {
        toast.error(err.message || 'Sign in failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendMagic = async (email: string) => {
    setIsSubmitting(true);
    setMagicStatus({ kind: 'idle' });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setIsSubmitting(false);
    if (error) {
      setMagicStatus({ kind: 'error', message: error.message });
      toast.error(error.message);
    } else {
      setMagicStatus({ kind: 'sent', email, at: Date.now() });
      setResendCooldown(30);
      toast.success('Magic link sent — check your email');
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = magicEmail.trim();
    if (!email) { toast.error('Enter your email'); return; }
    await sendMagic(email);
  };

  const handleResendMagic = async () => {
    if (magicStatus.kind !== 'sent' || resendCooldown > 0) return;
    await sendMagic(magicStatus.email);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </a>
          <img src="/jobbyistza.svg" alt="Jobbyist" className="h-12 mx-auto mb-4" />
          <p className="text-muted-foreground">South Africa's Premier Career Management & Job Discovery Platform</p>
        </div>

        <Card>
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-6">
              <TabsContent value="login" className="mt-0 space-y-4">
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={isSubmitting}>
                  <GoogleIcon /> Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-id">Email or username</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="login-id" className="pl-10" value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com or thando_m" required />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="login-password" type="password" className="pl-10" value={password}
                        onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="relative pt-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Passwordless</span></div>
                </div>

                <form onSubmit={handleMagicLink} className="space-y-2">
                  <Label htmlFor="magic-email" className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-amber-500" /> Magic link</Label>
                  <div className="flex gap-2">
                    <Input id="magic-email" type="email" value={magicEmail}
                      onChange={(e) => setMagicEmail(e.target.value)} placeholder="you@example.com" />
                    <Button type="submit" variant="secondary" disabled={isSubmitting}>Send link</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">We'll email you a one-tap sign-in link.</p>

                  {magicStatus.kind === 'sent' && (
                    <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs space-y-2">
                      <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                        ✓ Magic link sent to <span className="font-semibold">{magicStatus.email}</span>.
                      </p>
                      <p className="text-muted-foreground">
                        Check your inbox and spam folder. Links expire after 60 minutes.
                        If it doesn't arrive within 2 minutes, resend below or use password sign-in.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={resendCooldown > 0 || isSubmitting}
                        onClick={handleResendMagic}
                      >
                        {resendCooldown > 0 ? `Resend magic link (${resendCooldown}s)` : 'Resend magic link'}
                      </Button>
                    </div>
                  )}

                  {magicStatus.kind === 'error' && (
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs space-y-1">
                      <p className="text-destructive font-medium">Couldn't send the magic link.</p>
                      <p className="text-muted-foreground">{magicStatus.message}</p>
                      <p className="text-muted-foreground">
                        Email delivery may be temporarily unavailable. Try password sign-in, or contact
                        support@jobbyist.co.za if this persists.
                      </p>
                    </div>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <MultiStepSignup />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
