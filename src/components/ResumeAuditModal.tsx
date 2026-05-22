import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ResumeAuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUPPORT_EMAIL = "support@jobbyist.africa";

const ResumeAuditModal = ({ open, onOpenChange }: ResumeAuditModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setTimeout(() => {
      setName(""); setEmail(""); setRole(""); setNotes(""); setDone(false);
    }, 300);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      // Persist to waiting_list as a lightweight lead capture (no schema change needed)
      await supabase.from("waiting_list").insert({
        first_name: name.split(" ")[0] || name,
        last_name: name.split(" ").slice(1).join(" ") || null,
        email,
        country: "ZA",
        user_type: `resume_audit:${role || "general"}`,
      });
      // Fire-and-forget notification (relies on send-job-notifications style helper if available)
      try {
        await supabase.functions.invoke("send-job-notifications", {
          body: {
            to: SUPPORT_EMAIL,
            subject: "Free Resume Audit request",
            text: `Name: ${name}\nEmail: ${email}\nTarget role: ${role}\nNotes: ${notes}`,
          },
        });
      } catch { /* non-fatal */ }
      setDone(true);
      toast.success("Request received — check your inbox shortly.");
    } catch (err: any) {
      toast.error(err.message || "Could not submit, try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 gradient-brand rounded-full flex items-center justify-center">
              {done ? <CheckCircle2 className="h-7 w-7 text-primary-foreground" /> : <Sparkles className="h-7 w-7 text-primary-foreground" />}
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            {done ? "You're all set!" : "Free Resume Audit + Interview Prep"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {done
              ? "We'll email your personalised audit and starter pack within 24 hours."
              : "Tell us about you and we'll send a personalised CV audit and Interview Prep Starter Pack tailored to your profile."}
          </DialogDescription>
        </DialogHeader>

        {!done && (
          <form onSubmit={submit} className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="ra-name">Full name</Label>
              <Input id="ra-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Thando Mokoena" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ra-email">Email address</Label>
              <Input id="ra-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ra-role">Target role (optional)</Label>
              <Input id="ra-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Junior Data Analyst" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ra-notes">Anything to focus on? (optional)</Label>
              <Textarea id="ra-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Career change, gap year, first job..." />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</>) : "Send me my free pack"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">By submitting you agree we may email you the requested resources.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumeAuditModal;
