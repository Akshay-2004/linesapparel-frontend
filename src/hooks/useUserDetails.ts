import { useEffect, useState, useCallback } from "react";
import { useApi } from "./useApi";

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

/**
 * Hook to fetch and manage user authentication details
 * @returns Object containing user data, loading state, error state, and utility functions
 */
export function useUserDetails() {
  const { data: rawUser, error, loading, fetchData } = useApi<UserDetails>();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Process raw user data to ensure proper types
  useEffect(() => {
    if (rawUser) {
      const processedUser: UserDetails = {
        ...rawUser,
        role: rawUser.role as EUserRole || EUserRole.client,
        verified: Boolean(rawUser.verified),
      };
      setUser(processedUser);
      setIsInitialized(true);
    } else {
      setUser(null);
      // Only set initialized to true if we're not loading (meaning the request completed)
      if (!loading) {
        setIsInitialized(true);
      }
    }
  }, [rawUser, loading]);

  /**
   * Checks if the user is authenticated
   */
  const isAuthenticated = (): boolean => {
    return Boolean(user?.id);
  };

  /**
   * Checks if the user's email is verified
   */
  const isVerified = (): boolean => {
    return Boolean(user?.verified);
  }

  /**
   * Checks if the user has a specific role
   */
  const hasRole = (role: EUserRole): boolean => {
    return user?.role === role;
  };

  /**
   * Checks if the user is an admin (admin or super admin)
   */
  const isAdmin = (): boolean => {
    return user?.role === EUserRole.admin || user?.role === EUserRole.superAdmin;
  };

  /**
   * Refreshes the user data by refetching from the API
   * @returns Promise that resolves with the updated user data
   */
  const refreshUserData = useCallback(async (): Promise<UserDetails | null> => {
    try {
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
      return null;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      setUser(null);
      return null;
    }
  }, [fetchData]);

  // Fetch user data on mount only once
  useEffect(() => {
    if (!isInitialized) {
      refreshUserData();
    }
  }, [refreshUserData, isInitialized]);

  /**
   * Logs out the current user
   * @returns Promise that resolves when logout is complete
   */
  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await fetchData("/auth/logout", {
        method: "GET",
      });
      // Clear user data after successful logout
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    user,
    error,
    loading: loading || !isInitialized, // Keep loading true until we're initialized
    isLoggingOut,
    isVerified,
    isAuthenticated,
    hasRole,
    isAdmin,
    refreshUserData,
    logout,
  } as const;
}
