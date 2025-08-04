'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, AuthUser, UserRole } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@schnellwissen.de'

  // Check if user is admin
  const isAdmin = user?.email === adminEmail || user?.role === 'admin'

  // Helper function to create AuthUser from Supabase User
  const createAuthUser = async (supabaseUser: User): Promise<AuthUser> => {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error)
    }

    // Determine role
    let role: UserRole = 'user'
    if (supabaseUser.email === adminEmail) {
      role = 'admin'
    } else if (profile?.role) {
      role = profile.role
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      role,
      profile: profile || undefined
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const authUser = await createAuthUser(session.user)
        setUser(authUser)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (session?.user) {
          const authUser = await createAuthUser(session.user)
          setUser(authUser)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [adminEmail])

  // Sign up function
  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Create user profile
      const role: UserRole = email === adminEmail ? 'admin' : 'user'
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName || null,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }
  }

  // Sign in function
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Check if user profile exists, create if not
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const role: UserRole = email === adminEmail ? 'admin' : 'user'
        
        await supabase
          .from('user_profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email!,
            role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
      } else if (email === adminEmail && profile?.role !== 'admin') {
        // Update role to admin if it's the admin email
        await supabase
          .from('user_profiles')
          .update({ 
            role: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id)
      }
    }
  }

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}