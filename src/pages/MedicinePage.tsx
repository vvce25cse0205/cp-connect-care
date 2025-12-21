import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Search, Pill, Trash2, Edit2, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMedicines, useAddMedicine, useUpdateMedicine, useDeleteMedicine } from '@/hooks/useMedicines';
import { useChildren } from '@/hooks/useChildren';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MedicinePage = () => {
  const { user } = useAuth();
  const { data: medicines = [], isLoading } = useMedicines();
  const { data: children = [] } = useChildren();
  const addMedicine = useAddMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once daily',
    timing: 'morning',
    quantity: 0,
    unit: 'tablets',
    notes: '',
    child_id: ''
  });

  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.dosage && med.dosage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter medicine name');
      return;
    }

    try {
      if (editingId) {
        await updateMedicine.mutateAsync({ id: editingId, ...formData });
        setEditingId(null);
      } else {
        await addMedicine.mutateAsync({
          ...formData,
          child_id: formData.child_id || null
        });
      }
      
      setFormData({
        name: '',
        dosage: '',
        frequency: 'once daily',
        timing: 'morning',
        quantity: 0,
        unit: 'tablets',
        notes: '',
        child_id: ''
      });
      setIsAddOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (medicine: typeof medicines[0]) => {
    setFormData({
      name: medicine.name,
      dosage: medicine.dosage || '',
      frequency: medicine.frequency || 'once daily',
      timing: medicine.timing || 'morning',
      quantity: medicine.quantity || 0,
      unit: medicine.unit || 'tablets',
      notes: medicine.notes || '',
      child_id: medicine.child_id || ''
    });
    setEditingId(medicine.id);
    setIsAddOpen(true);
  };

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Please <Link to="/auth" className="text-primary underline">sign in</Link> to manage medicines.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold">Medicine Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage medications and dosages</p>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => {
              setEditingId(null);
              setFormData({
                name: '',
                dosage: '',
                frequency: 'once daily',
                timing: 'morning',
                quantity: 0,
                unit: 'tablets',
                notes: '',
                child_id: ''
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Paracetamol"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={0}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tablets">Tablets</SelectItem>
                      <SelectItem value="capsules">Capsules</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="drops">Drops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once daily">Once Daily</SelectItem>
                      <SelectItem value="twice daily">Twice Daily</SelectItem>
                      <SelectItem value="three times daily">Three Times Daily</SelectItem>
                      <SelectItem value="as needed">As Needed</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timing">Timing</Label>
                <Select value={formData.timing} onValueChange={(v) => setFormData({ ...formData, timing: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    <SelectItem value="before meals">Before Meals</SelectItem>
                    <SelectItem value="after meals">After Meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {children.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="child">Assign to Child</Label>
                  <Select value={formData.child_id} onValueChange={(v) => setFormData({ ...formData, child_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select child (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {children.map((child) => (
                        <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Any special instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={addMedicine.isPending || updateMedicine.isPending}>
                {editingId ? 'Update Medicine' : 'Add Medicine'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Medicine List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">Loading medicines...</div>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Pill className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No medicines found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'Add your first medicine to get started'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMedicines.map((medicine) => {
            const child = children.find(c => c.id === medicine.child_id);
            return (
              <Card key={medicine.id} variant="interactive">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Pill className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{medicine.name}</CardTitle>
                        {medicine.dosage && (
                          <CardDescription>{medicine.dosage}</CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(medicine)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => deleteMedicine.mutate(medicine.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {medicine.frequency && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted">
                        <Clock className="w-3 h-3" />
                        {medicine.frequency}
                      </span>
                    )}
                    {medicine.timing && (
                      <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                        {medicine.timing}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {medicine.quantity} {medicine.unit}
                      </span>
                    </div>
                    {child && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {child.name}
                      </span>
                    )}
                  </div>
                  
                  {medicine.notes && (
                    <p className="text-xs text-muted-foreground italic">{medicine.notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MedicinePage;
