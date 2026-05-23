import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Rocket } from "lucide-react";
import { submitLeadForm } from "@/lib/leadForms";

export interface RecruitmentSuiteWaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan?: string;
}

interface WaitlistForm {
  fullName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  companySize: string;
  hiringVolume: string;
  primaryInterest: string;
  message: string;
}

const EMPTY_FORM: WaitlistForm = {
  fullName: "",
  companyName: "",
  workEmail: "",
  phone: "",
  companySize: "",
  hiringVolume: "",
  primaryInterest: "",
  message: "",
};

const MODAL_CLOSE_DELAY = 2500;

const RecruitmentSuiteWaitlistModal = ({
  open,
  onOpenChange,
  selectedPlan = "",
}: RecruitmentSuiteWaitlistModalProps) => {
  const [form, setForm] = useState<WaitlistForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const set = (field: keyof WaitlistForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = form.workEmail.trim();
    const fullName = form.fullName.trim();

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid work email address.");
      return;
    }
    if (email.length > 255) {
      toast.error("Email is too long (max 255 characters).");
      return;
    }
    if (fullName.length > 100) {
      toast.error("Full name is too long (max 100 characters).");
      return;
    }

    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || undefined;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("waiting_list").insert({
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        user_type: "employer" as const,
        country: "ZA" as const,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("This email is already on the waitlist.");
        } else {
          throw error;
        }
      } else {
        const leadResult = await submitLeadForm({
          formType: "Recruitment Suite waitlist",
          destination: "partnerships@jobbyist.africa",
          replyTo: email,
          honeypot,
          fields: {
            selectedPlan,
            ...form,
            workEmail: email,
          },
        });
        if (!leadResult.ok) {
          throw new Error(leadResult.error || "Unable to deliver waitlist request");
        }
        toast.success(
          "You're on the Recruitment Suite waitlist! We'll be in touch before launch."
        );
        setForm(EMPTY_FORM);
        setHoneypot("");
        setTimeout(() => onOpenChange(false), MODAL_CLOSE_DELAY);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4562ee] to-[#7f5cff]">
              <Rocket className="h-7 w-7 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-black tracking-tight">
            Join the Recruitment Suite Waitlist
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-relaxed pt-2">
            <span className="font-semibold text-foreground">
              Recruitment Suite launches October 2026.
            </span>{" "}
            Join the waitlist now and receive{" "}
            <span className="font-semibold text-foreground">
              25% off your first 3 paid months
            </span>{" "}
            when your company activates during the launch window.
            {selectedPlan && (
              <span className="mt-1 block text-xs text-muted-foreground">
                Selected plan: <strong>{selectedPlan}</strong>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="rs-fullName">Full name *</Label>
              <Input
                id="rs-fullName"
                value={form.fullName}
                onChange={(e) => set("fullName")(e.target.value)}
                placeholder="Jane Smith"
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rs-companyName">Company name *</Label>
              <Input
                id="rs-companyName"
                value={form.companyName}
                onChange={(e) => set("companyName")(e.target.value)}
                placeholder="Acme (Pty) Ltd"
                required
                maxLength={150}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="rs-workEmail">Work email *</Label>
              <Input
                id="rs-workEmail"
                type="email"
                value={form.workEmail}
                onChange={(e) => set("workEmail")(e.target.value)}
                placeholder="you@company.co.za"
                required
                maxLength={255}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rs-phone">Phone / WhatsApp</Label>
              <Input
                id="rs-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                placeholder="+27 ..."
                maxLength={30}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="rs-companySize">Company size</Label>
              <Select
                value={form.companySize}
                onValueChange={set("companySize")}
              >
                <SelectTrigger id="rs-companySize">
                  <SelectValue placeholder="Select size..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1–10 employees</SelectItem>
                  <SelectItem value="11-50">11–50 employees</SelectItem>
                  <SelectItem value="51-200">51–200 employees</SelectItem>
                  <SelectItem value="201-500">201–500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rs-hiringVolume">Hiring volume (per year)</Label>
              <Select
                value={form.hiringVolume}
                onValueChange={set("hiringVolume")}
              >
                <SelectTrigger id="rs-hiringVolume">
                  <SelectValue placeholder="Select volume..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1–5 hires</SelectItem>
                  <SelectItem value="6-20">6–20 hires</SelectItem>
                  <SelectItem value="21-50">21–50 hires</SelectItem>
                  <SelectItem value="51-100">51–100 hires</SelectItem>
                  <SelectItem value="100+">100+ hires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rs-primaryInterest">Primary interest</Label>
            <Select
              value={form.primaryInterest}
              onValueChange={set("primaryInterest")}
            >
              <SelectTrigger id="rs-primaryInterest">
                <SelectValue placeholder="What matters most to you?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job-listings">Job listings &amp; applicant tracking</SelectItem>
                <SelectItem value="pre-screening">Pre-screening &amp; candidate summaries</SelectItem>
                <SelectItem value="background-checks">Candidate background checks</SelectItem>
                <SelectItem value="candidate-directory">Verified candidate directory</SelectItem>
                <SelectItem value="onboarding">Onboarding &amp; training packs</SelectItem>
                <SelectItem value="payroll-hr">Payroll-ready HR tools</SelectItem>
                <SelectItem value="full-suite">Full Recruitment Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rs-message">Message (optional)</Label>
            <Textarea
              id="rs-message"
              value={form.message}
              onChange={(e) => set("message")(e.target.value)}
              placeholder="Tell us about your hiring needs or any questions you have..."
              rows={3}
              maxLength={1000}
            />
          </div>
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="rs-website">Website</Label>
            <Input
              id="rs-website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="brand"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining waitlist..." : "Join the Recruitment Suite Waitlist"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Cancel
          </Button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By joining you agree to our{" "}
            <a href="/terms" className="underline hover:text-foreground">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
            . We will contact you before the October 2026 launch.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecruitmentSuiteWaitlistModal;
