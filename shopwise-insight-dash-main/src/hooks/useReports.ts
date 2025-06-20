import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Report {
  id: string;
  user_id: string;
  report_name: string;
  report_type: 'sales' | 'inventory' | 'performance' | 'customer';
  report_data: any;
  date_range_start?: string;
  date_range_end?: string;
  created_at: string;
}

export const useReports = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, returning empty reports array');
        return [];
      }
      
      console.log('Fetching reports for user:', user.id);
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
      
      console.log('Fetched reports:', data);
      return data as Report[];
    },
    enabled: !!user,
  });

  const generateReport = useMutation({
    mutationFn: async ({ 
      reportName, 
      reportType, 
      reportData 
    }: { 
      reportName: string; 
      reportType: Report['report_type']; 
      reportData: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          report_name: reportName,
          report_type: reportType,
          report_data: reportData,
          date_range_start: new Date().toISOString().split('T')[0],
          date_range_end: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const deleteReport = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  return {
    reports,
    isLoading,
    generateReport,
    deleteReport,
  };
};
