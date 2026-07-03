import { useState } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const PREWRITTEN_QUERIES = [
  "How do I update my CV?",
  "How soon will I get a job?",
  "Can I get a refund if I don't get a job?",
];

const FREE_QUESTION_LIMIT = 1;
const FREE_USED_KEY = "jobbyist:concierge:free-used";

const readFreeUsed = (): number => {
  try {
    const v = localStorage.getItem(FREE_USED_KEY);
    const n = v ? parseInt(v, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
};

const bumpFreeUsed = () => {
  try {
    const n = readFreeUsed() + 1;
    localStorage.setItem(FREE_USED_KEY, String(n));
  } catch {
    /* ignore */
  }
};

const ConciergeChat = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello, Concierge here — your personal AI assistant. Please feel free to let me know if you need help with anything, I'm always happy to help 🙂",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const isPro = hasActiveSubscription("jobseeker_pro");

  const hiddenPathPrefixes = [
    "/recruitment-suite",
    "/30-day-job-sprint",
    "/sprint",
    "/professional-profiles",
    "/concierge",
  ];
  const isHidden = hiddenPathPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (isHidden) return null;

  const toggleChat = () => setIsOpen(!isOpen);

  const addMessage = (text: string, isBot: boolean) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), text, isBot }]);
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isTyping) return;

    // Rate limit for free users (client-side gate; server also has its own limits)
    if (!isPro) {
      const used = readFreeUsed();
      if (used >= FREE_QUESTION_LIMIT) {
        addMessage(textToSend, false);
        setInput("");
        setTimeout(() => {
          addMessage(
            "You've reached the free question limit. Upgrade to Jobbyist Pro (R99/month) for unlimited Concierge access, unlimited applications, and AI matching. Visit /pro to upgrade.",
            true,
          );
        }, 400);
        return;
      }
    }

    addMessage(textToSend, false);
    setInput("");
    setIsTyping(true);

    try {
      const history = [...messages, { id: 0, text: textToSend, isBot: false }]
        .filter((m) => m.id !== 1 || m.isBot === false) // skip initial greeting for context
        .map((m) => ({ role: m.isBot ? "assistant" : "user", content: m.text }));

      const { data, error } = await supabase.functions.invoke("concierge-chat", {
        body: { messages: history },
      });

      if (error) throw error;
      const reply =
        data?.reply ||
        data?.error ||
        "Sorry, I couldn't reach the assistant right now. Please try again.";
      addMessage(reply, true);
      if (!isPro && !data?.error) bumpFreeUsed();
    } catch (e) {
      addMessage(
        "Sorry, I couldn't reach the assistant right now. Please try again or contact support@jobbyist.co.za.",
        true,
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handlePrewrittenClick = (query: string) => sendMessage(query);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-[60] flex items-center gap-2 h-12 px-5 rounded-full text-black font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-transparent bg-white",
          "chatbot-gradient-border",
          "shadow-[0_8px_24px_-6px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.35)]",
          isOpen && "ring-2 ring-white/40",
        )}
        aria-label="Open Concierge AI Chat"
      >
        {isOpen ? (
          <>
            <X className="h-4 w-4" />
            <span>Close</span>
          </>
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            <span>Concierge</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[70] w-[calc(100%-3rem)] max-w-[380px] rounded-2xl border border-border bg-background shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm">Concierge</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  AI Assistant
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px] bg-background text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex gap-2", msg.isBot ? "justify-start" : "justify-end")}
              >
                {msg.isBot && (
                  <div className="w-7 h-7 rounded-full gradient-brand flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    msg.isBot
                      ? "bg-muted text-foreground rounded-tl-none"
                      : "bg-brand-pink text-white rounded-tr-none",
                  )}
                >
                  {msg.text}
                </div>
                {!msg.isBot && (
                  <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0 flex items-center justify-center mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full gradient-brand flex-shrink-0 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {messages.length < 3 && (
            <div className="px-4 py-2 border-t bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2 px-1">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {PREWRITTEN_QUERIES.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePrewrittenClick(query)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors text-left"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Concierge anything..."
                className="flex-1 text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              {isPro
                ? "Unlimited access • Private & secure"
                : `Free plan: ${FREE_QUESTION_LIMIT} question • Upgrade to Pro for unlimited`}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ConciergeChat;
