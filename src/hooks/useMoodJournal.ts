import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface MoodEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood_level?: number;
  stress_level?: number;
  energy_level?: number;
  notes?: string;
  gratitude?: string;
  self_care_done?: string[];
  created_at: string;
}

export const useMoodJournal = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['mood-journal', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('mood_journal')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as MoodEntry[];
    },
    enabled: !!user,
  });
};

export const useAddMoodEntry = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('mood_journal')
        .insert({ ...entry, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-journal'] });
      toast.success('Mood entry saved!');
    },
    onError: (error) => {
      toast.error('Failed to save entry: ' + error.message);
    },
  });
};

export const useDeleteMoodEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('mood_journal')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-journal'] });
      toast.success('Entry removed');
    },
  });
};
