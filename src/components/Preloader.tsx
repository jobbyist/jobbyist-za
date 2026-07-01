import { useEffect, useState } from "react";

const motivationalQuotes = [
  "Your dream career is closer than you think.",
  "Every application brings you one step closer to success.",
  "The perfect opportunity is waiting for you.",
  "Your next breakthrough starts here.",
  "Success is built one opportunity at a time.",
  "Great careers begin with a single, bold step.",
  "Your potential is limitless. Your future is bright.",
  "The role you've been waiting for is waiting for you.",
  "Believe in yourself and everything you're capable of.",
  "Your skills will open doors to amazing opportunities.",
  "Show up daily. Momentum is your unfair advantage.",
  "Bet on yourself — nobody else has your unique story.",
];

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [quote] = useState(
    () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(69,98,238,0.35) 0%, transparent 45%)," +
          "radial-gradient(circle at 80% 80%, rgba(127,92,255,0.28) 0%, transparent 45%)," +
          "linear-gradient(135deg, #04061a 0%, #070a2f 45%, #0f1451 100%)",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #4562ee 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #7f5cff 0%, transparent 70%)" }}
      />

      <div className="relative flex flex-col items-center gap-10 w-full max-w-lg px-8 text-center">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 rounded-3xl blur-2xl opacity-70 animate-pulse"
            style={{
              background:
                "linear-gradient(135deg, #4562ee 0%, #7f5cff 60%, #22d3ee 100%)",
            }}
          />
          <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl px-8 py-6 shadow-2xl">
            <img
              src="/jobbyistza.svg"
              alt="Jobbyist"
              className="h-16 md:h-20 w-auto"
              style={{ imageRendering: "auto" }}
              draggable={false}
            />
          </div>
        </div>

        <div className="w-full space-y-5">
          {/* Gradient progress bar */}
          <div className="relative w-full h-3 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #22d3ee 0%, #4562ee 50%, #7f5cff 100%)",
                boxShadow:
                  "0 0 20px rgba(69,98,238,0.6), 0 0 40px rgba(127,92,255,0.35)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                transform: `translateX(${progress - 100}%)`,
                transition: "transform 0.3s ease-out",
              }}
            />
          </div>

          <p
            className="text-lg md:text-2xl font-extrabold leading-snug tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #a5b4fc 60%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            “{quote}”
          </p>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-white/50">
            Loading your next opportunity
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
