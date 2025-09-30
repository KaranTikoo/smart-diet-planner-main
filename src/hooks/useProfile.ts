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

  const saveProfile = async (updates: Partial<Profile>) => { // Renamed from updateProfile/createProfile to saveProfile
    if (!user) {
      toast.error('Authentication error: User not found for profile save operation.');
      return;
    }
    if (!user.email) { // Explicit check for user.email
      toast.error('Authentication error: User email not found for profile save operation.');
      console.error('User object is missing email:', user);
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: user.id,
            email: user.email, // Use user.email directly, as we've checked it's not null
            ...updates,
          },
        ])
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      toast.success('Profile saved successfully!')
      return data
    } catch (error: any) {
      console.error('Error saving profile:', error) // Log the full error object
      toast.error(`Failed to save profile: ${error.message || 'Unknown error'}`) // Provide more specific toast message
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
    saveProfile, // Export saveProfile as the single function
    refetch: fetchProfile,
  }
}