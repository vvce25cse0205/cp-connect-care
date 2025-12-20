import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Plus, Edit2, Target, Heart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Child } from '@/types';
import { toast } from 'sonner';

const ChildProfilePage = () => {
  const { children, addChild, activeChildId, setActiveChild } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Child>>({
    name: '',
    dateOfBirth: '',
    cpType: 'spastic',
    mobilityLevel: 'assisted',
    communicationLevel: 'limited-verbal',
    goals: [],
    notes: ''
  });

  const activeChild = children.find(c => c.id === activeChildId);

  const handleSubmit = () => {
    if (!formData.name || !formData.dateOfBirth) {
      toast.error('Please fill in required fields');
      return;
    }

    const newChild: Child = {
      id: Date.now().toString(),
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      cpType: formData.cpType as Child['cpType'],
      mobilityLevel: formData.mobilityLevel as Child['mobilityLevel'],
      communicationLevel: formData.communicationLevel as Child['communicationLevel'],
      goals: formData.goals || [],
      notes: formData.notes
    };

    addChild(newChild);
    setDialogOpen(false);
    toast.success(`${newChild.name}'s profile created! 🎉`);
    setFormData({
      name: '',
      dateOfBirth: '',
      cpType: 'spastic',
      mobilityLevel: 'assisted',
      communicationLevel: 'limited-verbal',
      goals: [],
      notes: ''
    });
  };

  const cpTypeLabels = {
    spastic: 'Spastic CP',
    dyskinetic: 'Dyskinetic CP',
    ataxic: 'Ataxic CP',
    mixed: 'Mixed CP'
  };

  const mobilityLabels = {
    independent: 'Independent',
    assisted: 'Assisted Walking',
    wheelchair: 'Wheelchair User',
    limited: 'Limited Mobility'
  };

  const communicationLabels = {
    verbal: 'Verbal',
    'limited-verbal': 'Limited Verbal',
    'non-verbal': 'Non-Verbal',
    'aac-user': 'AAC User'
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Child Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your child's information and goals</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Add Child Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Child's Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CP Type</Label>
                  <Select 
                    value={formData.cpType} 
                    onValueChange={(value) => setFormData({ ...formData, cpType: value as Child['cpType'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spastic">Spastic</SelectItem>
                      <SelectItem value="dyskinetic">Dyskinetic</SelectItem>
                      <SelectItem value="ataxic">Ataxic</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mobility Level</Label>
                  <Select 
                    value={formData.mobilityLevel} 
                    onValueChange={(value) => setFormData({ ...formData, mobilityLevel: value as Child['mobilityLevel'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">Independent</SelectItem>
                      <SelectItem value="assisted">Assisted</SelectItem>
                      <SelectItem value="wheelchair">Wheelchair</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Communication Level</Label>
                <Select 
                  value={formData.communicationLevel} 
                  onValueChange={(value) => setFormData({ ...formData, communicationLevel: value as Child['communicationLevel'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verbal">Verbal</SelectItem>
                    <SelectItem value="limited-verbal">Limited Verbal</SelectItem>
                    <SelectItem value="non-verbal">Non-Verbal</SelectItem>
                    <SelectItem value="aac-user">AAC User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your child..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full" variant="hero">
                Create Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {children.length === 0 ? (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">No Profiles Yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Add your child's profile to start tracking activities, milestones, and therapy sessions.
            </p>
            <Button onClick={() => setDialogOpen(true)} variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Child
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <Card 
              key={child.id} 
              variant={child.id === activeChildId ? 'stats' : 'interactive'}
              className={child.id === activeChildId ? 'ring-2 ring-primary' : ''}
              onClick={() => setActiveChild(child.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {child.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{child.name}</CardTitle>
                    <CardDescription>
                      {new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()} years old
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{cpTypeLabels[child.cpType]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-success" />
                  <span className="text-muted-foreground">Mobility:</span>
                  <span className="font-medium">{mobilityLabels[child.mobilityLevel]}</span>
                </div>
                {child.notes && (
                  <p className="text-sm text-muted-foreground italic mt-2">
                    "{child.notes}"
                  </p>
                )}
              </CardContent>
              <CardFooter>
                {child.id === activeChildId && (
                  <span className="text-xs font-medium text-primary flex items-center gap-1">
                    ✓ Active Profile
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildProfilePage;
