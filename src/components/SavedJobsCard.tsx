import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MapPin, Briefcase, ExternalLink, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SavedJobRow {
  id: string;
  job_id: string;
  created_at: string;
  job: {
    id: string;
    title: string;
    location: string;
    job_type: string;
    is_remote: boolean;
    company_id: string;
  } | null;
}

const SavedJobsCard = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<SavedJobRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("saved_jobs")
      .select("id, job_id, created_at, job:jobs(id, title, location, job_type, is_remote, company_id)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setRows((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("saved_jobs").delete().eq("id", id);
    if (error) return toast.error("Could not remove");
    toast.success("Removed from saved jobs");
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Saved Jobs
        </CardTitle>
        <CardDescription>Jobs you bookmarked from listings and detail pages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && rows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No saved jobs yet. Tap the save icon on any job to keep it here.
            <div className="mt-4">
              <Button asChild variant="outline" size="sm"><Link to="/jobs">Browse jobs</Link></Button>
            </div>
          </div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-3 border rounded-lg p-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{r.job?.title || "Job no longer available"}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                {r.job?.location && (<span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.job.location}</span>)}
                {r.job?.job_type && (<span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{r.job.job_type}</span>)}
                {r.job?.is_remote && <Badge variant="secondary" className="text-[10px]">Remote</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {r.job && (
                <Button asChild size="sm" variant="ghost">
                  <Link to={`/job/${r.job.id}`}><ExternalLink className="h-4 w-4" /></Link>
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => remove(r.id)} aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SavedJobsCard;
