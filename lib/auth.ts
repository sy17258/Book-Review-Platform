
import { supabase } from './supabase';
import { usersAPI } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

// Auth functions using Supabase Auth + custom user table
export const authAPI = {
  // Sign up with email and password
  async signup(data: { email: string; password: string; name: string }) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile in our custom users table
        try {
          await usersAPI.createUser({
            id: authData.user.id,
            email: data.email,
            name: data.name,
          });
        } catch (profileError) {
          // Continue since auth user was created successfully
        }
      }

      return authData;
    } catch (error) {
      throw error;
    }
  },

  // Sign in with email and password
  async login(data: { email: string; password: string }) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      return authData;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      return null;
    }
  },

  // Get current user with profile data
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        // Try to get user profile from our custom users table
        try {
          const profile = await usersAPI.getUser(user.id);
          return {
            id: user.id,
            email: user.email || '',
            name: profile?.name || user.email?.split('@')[0] || 'User',
          };
        } catch (profileError) {
          // Fallback: create a user profile from auth data
          const fallbackUser = {
            id: user.id,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'User',
          };
          
          // Try to create the user profile for future use
          try {
            await usersAPI.createUser(fallbackUser);
          } catch (createError) {
            // Ignore create errors - table might not exist
          }
          
          return fallbackUser;
        }
      }
      
      // Check localStorage fallback
      const localUser = getCurrentUser();
      if (localUser) {
        return localUser;
      }
      
      return null;
    } catch (error) {
      // Final fallback - check localStorage
      const localUser = getCurrentUser();
      return localUser || null;
    }
  }
};

// Legacy functions for compatibility (using localStorage as fallback)
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('current_user', JSON.stringify(user));
};

export const removeCurrentUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('current_user');
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!getAuthToken() || !!localStorage.getItem('supabase.auth.token');
};

// Enhanced auth state management
export const useAuthState = () => {
  return {
    async signUp(email: string, password: string, name: string) {
      const result = await authAPI.signup({ email, password, name });
      if (result.user) {
        const user = {
          id: result.user.id,
          email: email,
          name: name,
        };
        setCurrentUser(user);
        setAuthToken(result.session?.access_token || 'supabase-session');
      }
      return result;
    },

    async signIn(email: string, password: string) {
      const result = await authAPI.login({ email, password });
      if (result.user) {
        // Create user profile data
        const userProfile = {
          id: result.user.id,
          email: result.user.email || email,
          name: result.user.email?.split('@')[0] || 'User',
        };
        
        // Store in localStorage immediately
        setCurrentUser(userProfile);
        setAuthToken(result.session?.access_token || 'supabase-session');
        
        // Try to get/create the full profile
        try {
          const fullProfile = await authAPI.getCurrentUser();
          if (fullProfile) {
            setCurrentUser(fullProfile);
          }
        } catch (error) {
          // Use the basic profile we already set
        }
      }
      return result;
    },

    async signOut() {
      await authAPI.logout();
      removeAuthToken();
      removeCurrentUser();
    },

    async getCurrentUser() {
      return await authAPI.getCurrentUser();
    },

    isAuthenticated: isAuthenticated(),
  };
};
