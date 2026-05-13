import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "remote_sprint_modal_shown_v1";
const TRIGGER_MS = 5 * 60 * 1000; // 5 minutes

const RemoteSprintModal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const t = setTimeout(() => {
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }, TRIGGER_MS);

    return () => clearTimeout(t);
  }, [user]);

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
          <Button variant="brand" onClick={() => { setOpen(false); navigate("/pro?sprint=1"); }}>
            Reserve my spot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoteSprintModal;
