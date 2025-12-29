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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Rocket, Users, Briefcase } from "lucide-react";

interface RecruitmentSuiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MODAL_CLOSE_DELAY = 2000;

const RecruitmentSuiteModal = ({
  open,
  onOpenChange,
}: RecruitmentSuiteModalProps) => {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    userType: "employer",
    companyName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const email = form.email.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const userType = form.userType;
    const companyName = form.companyName.trim();

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (email.length > 255) {
      toast.error("Email is too long (max 255 characters)");
      return;
    }

    // Validate name lengths
    if (firstName.length > 50) {
      toast.error("First name is too long (max 50 characters)");
      return;
    }

    if (lastName.length > 50) {
      toast.error("Last name is too long (max 50 characters)");
      return;
    }

    if (companyName.length > 100) {
      toast.error("Company name is too long (max 100 characters)");
      return;
    }

    // Validate user type
    if (!["employer", "recruiter"].includes(userType)) {
      toast.error("Invalid user type selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("recruitment_suite_waitlist").insert({
        email: email,
        first_name: firstName || null,
        last_name: lastName || null,
        user_type: userType,
        company_name: companyName || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("This email is already on the waiting list!");
        } else if (error.code === "42P01") {
          // Table doesn't exist - fallback to waiting_list
          const { error: fallbackError } = await supabase.from("waiting_list").insert({
            email: email,
            first_name: firstName || null,
            last_name: lastName || null,
            user_type: userType === "recruiter" ? "employer" : userType,
            country: "ZA",
          });

          if (fallbackError) {
            if (fallbackError.code === "23505") {
              toast.error("This email is already on the waiting list!");
            } else {
              throw fallbackError;
            }
          } else {
            toast.success("You've been added to the Early Access Program!");
            setForm({
              email: "",
              firstName: "",
              lastName: "",
              userType: "employer",
              companyName: "",
            });
            setTimeout(() => onOpenChange(false), MODAL_CLOSE_DELAY);
          }
        } else {
          throw error;
        }
      } else {
        toast.success("You've been added to the Early Access Program!");
        setForm({
          email: "",
          firstName: "",
          lastName: "",
          userType: "employer",
          companyName: "",
        });
        setTimeout(() => onOpenChange(false), MODAL_CLOSE_DELAY);
      }
    } catch (error) {
      console.error("Error joining Early Access Program:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center">
              <Rocket className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Join Early Access Program
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            Get priority access to our comprehensive HR management solution launching in Q1 2026. Perfect for SMEs looking for affordable, turnkey staffing solutions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
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
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="Your Company"
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
                <RadioGroupItem value="employer" id="employer" />
                <Label
                  htmlFor="employer"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Briefcase className="h-4 w-4" />
                  Employer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label
                  htmlFor="recruiter"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Users className="h-4 w-4" />
                  Recruiter
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            variant="brand"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join Early Access"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecruitmentSuiteModal;
