import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Star, Accessibility } from 'lucide-react';
import { games } from '@/data/sampleData';
import { toast } from 'sonner';

const GamesPage = () => {
  const handlePlayGame = (title: string) => {
    toast.info(`🎮 "${title}" game coming soon!`);
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Fun Games for Children</h1>
        <p className="text-muted-foreground mt-1">Accessible, engaging games designed for children with CP</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} variant="interactive">
            <CardHeader>
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl mb-3">
                {game.icon}
              </div>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Ages: {game.ageRange}</p>
              <div className="flex flex-wrap gap-1">
                {game.accessibilityFeatures.map((feature, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-success/10 text-success flex items-center gap-1">
                    <Accessibility className="w-3 h-3" /> {feature}
                  </span>
                ))}
              </div>
              <Button variant="hero" className="w-full" onClick={() => handlePlayGame(game.title)}>
                <Gamepad2 className="w-4 h-4 mr-2" /> Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
