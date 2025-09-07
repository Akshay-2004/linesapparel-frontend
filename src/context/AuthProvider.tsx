"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/useApi";

export enum EUserRole {
  client = 'client',
  admin = 'admin',
  superAdmin = 'super_admin'
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: EUserRole;
  phone?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  // Modal states
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  showSignup: boolean;
  setShowSignup: (show: boolean) => void;

  // User authentication state
  user: UserDetails | null;
  loading: boolean;
  error: string | null;
  isLoggingOut: boolean;

  // Authentication methods
  isAuthenticated: () => boolean;
  isVerified: () => boolean;
  hasRole: (role: EUserRole) => boolean;
  isAdmin: () => boolean;
  refreshUserData: () => Promise<UserDetails | null>;
  logout: () => Promise<void>;
  login: (userData: UserDetails) => void;
}

const defaultContext: AuthContextType = {
  showLogin: false,
  setShowLogin: () => {},
  showSignup: false,
  setShowSignup: () => {},

  user: null,
  loading: true,
  error: null,
  isLoggingOut: false,

  isAuthenticated: () => false,
  isVerified: () => false,
  hasRole: () => false,
  isAdmin: () => false,
  refreshUserData: async () => null,
  logout: async () => {},
  login: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // User authentication state
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { fetchData } = useApi<UserDetails>();

  /**
   * Checks if the user is authenticated
   */
  const isAuthenticated = useCallback((): boolean => {
    return Boolean(user?.id);
  }, [user]);

  /**
   * Checks if the user's email is verified
   */
  const isVerified = useCallback((): boolean => {
    return Boolean(user?.verified);
  }, [user]);

  /**
   * Checks if the user has a specific role
   */
  const hasRole = useCallback((role: EUserRole): boolean => {
    return user?.role === role;
  }, [user]);

  /**
   * Checks if the user is an admin (admin or super admin)
   */
  const isAdmin = useCallback((): boolean => {
    return user?.role === EUserRole.admin || user?.role === EUserRole.superAdmin;
  }, [user]);

  /**
   * Refreshes the user data by refetching from the API
   */
  const refreshUserData = useCallback(async (): Promise<UserDetails | null> => {
    try {
      setLoading(true);
      setError(null);
      const userData = await fetchData("/auth/me");
      if (userData) {
        const processedUser: UserDetails = {
          ...userData,
          role: userData.role as EUserRole || EUserRole.client,
          verified: Boolean(userData.verified),
        };
        setUser(processedUser);
        return processedUser;
      }
      setUser(null);
      return null;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch user data");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  /**
   * Logs in the user by setting the user data
   */
  const login = useCallback((userData: UserDetails) => {
    const processedUser: UserDetails = {
      ...userData,
      role: userData.role as EUserRole || EUserRole.client,
      verified: Boolean(userData.verified),
    };
    setUser(processedUser);
    setError(null);
  }, []);

  /**
   * Logs out the current user
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await fetchData("/auth/logout", {
        method: "GET",
      });
      // Clear user data after successful logout
      setUser(null);
      setError(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    } finally {
      setIsLoggingOut(false);
    }
  }, [fetchData]);

  // Fetch user data on mount only once
  useEffect(() => {
    if (!isInitialized) {
      refreshUserData();
      setIsInitialized(true);
    }
  }, [refreshUserData, isInitialized]);

  const contextValue: AuthContextType = {
    // Modal states
    showLogin,
    setShowLogin,
    showSignup,
    setShowSignup,

    // User authentication state
    user,
    loading: loading && !isInitialized,
    error,
    isLoggingOut,

    // Authentication methods
    isAuthenticated,
    isVerified,
    hasRole,
    isAdmin,
    refreshUserData,
    logout,
    login,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Re-export types for convenience
export type { UserDetails };
