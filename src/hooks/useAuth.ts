import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper to create a mock user object
  const createMockUser = (email: string): User => ({
    id: 'mock-user-id',
    email: email,
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    confirmed_at: new Date().toISOString()
  });

  useEffect(() => {
    // If Supabase is not connected, use mock auth
    if (!supabase) {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      const userEmail = localStorage.getItem("userEmail");
      
      if (isAuthenticated && userEmail) {
        setUser(createMockUser(userEmail));
      }
      setLoading(false);
      return;
    }
    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!')
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out!')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Mock authentication logic
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      setUser(createMockUser(email)); // Directly set mock user
      setLoading(false); // Ensure loading is false after mock auth
      toast.success("Successfully signed in! (Using mock auth - connect Supabase for real auth)");
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      toast.error(error.message)
    }
    
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      // Mock authentication logic
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      setUser(createMockUser(email)); // Directly set mock user
      setLoading(false); // Ensure loading is false after mock auth
      toast.success("Account created! (Using mock auth - connect Supabase for real auth)");
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Check your email for verification link!')
    }
    
    return { error }
  }

  const signOut = async () => {
    if (!supabase) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      setUser(null); // Clear mock user
      setLoading(false); // Ensure loading is false after mock auth
      toast.success("Successfully signed out!");
      return;
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }
}