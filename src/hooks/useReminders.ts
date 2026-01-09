import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  reminder_type: string;
  frequency: string;
  reminder_date?: string;
  reminder_time?: string;
  is_active: boolean;
  last_triggered?: string;
  created_at: string;
}

export const useReminders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Reminder[];
    },
    enabled: !!user,
  });

  const addReminder = useMutation({
    mutationFn: async (reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'last_triggered'>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('reminders')
        .insert({ ...reminder, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add reminder: ' + error.message);
    },
  });

  const updateReminder = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reminder> & { id: string }) => {
      const { data, error } = await supabase
        .from('reminders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder updated');
    },
    onError: (error) => {
      toast.error('Failed to update reminder: ' + error.message);
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete reminder: ' + error.message);
    },
  });

  return {
    reminders,
    isLoading,
    addReminder,
    updateReminder,
    deleteReminder,
  };
};

// Hook for checking and showing due reminders
export const useReminderChecker = () => {
  const { reminders } = useReminders();
  
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      
      reminders.forEach(reminder => {
        if (!reminder.is_active) return;
        
        const shouldTrigger = 
          (reminder.frequency === 'daily') ||
          (reminder.frequency === 'weekly' && now.getDay() === 0) ||
          (reminder.frequency === 'monthly' && now.getDate() === 1) ||
          (reminder.reminder_date === today);
        
        if (shouldTrigger && reminder.reminder_time === currentTime) {
          toast.info(reminder.title, {
            description: reminder.description,
            duration: 10000,
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);
};
