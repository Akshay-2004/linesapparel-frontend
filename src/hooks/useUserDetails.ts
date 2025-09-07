import { useAuth, EUserRole, type UserDetails } from "@/context/AuthProvider";

/**
 * Hook to fetch and manage user authentication details
 * Now uses the global AuthContext for shared state across the app
 * @returns Object containing user data, loading state, error state, and utility functions
 */
export function useUserDetails() {
  const {
    user,
    loading,
    error,
    isLoggingOut,
    isAuthenticated,
    isVerified,
    hasRole,
    isAdmin,
    refreshUserData,
    logout,
    login,
  } = useAuth();

  return {
    user,
    error,
    loading,
    isLoggingOut,
    isVerified,
    isAuthenticated,
    hasRole,
    isAdmin,
    refreshUserData,
    logout,
    login,
  } as const;
}

// Re-export types and enums for convenience
export { EUserRole };
export type { UserDetails };
