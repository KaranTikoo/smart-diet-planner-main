import { useState, useEffect } from 'react'
import { supabase, Profile, DietTypeEnum, PrepTimeEnum, CookingSkillEnum, BudgetEnum } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'
import { Database } from '@/integrations/supabase/types'

export const useProfile = () => {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    if (!authUser) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
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

  const saveProfile = async (user: User, updates: Partial<Profile>) => {
    if (!user.email) {
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
        .upsert([profileData])
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      toast.success('Profile saved successfully!')
      return data
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(`Failed to save profile: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [authUser])

  return {
    profile,
    loading,
    isSaving,
    saveProfile,
    refetch: fetchProfile,
  }
}