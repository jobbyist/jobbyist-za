import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface ExpiredBadgeProps {
  className?: string;
}

const ExpiredBadge = ({ className }: ExpiredBadgeProps) => (
  <Badge variant="destructive" className={className}>
    <AlertCircle className="h-3 w-3 mr-1" />
    Offer Expired
  </Badge>
);

export default ExpiredBadge;
