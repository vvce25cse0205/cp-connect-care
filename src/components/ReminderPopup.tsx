import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, X, Calendar, Upload } from 'lucide-react';
import { useReminders } from '@/hooks/useReminders';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const ReminderPopup = () => {
  const { user } = useAuth();
  const { reminders } = useReminders();
  const [showPopup, setShowPopup] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<any>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const checkReminders = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentHour = now.getHours();
      
      // Check for medical upload reminders
      const dueReminders = reminders.filter(reminder => {
        if (!reminder.is_active || dismissed.includes(reminder.id)) return false;
        
        const reminderHour = reminder.reminder_time ? parseInt(reminder.reminder_time.split(':')[0]) : 10;
        
        if (reminder.frequency === 'weekly') {
          return now.getDay() === 0 && currentHour >= reminderHour;
        }
        if (reminder.frequency === 'monthly') {
          return now.getDate() === 1 && currentHour >= reminderHour;
        }
        if (reminder.reminder_date === today && currentHour >= reminderHour) {
          return true;
        }
        return false;
      });

      if (dueReminders.length > 0 && !currentReminder) {
        setCurrentReminder(dueReminders[0]);
        setShowPopup(true);
      }
    };

    // Check on mount and every 5 minutes
    checkReminders();
    const interval = setInterval(checkReminders, 300000);

    // Also show a general reminder after 30 seconds if user has no reminders set
    const timeout = setTimeout(() => {
      if (reminders.length === 0 && !showPopup) {
        setCurrentReminder({
          id: 'default',
          title: 'Keep Your Medical Records Updated',
          description: 'Set up reminders to upload your medical reports regularly for better health tracking.',
          reminder_type: 'medical_upload',
        });
        setShowPopup(true);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [user, reminders, dismissed, currentReminder, showPopup]);

  const handleDismiss = () => {
    if (currentReminder) {
      setDismissed(prev => [...prev, currentReminder.id]);
    }
    setShowPopup(false);
    setCurrentReminder(null);
  };

  if (!user || !showPopup) return null;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <span>Reminder</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2">{currentReminder?.title}</h3>
            <p className="text-muted-foreground">{currentReminder?.description}</p>
          </div>
          
          {currentReminder?.reminder_type === 'medical_upload' && (
            <div className="flex flex-col gap-2">
              <Link to="/medical-records" onClick={handleDismiss}>
                <Button variant="hero" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Medical Records
                </Button>
              </Link>
              <Button variant="outline" onClick={handleDismiss}>
                <Calendar className="w-4 h-4 mr-2" />
                Remind Me Later
              </Button>
            </div>
          )}
          
          {currentReminder?.reminder_type !== 'medical_upload' && (
            <Button variant="outline" onClick={handleDismiss} className="w-full">
              <X className="w-4 h-4 mr-2" />
              Dismiss
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
