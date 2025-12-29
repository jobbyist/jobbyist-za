import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const motivationalQuotes = [
  "Your dream career is closer than you think.",
  "Every application brings you one step closer to success.",
  "The perfect opportunity is waiting for you.",
  "Your next breakthrough starts here.",
  "Success is built one opportunity at a time.",
  "Great careers begin with a single step.",
  "Your potential is limitless, your future is bright.",
  "The job you've been waiting for is waiting for you.",
  "Believe in yourself and all that you are capable of.",
  "Your skills will open doors to amazing opportunities."
];

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [quote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-8">
        <img 
          src="/jobbyistpreloader.svg" 
          alt="Jobbyist" 
          className="h-40 w-auto animate-pulse"
        />
        <div className="w-full space-y-3">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground font-medium">
            {quote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
