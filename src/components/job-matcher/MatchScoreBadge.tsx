import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MatchScoreBadgeProps {
  score: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchScoreBadge({ score, showProgress = false, size = 'md' }: MatchScoreBadgeProps) {
  const getColorClass = (score: number) => {
    if (score >= 90) return 'bg-green-500 hover:bg-green-600 text-white';
    if (score >= 70) return 'bg-blue-500 hover:bg-blue-600 text-white';
    if (score >= 50) return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    return 'bg-gray-400 hover:bg-gray-500 text-white';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 50) return 'Fair Match';
    return 'Low Match';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div className="flex flex-col gap-2">
      <Badge className={`${getColorClass(score)} ${sizeClasses[size]} font-semibold`}>
        {score}% {getLabel(score)}
      </Badge>
      {showProgress && (
        <div className="w-full">
          <Progress 
            value={score} 
            className="h-2"
            indicatorClassName={getProgressColor(score)}
          />
        </div>
      )}
    </div>
  );
}
