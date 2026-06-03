// Small badge utilities for jobs:
//   - Featured  → applied to Adzuna-sourced listings
//   - High Demand → applied to titles in our in-demand list

import { Badge } from "@/components/ui/badge";
import { Sparkles, Flame } from "lucide-react";

const HIGH_DEMAND_KEYWORDS = [
  "software", "developer", "engineer", "data", "devops", "cloud",
  "cybersecurity", "ai", "machine learning", "product manager",
  "ux", "ui designer", "nurse", "accountant", "sales", "fintech",
];

export function isAdzunaJob(job: { source?: string | null; source_name?: string | null }) {
  return (
    (job.source && job.source.toLowerCase() === "adzuna") ||
    (job.source_name && job.source_name.toLowerCase() === "adzuna")
  );
}

export function isHighDemandJob(job: { title?: string | null; skills?: string[] | null }) {
  const hay = `${job.title ?? ""} ${(job.skills ?? []).join(" ")}`.toLowerCase();
  return HIGH_DEMAND_KEYWORDS.some((k) => hay.includes(k));
}

export const FeaturedBadge = () => (
  <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1">
    <Sparkles className="h-3 w-3" /> Featured
  </Badge>
);

export const HighDemandBadge = () => (
  <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 gap-1">
    <Flame className="h-3 w-3" /> High Demand
  </Badge>
);

export const JobMetaBadges = ({
  job,
}: {
  job: { source?: string | null; source_name?: string | null; title?: string | null; skills?: string[] | null };
}) => (
  <>
    {isAdzunaJob(job) && <FeaturedBadge />}
    {isHighDemandJob(job) && <HighDemandBadge />}
  </>
);
