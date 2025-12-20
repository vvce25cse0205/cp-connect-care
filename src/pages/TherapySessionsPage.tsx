import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Clock, MapPin, User, CheckCircle, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { TherapySession } from '@/types';
import { toast } from 'sonner';
import { CelebrationModal } from '@/components/CelebrationModal';

const TherapySessionsPage = () => {
  const { therapySessions, addTherapySession, completeTherapySession, activeChildId } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<TherapySession>>({
    therapistName: '',
    therapyType: 'physical',
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  const handleSubmit = () => {
    if (!activeChildId) {
      toast.error('Please create a child profile first');
      return;
    }

    if (!formData.therapistName || !formData.date || !formData.time) {
      toast.error('Please fill in required fields');
      return;
    }

    const session: TherapySession = {
      id: Date.now().toString(),
      childId: activeChildId,
      therapistName: formData.therapistName!,
      therapyType: formData.therapyType as TherapySession['therapyType'],
      date: formData.date!,
      time: formData.time!,
      location: formData.location || '',
      notes: formData.notes,
      completed: false
    };

    addTherapySession(session);
    setDialogOpen(false);
    toast.success('Therapy session scheduled! 📅');
    setFormData({
      therapistName: '',
      therapyType: 'physical',
      date: '',
      time: '',
      location: '',
      notes: ''
    });
  };

  const handleComplete = (id: string) => {
    completeTherapySession(id);
    setCelebrationOpen(true);
  };

  const therapyTypeLabels: Record<string, { label: string; color: string }> = {
    physical: { label: 'Physical Therapy', color: 'bg-success/20 text-success' },
    occupational: { label: 'Occupational Therapy', color: 'bg-primary/20 text-primary' },
    speech: { label: 'Speech Therapy', color: 'bg-warning/20 text-warning' },
    behavioral: { label: 'Behavioral Therapy', color: 'bg-celebration/20 text-celebration' },
    aquatic: { label: 'Aquatic Therapy', color: 'bg-accent/20 text-accent' },
  };

  const upcomingSessions = therapySessions.filter(s => !s.completed);
  const completedSessions = therapySessions.filter(s => s.completed);

  return (
    <div className="container py-8 space-y-8">
      <CelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        title="Session Complete! 🎉"
        description="Great job attending therapy! Every session brings progress. Keep it up!"
        pointsEarned={25}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Therapy Sessions</h1>
          <p className="text-muted-foreground mt-1">Schedule and track therapy appointments</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Schedule Therapy Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="therapist">Therapist Name *</Label>
                  <Input
                    id="therapist"
                    placeholder="Dr. Sharma"
                    value={formData.therapistName}
                    onChange={(e) => setFormData({ ...formData, therapistName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Therapy Type</Label>
                  <Select 
                    value={formData.therapyType} 
                    onValueChange={(value) => setFormData({ ...formData, therapyType: value as TherapySession['therapyType'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical Therapy</SelectItem>
                      <SelectItem value="occupational">Occupational Therapy</SelectItem>
                      <SelectItem value="speech">Speech Therapy</SelectItem>
                      <SelectItem value="behavioral">Behavioral Therapy</SelectItem>
                      <SelectItem value="aquatic">Aquatic Therapy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Hospital/Clinic name and address"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions or things to remember..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full" variant="hero">
                Schedule Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Sessions */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Upcoming Sessions ({upcomingSessions.length})
        </h2>
        
        {upcomingSessions.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No upcoming sessions scheduled</p>
              <Button variant="soft" className="mt-4" onClick={() => setDialogOpen(true)}>
                Schedule Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} variant="interactive">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${therapyTypeLabels[session.therapyType].color}`}>
                      {therapyTypeLabels[session.therapyType].label}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning" />
                      +25 pts
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium">{session.therapistName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(session.date).toLocaleDateString('en-IN', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                    <Clock className="w-4 h-4 ml-2" />
                    {session.time}
                  </div>
                  {session.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {session.location}
                    </div>
                  )}
                  <Button 
                    variant="success" 
                    className="w-full mt-4"
                    onClick={() => handleComplete(session.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Completed Sessions ({completedSessions.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedSessions.map((session) => (
              <Card key={session.id} className="opacity-80">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{therapyTypeLabels[session.therapyType].label}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString('en-IN')}
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

export default TherapySessionsPage;
