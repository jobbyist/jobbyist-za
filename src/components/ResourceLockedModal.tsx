import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResourceLockedModal = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 rounded-full gradient-brand flex items-center justify-center">
            <Crown className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <DialogTitle className="text-center text-2xl">Available to Jobbyist Pro members</DialogTitle>
        <DialogDescription className="text-center">
          This resource is unlocked exclusively for Jobbyist Pro members. Upgrade to Pro to
          access every guide, template, interview pack and premium tool on the platform.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="!flex-col gap-2 sm:!flex-col">
        <Link to="/pro" className="w-full" onClick={() => onOpenChange(false)}>
          <Button variant="brand" className="w-full gap-2" size="lg">
            Upgrade to Jobbyist Pro
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
          Maybe later
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ResourceLockedModal;
