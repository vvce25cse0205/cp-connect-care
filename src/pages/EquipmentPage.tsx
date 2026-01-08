import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEquipment, useAddEquipment, useDeleteEquipment, Equipment } from '@/hooks/useEquipment';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Trash2, Wrench, Calendar, AlertTriangle } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';

const equipmentTypes: Record<string, { label: string; icon: string }> = {
  wheelchair: { label: 'Wheelchair', icon: '🦽' },
  walker: { label: 'Walker', icon: '🚶' },
  afo: { label: 'AFO/Braces', icon: '🦿' },
  stander: { label: 'Stander', icon: '🧍' },
  communication_device: { label: 'Communication Device', icon: '💬' },
  seating: { label: 'Seating System', icon: '🪑' },
  bath_equipment: { label: 'Bath Equipment', icon: '🛁' },
  other: { label: 'Other', icon: '📦' },
};

const EquipmentPage = () => {
  const { user } = useAuth();
  const { data: equipment = [], isLoading } = useEquipment();
  const addEquipment = useAddEquipment();
  const deleteEquipment = useDeleteEquipment();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serial_number: '',
    purchase_date: '',
    last_maintenance: '',
    next_maintenance: '',
    size: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipment.mutate(formData, {
      onSuccess: () => {
        setDialogOpen(false);
        setFormData({ name: '', type: '', serial_number: '', purchase_date: '', last_maintenance: '', next_maintenance: '', size: '', notes: '' });
      },
    });
  };

  const getMaintenanceStatus = (nextDate?: string) => {
    if (!nextDate) return null;
    const days = differenceInDays(parseISO(nextDate), new Date());
    if (days < 0) return { status: 'overdue', message: 'Maintenance overdue!', color: 'text-destructive' };
    if (days <= 14) return { status: 'soon', message: `Due in ${days} days`, color: 'text-warning' };
    return null;
  };

  if (!user) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription className="mt-2">Please sign in to manage equipment.</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold">Equipment Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Manage wheelchairs, AFOs, walkers, and other assistive devices
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Equipment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Ottobock Wheelchair"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(equipmentTypes).map(([value, { label, icon }]) => (
                      <SelectItem key={value} value={value}>{icon} {label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serial">Serial Number</Label>
                  <Input
                    id="serial"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g., Medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase">Purchase Date</Label>
                <Input
                  id="purchase"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastMaint">Last Maintenance</Label>
                  <Input
                    id="lastMaint"
                    type="date"
                    value={formData.last_maintenance}
                    onChange={(e) => setFormData({ ...formData, last_maintenance: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextMaint">Next Maintenance</Label>
                  <Input
                    id="nextMaint"
                    type="date"
                    value={formData.next_maintenance}
                    onChange={(e) => setFormData({ ...formData, next_maintenance: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Vendor contact, warranty info, etc."
                />
              </div>
              <Button type="submit" className="w-full" disabled={addEquipment.isPending}>
                {addEquipment.isPending ? 'Adding...' : 'Add Equipment'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Maintenance Alerts */}
      {equipment.some(e => getMaintenanceStatus(e.next_maintenance)) && (
        <Card className="border-warning bg-warning/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-warning font-medium">
              <AlertTriangle className="h-5 w-5" />
              Maintenance Reminders
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {equipment.filter(e => getMaintenanceStatus(e.next_maintenance)).map(e => {
                const status = getMaintenanceStatus(e.next_maintenance);
                return (
                  <li key={e.id} className={status?.color}>
                    {e.name}: {status?.message}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-48 bg-muted/50" />
            </Card>
          ))}
        </div>
      ) : equipment.length === 0 ? (
        <Card className="text-center p-12">
          <span className="text-6xl">🦽</span>
          <CardTitle className="mt-4 mb-2">No Equipment Added</CardTitle>
          <CardDescription>Track your child's wheelchairs, AFOs, and other devices.</CardDescription>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => {
            const type = equipmentTypes[item.type] || { label: item.type, icon: '📦' };
            const maintenanceStatus = getMaintenanceStatus(item.next_maintenance);
            
            return (
              <Card key={item.id} variant="interactive">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{type.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>{type.label}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteEquipment.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {item.serial_number && (
                    <p className="text-muted-foreground">S/N: {item.serial_number}</p>
                  )}
                  {item.size && (
                    <p className="text-muted-foreground">Size: {item.size}</p>
                  )}
                  {item.purchase_date && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Purchased: {format(parseISO(item.purchase_date), 'MMM d, yyyy')}
                    </p>
                  )}
                  {item.next_maintenance && (
                    <p className={`flex items-center gap-2 ${maintenanceStatus?.color || 'text-muted-foreground'}`}>
                      <Wrench className="h-4 w-4" />
                      Next maintenance: {format(parseISO(item.next_maintenance), 'MMM d, yyyy')}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-muted-foreground italic mt-2">{item.notes}</p>
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

export default EquipmentPage;
