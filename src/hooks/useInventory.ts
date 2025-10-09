import { useState, useEffect } from 'react';
import { supabase, InventoryItem } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

export const useInventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast.error('Failed to fetch inventory items');
      console.error('Error fetching inventory items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<InventoryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !supabase) return;

    try {
      const inventoryItemData: Database['public']['Tables']['inventory_items']['Insert'] = {
        ...item,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('inventory_items')
        .insert([inventoryItemData])
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [...prev, data]);
      toast.success('Inventory item added successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to add inventory item');
      console.error('Error adding inventory item:', error);
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    if (!user || !supabase) return;

    try {
      const inventoryItemUpdates: Database['public']['Tables']['inventory_items']['Update'] = updates;

      const { data, error } = await supabase
        .from('inventory_items')
        .update(inventoryItemUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Inventory item updated successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to update inventory item');
      console.error('Error updating inventory item:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Inventory item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete inventory item');
      console.error('Error deleting inventory item:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
};