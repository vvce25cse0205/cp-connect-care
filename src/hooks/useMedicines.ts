import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Medicine {
  id: string;
  user_id: string;
  child_id: string | null;
  name: string;
  dosage: string | null;
  frequency: string | null;
  timing: string | null;
  notes: string | null;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export const useMedicines = (childId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['medicines', user?.id, childId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('medicines')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (childId) {
        query = query.eq('child_id', childId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Medicine[];
    },
    enabled: !!user
  });
};

export const useAddMedicine = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (medicine: Omit<Medicine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('medicines')
        .insert({
          ...medicine,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine added! 💊');
    },
    onError: (error) => {
      toast.error('Failed to add medicine: ' + error.message);
    }
  });
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Medicine> & { id: string }) => {
      const { data, error } = await supabase
        .from('medicines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine updated!');
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    }
  });
};

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medicines')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine removed');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    }
  });
};
