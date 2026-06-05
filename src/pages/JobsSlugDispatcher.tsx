import { useParams } from "react-router-dom";
import JobDetail from "./JobDetail";
import LocationJobs from "./LocationJobs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Dispatches /jobs/:slug — if slug is a UUID we render the job detail page,
 * otherwise we treat it as a location landing page (kept for legacy SEO URLs).
 */
const JobsSlugDispatcher = () => {
  const { slug } = useParams();
  if (slug && UUID_RE.test(slug)) return <JobDetail />;
  return <LocationJobs />;
};

export default JobsSlugDispatcher;
