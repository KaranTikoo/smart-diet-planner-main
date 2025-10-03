import React from 'react'
import { useAuthState } from '@/hooks/useAuth'
import { User, Session, AuthError } from '@supabase/supabase-js' // Import necessary types

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isGuest: boolean // Added isGuest
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>
  signUp: (email: string, password: string) => Promise<{ error?: AuthError }>
  signOut: () => Promise<void>
  signInAsGuest: () => void // Added signInAsGuest
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthState()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}