import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CareTeamMember {
  id: string;
  user_id: string;
  child_id?: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  clinic_name?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useCareTeam = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['care-team', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('care_team')
        .select('*')
        .eq('user_id', user.id)
        .order('role', { ascending: true });
      
      if (error) throw error;
      return data as CareTeamMember[];
    },
    enabled: !!user,
  });
};

export const useAddCareTeamMember = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (member: Omit<CareTeamMember, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('care_team')
        .insert({ ...member, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-team'] });
      toast.success('Care team member added!');
    },
    onError: (error) => {
      toast.error('Failed to add member: ' + error.message);
    },
  });
};

export const useUpdateCareTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CareTeamMember> & { id: string }) => {
      const { data, error } = await supabase
        .from('care_team')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-team'] });
      toast.success('Care team member updated!');
    },
  });
};

export const useDeleteCareTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('care_team')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-team'] });
      toast.success('Care team member removed');
    },
  });
};
