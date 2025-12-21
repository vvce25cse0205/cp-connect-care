import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Play, Clock, ExternalLink } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  duration: string;
}

const cpVideos: YouTubeVideo[] = [
  {
    id: '1',
    title: 'Stretching Exercises for Cerebral Palsy',
    description: 'Gentle stretching routine to reduce muscle stiffness and improve flexibility',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'stretching',
    duration: '15 min'
  },
  {
    id: '2',
    title: 'Physical Therapy for CP - Home Exercises',
    description: 'Easy-to-follow home therapy exercises for children with cerebral palsy',
    youtubeId: 'L_jWHffIx5E',
    category: 'therapy',
    duration: '20 min'
  },
  {
    id: '3',
    title: 'Occupational Therapy Activities',
    description: 'Fine motor skill development activities for daily living',
    youtubeId: 'rfscVS0vtbw',
    category: 'therapy',
    duration: '12 min'
  },
  {
    id: '4',
    title: 'Speech Therapy Exercises for Children',
    description: 'Oral motor exercises and speech development activities',
    youtubeId: 'Ke90Tje7VS0',
    category: 'speech',
    duration: '18 min'
  },
  {
    id: '5',
    title: 'Balance and Core Strengthening',
    description: 'Exercises to improve trunk stability and balance control',
    youtubeId: 'x7X9w_GIm1s',
    category: 'strengthening',
    duration: '14 min'
  },
  {
    id: '6',
    title: 'Sensory Integration Activities',
    description: 'Calming sensory play activities for regulation',
    youtubeId: 'C0DPdy98e4c',
    category: 'sensory',
    duration: '10 min'
  },
  {
    id: '7',
    title: 'Leg Strengthening Exercises',
    description: 'Lower limb exercises to improve walking and standing',
    youtubeId: 'jNgP6d9HraI',
    category: 'strengthening',
    duration: '16 min'
  },
  {
    id: '8',
    title: 'Hand-Eye Coordination Games',
    description: 'Fun activities to develop motor planning and coordination',
    youtubeId: 'XqZsoesa55w',
    category: 'coordination',
    duration: '12 min'
  }
];

const categories = [
  { value: 'all', label: 'All Videos' },
  { value: 'stretching', label: 'Stretching' },
  { value: 'therapy', label: 'Therapy' },
  { value: 'strengthening', label: 'Strengthening' },
  { value: 'speech', label: 'Speech' },
  { value: 'sensory', label: 'Sensory' },
  { value: 'coordination', label: 'Coordination' }
];

const categoryColors: Record<string, string> = {
  stretching: 'bg-success/20 text-success',
  therapy: 'bg-primary/20 text-primary',
  strengthening: 'bg-warning/20 text-warning',
  speech: 'bg-accent/20 text-accent',
  sensory: 'bg-celebration/20 text-celebration',
  coordination: 'bg-muted text-muted-foreground',
};

const VideosPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredVideos = selectedCategory === 'all' 
    ? cpVideos 
    : cpVideos.filter(v => v.category === selectedCategory);

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Exercise Videos</h1>
        <p className="text-muted-foreground mt-1">
          Watch therapeutic exercise videos designed for children with CP
        </p>
      </div>

      {/* Featured Video */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-foreground/5">
          {playingId === 'featured' ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Featured Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div 
              className="absolute inset-0 gradient-primary flex items-center justify-center cursor-pointer group"
              onClick={() => setPlayingId('featured')}
            >
              <div className="text-center text-primary-foreground">
                <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-foreground/30 transition-colors">
                  <Play className="w-10 h-10 ml-1" />
                </div>
                <h3 className="font-display text-xl font-bold">Daily Stretching Routine</h3>
                <p className="text-sm opacity-90 mt-1">15-minute gentle stretches for the whole body</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex-wrap h-auto gap-2">
          {categories.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} variant="interactive" className="overflow-hidden">
            <div 
              className="relative aspect-video bg-muted cursor-pointer group"
              onClick={() => setPlayingId(playingId === video.id ? null : video.id)}
            >
              {playingId === video.id ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                      <Play className="w-7 h-7 ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-foreground/80 text-background text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </span>
                </>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[video.category]}`}>
                  {video.category}
                </span>
              </div>
              <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
              <CardDescription className="line-clamp-2">{video.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="soft" 
                className="w-full"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch on YouTube
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
