import { useState, useEffect } from 'react'
import { supabase, FoodEntry } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider' // Corrected import path
import { toast } from 'sonner'
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types' // Import TablesInsert and TablesUpdate

export const useFoodEntries = (date?: string) => {
  const { user } = useAuth()
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEntries = async () => {
    if (!user || !supabase) return

    setLoading(true)
    try {
      let query = supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (date) {
        query = query.eq('entry_date', date)
      }

      const { data, error } = await query

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      toast.error('Failed to fetch food entries')
      console.error('Error fetching food entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEntry = async (entry: Omit<FoodEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!user || !supabase) return

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .insert([
          {
            ...entry,
            user_id: user.id,
          } as TablesInsert<'food_entries'>, // Explicitly cast to TablesInsert<'food_entries'>
        ])
        .select()
        .single()

      if (error) throw error
      
      setEntries(prev => [data, ...prev])
      toast.success('Food entry added successfully!')
      return data
    } catch (error) {
      toast.error('Failed to add food entry')
      console.error('Error adding food entry:', error)
    }
  }

  const updateEntry = async (id: string, updates: Partial<FoodEntry>) => {
    if (!user || !supabase) return

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .update(updates as TablesUpdate<'food_entries'>) // Explicitly cast to TablesUpdate<'food_entries'>
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setEntries(prev => prev.map(entry => entry.id === id ? data : entry))
      toast.success('Food entry updated successfully!')
      return data
    } catch (error) {
      toast.error('Failed to update food entry')
      console.error('Error updating food entry:', error)
    }
  }

  const deleteEntry = async (id: string) => {
    if (!user || !supabase) return

    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      setEntries(prev => prev.filter(entry => entry.id !== id))
      toast.success('Food entry deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete food entry')
      console.error('Error deleting food entry:', error)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [user, date])

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  }
}