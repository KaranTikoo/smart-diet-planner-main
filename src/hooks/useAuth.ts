import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false) // New state for guest mode

  // Helper to create a mock user object (if needed, but for guest, user will be null)
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
    const storedIsGuest = localStorage.getItem("isGuestMode") === "true";
    setIsGuest(storedIsGuest);

    // If in guest mode, we don't try to fetch Supabase session
    if (storedIsGuest) {
      setUser(null); // No actual user for guest mode
      setSession(null);
      setLoading(false);
      return;
    }

    // Supabase logic for authenticated users
    if (!supabase) {
      // Mock authentication logic for non-Supabase setup
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      const userEmail = localStorage.getItem("userEmail");
      
      if (isAuthenticated && userEmail) {
        setUser(createMockUser(userEmail));
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // If a user signs in while in guest mode, clear guest mode
        if (event === 'SIGNED_IN' && isGuest) {
          localStorage.removeItem("isGuestMode");
          setIsGuest(false);
        }
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
  }, [isGuest]) // Re-run effect if isGuest changes

  const signIn = async (email: string, password: string) => {
    // If currently in guest mode, clear it upon sign-in attempt
    if (isGuest) {
      localStorage.removeItem("isGuestMode");
      setIsGuest(false);
    }

    if (!supabase) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      setUser(createMockUser(email));
      setLoading(false);
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
    // If currently in guest mode, clear it upon sign-up attempt
    if (isGuest) {
      localStorage.removeItem("isGuestMode");
      setIsGuest(false);
    }

    if (!supabase) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      setUser(createMockUser(email));
      setLoading(false);
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
    localStorage.removeItem("isAuthenticated"); // Clear old mock auth flag
    localStorage.removeItem("userEmail"); // Clear old mock auth email
    localStorage.removeItem("isGuestMode"); // Clear guest mode
    setIsGuest(false); // Update state

    if (!supabase) {
      setUser(null);
      setLoading(false);
      toast.success("Successfully signed out!");
      return;
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Successfully signed out!");
    }
  }

  const signInAsGuest = () => {
    localStorage.setItem("isGuestMode", "true");
    setIsGuest(true);
    setUser(null); // Explicitly set user to null for guest mode
    setSession(null); // Explicitly set session to null for guest mode
    toast.info("Continuing as guest.");
  }

  return {
    user,
    session,
    loading,
    isGuest, // Export isGuest
    signIn,
    signUp,
    signOut,
    signInAsGuest, // Export signInAsGuest
  }
}