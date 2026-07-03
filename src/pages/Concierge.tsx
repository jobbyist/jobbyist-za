import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send, Sparkles, Lock, ArrowLeft, Bot, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Recommend jobs based on my profile",
  "Help me prepare for an interview",
  "How do I improve my professional profile?",
  "Help me create a resume website",
];

const ConciergePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();
  const isPro = hasActiveSubscription("jobseeker_pro");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    if (!isSending && isPro) textareaRef.current?.focus();
  }, [isSending, isPro]);

  const send = async (text?: string) => {
    const payload = (text ?? input).trim();
    if (!payload || isSending) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: payload };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("concierge-chat", {
        body: {
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        },
      });
      if (error) throw error;
      const reply = data?.reply || data?.error || "Sorry, I couldn't respond right now.";
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I'm having trouble reaching the assistant. Please try again in a moment or contact support@jobbyist.co.za.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Loading state
  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen concierge-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black/60" />
      </div>
    );
  }

  // Locked screen for free / signed-out users
  if (!user || !isPro) {
    return (
      <div className="min-h-screen concierge-gradient flex items-center justify-center p-6">
        <SEOHead title="Concierge AI — Jobbyist Pro" description="Your Jobbyist Pro AI career concierge." />
        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-black/5 flex items-center justify-center">
            <Lock className="h-7 w-7 text-black/70" />
          </div>
          <h1 className="text-3xl font-black text-black">Concierge is Pro-only</h1>
          <p className="text-black/70">
            Unlock unlimited access to your personal AI career concierge — advanced job recommendations,
            interview coaching, profile reviews and more.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full h-12 text-base font-semibold bg-black text-white hover:bg-black/85"
              onClick={() => navigate(user ? "/pro" : "/auth")}
            >
              {user ? "Upgrade to Jobbyist Pro" : "Sign in to continue"}
            </Button>
            <Link to="/" className="text-sm text-black/60 hover:text-black inline-flex items-center gap-1 justify-center">
              <ArrowLeft className="h-3 w-3" /> Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const empty = messages.length === 0;

  return (
    <div className="min-h-screen concierge-gradient flex flex-col">
      <SEOHead title="Concierge AI — Jobbyist Pro" description="Your Jobbyist Pro AI career concierge." />

      {/* Header bar */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-black/70 hover:text-black inline-flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black/60">
          <Sparkles className="h-3.5 w-3.5" /> Pro
        </div>
      </header>

      {/* Message area / empty state */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-8 pb-4">
        <div className="max-w-2xl mx-auto w-full">
          {empty ? (
            <div className="pt-8 sm:pt-16 pb-6 text-center space-y-6">
              <h1 className="text-5xl sm:text-7xl font-black text-black tracking-tight">Concierge</h1>
              <div className="space-y-4 text-black font-bold text-lg sm:text-xl leading-snug max-w-lg mx-auto">
                <p>Greetings! I'm Concierge AI.</p>
                <p>
                  I'm here to support you in your job search endeavors. Whether you require guidance on
                  resume writing, interview preparation, or assistance with job listings, I am prepared
                  to help you advance in your career.
                </p>
                <p>How may I assist you today?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 max-w-lg mx-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm bg-white/60 hover:bg-white/90 transition-colors rounded-2xl px-4 py-3 text-black/80 border border-white/40 backdrop-blur-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-6 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-black text-white rounded-tr-sm"
                        : "bg-white/85 text-black rounded-tl-sm backdrop-blur-sm",
                    )}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-white/70 text-black flex items-center justify-center shrink-0">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isSending && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white/85 backdrop-blur-sm rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="px-4 sm:px-8 pb-6 pt-2">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-3 flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Enter your text here…"
              rows={2}
              className="flex-1 border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent min-h-[52px] max-h-40 text-black placeholder:text-black/40"
              disabled={isSending}
            />
            <Button
              onClick={() => send()}
              disabled={!input.trim() || isSending}
              size="icon"
              className="rounded-full h-11 w-11 bg-black hover:bg-black/85 shrink-0"
              aria-label="Send"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
          <p className="text-[11px] text-center text-black/50 mt-2">
            Pro members enjoy unlimited Concierge access. Responses may be inaccurate — verify important info.
          </p>
        </div>
      </div>

      <style>{`
        .concierge-gradient {
          background: linear-gradient(-45deg, #d8c7ff, #c9b8ff, #b8d5ff, #e8dcff, #a5c9ff);
          background-size: 400% 400%;
          animation: conciergeGradient 18s ease infinite;
        }
        @keyframes conciergeGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ConciergePage;
