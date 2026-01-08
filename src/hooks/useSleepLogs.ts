import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SleepLog {
  id: string;
  user_id: string;
  child_id?: string;
  sleep_date: string;
  bedtime?: string;
  wake_time?: string;
  total_hours?: number;
  quality?: number;
  night_wakings?: number;
  notes?: string;
  created_at: string;
}

export const useSleepLogs = (childId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sleep-logs', user?.id, childId],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('sleep_date', { ascending: false })
        .limit(30);
      
      if (childId) {
        query = query.eq('child_id', childId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as SleepLog[];
    },
    enabled: !!user,
  });
};

export const useAddSleepLog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (log: Omit<SleepLog, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('sleep_logs')
        .insert({ ...log, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-logs'] });
      toast.success('Sleep log added!');
    },
    onError: (error) => {
      toast.error('Failed to add sleep log: ' + error.message);
    },
  });
};

export const useDeleteSleepLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sleep_logs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-logs'] });
      toast.success('Sleep log removed');
    },
  });
};
