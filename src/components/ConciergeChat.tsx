import { useState } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const PREWRITTEN_QUERIES = [
  "How do I update my CV?",
  "How soon will I get a job?",
  "Can I get a refund if I don’t get a job?",
];

const ConciergeChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello, Concierge here - your personal AI assistant. Please feel free to let me know if you need help with anything, I'm always happy to help 🙂",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isBot,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const getConciergeResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes("cv") || lowerMsg.includes("resume")) {
      return "Great question! You can update your CV using our Resume Builder tool at /resume-builder. It helps optimize for ATS and highlights your strengths. Pro members get AI-powered suggestions too! Would you like tips on tailoring it for a specific role?";
    }
    if (lowerMsg.includes("how soon") || lowerMsg.includes("get a job") || lowerMsg.includes("timeline")) {
      return "It depends on your industry, experience, and how actively you're applying. Many job seekers on Jobbyist land interviews within 2-4 weeks with consistent applications (10-15/week). Use our AI Job Matcher and set up alerts! Stay persistent and tailor applications.";
    }
    if (lowerMsg.includes("refund") || lowerMsg.includes("money back") || lowerMsg.includes("guarantee")) {
      return "Yes! We offer a 30-Day Money Back Guarantee on Jobbyist Pro. If you don't land a job or aren't satisfied within 30 days, contact support for a full refund. No questions asked. Pro users also get priority support.";
    }
    if (lowerMsg.includes("pro") || lowerMsg.includes("upgrade")) {
      return "Jobbyist Pro unlocks unlimited AI Concierge access, exclusive jobs, advanced matching, and more for just R99/month. You can upgrade anytime from the /pro page. It includes our 30-Day Money Back Guarantee too!";
    }
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
      return "Hi there! 😊 How can I assist you with your job search today? Feel free to ask about CVs, interviews, job applications, or anything career-related.";
    }

    return "Thanks for asking! As your Concierge, I can help with CV advice, interview prep, job search strategies, understanding Pro benefits, or navigating the platform. What specifically are you looking for help with? For personalized guidance, Pro members get deeper insights.";
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    addMessage(textToSend, false);
    setInput("");

    if (!user) {
      setTimeout(() => {
        addMessage(
          "Sorry, I'd love to help, but this service is reserved for verified Jobbyist community members only. Sign up for free to get limited access or Upgrade to Jobbyist Pro for just R99 per month to unlock full access to this feature 😉",
          true
        );
        setIsTyping(false);
      }, 800);
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      const response = getConciergeResponse(textToSend);
      addMessage(response, true);
      setIsTyping(false);
    }, 1200);
  };

  const handlePrewrittenClick = (query: string) => {
    sendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Concierge Pill */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-[60] flex items-center gap-2 h-12 px-5 rounded-full text-black font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-transparent bg-white",
          "chatbot-gradient-border",
          "shadow-[0_8px_24px_-6px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.35)]",
          isOpen && "ring-2 ring-white/40"
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
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" /> AI Assistant • Gemini Powered
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
                className={cn(
                  "flex gap-2",
                  msg.isBot ? "justify-start" : "justify-end"
                )}
              >
                {msg.isBot && (
                  <div className="w-7 h-7 rounded-full gradient-brand flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    msg.isBot 
                      ? "bg-muted text-foreground rounded-tl-none" 
                      : "bg-brand-pink text-white rounded-tr-none"
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
              {!user ? "Limited access • Upgrade to Pro for full AI features" : "Powered by Gemini • Private & secure"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ConciergeChat;
