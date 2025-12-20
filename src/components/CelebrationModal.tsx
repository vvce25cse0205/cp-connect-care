import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Award, Sparkles, Star } from 'lucide-react';

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  pointsEarned: number;
}

export const CelebrationModal = ({ open, onClose, title, description, pointsEarned }: CelebrationModalProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (open) {
      const colors = ['#2dd4bf', '#f97316', '#fbbf24', '#a855f7', '#3b82f6'];
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setConfetti(newConfetti);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                left: `${piece.left}%`,
                top: '-20px',
                backgroundColor: piece.color,
                animation: `confetti-fall 3s ease-out ${piece.delay}s forwards`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 py-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full gradient-celebration flex items-center justify-center animate-celebrate">
              <Award className="w-12 h-12 text-celebration-foreground" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-warning animate-pulse" />
            <Star className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground">
              🎉 {title}
            </h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary">
            <Star className="w-5 h-5 text-warning" />
            <span className="font-bold text-lg">+{pointsEarned} Points!</span>
          </div>

          <Button onClick={onClose} variant="hero" size="lg">
            Awesome! 🙌
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
