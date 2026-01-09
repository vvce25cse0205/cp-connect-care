import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface MedicalRecord {
  id: string;
  user_id: string;
  child_id?: string;
  title: string;
  description?: string;
  record_type: string;
  record_date: string;
  doctor_name?: string;
  hospital_name?: string;
  file_url?: string;
  file_name?: string;
  notes?: string;
  is_emergency: boolean;
  created_at: string;
  updated_at: string;
}

export const useMedicalRecords = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['medical-records', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false });
      
      if (error) throw error;
      return data as MedicalRecord[];
    },
    enabled: !!user,
  });

  const addRecord = useMutation({
    mutationFn: async (record: Omit<MedicalRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('medical_records')
        .insert({ ...record, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      toast.success('Medical record added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add medical record: ' + error.message);
    },
  });

  const updateRecord = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MedicalRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('medical_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      toast.success('Medical record updated');
    },
    onError: (error) => {
      toast.error('Failed to update record: ' + error.message);
    },
  });

  const deleteRecord = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      toast.success('Medical record deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete record: ' + error.message);
    },
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('medical-documents')
      .upload(fileName, file);
    
    if (error) {
      toast.error('Failed to upload file: ' + error.message);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('medical-documents')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  };

  return {
    records,
    isLoading,
    addRecord,
    updateRecord,
    deleteRecord,
    uploadFile,
  };
};
