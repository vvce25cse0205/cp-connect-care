import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SuccessStory {
  id: string;
  user_id: string;
  title: string;
  story: string;
  category?: string;
  is_anonymous?: boolean;
  display_name?: string;
  likes_count?: number;
  created_at: string;
}

export const useSuccessStories = () => {
  return useQuery({
    queryKey: ['success-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as SuccessStory[];
    },
  });
};

export const useAddSuccessStory = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (story: Omit<SuccessStory, 'id' | 'user_id' | 'created_at' | 'likes_count'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('success_stories')
        .insert({ ...story, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['success-stories'] });
      toast.success('Story shared! 🎉');
    },
    onError: (error) => {
      toast.error('Failed to share story: ' + error.message);
    },
  });
};

export const useDeleteSuccessStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('success_stories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['success-stories'] });
      toast.success('Story removed');
    },
  });
};
