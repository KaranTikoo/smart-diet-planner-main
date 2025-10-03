import { useState, useEffect } from 'react';
import { supabase, MealPlan, MealTypeEnum } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types'; // Import Database type

export const useMealPlans = (date?: string) => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMealPlans = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    try {
      let query = supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('plan_date', { ascending: false })
        .order('meal_type', { ascending: true });

      if (date) {
        query = query.eq('plan_date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      toast.error('Failed to fetch meal plans');
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMealPlan = async (plan: Omit<MealPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !supabase) return;

    try {
      const mealPlanData: Database['public']['Tables']['meal_plans']['Insert'] = {
        ...plan,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('meal_plans')
        .insert([mealPlanData])
        .select()
        .single();

      if (error) throw error;
      
      setMealPlans(prev => [data, ...prev]);
      toast.success('Meal plan added successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to add meal plan');
      console.error('Error adding meal plan:', error);
    }
  };

  const updateMealPlan = async (id: string, updates: Partial<MealPlan>) => {
    if (!user || !supabase) return;

    try {
      const mealPlanUpdates: Database['public']['Tables']['meal_plans']['Update'] = updates;

      const { data, error } = await supabase
        .from('meal_plans')
        .update(mealPlanUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setMealPlans(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Meal plan updated successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to update meal plan');
      console.error('Error updating meal plan:', error);
    }
  };

  const deleteMealPlan = async (id: string) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setMealPlans(prev => prev.filter(p => p.id !== id));
      toast.success('Meal plan deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete meal plan');
      console.error('Error deleting meal plan:', error);
    }
  };

  useEffect(() => {
    fetchMealPlans();
  }, [user, date]);

  return {
    mealPlans,
    loading,
    addMealPlan,
    updateMealPlan,
    deleteMealPlan,
    refetch: fetchMealPlans,
  };
};