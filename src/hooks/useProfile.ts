import { useState, useEffect } from 'react'
import { supabase, Profile } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'

export const useProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false) // For initial fetch
  const [isSaving, setIsSaving] = useState(false); // For create/update operations

  const fetchProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: user.id,
            email: user.email || '',
            ...updates,
          },
        ])
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      toast.success('Profile updated successfully!')
      return data
    } catch (error: any) {
      console.error('Error updating profile:', error) // Log the full error object
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`) // Provide more specific toast message
    } finally {
      setIsSaving(false);
    }
  }

  // Modified createProfile to use upsert
  const createProfile = async (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: user.id,
            email: user.email || '',
            ...profileData,
          },
        ])
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      toast.success('Profile created successfully!')
      return data
    } catch (error: any) {
      console.error('Error creating profile:', error) // Log the full error object
      toast.error(`Failed to create profile: ${error.message || 'Unknown error'}`) // Provide more specific toast message
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  return {
    profile,
    loading,
    isSaving,
    updateProfile,
    createProfile,
    refetch: fetchProfile,
  }
}