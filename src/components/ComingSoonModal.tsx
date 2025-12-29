import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

const ComingSoonModal = ({
  open,
  onOpenChange,
  title = "Coming Soon!",
  description = "We're working hard to bring you this exciting new feature. Stay tuned for updates!",
}: ComingSoonModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center pt-4">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button variant="brand" className="w-full gap-2">
            <Bell className="h-4 w-4" />
            Notify Me When Available
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonModal;
