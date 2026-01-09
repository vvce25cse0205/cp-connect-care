import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Plus, 
  Calendar, 
  AlertCircle, 
  Trash2, 
  Download,
  Clock,
  Hospital,
  User,
  Bell,
  BellRing
} from 'lucide-react';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useReminders } from '@/hooks/useReminders';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const recordTypes = [
  { value: 'report', label: 'Medical Report', icon: '📋' },
  { value: 'prescription', label: 'Prescription', icon: '💊' },
  { value: 'emergency', label: 'Emergency Record', icon: '🚨' },
  { value: 'lab_result', label: 'Lab Result', icon: '🔬' },
  { value: 'imaging', label: 'Imaging/X-Ray', icon: '🩻' },
];

const typeColors: Record<string, string> = {
  report: 'bg-primary/20 text-primary',
  prescription: 'bg-success/20 text-success',
  emergency: 'bg-destructive/20 text-destructive',
  lab_result: 'bg-warning/20 text-warning',
  imaging: 'bg-accent/20 text-accent',
};

const MedicalRecordsPage = () => {
  const { user } = useAuth();
  const { records, isLoading, addRecord, deleteRecord, uploadFile } = useMedicalRecords();
  const { reminders, addReminder, updateReminder, deleteReminder } = useReminders();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    record_type: 'report',
    record_date: new Date().toISOString().split('T')[0],
    doctor_name: '',
    hospital_name: '',
    notes: '',
    is_emergency: false,
  });
  
  const [reminderData, setReminderData] = useState({
    title: 'Upload Medical Reports',
    description: 'Remember to upload your latest medical reports',
    reminder_type: 'medical_upload',
    frequency: 'monthly',
    reminder_date: '',
    reminder_time: '10:00',
    is_active: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to manage your medical records.</p>
            <Link to="/auth">
              <Button variant="hero">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredRecords = selectedType === 'all' 
    ? records 
    : records.filter(r => r.record_type === selectedType);

  const emergencyRecords = records.filter(r => r.is_emergency);
  const medicalReminders = reminders.filter(r => r.reminder_type === 'medical_upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddRecord = async () => {
    setUploading(true);
    let fileUrl = null;
    let fileName = null;

    if (selectedFile) {
      fileUrl = await uploadFile(selectedFile);
      fileName = selectedFile.name;
    }

    await addRecord.mutateAsync({
      ...formData,
      file_url: fileUrl || undefined,
      file_name: fileName || undefined,
    });

    setFormData({
      title: '',
      description: '',
      record_type: 'report',
      record_date: new Date().toISOString().split('T')[0],
      doctor_name: '',
      hospital_name: '',
      notes: '',
      is_emergency: false,
    });
    setSelectedFile(null);
    setUploading(false);
    setIsAddOpen(false);
  };

  const handleAddReminder = async () => {
    await addReminder.mutateAsync(reminderData);
    setIsReminderOpen(false);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">
            Manage your medical history and emergency documents
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Upload Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Reminder Title</Label>
                  <Input 
                    value={reminderData.title}
                    onChange={(e) => setReminderData({...reminderData, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={reminderData.description}
                    onChange={(e) => setReminderData({...reminderData, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Select value={reminderData.frequency} onValueChange={(v) => setReminderData({...reminderData, frequency: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time</Label>
                  <Input 
                    type="time"
                    value={reminderData.reminder_time}
                    onChange={(e) => setReminderData({...reminderData, reminder_time: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddReminder} className="w-full">
                  <BellRing className="w-4 h-4 mr-2" />
                  Create Reminder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Medical Record</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Annual Checkup Report"
                  />
                </div>
                <div>
                  <Label>Record Type</Label>
                  <Select value={formData.record_type} onValueChange={(v) => setFormData({...formData, record_type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {recordTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={formData.record_date}
                    onChange={(e) => setFormData({...formData, record_date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Doctor Name</Label>
                    <Input 
                      value={formData.doctor_name}
                      onChange={(e) => setFormData({...formData, doctor_name: e.target.value})}
                      placeholder="Dr. Name"
                    />
                  </div>
                  <div>
                    <Label>Hospital/Clinic</Label>
                    <Input 
                      value={formData.hospital_name}
                      onChange={(e) => setFormData({...formData, hospital_name: e.target.value})}
                      placeholder="Hospital name"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the record"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional notes"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.is_emergency}
                    onCheckedChange={(checked) => setFormData({...formData, is_emergency: checked})}
                  />
                  <Label>Mark as Emergency Record</Label>
                </div>
                <div>
                  <Label>Upload Document</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    {selectedFile ? (
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Click to upload PDF, Image, or Document</p>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddRecord} 
                  className="w-full" 
                  disabled={!formData.title || uploading}
                >
                  {uploading ? 'Uploading...' : 'Save Record'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Reminders */}
      {medicalReminders.length > 0 && (
        <Card variant="warm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <BellRing className="w-5 h-5 text-secondary-foreground" />
              <h3 className="font-bold text-secondary-foreground">Active Reminders</h3>
            </div>
            <div className="space-y-2">
              {medicalReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between bg-secondary-foreground/10 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-secondary-foreground">{reminder.title}</p>
                    <p className="text-sm text-secondary-foreground/70">
                      {reminder.frequency === 'weekly' ? 'Every Week' : 'Every Month'} at {reminder.reminder_time}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteReminder.mutate(reminder.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Records */}
      {emergencyRecords.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Emergency Records
            </CardTitle>
            <CardDescription>Quick access to critical medical information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {emergencyRecords.map(record => (
                <div key={record.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    🚨
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{record.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(record.record_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {record.file_url && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(record.file_url, '_blank')}>
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Record Type Tabs */}
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="flex-wrap h-auto gap-2">
          <TabsTrigger value="all">All Records</TabsTrigger>
          {recordTypes.map(type => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.icon} {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Records List */}
      {isLoading ? (
        <div className="text-center py-12">Loading records...</div>
      ) : filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-bold mb-2">No Records Found</h3>
            <p className="text-muted-foreground">
              Start by adding your first medical record to keep track of your health history.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map(record => (
            <Card key={record.id} variant="interactive">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {recordTypes.find(t => t.value === record.record_type)?.icon || '📋'}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-lg">{record.title}</h3>
                      <Badge className={typeColors[record.record_type]}>
                        {recordTypes.find(t => t.value === record.record_type)?.label}
                      </Badge>
                      {record.is_emergency && (
                        <Badge variant="destructive">Emergency</Badge>
                      )}
                    </div>
                    {record.description && (
                      <p className="text-muted-foreground">{record.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(record.record_date), 'MMM d, yyyy')}
                      </span>
                      {record.doctor_name && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {record.doctor_name}
                        </span>
                      )}
                      {record.hospital_name && (
                        <span className="flex items-center gap-1">
                          <Hospital className="w-4 h-4" />
                          {record.hospital_name}
                        </span>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-sm bg-muted p-3 rounded-lg">{record.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {record.file_url && (
                      <Button variant="outline" size="sm" onClick={() => window.open(record.file_url, '_blank')}>
                        <Download className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteRecord.mutate(record.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips Card */}
      <Card variant="warm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-foreground/10 flex items-center justify-center flex-shrink-0">
              💡
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-accent-foreground mb-1">
                Tips for Managing Medical Records
              </h3>
              <ul className="text-accent-foreground/80 space-y-1 text-sm">
                <li>• Upload documents immediately after doctor visits</li>
                <li>• Mark critical records as "Emergency" for quick access</li>
                <li>• Set monthly reminders to keep records updated</li>
                <li>• Include doctor's notes for future reference</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordsPage;
