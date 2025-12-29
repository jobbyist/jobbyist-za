import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-8">
        <img 
          src="/jobbyistza.svg" 
          alt="Jobbyist" 
          className="h-24 w-auto animate-pulse"
        />
        <div className="w-full space-y-3">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground font-medium">
            Your Dream Job Awaits...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
