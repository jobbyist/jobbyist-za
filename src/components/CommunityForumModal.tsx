import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle, Users, Lightbulb, BookOpen, Star } from "lucide-react";

interface CommunityForumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/E6y1JvZV7CSBWO8E5Z8eKc?mode=gi_t";
const WHATSAPP_BRAND_GREEN = "#25D366";

const highlights = [
  { icon: Users, text: "Connect with thousands of SA professionals" },
  { icon: Lightbulb, text: "Exclusive job leads and career tips" },
  { icon: Star, text: "Peer mentorship and community support" },
  { icon: BookOpen, text: "Free resources, guides, and insider advice" },
];

const CommunityForumModal = ({ open, onOpenChange }: CommunityForumModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: WHATSAPP_BRAND_GREEN }}>
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Join Our WhatsApp Community Forum
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            A free, open space for South African job seekers, professionals, and career changers.
            Get real-time job tips, interview advice, peer support, and exclusive resources —
            all in one convenient community.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-3 my-2">
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 mt-2">
          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="brand" className="w-full gap-2" size="lg">
              <MessageCircle className="h-5 w-5" />
              Join the Community on WhatsApp
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-1">
          Free to join · South African professionals · No spam
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityForumModal;
