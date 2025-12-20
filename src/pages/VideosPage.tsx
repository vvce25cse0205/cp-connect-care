import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Play, Clock, Star, ArrowUpRight } from 'lucide-react';
import { exerciseVideos } from '@/data/sampleData';
import { toast } from 'sonner';

const VideosPage = () => {
  const categoryColors: Record<string, string> = {
    stretching: 'bg-success/20 text-success',
    strengthening: 'bg-primary/20 text-primary',
    balance: 'bg-warning/20 text-warning',
    coordination: 'bg-accent/20 text-accent',
    sensory: 'bg-celebration/20 text-celebration',
    speech: 'bg-muted text-muted-foreground',
  };

  const difficultyBadge: Record<string, string> = {
    beginner: 'bg-success/10 text-success',
    intermediate: 'bg-warning/10 text-warning',
    advanced: 'bg-destructive/10 text-destructive',
  };

  const handlePlayVideo = (title: string) => {
    toast.info(`🎬 Video player coming soon! "${title}" would play here.`);
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Exercise Videos</h1>
        <p className="text-muted-foreground mt-1">
          Watch and follow along with therapeutic exercises designed for children with CP
        </p>
      </div>

      {/* Featured Video */}
      <Card className="overflow-hidden">
        <div className="relative h-48 md:h-64 gradient-primary flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/5" />
          <div className="relative z-10 text-center text-primary-foreground">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary-foreground/30 transition-colors">
              <Play className="w-10 h-10 ml-1" />
            </div>
            <h3 className="font-display text-xl font-bold">Daily Stretching Routine</h3>
            <p className="text-sm opacity-90 mt-1">15-minute gentle stretches for the whole body</p>
          </div>
        </div>
      </Card>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exerciseVideos.map((video) => (
          <Card key={video.id} variant="interactive" className="overflow-hidden">
            <div className="relative h-40 bg-muted flex items-center justify-center group cursor-pointer"
                 onClick={() => handlePlayVideo(video.title)}>
              <Video className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-7 h-7 ml-1" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-foreground/80 text-background text-xs">
                {video.duration} min
              </span>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[video.category]}`}>
                  {video.category}
                </span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyBadge[video.difficulty]}`}>
                  {video.difficulty}
                </span>
              </div>
              <CardTitle className="text-lg">{video.title}</CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {video.benefits.map((benefit, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted">
                    ✓ {benefit}
                  </span>
                ))}
              </div>
              <Button 
                variant="soft" 
                className="w-full"
                onClick={() => handlePlayVideo(video.title)}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tip */}
      <Card variant="warm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center flex-shrink-0">
              🎥
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-secondary-foreground mb-1">
                Video Exercise Tips
              </h3>
              <p className="text-secondary-foreground/80">
                Always warm up before exercises. Watch the video first without doing exercises, 
                then follow along. Never force movements - comfort is key! 
                Consult your therapist before trying new exercises. 🩺
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideosPage;
