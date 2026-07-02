import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Pause, Headphones, ArrowRight, Clock, Heart, MessageSquare } from "lucide-react";
import podcastThumbnail from "@/assets/podcast-episode-1.png";

const PLAYS_KEY = "jobbyist:podcast:s1e1:plays";
const PLAYS_BASELINE = 8769;
const LIKES_KEY = "jobbyist:podcast:s1e1:likes";
const LIKES_BASELINE = 784;
const LIKED_KEY = "jobbyist:podcast:s1e1:liked";
const COUNTED_THIS_SESSION_KEY = "jobbyist:podcast:s1e1:counted-session";

const readNumber = (key: string, fallback: number): number => {
  try {
    const v = localStorage.getItem(key);
    const n = v ? parseInt(v, 10) : NaN;
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
};

const writeNumber = (key: string, value: number) => {
  try { localStorage.setItem(key, String(value)); } catch { /* ignore */ }
};

interface PodcastPlayerProps {
  showHeader?: boolean;
  showAllEpisodesButton?: boolean;
}

const PodcastPlayer = ({ showHeader = true, showAllEpisodesButton = true }: PodcastPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [plays, setPlays] = useState<number>(() => readNumber(PLAYS_KEY, PLAYS_BASELINE));
  const [likes, setLikes] = useState<number>(() => readNumber(LIKES_KEY, LIKES_BASELINE));
  const [liked, setLiked] = useState<boolean>(() => {
    try { return localStorage.getItem(LIKED_KEY) === "1"; } catch { return false; }
  });
  const [commentsOpen, setCommentsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => {
      setIsPlaying(true);
      try {
        if (sessionStorage.getItem(COUNTED_THIS_SESSION_KEY) !== "1") {
          setPlays((prev) => {
            const next = prev + 1;
            writeNumber(PLAYS_KEY, next);
            return next;
          });
          sessionStorage.setItem(COUNTED_THIS_SESSION_KEY, "1");
        }
      } catch { /* ignore */ }
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.pause(); else a.play();
  };

  const toggleLike = () => {
    setLiked((prev) => {
      const nextLiked = !prev;
      setLikes((cur) => {
        const next = Math.max(0, cur + (nextLiked ? 1 : -1));
        writeNumber(LIKES_KEY, next);
        return next;
      });
      try { localStorage.setItem(LIKED_KEY, nextLiked ? "1" : "0"); } catch { /* ignore */ }
      return nextLiked;
    });
  };

  return (
    <section className={showHeader ? "py-20" : "py-0"}>
      <audio ref={audioRef} src="/audio/podcast-s1e1.mp3" preload="metadata" />
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {showHeader && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Job Post</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Listen to expert advice, success stories, and practical tips to advance
                your career in the African job market. New episodes every weekday.
              </p>
            </div>
          )}

          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={podcastThumbnail}
                    alt="Jobbyist Podcast Episode 1"
                    className="w-full h-full object-cover"
                  />
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors cursor-pointer"
                  >
                    <div className="w-24 h-24 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isPlaying ? (
                        <Pause className="h-12 w-12 text-background fill-current" />
                      ) : (
                        <Play className="h-12 w-12 text-background fill-current ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Headphones className="h-4 w-4" />
                  <span>Season Premiere</span>
                  <span className="text-muted">•</span>
                  <Clock className="h-4 w-4" />
                  <span>1 July, 2026</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  S1E1 - Reclaim Your Worth: Dismantling the Gratitude Tax and Earning What You Deserve
                </h3>

                <p className="text-muted-foreground mb-6">
                  Explore how to break free from the "gratitude tax" - the expectation
                  that you should accept less than you deserve simply because you have a job.
                  Learn strategies to recognize your true worth and negotiate for what you deserve.
                </p>

                <div className="flex flex-wrap gap-3 mb-4">
                  <Button variant="brand" className="group" onClick={togglePlay}>
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-2 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 mr-2 fill-current" />
                    )}
                    {isPlaying ? "Pause Episode" : "Play Episode"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleLike}
                    aria-pressed={liked}
                    className="group"
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 transition-colors ${liked ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {likes.toLocaleString()}
                  </Button>
                  <Button variant="outline" onClick={() => setCommentsOpen(true)} className="group">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comments
                  </Button>
                  {showAllEpisodesButton && (
                    <Button variant="ghost" className="group" asChild>
                      <a href="/podcast">
                        See All Episodes
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {plays.toLocaleString()} plays
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              Comments are temporarily disabled while we build a better community
              experience. Check back soon — we'd love to hear your thoughts on this
              episode.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            In the meantime, share feedback at{" "}
            <a href="mailto:support@jobbyist.co.za" className="text-primary hover:underline">
              support@jobbyist.co.za
            </a>
            .
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PodcastPlayer;
