import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface TherapySession {
  id: string;
  child_id: string;
  user_id: string;
  therapist_name: string;
  therapist_type: string;
  session_date: string;
  duration_minutes: number;
  location: string | null;
  status: string;
  notes: string | null;
  home_exercises: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useTherapySessions = (childId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['therapySessions', user?.id, childId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: true });

      if (childId) {
        query = query.eq('child_id', childId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TherapySession[];
    },
    enabled: !!user
  });
};

export const useAddTherapySession = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (session: Omit<TherapySession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          ...session,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapySessions'] });
      toast.success('Therapy session scheduled! 📅');
    },
    onError: (error) => {
      toast.error('Failed to schedule session: ' + error.message);
    }
  });
};

export const useCompleteTherapySession = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('therapy_sessions')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update user points
      await supabase.rpc('increment_user_points', { 
        user_id_param: user.id, 
        points_to_add: 25,
        sessions_to_add: 1
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['userPoints'] });
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapySessions'] });
    },
    onError: (error) => {
      toast.error('Failed to complete session: ' + error.message);
    }
  });
};

export const useDeleteTherapySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('therapy_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapySessions'] });
      toast.success('Session deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    }
  });
};
