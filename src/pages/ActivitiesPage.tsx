import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Activity, Clock, Star, CheckCircle, Filter } from 'lucide-react';
import { sampleActivities } from '@/data/sampleData';
import { useAppStore } from '@/store/useAppStore';
import { ActivityLog } from '@/types';
import { CelebrationModal } from '@/components/CelebrationModal';
import { toast } from 'sonner';

const ActivitiesPage = () => {
  const { logActivity, activeChildId } = useAppStore();
  const [selectedActivity, setSelectedActivity] = useState<typeof sampleActivities[0] | null>(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ title: '', description: '', points: 0 });
  const [engagement, setEngagement] = useState([3]);
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Activities' },
    { value: 'motor', label: 'Motor Skills' },
    { value: 'communication', label: 'Communication' },
    { value: 'sensory', label: 'Sensory' },
    { value: 'cognitive', label: 'Cognitive' },
    { value: 'social', label: 'Social' },
    { value: 'self-care', label: 'Self-Care' },
  ];

  const filteredActivities = filter === 'all' 
    ? sampleActivities 
    : sampleActivities.filter(a => a.category === filter);

  const handleLogActivity = () => {
    if (!activeChildId) {
      toast.error('Please create a child profile first');
      return;
    }

    if (!selectedActivity) return;

    const pointsEarned = 10 + (engagement[0] * 2);

    const log: ActivityLog = {
      id: Date.now().toString(),
      childId: activeChildId,
      activityId: selectedActivity.id,
      completedAt: new Date().toISOString(),
      duration: selectedActivity.duration,
      engagementLevel: engagement[0] as 1 | 2 | 3 | 4 | 5,
      notes: notes,
      pointsEarned
    };

    logActivity(log);
    setLogDialogOpen(false);
    
    setCelebrationData({
      title: 'Activity Complete!',
      description: `Great job completing "${selectedActivity.title}"! Keep up the amazing work! 💪`,
      points: pointsEarned
    });
    setCelebrationOpen(true);

    setNotes('');
    setEngagement([3]);
    setSelectedActivity(null);
  };

  const categoryColors: Record<string, string> = {
    motor: 'bg-success/20 text-success border-success/30',
    communication: 'bg-primary/20 text-primary border-primary/30',
    sensory: 'bg-celebration/20 text-celebration border-celebration/30',
    cognitive: 'bg-warning/20 text-warning border-warning/30',
    social: 'bg-accent/20 text-accent border-accent/30',
    'self-care': 'bg-muted text-muted-foreground border-muted-foreground/30',
  };

  const difficultyBadge: Record<string, string> = {
    easy: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    hard: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="container py-8 space-y-6">
      <CelebrationModal 
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        title={celebrationData.title}
        description={celebrationData.description}
        pointsEarned={celebrationData.points}
      />

      <div>
        <h1 className="font-display text-3xl font-bold">Activities & Exercises</h1>
        <p className="text-muted-foreground mt-1">
          Fun, therapeutic activities designed for children with CP
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={filter === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} variant="interactive">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[activity.category]}`}>
                  {activity.category}
                </span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyBadge[activity.difficulty]}`}>
                  {activity.difficulty}
                </span>
              </div>
              <CardTitle className="text-lg leading-tight">{activity.title}</CardTitle>
              <CardDescription className="line-clamp-2">{activity.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {activity.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning" />
                  +10-20 pts
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Benefits:</p>
                <div className="flex flex-wrap gap-1">
                  {activity.benefits.map((benefit, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <Dialog open={logDialogOpen && selectedActivity?.id === activity.id} onOpenChange={(open) => {
                setLogDialogOpen(open);
                if (open) setSelectedActivity(activity);
              }}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="w-full" onClick={() => setSelectedActivity(activity)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Log Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display">Log: {activity.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Instructions */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Instructions:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {activity.instructions.map((instruction, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary font-bold">{i + 1}.</span>
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Engagement Level */}
                    <div className="space-y-4">
                      <Label>How engaged was your child?</Label>
                      <div className="space-y-2">
                        <Slider
                          value={engagement}
                          onValueChange={setEngagement}
                          min={1}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low</span>
                          <span className="font-bold text-primary">Level {engagement[0]}</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="How did it go? Any observations?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleLogActivity} className="w-full" variant="hero" size="lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Complete & Earn Points!
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesPage;
