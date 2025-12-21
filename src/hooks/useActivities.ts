import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Activity {
  id: string;
  child_id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string;
  duration_minutes: number;
  difficulty: string;
  completed: boolean;
  engagement_level: number;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
}

export const useActivities = (childId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['activities', user?.id, childId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (childId) {
        query = query.eq('child_id', childId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!user
  });
};

export const useLogActivity = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (activity: Omit<Activity, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: user.id,
          completed: true,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update user points
      const pointsToAdd = 10 + (activity.engagement_level * 2);
      await supabase.rpc('increment_user_points', { 
        user_id_param: user.id, 
        points_to_add: pointsToAdd,
        activities_to_add: 1
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['userPoints'] });
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      toast.error('Failed to log activity: ' + error.message);
    }
  });
};
