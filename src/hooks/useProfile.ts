import { useState, useEffect } from 'react'
import { supabase, Profile } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js' // Import User type
import { Database } from '@/integrations/supabase/types' // Import Database type

export const useProfile = () => {
  const { user: authUser } = useAuth() // Renamed to avoid conflict with function param
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false) // For initial fetch
  const [isSaving, setIsSaving] = useState(false); // For create/update operations

  const fetchProfile = async () => {
    if (!authUser) return // Use authUser here

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id) // Use authUser here
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

  // saveProfile now explicitly takes the user object
  const saveProfile = async (user: User, updates: Partial<Profile>) => {
    if (!user.email) { // Explicit check for user.email
      toast.error('Authentication error: User email not found for profile save operation.');
      console.error('User object is missing email:', user);
      return;
    }

    setIsSaving(true);
    try {
      const profileData: Database['public']['Tables']['profiles']['Insert'] = {
        id: user.id,
        email: user.email,
        ...updates,
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert([profileData]) // Pass the explicitly typed object in an array
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
  }, [authUser]) // Depend on authUser

  return {
    profile,
    loading,
    isSaving,
    saveProfile, // Export saveProfile as the single function
    refetch: fetchProfile,
  }
}