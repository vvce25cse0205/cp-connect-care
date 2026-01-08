import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCareTeam, useAddCareTeamMember, useDeleteCareTeamMember, CareTeamMember } from '@/hooks/useCareTeam';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, Mail, MapPin, Plus, Trash2, User, Stethoscope, Brain, Bone, MessageSquare, Activity } from 'lucide-react';

const roleIcons: Record<string, React.ReactNode> = {
  neurologist: <Brain className="h-5 w-5" />,
  orthopedist: <Bone className="h-5 w-5" />,
  physical_therapist: <Activity className="h-5 w-5" />,
  primary_doctor: <Stethoscope className="h-5 w-5" />,
  occupational_therapist: <User className="h-5 w-5" />,
  speech_therapist: <MessageSquare className="h-5 w-5" />,
  other: <User className="h-5 w-5" />,
};

const roleLabels: Record<string, string> = {
  neurologist: 'Neurologist',
  orthopedist: 'Orthopedist',
  physical_therapist: 'Physical Therapist',
  primary_doctor: 'Primary Doctor',
  occupational_therapist: 'Occupational Therapist',
  speech_therapist: 'Speech Therapist',
  other: 'Other',
};

const CareTeamPage = () => {
  const { user } = useAuth();
  const { data: careTeam = [], isLoading } = useCareTeam();
  const addMember = useAddCareTeamMember();
  const deleteMember = useDeleteCareTeamMember();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    clinic_name: '',
    address: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember.mutate(formData, {
      onSuccess: () => {
        setDialogOpen(false);
        setFormData({ name: '', role: '', phone: '', email: '', clinic_name: '', address: '', notes: '' });
      },
    });
  };

  if (!user) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription className="mt-2">Please sign in to manage your care team.</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold">Care Team</h1>
          <p className="text-muted-foreground mt-1">
            All your child's healthcare providers in one place
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Care Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic">Clinic/Hospital</Label>
                <Input
                  id="clinic"
                  value={formData.clinic_name}
                  onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Appointment schedule, specialty focus, etc."
                />
              </div>
              <Button type="submit" className="w-full" disabled={addMember.isPending}>
                {addMember.isPending ? 'Adding...' : 'Add Member'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-48 bg-muted/50" />
            </Card>
          ))}
        </div>
      ) : careTeam.length === 0 ? (
        <Card className="text-center p-12">
          <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="mb-2">No Care Team Members Yet</CardTitle>
          <CardDescription>Add your child's doctors, therapists, and specialists.</CardDescription>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careTeam.map((member) => (
            <Card key={member.id} variant="interactive">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {roleIcons[member.role] || <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{roleLabels[member.role] || member.role}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMember.mutate(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {member.clinic_name && (
                  <p className="text-muted-foreground">{member.clinic_name}</p>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                    <Phone className="h-4 w-4" />
                    {member.phone}
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-primary hover:underline">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </a>
                )}
                {member.address && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {member.address}
                  </p>
                )}
                {member.notes && (
                  <p className="text-muted-foreground italic mt-2">{member.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareTeamPage;
