import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  activities_completed: number;
  sessions_logged: number;
  milestones_achieved: number;
  streak_days: number;
  created_at: string;
  updated_at: string;
}

export const useUserPoints = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userPoints', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Return default values if no record exists
      if (!data) {
        return {
          total_points: 0,
          activities_completed: 0,
          sessions_logged: 0,
          milestones_achieved: 0,
          streak_days: 0
        } as UserPoints;
      }
      
      return data as UserPoints;
    },
    enabled: !!user
  });
};

export const calculateLevel = (points: number): number => {
  return Math.floor(points / 100) + 1;
};
