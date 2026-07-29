/**
 * Auth Context
 *
 * Provides authentication state and methods to the entire app.
 * Persists the JWT token in localStorage and HTTP-only cookie.
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe, logout as apiLogout } from "../services/authApi";

const AuthContext = createContext(null);

/**
 * AuthProvider component.
 * Wrap your app (or the protected parts) with this.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // initial auth check
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check if user is already authenticated on mount
   * (by checking the cookie via GET /api/auth/me)
   */
  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const response = await getMe();
        if (!cancelled && response.success) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
} catch (_err) {
        // Not authenticated – that's fine
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  /**
   * Called after successful OTP verification.
   * Stores the token and user data.
   */
  const login = useCallback((userData, token) => {
    // Store token in localStorage as a fallback (mobile/API clients)
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  /**
   * Logout – clear everything.
   */
  const logout = useCallback(async () => {
    try {
      await apiLogout();
} catch (_err) {
      // Even if the API call fails, clear local state
    }
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
