// Lets a signed-in user enroll/disable a TOTP MFA factor and delete their account.
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountSecurityCard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [enrolledFactorId, setEnrolledFactorId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadFactors = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = data?.totp?.find(f => f.status === "verified");
    setEnrolledFactorId(verified?.id ?? null);
  };
  useEffect(() => { loadFactors(); }, []);

  const startEnroll = async () => {
    setBusy(true);
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Authenticator" });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setFactorId(data.id); setQr(data.totp.qr_code); setSecret(data.totp.secret);
  };

  const verifyEnroll = async () => {
    if (!factorId) return;
    setBusy(true);
    const { data: chal, error: chErr } = await supabase.auth.mfa.challenge({ factorId });
    if (chErr) { setBusy(false); toast.error(chErr.message); return; }
    const { error } = await supabase.auth.mfa.verify({ factorId, challengeId: chal.id, code });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Two-factor authentication enabled");
    setFactorId(null); setQr(null); setSecret(null); setCode("");
    loadFactors();
  };

  const disableMfa = async () => {
    if (!enrolledFactorId) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: enrolledFactorId });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Two-factor authentication disabled");
    loadFactors();
  };

  const deleteAccount = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("delete_my_account" as never);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Your account has been deleted");
    await signOut();
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Two-Factor Authentication
            {enrolledFactorId && <Badge className="bg-green-500">Enabled</Badge>}
          </CardTitle>
          <CardDescription>Protect your account with an authenticator app (Google Authenticator, 1Password, Authy).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!enrolledFactorId && !factorId && (
            <Button onClick={startEnroll} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Set up authenticator app
            </Button>
          )}
          {factorId && qr && (
            <div className="space-y-3">
              <p className="text-sm">Scan this QR code with your authenticator app, then enter the 6-digit code below.</p>
              <img src={qr} alt="MFA QR code" className="h-44 w-44 border rounded bg-white p-2" />
              {secret && <p className="text-xs text-muted-foreground break-all">Or enter this secret manually: <code className="font-mono">{secret}</code></p>}
              <div className="flex gap-2 max-w-xs">
                <Input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="123456" />
                <Button onClick={verifyEnroll} disabled={busy || code.length !== 6}>Verify</Button>
              </div>
            </div>
          )}
          {enrolledFactorId && (
            <Button variant="outline" onClick={disableMfa} disabled={busy}>Disable two-factor authentication</Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><Trash2 className="h-5 w-5" /> Delete account</CardTitle>
          <CardDescription>This permanently removes your account, profile, applications and saved jobs. This cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={busy}>Delete my account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your Jobbyist account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your profile, applications, saved jobs and all related data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
