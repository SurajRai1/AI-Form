'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
  isSessionValid: boolean;
  lastActivity: Date | null;
  updateLastActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Security configuration
const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  ACTIVITY_CHECK_INTERVAL: 60 * 1000, // 1 minute
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<Record<string, { count: number; lastAttempt: number }>>({});

  // Update last activity
  const updateLastActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // Check if user is locked out
  const isUserLockedOut = useCallback((email: string) => {
    const attempts = loginAttempts[email];
    if (!attempts) return false;

    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    return attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS && 
           timeSinceLastAttempt < SECURITY_CONFIG.LOCKOUT_DURATION;
  }, [loginAttempts]);

  // Record login attempt
  const recordLoginAttempt = useCallback((email: string, success: boolean) => {
    setLoginAttempts(prev => {
      const current = prev[email] || { count: 0, lastAttempt: 0 };
      
      if (success) {
        // Reset on successful login
        const { [email]: _, ...rest } = prev;
        return rest;
      } else {
        // Increment failed attempts
        return {
          ...prev,
          [email]: {
            count: current.count + 1,
            lastAttempt: Date.now(),
          }
        };
      }
    });
  }, []);

  // Refresh session (exposed but not auto-looped)
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error);
        setIsSessionValid(false);
      } else if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        setIsSessionValid(true);
        updateLastActivity();
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      setIsSessionValid(false);
    }
  }, [updateLastActivity]);

  // Initialize once and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session) {
          setIsSessionValid(true);
          updateLastActivity();
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsSessionValid(!!session);
      if (session) updateLastActivity(); else setLastActivity(null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  // run once
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      if (isUserLockedOut(email)) {
        const attempts = loginAttempts[email];
        const remainingTime = Math.ceil((SECURITY_CONFIG.LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt)) / 1000 / 60);
        return { 
          error: { 
            message: `Account temporarily locked. Please try again in ${remainingTime} minutes.`,
            name: 'AccountLocked',
            status: 429
          } as AuthError 
        };
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        recordLoginAttempt(email, false);
        return { error };
      } else {
        recordLoginAttempt(email, true);
        updateLastActivity();
        return { error: null };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      recordLoginAttempt(email, false);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      if (password.length < 8) {
        return { error: { message: 'Password must be at least 8 characters long', name: 'WeakPassword', status: 400 } as AuthError };
      }
      const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
      if (weakPasswords.includes(password.toLowerCase())) {
        return { error: { message: 'Please choose a stronger password', name: 'WeakPassword', status: 400 } as AuthError };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          data: { created_at: new Date().toISOString(), security_level: 'enterprise' }
        },
      });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      return { error };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        setLoginAttempts({});
        setIsSessionValid(false);
        setLastActivity(null);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshSession,
    isSessionValid,
    lastActivity,
    updateLastActivity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
