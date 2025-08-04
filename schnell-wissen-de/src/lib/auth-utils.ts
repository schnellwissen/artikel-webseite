import { supabase } from './supabase'

/**
 * Get authentication token for API requests
 * Tries Supabase token first, falls back to old admin token system
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    // Try to get Supabase session first
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.access_token) {
      return session.access_token
    }
    
    // Fallback to old admin token system for backward compatibility
    const adminToken = localStorage.getItem('admin_token')
    return adminToken
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }
    
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@schnellwissen.de'
    
    if (user.email === adminEmail) {
      return true
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}