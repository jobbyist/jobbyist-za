import { Navigate, useParams } from "react-router-dom";

export const LegacyJobRedirect = () => {
  const { jobId } = useParams();
  return <Navigate to={`/jobs/${jobId}`} replace />;
};

export const LegacyCompanyRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/companies/${slug}`} replace />;
};
