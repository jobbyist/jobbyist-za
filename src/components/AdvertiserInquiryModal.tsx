import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Megaphone } from 'lucide-react';
import { submitLeadForm, validateEmail } from '@/lib/leadForms';

interface AdvertiserInquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdvertiserInquiryModal = ({ open, onOpenChange }: AdvertiserInquiryModalProps) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    if (!validateEmail(email)) {
      toast.error('Please enter a valid work email');
      return;
    }

    setSubmitting(true);

    const result = await submitLeadForm({
      formType: 'Advertiser enquiry',
      destination: 'partnerships@jobbyist.africa',
      replyTo: email,
      honeypot,
      fields: {
        name,
        company,
        email,
        message,
      },
    });

    if (!result.ok) {
      toast.error(result.error || 'Could not send enquiry right now');
      setSubmitting(false);
      return;
    }

    toast.success("Enquiry sent successfully");
    setSubmitting(false);
    onOpenChange(false);

    // Reset
    setName('');
    setCompany('');
    setEmail('');
    setMessage('');
    setHoneypot('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="h-5 w-5 text-primary" />
            <DialogTitle>Advertise on Jobbyist</DialogTitle>
          </div>
          <DialogDescription>
            Reach South Africa's most engaged audience of job seekers and professionals. Fill in
            your details and our ads team will be in touch within one business day.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="adq-name">Your name *</Label>
              <Input
                id="adq-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="adq-company">Company</Label>
              <Input
                id="adq-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="adq-email">Work email *</Label>
            <Input
              id="adq-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@acme.com"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="adq-message">Tell us about your campaign</Label>
            <Textarea
              id="adq-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Budget, target audience, campaign goals…"
              rows={3}
            />
          </div>

          <div className="hidden" aria-hidden="true">
            <Label htmlFor="adq-website">Website</Label>
            <Input
              id="adq-website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1" disabled={submitting}>
              Send enquiry
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertiserInquiryModal;
