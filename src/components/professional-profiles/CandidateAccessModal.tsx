import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CandidateAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId?: string;
}

export const CandidateAccessModal = ({ isOpen, onClose, profileId }: CandidateAccessModalProps) => {
  const navigate = useNavigate();

  const handleJobseekerUpgrade = () => {
    navigate("/pro");
    onClose();
  };

  const handleRecruiterUpgrade = () => {
    // TODO: Update with actual Recruitment Suite route when available
    navigate("/pro");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold">
            Access Full Candidate Profiles
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            Full candidate details are available only to active Jobbyist Pro members and employers or recruiters on paid Recruitment Suite plans.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {/* Jobbyist Pro Option */}
          <Card className="p-5 border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Jobbyist Pro</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
              Upgrade to Jobbyist Pro to improve your profile visibility, strengthen your professional presentation and increase your chances of being discovered by relevant employers and recruiters.
            </p>

            <ul className="text-sm space-y-2 mb-4 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Enhanced profile visibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Priority in search results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Verification badge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Advanced career tools</span>
              </li>
            </ul>

            <Button
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              onClick={handleJobseekerUpgrade}
            >
              Upgrade to Jobbyist Pro
            </Button>
          </Card>

          {/* Recruitment Suite Option */}
          <Card className="p-5 border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold">Recruitment Suite</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
              Recruitment Suite gives employers and recruiters full access to a growing database of verified candidates, shortlisting tools and HR-ready hiring workflows.
            </p>

            <ul className="text-sm space-y-2 mb-4 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Full candidate profiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Contact information access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Advanced search filters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Applicant tracking tools</span>
              </li>
            </ul>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-600/90 hover:to-cyan-600/90"
              onClick={handleRecruiterUpgrade}
            >
              Get Recruitment Suite Access
            </Button>
          </Card>
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Full candidate access is subject to privacy compliance, consent verification and active subscription status.
        </p>
      </DialogContent>
    </Dialog>
  );
};
