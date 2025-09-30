import { useState, useEffect } from 'react'
import { supabase, Profile } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider' // Corrected import path
import { toast } from 'sonner'

export const useProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
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
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const createProfile = async (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
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
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  return {
    profile,
    loading,
    updateProfile,
    createProfile,
    refetch: fetchProfile,
  }
}