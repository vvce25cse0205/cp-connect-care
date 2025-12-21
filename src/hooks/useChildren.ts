import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Child {
  id: string;
  user_id: string;
  name: string;
  date_of_birth: string | null;
  cp_type: string | null;
  mobility_level: string;
  communication_level: string;
  goals: string[] | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useChildren = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['children', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Child[];
    },
    enabled: !!user
  });
};

export const useAddChild = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (child: Omit<Child, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('children')
        .insert({
          ...child,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast.success('Child profile created! 🎉');
    },
    onError: (error) => {
      toast.error('Failed to create profile: ' + error.message);
    }
  });
};

export const useUpdateChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Child> & { id: string }) => {
      const { data, error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast.success('Profile updated!');
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    }
  });
};

export const useDeleteChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast.success('Profile deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    }
  });
};
