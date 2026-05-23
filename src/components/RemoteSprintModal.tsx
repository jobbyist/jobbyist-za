import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "remote_sprint_modal_last_shown_at_v2";
const TRIGGER_MS = 120 * 1000; // Show the modal 120 seconds after the app loads.
const RETURN_VISITOR_DELAY_MS = 30 * 24 * 60 * 60 * 1000; // Wait 30 days before showing the modal again.

const RemoteSprintModal = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const lastShownAt = localStorage.getItem(STORAGE_KEY);

      if (lastShownAt) {
        const lastShownTimestamp = Number(lastShownAt);
        const now = Date.now();

        if (Number.isFinite(lastShownTimestamp) && lastShownTimestamp <= now && now - lastShownTimestamp < RETURN_VISITOR_DELAY_MS) {
          return;
        }
      }
    } catch {
      // Ignore storage access issues and continue showing the modal.
    }

    const t = setTimeout(() => {
      setOpen(true);
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        // Ignore storage write failures in restricted environments.
      }
    }, TRIGGER_MS);

    return () => clearTimeout(t);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <Badge variant="secondary" className="w-fit gap-1"><Sparkles className="h-3 w-3" /> Limited spots</Badge>
          <DialogTitle className="text-2xl">The 30-Day Remote Job Sprint</DialogTitle>
          <DialogDescription>
            A premium, hands-on placement service with an <strong>80% success rate</strong>.
            Work 1-on-1 with a senior placement expert who builds and executes a personalised
            strategy to land you at least <strong>4 verified interviews</strong> in 30 days.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2 text-sm">
          <div className="flex gap-3"><Target className="h-5 w-5 text-primary mt-0.5" /><div><strong>Guaranteed pipeline.</strong> Min. 4 interviews with vetted SA &amp; remote employers.</div></div>
          <div className="flex gap-3"><TrendingUp className="h-5 w-5 text-primary mt-0.5" /><div><strong>+73% higher hire rate</strong> versus searching alone.</div></div>
          <div className="flex gap-3"><Users className="h-5 w-5 text-primary mt-0.5" /><div><strong>Dedicated expert.</strong> Reputable placement specialist runs your search end-to-end.</div></div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Maybe later</Button>
          <Button variant="brand" onClick={() => { setOpen(false); navigate("/30-day-job-sprint"); }}>
            Find Out More
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoteSprintModal;
