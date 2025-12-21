import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gamepad2, Accessibility, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

// Color Match Game Component
const ColorMatchGame = ({ onClose }: { onClose: () => void }) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'];
  const [targetColor, setTargetColor] = useState(colors[Math.floor(Math.random() * colors.length)]);
  const [score, setScore] = useState(0);
  const [shuffledColors, setShuffledColors] = useState([...colors].sort(() => Math.random() - 0.5));

  const handleColorClick = (color: string) => {
    if (color === targetColor) {
      setScore(s => s + 1);
      toast.success('Correct! 🎉');
      const newTarget = colors[Math.floor(Math.random() * colors.length)];
      setTargetColor(newTarget);
      setShuffledColors([...colors].sort(() => Math.random() - 0.5));
    } else {
      toast.error('Try again!');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <p className="text-lg font-semibold mb-4">Match this color!</p>
        <div className={`w-24 h-24 ${targetColor} rounded-2xl mx-auto shadow-lg`} />
        <p className="mt-4 text-2xl font-bold">Score: {score}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {shuffledColors.map((color, i) => (
          <button
            key={i}
            className={`w-full aspect-square ${color} rounded-xl hover:scale-105 transition-transform touch-target shadow-md`}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setScore(0); setShuffledColors([...colors].sort(() => Math.random() - 0.5)); }}>
        <RotateCcw className="w-4 h-4 mr-2" /> Reset Game
      </Button>
    </div>
  );
};

// Memory Game Component
const MemoryGame = ({ onClose }: { onClose: () => void }) => {
  const emojis = ['🌸', '🌻', '🌺', '🌷', '🌹', '🌼'];
  const [cards, setCards] = useState(() => {
    const pairs = [...emojis, ...emojis];
    return pairs.sort(() => Math.random() - 0.5).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
  });
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          
          if (matchedCards.every(c => c.matched)) {
            toast.success('You won! 🎉');
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    const pairs = [...emojis, ...emojis];
    setCards(pairs.sort(() => Math.random() - 0.5).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })));
    setFlippedCards([]);
    setMoves(0);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <p className="text-lg font-semibold">Find matching pairs!</p>
        <p className="text-muted-foreground">Moves: {moves}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all touch-target ${
              card.flipped || card.matched 
                ? 'bg-primary/20' 
                : 'bg-muted hover:bg-muted/80'
            } ${card.matched ? 'opacity-50' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {(card.flipped || card.matched) ? card.emoji : '?'}
          </button>
        ))}
      </div>
      <Button variant="outline" className="w-full" onClick={resetGame}>
        <RotateCcw className="w-4 h-4 mr-2" /> New Game
      </Button>
    </div>
  );
};

// Bubble Pop Game
const BubblePopGame = ({ onClose }: { onClose: () => void }) => {
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const colors = ['bg-blue-400', 'bg-pink-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'];

  const spawnBubble = () => {
    const newBubble = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setBubbles(prev => [...prev, newBubble]);
  };

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
    toast.success('Pop! 🫧');
    spawnBubble();
  };

  useState(() => {
    for (let i = 0; i < 6; i++) {
      setTimeout(spawnBubble, i * 200);
    }
  });

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <p className="text-2xl font-bold">Score: {score}</p>
      </div>
      <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl overflow-hidden">
        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            className={`absolute w-12 h-12 ${bubble.color} rounded-full shadow-lg hover:scale-110 transition-transform animate-pulse`}
            style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => popBubble(bubble.id)}
          />
        ))}
        {bubbles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={() => { setScore(0); for (let i = 0; i < 6; i++) setTimeout(spawnBubble, i * 200); }}>
              Start Game
            </Button>
          </div>
        )}
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setBubbles([]); setScore(0); for (let i = 0; i < 6; i++) setTimeout(spawnBubble, i * 200); }}>
        <RotateCcw className="w-4 h-4 mr-2" /> Reset
      </Button>
    </div>
  );
};

// Counting Game
const CountingGame = ({ onClose }: { onClose: () => void }) => {
  const animals = ['🐕', '🐈', '🐰', '🐦', '🦋', '🐢'];
  const [count, setCount] = useState(Math.floor(Math.random() * 5) + 1);
  const [animal, setAnimal] = useState(animals[Math.floor(Math.random() * animals.length)]);
  const [score, setScore] = useState(0);

  const checkAnswer = (answer: number) => {
    if (answer === count) {
      setScore(s => s + 1);
      toast.success('Correct! 🎉');
      setCount(Math.floor(Math.random() * 5) + 1);
      setAnimal(animals[Math.floor(Math.random() * animals.length)]);
    } else {
      toast.error('Try again!');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <p className="text-lg font-semibold mb-4">How many do you see?</p>
        <div className="flex flex-wrap justify-center gap-4 p-4 bg-muted rounded-xl min-h-[100px]">
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              {animal}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xl font-bold">Score: {score}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map(num => (
          <Button
            key={num}
            variant="outline"
            className="text-2xl h-16 touch-target"
            onClick={() => checkAnswer(num)}
          >
            {num}
          </Button>
        ))}
      </div>
    </div>
  );
};

const games = [
  {
    id: '1',
    title: 'Color Match Magic',
    description: 'Match colorful objects to learn colors and patterns',
    category: 'cognitive',
    ageRange: '2-8 years',
    accessibilityFeatures: ['Large touch targets', 'Audio feedback', 'Simple gestures'],
    icon: '🎨',
    component: ColorMatchGame
  },
  {
    id: '2',
    title: 'Memory Garden',
    description: 'Find matching pairs of flowers and animals',
    category: 'cognitive',
    ageRange: '3-10 years',
    accessibilityFeatures: ['Adjustable difficulty', 'Voice prompts', 'High contrast'],
    icon: '🌸',
    component: MemoryGame
  },
  {
    id: '3',
    title: 'Bubble Pop Fun',
    description: 'Pop bubbles to improve motor skills and reaction time',
    category: 'motor',
    ageRange: '1-8 years',
    accessibilityFeatures: ['Adjustable speed', 'Large bubbles', 'Haptic feedback'],
    icon: '🫧',
    component: BubblePopGame
  },
  {
    id: '4',
    title: 'Count with Animals',
    description: 'Learn numbers with cute animal friends',
    category: 'cognitive',
    ageRange: '2-7 years',
    accessibilityFeatures: ['Large numbers', 'Audio counting', 'Rewards'],
    icon: '🐾',
    component: CountingGame
  }
];

const GamesPage = () => {
  const [activeGame, setActiveGame] = useState<typeof games[0] | null>(null);

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
              <Button 
                variant="hero" 
                className="w-full" 
                onClick={() => setActiveGame(game)}
              >
                <Gamepad2 className="w-4 h-4 mr-2" /> Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game Dialog */}
      <Dialog open={!!activeGame} onOpenChange={() => setActiveGame(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{activeGame?.icon}</span>
              {activeGame?.title}
            </DialogTitle>
          </DialogHeader>
          {activeGame?.component && <activeGame.component onClose={() => setActiveGame(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesPage;
