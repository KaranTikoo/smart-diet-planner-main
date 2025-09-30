import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Fallback auth for when Supabase is not connected
const createMockAuth = () => ({
  user: null,
  session: null,
  loading: false,
  signIn: async (email: string, password: string) => {
    // Mock authentication
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    toast.success("Successfully signed in! (Using mock auth - connect Supabase for real auth)");
    return { error: null };
  },
  signUp: async (email: string, password: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    toast.success("Account created! (Using mock auth - connect Supabase for real auth)");
    return { error: null };
  },
  signOut: async () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    toast.success("Successfully signed out!");
  }
})

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>
  signUp: (email: string, password: string) => Promise<{ error?: AuthError }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Supabase is not connected, use mock auth
    if (!supabase) {
      // Check for mock authentication
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      const userEmail = localStorage.getItem("userEmail");
      
      if (isAuthenticated && userEmail) {
        // Create a mock user object
        setUser({ 
          id: 'mock-user-id', 
          email: userEmail,
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          confirmed_at: new Date().toISOString()
        } as User);
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
      return createMockAuth().signIn(email, password);
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
      return createMockAuth().signUp(email, password);
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
      return createMockAuth().signOut();
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