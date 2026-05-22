import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Flag, Lock } from "lucide-react";

export const TrustCopyModules = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="h-5 w-5 text-primary" /> Verification standards</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Company listings are screened for identity, active contact channels, and role clarity before publishing. High-risk listings are manually reviewed for South African market relevance.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Flag className="h-5 w-5 text-primary" /> Anti-scam reporting</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Found suspicious hiring behaviour, fake recruiters, or payment requests? Use in-platform reporting and our team escalates urgent cases for same-day moderation.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Lock className="h-5 w-5 text-primary" /> Privacy controls</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">You control profile visibility, contact sharing, and employer access. Personal details stay gated until you choose to apply, unlock, or share your profile.</CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TrustCopyModules;
