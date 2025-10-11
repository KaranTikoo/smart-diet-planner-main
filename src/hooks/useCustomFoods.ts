import { useState, useEffect } from 'react';
import { supabase, CustomFood } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

export const useCustomFoods = () => {
  const { user } = useAuth();
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomFoods = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setCustomFoods(data || []);
    } catch (error) {
      toast.error('Failed to fetch custom foods');
      console.error('Error fetching custom foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomFood = async (food: Omit<CustomFood, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !supabase) return;

    try {
      const customFoodData: Database['public']['Tables']['custom_foods']['Insert'] = {
        ...food,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('custom_foods')
        .insert([customFoodData])
        .select()
        .single();

      if (error) throw error;
      
      setCustomFoods(prev => [...prev, data]);
      toast.success('Custom food added successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to add custom food');
      console.error('Error adding custom food:', error);
    }
  };

  const updateCustomFood = async (id: string, updates: Partial<CustomFood>) => {
    if (!user || !supabase) return;

    try {
      const customFoodUpdates: Database['public']['Tables']['custom_foods']['Update'] = updates;

      const { data, error } = await supabase
        .from('custom_foods')
        .update(customFoodUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setCustomFoods(prev => prev.map(food => food.id === id ? data : food));
      toast.success('Custom food updated successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to update custom food');
      console.error('Error updating custom food:', error);
    }
  };

  const deleteCustomFood = async (id: string) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('custom_foods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setCustomFoods(prev => prev.filter(food => food.id !== id));
      toast.success('Custom food deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete custom food');
      console.error('Error deleting custom food:', error);
    }
  };

  useEffect(() => {
    fetchCustomFoods();
  }, [user]);

  return {
    customFoods,
    loading,
    addCustomFood,
    updateCustomFood,
    deleteCustomFood,
    refetch: fetchCustomFoods,
  };
};