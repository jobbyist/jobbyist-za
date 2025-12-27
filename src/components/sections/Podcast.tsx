import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Headphones, ArrowRight, Clock } from "lucide-react";
import podcastThumbnail from "@/assets/podcast-episode-1.png";

const Podcast = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-20">
      <audio ref={audioRef} src="/audio/podcast-s1e1.mp3" preload="metadata" />
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Job Post</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Listen to expert advice, success stories, and practical tips to advance 
              your career in the African job market. New episodes every weekday.
            </p>
          </div>

          {/* Featured Episode */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Episode artwork */}
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

              {/* Episode info */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Headphones className="h-4 w-4" />
                  <span>Latest Episode</span>
                  <span className="text-muted">•</span>
                  <Clock className="h-4 w-4" />
                  <span>December 25, 2025</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  S1E1 - Reclaim Your Worth: Dismantling the Gratitude Tax and Earning What You Deserve
                </h3>

                <p className="text-muted-foreground mb-6">
                  Explore how to break free from the "gratitude tax" - the expectation 
                  that you should accept less than you deserve simply because you have a job. 
                  Learn strategies to recognize your true worth and negotiate for what you deserve.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button variant="brand" className="group" onClick={togglePlay}>
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-2 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 mr-2 fill-current" />
                    )}
                    {isPlaying ? "Pause Episode" : "Play Episode"}
                  </Button>
                  <Button variant="outline" className="group">
                    See All Episodes
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  8,769 plays
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;
