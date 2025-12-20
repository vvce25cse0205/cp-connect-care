import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Plus, Award, PartyPopper, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Milestone } from '@/types';
import { toast } from 'sonner';
import { CelebrationModal } from '@/components/CelebrationModal';

const MilestonesPage = () => {
  const { milestones, addMilestone, celebrateMilestone, activeChildId } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ title: '', description: '', points: 0 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'motor' as Milestone['category'],
    targetDate: ''
  });

  const handleSubmit = () => {
    if (!activeChildId) {
      toast.error('Please create a child profile first');
      return;
    }

    if (!formData.title) {
      toast.error('Please enter a milestone title');
      return;
    }

    const milestone: Milestone = {
      id: Date.now().toString(),
      childId: activeChildId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      targetDate: formData.targetDate || undefined,
      celebrated: false
    };

    addMilestone(milestone);
    setDialogOpen(false);
    toast.success('Milestone added! 🎯');
    setFormData({ title: '', description: '', category: 'motor', targetDate: '' });
  };

  const handleCelebrate = (milestone: Milestone) => {
    celebrateMilestone(milestone.id);
    setCelebrationData({
      title: '🏆 Milestone Achieved!',
      description: `"${milestone.title}" - What an amazing achievement! You're doing incredible work!`,
      points: 50
    });
    setCelebrationOpen(true);
  };

  const categoryIcons: Record<string, { icon: string; color: string }> = {
    motor: { icon: '🦿', color: 'bg-success/20 border-success/30' },
    communication: { icon: '💬', color: 'bg-primary/20 border-primary/30' },
    cognitive: { icon: '🧠', color: 'bg-warning/20 border-warning/30' },
    social: { icon: '🤝', color: 'bg-accent/20 border-accent/30' },
    'self-care': { icon: '🌟', color: 'bg-celebration/20 border-celebration/30' },
  };

  const pendingMilestones = milestones.filter(m => !m.celebrated);
  const achievedMilestones = milestones.filter(m => m.celebrated);

  return (
    <div className="container py-8 space-y-8">
      <CelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        title={celebrationData.title}
        description={celebrationData.description}
        pointsEarned={celebrationData.points}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Milestones</h1>
          <p className="text-muted-foreground mt-1">Track and celebrate your child's achievements</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add New Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Milestone Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., First steps with walker"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What does this milestone involve?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value as Milestone['category'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motor">🦿 Motor Skills</SelectItem>
                      <SelectItem value="communication">💬 Communication</SelectItem>
                      <SelectItem value="cognitive">🧠 Cognitive</SelectItem>
                      <SelectItem value="social">🤝 Social</SelectItem>
                      <SelectItem value="self-care">🌟 Self-Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full" variant="hero">
                Add Milestone
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Milestones */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Working Towards ({pendingMilestones.length})
        </h2>
        
        {pendingMilestones.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center text-center">
              <Target className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No milestones set yet</p>
              <Button variant="soft" className="mt-4" onClick={() => setDialogOpen(true)}>
                Set Your First Milestone
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingMilestones.map((milestone) => (
              <Card key={milestone.id} variant="interactive" className={`border ${categoryIcons[milestone.category].color}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{categoryIcons[milestone.category].icon}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning" />
                      +50 pts
                    </span>
                  </div>
                  <CardTitle className="text-lg">{milestone.title}</CardTitle>
                  {milestone.description && (
                    <CardDescription>{milestone.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {milestone.targetDate && (
                    <p className="text-xs text-muted-foreground mb-3">
                      Target: {new Date(milestone.targetDate).toLocaleDateString('en-IN')}
                    </p>
                  )}
                  <Button 
                    variant="celebration" 
                    className="w-full"
                    onClick={() => handleCelebrate(milestone)}
                  >
                    <PartyPopper className="w-4 h-4 mr-2" />
                    Celebrate Achievement!
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Achieved Milestones */}
      {achievedMilestones.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            Celebrated Achievements ({achievedMilestones.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievedMilestones.map((milestone) => (
              <Card key={milestone.id} variant="warm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-celebration flex items-center justify-center text-2xl">
                      🏆
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-foreground">{milestone.title}</p>
                      <p className="text-sm text-secondary-foreground/70">
                        Achieved {milestone.achievedAt ? new Date(milestone.achievedAt).toLocaleDateString('en-IN') : ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MilestonesPage;
