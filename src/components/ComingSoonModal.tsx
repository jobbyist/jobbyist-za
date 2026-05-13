import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  ctaText?: string;
  showForm?: boolean;
}

const ComingSoonModal = ({
  open,
  onOpenChange,
  title = "Coming Soon!",
  description = "We're working hard to bring you this exciting new feature. Stay tuned for updates!",
  ctaText = "Notify Me When Available",
  showForm = true,
}: ComingSoonModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Name and email are required to notify you.",
        variant: "destructive",
      });
      return;
    }
    // Simulate submission - in production, integrate with Supabase waitlist or email service
    console.log("Notify signup:", { name, email, resource: title });
    setSubmitted(true);
    toast({
      title: "Thank you!",
      description: "We'll notify you as soon as it's available.",
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form state after close
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center">
              {submitted ? (
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              ) : (
                <Clock className="h-8 w-8 text-primary-foreground" />
              )}
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{submitted ? "You're on the list!" : title}</DialogTitle>
          <DialogDescription className="text-center pt-4">
            {submitted 
              ? "Thank you for your interest! We'll send you an email notification when this resource is ready for download." 
              : description
            }
          </DialogDescription>
        </DialogHeader>

        {!submitted && showForm && (
          <form onSubmit={handleNotify} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Your full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" variant="brand" className="w-full gap-2 mt-2">
              <Bell className="h-4 w-4" />
              {ctaText}
            </Button>
          </form>
        )}

        {submitted && (
          <div className="flex justify-center mt-4">
            <Button variant="brand" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}

        {!submitted && (
          <div className="flex flex-col gap-3 mt-4">
            {!showForm && (
              <Button variant="brand" className="w-full gap-2" onClick={() => {
                handleClose();
              }}>
                <Bell className="h-4 w-4" />
                {ctaText}
              </Button>
            )}
            <Button variant="outline" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonModal;