import { useState, useEffect, useCallback } from 'react';
import { supabase, GroceryList, GroceryItem } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

export const useGroceryLists = () => {
  const { user } = useAuth();
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroceryLists = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('grocery_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setGroceryLists(data || []);
      if (data && data.length > 0 && !selectedListId) {
        setSelectedListId(data[0].id); // Automatically select the first list
      } else if (data && data.length === 0) {
        setSelectedListId(null);
      }
    } catch (err: any) {
      console.error('Error fetching grocery lists:', err);
      setError(err.message);
      toast.error('Failed to fetch grocery lists.');
    } finally {
      setLoading(false);
    }
  }, [user, selectedListId]);

  const fetchGroceryItems = useCallback(async (listId: string) => {
    if (!user || !listId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('grocery_items')
        .select('*')
        .eq('grocery_list_id', listId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.error('Error fetching grocery items:', err);
      setError(err.message);
      toast.error('Failed to fetch grocery items.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGroceryLists();
  }, [fetchGroceryLists]);

  useEffect(() => {
    if (selectedListId) {
      fetchGroceryItems(selectedListId);
    } else {
      setItems([]); // Clear items if no list is selected
    }
  }, [selectedListId, fetchGroceryItems]);

  const addGroceryList = async (name: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('grocery_lists')
        .insert([{ user_id: user.id, name }])
        .select()
        .single();

      if (error) throw error;
      setGroceryLists(prev => [...prev, data]);
      setSelectedListId(data.id); // Select the new list
      toast.success('Grocery list created!');
      return data;
    } catch (err: any) {
      console.error('Error adding grocery list:', err);
      toast.error(`Failed to add grocery list: ${err.message}`);
    }
  };

  const addGroceryItem = async (item: Omit<GroceryItem, 'id' | 'grocery_list_id' | 'created_at'>) => {
    if (!user || !selectedListId) {
      toast.error('Please select a grocery list first.');
      return;
    }
    try {
      const itemData: Database['public']['Tables']['grocery_items']['Insert'] = {
        ...item,
        grocery_list_id: selectedListId,
      };
      const { data, error } = await supabase
        .from('grocery_items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [...prev, data]);
      toast.success('Item added to grocery list!');
      return data;
    } catch (err: any) {
      console.error('Error adding grocery item:', err);
      toast.error(`Failed to add item: ${err.message}`);
    }
  };

  const updateGroceryItem = async (id: string, updates: Partial<Omit<GroceryItem, 'grocery_list_id' | 'created_at'>>) => {
    if (!user || !selectedListId) return;
    try {
      const itemUpdates: Database['public']['Tables']['grocery_items']['Update'] = updates;
      const { data, error } = await supabase
        .from('grocery_items')
        .update(itemUpdates)
        .eq('id', id)
        .eq('grocery_list_id', selectedListId)
        .select()
        .single();

      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Item updated!');
      return data;
    } catch (err: any) {
      console.error('Error updating grocery item:', err);
      toast.error(`Failed to update item: ${err.message}`);
    }
  };

  const deleteGroceryItem = async (id: string) => {
    if (!user || !selectedListId) return;
    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', id)
        .eq('grocery_list_id', selectedListId);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item deleted!');
    } catch (err: any) {
      console.error('Error deleting grocery item:', err);
      toast.error(`Failed to delete item: ${err.message}`);
    }
  };

  const clearCompletedItems = async () => {
    if (!user || !selectedListId) return;
    try {
      const completedItemIds = items.filter(item => item.is_checked).map(item => item.id);
      if (completedItemIds.length === 0) {
        toast.info("No completed items to clear.");
        return;
      }

      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .in('id', completedItemIds)
        .eq('grocery_list_id', selectedListId);

      if (error) throw error;
      setItems(prev => prev.filter(item => !item.is_checked));
      toast.success(`Removed ${completedItemIds.length} completed items.`);
    } catch (err: any) {
      console.error('Error clearing completed items:', err);
      toast.error(`Failed to clear completed items: ${err.message}`);
    }
  };

  return {
    groceryLists,
    selectedListId,
    setSelectedListId,
    items,
    loading,
    error,
    fetchGroceryLists,
    fetchGroceryItems,
    addGroceryList,
    addGroceryItem,
    updateGroceryItem,
    deleteGroceryItem,
    clearCompletedItems,
  };
};