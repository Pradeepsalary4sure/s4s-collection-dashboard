/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * Shows a loading spinner while checking auth status,
 * redirects to login if not authenticated.
 */

import { useAuth } from "../../context/AuthContext";
import LoginPage from "../../pages/LoginPage";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading spinner while checking auth on initial load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a100d]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#7a8a80]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Authenticated → render children
  return children;
}
