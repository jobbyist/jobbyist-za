// Huzzle-style AI interview: video preview + spoken AI questions + voice answers.
// Uses Web Speech API for TTS/STT with graceful typing fallback, and the
// existing `ai-interview` edge function (Gemini) for adaptive questions.
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Mic, MicOff, Video, VideoOff, Sparkles, Loader2, Volume2, VolumeX, ArrowRight, SkipForward } from "lucide-react";

type Msg = { role: "assistant" | "user"; content: string };

interface Props {
  firstName: string;
  onComplete: () => void;
  onSkip: () => void;
}

const TOTAL_Q = 5;

const VoiceVideoInterview = ({ firstName, onComplete, onSkip }: Props) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [chat, setChat] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [qCount, setQCount] = useState(0);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [ttsOn, setTtsOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);

  // ---- Camera ----
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        toast.error("Camera/mic blocked — you can still type your answers.");
        setCamOn(false); setMicOn(false);
      }
    })();
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      window.speechSynthesis?.cancel();
      try { recognitionRef.current?.stop(); } catch { /* noop */ }
    };
  }, []);

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks?.()[0];
    if (track) { track.enabled = !track.enabled; setCamOn(track.enabled); }
  };
  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks?.()[0];
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled); }
  };

  // ---- TTS ----
  const speak = (text: string) => {
    if (!ttsOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1; u.pitch = 1; u.lang = "en-ZA";
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    } catch { /* noop */ }
  };

  // ---- STT ----
  useEffect(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSttSupported(false); return; }
    const r = new SR();
    r.lang = "en-ZA"; r.continuous = false; r.interimResults = true;
    r.onresult = (e: any) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript;
      setReply((prev) => (prev + " " + text).trim());
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognitionRef.current = r;
  }, []);

  const startListening = () => {
    if (!sttSupported) { toast.info("Voice input not supported in this browser — type instead."); return; }
    try { recognitionRef.current?.start(); setListening(true); }
    catch { /* already started */ }
  };
  const stopListening = () => { try { recognitionRef.current?.stop(); } catch { /* noop */ } setListening(false); };

  // ---- AI flow ----
  const startInterview = async () => {
    if (chat.length > 0 || loading) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-interview", {
        body: { messages: [{ role: "user", content: `Hi! I'm ${firstName}. Please start the interview.` }] },
      });
      if (error) throw error;
      const msg = data?.message || "Hi there! Tell me about your career goals over the next 12-24 months.";
      setChat([{ role: "assistant", content: msg }]);
      speak(msg);
    } catch (e: any) {
      toast.error("Couldn't start interview — you can skip.");
    } finally { setLoading(false); }
  };

  useEffect(() => { startInterview(); /* eslint-disable-next-line */ }, []);

  const sendReply = async () => {
    if (!reply.trim() || loading) return;
    stopListening();
    window.speechSynthesis?.cancel();
    const next: Msg[] = [...chat, { role: "user", content: reply.trim() }];
    setChat(next); setReply(""); setLoading(true);
    const newCount = qCount + 1; setQCount(newCount);
    const finalize = newCount >= TOTAL_Q;
    try {
      const { data, error } = await supabase.functions.invoke("ai-interview", {
        body: { messages: next, finalize, userId: user?.id },
      });
      if (error) throw error;
      if (finalize) {
        toast.success("Interview complete — welcome aboard!");
        if (user) await supabase.from("profiles").update({ onboarding_completed_at: new Date().toISOString() }).eq("user_id", user.id);
        onComplete();
      } else {
        const msg = data?.message || "Tell me more.";
        setChat([...next, { role: "assistant", content: msg }]);
        speak(msg);
      }
    } catch {
      toast.error("Interview error — try again or skip.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-sm gap-2">
              <VideoOff className="h-5 w-5" /> Camera off
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex gap-2">
            <Button size="icon" variant="secondary" onClick={toggleCam} className="h-8 w-8" aria-label="Toggle camera">
              {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="secondary" onClick={toggleMic} className="h-8 w-8" aria-label="Toggle microphone">
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="secondary" onClick={() => setTtsOn((v) => !v)} className="h-8 w-8" aria-label="Toggle voice">
              {ttsOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
          <Badge className="absolute top-2 right-2 bg-black/60 text-white border-0">{qCount}/{TOTAL_Q}</Badge>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3 flex flex-col min-h-[220px] max-h-[280px] overflow-y-auto space-y-2">
          {chat.length === 0 && loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Connecting to your AI interviewer…
            </div>
          )}
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-lg max-w-[85%] text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"}`}>
                {m.role === "assistant" && <Sparkles className="h-3 w-3 inline mr-1" />}
                {m.content}
              </div>
            </div>
          ))}
          {loading && chat.length > 0 && (
            <div className="text-xs text-muted-foreground"><Loader2 className="h-3 w-3 inline animate-spin mr-1" /> Thinking…</div>
          )}
          {speaking && (
            <div className="text-xs text-primary"><Volume2 className="h-3 w-3 inline mr-1" /> Speaking…</div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={listening ? "Listening… speak your answer" : "Type your answer or tap the mic to speak"}
          rows={3}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {!listening ? (
              <Button type="button" variant="outline" onClick={startListening} disabled={!sttSupported}>
                <Mic className="h-4 w-4 mr-1" /> {sttSupported ? "Speak" : "Voice unsupported"}
              </Button>
            ) : (
              <Button type="button" variant="destructive" onClick={stopListening}>
                <MicOff className="h-4 w-4 mr-1" /> Stop
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={onSkip}>
              <SkipForward className="h-4 w-4 mr-1" /> Skip
            </Button>
          </div>
          <Button onClick={sendReply} disabled={!reply.trim() || loading}>
            Send <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          Powered by Gemini · We never record or store video.
        </p>
      </div>
    </div>
  );
};

export default VoiceVideoInterview;
