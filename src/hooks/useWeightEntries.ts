import { useState, useEffect } from 'react'
import { supabase, WeightEntry } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider' // Corrected import path
import { toast } from 'sonner'
import { Database } from '@/integrations/supabase/types' // Import Database type

export const useWeightEntries = (limit?: number) => {
  const { user } = useAuth()
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEntries = async () => {
    if (!user) return

    setLoading(true)
    try {
      let query = supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      toast.error('Failed to fetch weight entries')
      console.error('Error fetching weight entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEntry = async (entry: Omit<WeightEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return

    try {
      const weightEntryData: Database['public']['Tables']['weight_entries']['Insert'] = {
        ...entry,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('weight_entries')
        .insert([weightEntryData])
        .select()
        .single()

      if (error) throw error
      
      setEntries(prev => [data, ...prev])
      toast.success('Weight entry added successfully!')
      return data
    } catch (error) {
      toast.error('Failed to add weight entry')
      console.error('Error adding weight entry:', error)
    }
  }

  const updateEntry = async (id: string, updates: Partial<WeightEntry>) => {
    if (!user) return

    try {
      const weightEntryUpdates: Database['public']['Tables']['weight_entries']['Update'] = updates;

      const { data, error } = await supabase
        .from('weight_entries')
        .update(weightEntryUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setEntries(prev => prev.map(entry => entry.id === id ? data : entry))
      toast.success('Weight entry updated successfully!')
      return data
    } catch (error) {
      toast.error('Failed to update weight entry')
      console.error('Error updating weight entry:', error)
    }
  }

  const deleteEntry = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      setEntries(prev => prev.filter(entry => entry.id !== id))
      toast.success('Weight entry deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete weight entry')
      console.error('Error deleting weight entry:', error)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [user, limit])

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  }
}