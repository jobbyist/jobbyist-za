import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sprintBannerAsset from "@/assets/sprintbanner.png.asset.json";

const STORAGE_KEY = "sprint_modal_last_shown_at_v3";
const TRIGGER_MS = 120 * 1000;
const RETURN_VISITOR_DELAY_MS = 30 * 24 * 60 * 60 * 1000;

const RemoteSprintModal = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const lastShownAt = localStorage.getItem(STORAGE_KEY);
      if (lastShownAt) {
        const ts = Number(lastShownAt);
        if (Number.isFinite(ts) && ts <= Date.now() && Date.now() - ts < RETURN_VISITOR_DELAY_MS) {
          return;
        }
      }
    } catch {
      // ignore
    }
    const t = setTimeout(() => {
      setOpen(true);
      try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {
        // ignore
      }
    }, TRIGGER_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <img
          src={sprintBannerAsset.url}
          alt="The 90-Day Job Search Sprint by Jobbyist"
          className="w-full h-auto"
        />
        <div className="p-6 space-y-4">
          <Badge variant="secondary" className="w-fit gap-1">
            <Sparkles className="h-3 w-3" /> Limited spots
          </Badge>
          <DialogTitle className="sr-only">The 90-Day Job Search Sprint</DialogTitle>
          <DialogDescription>
            A premium, hands-on placement service with an <strong>80% success rate</strong>. Work 1-on-1 with a
            senior placement expert who builds and executes a personalised strategy to land you at least
            <strong> 4 verified interviews</strong> within your sprint.
          </DialogDescription>

          <div className="grid gap-3 py-2 text-sm">
            <div className="flex gap-3"><Target className="h-5 w-5 text-primary mt-0.5" /><div><strong>Guaranteed pipeline.</strong> Min. 4 interviews with vetted employers.</div></div>
            <div className="flex gap-3"><TrendingUp className="h-5 w-5 text-primary mt-0.5" /><div><strong>+73% higher hire rate</strong> versus searching alone.</div></div>
            <div className="flex gap-3"><Users className="h-5 w-5 text-primary mt-0.5" /><div><strong>Dedicated expert.</strong> Reputable placement specialist runs your search end-to-end.</div></div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Maybe later</Button>
            <Button variant="brand" onClick={() => { setOpen(false); navigate("/sprint"); }}>
              Find Out More
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoteSprintModal;
