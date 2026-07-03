import { useEffect, useState } from "react";
import mascot from "@/assets/preloader-mascot.png";

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
    const start = Date.now();
    const duration = 5000;
    const timer = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden preloader-bg">
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-40 blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, #4562ee 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, #7f5cff 0%, transparent 70%)", animationDelay: "1s" }}
      />

      <div className="relative flex flex-col items-center gap-8 w-full max-w-lg px-8 text-center">
        {/* Animated mascot */}
        <div className="relative preloader-mascot">
          <img
            src={mascot}
            alt=""
            aria-hidden="true"
            className="h-32 md:h-40 w-auto drop-shadow-[0_10px_30px_rgba(69,98,238,0.5)]"
            draggable={false}
          />
        </div>

        {/* Logo */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl blur-2xl opacity-70 animate-pulse"
            style={{
              background: "linear-gradient(135deg, #4562ee 0%, #7f5cff 60%, #22d3ee 100%)",
            }}
          />
          <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl px-6 py-4 shadow-2xl">
            <img
              src="/jobbyistza.svg"
              alt="Jobbyist"
              className="h-12 md:h-14 w-auto"
              draggable={false}
            />
          </div>
        </div>

        <div className="w-full space-y-4">
          {/* Gradient progress bar */}
          <div className="relative w-full h-2.5 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #22d3ee 0%, #4562ee 50%, #7f5cff 100%)",
                boxShadow: "0 0 20px rgba(69,98,238,0.6), 0 0 40px rgba(127,92,255,0.35)",
              }}
            />
          </div>

          <p className="text-xs uppercase tracking-[0.3em] font-bold text-white/60">
            Loading your experience…
          </p>

          <p
            className="text-base md:text-xl font-bold leading-snug tracking-tight px-2"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 60%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            "{quote}"
          </p>
        </div>
      </div>

      <style>{`
        .preloader-bg {
          background: linear-gradient(-45deg, #04061a, #0f1451, #1e1b6e, #070a2f, #0a1a5c);
          background-size: 400% 400%;
          animation: preloaderGradient 12s ease infinite;
        }
        @keyframes preloaderGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .preloader-mascot {
          animation: mascotBob 2.4s ease-in-out infinite;
        }
        @keyframes mascotBob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
