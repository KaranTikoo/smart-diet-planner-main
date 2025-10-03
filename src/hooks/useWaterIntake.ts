import { useState, useEffect } from 'react'
import { supabase, WaterIntake } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider' // Corrected import path
import { toast } from 'sonner'
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types' // Import TablesInsert and TablesUpdate

export const useWaterIntake = (date?: string) => {
  const { user } = useAuth()
  const [entries, setEntries] = useState<WaterIntake[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEntries = async () => {
    if (!user || !supabase) return

    setLoading(true)
    try {
      let query = supabase
        .from('water_intake')
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
      toast.error('Failed to fetch water entries')
      console.error('Error fetching water entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEntry = async (amount_ml: number, entry_date: string) => {
    if (!user || !supabase) return

    try {
      const { data, error } = await supabase
        .from('water_intake')
        .insert([
          {
            user_id: user.id,
            amount_ml,
            entry_date,
          } as TablesInsert<'water_intake'>, // Explicitly cast to TablesInsert<'water_intake'>
        ])
        .select()
        .single()

      if (error) throw error
      
      setEntries(prev => [data, ...prev])
      toast.success('Water entry added successfully!')
      return data
    } catch (error) {
      toast.error('Failed to add water entry')
      console.error('Error adding water entry:', error)
    }
  }

  const updateEntry = async (id: string, updates: Partial<WaterIntake>) => {
    if (!user || !supabase) return

    try {
      const { data, error } = await supabase
        .from('water_intake')
        .update(updates as TablesUpdate<'water_intake'>) // Explicitly cast to TablesUpdate<'water_intake'>
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setEntries(prev => prev.map(entry => entry.id === id ? data : entry))
      toast.success('Water entry updated successfully!')
      return data
    } catch (error) {
      toast.error('Failed to update water entry')
      console.error('Error updating water entry:', error)
    }
  }

  const deleteEntry = async (id: string) => {
    if (!user || !supabase) return

    try {
      const { error } = await supabase
        .from('water_intake')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      setEntries(prev => prev.filter(entry => entry.id !== id))
      toast.success('Water entry deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete water entry')
      console.error('Error deleting water entry:', error)
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