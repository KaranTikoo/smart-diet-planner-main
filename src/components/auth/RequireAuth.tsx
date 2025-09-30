import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "@/providers/AuthProvider";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // If we are still loading auth state, do nothing yet.
    // This is crucial for the onboarding flow right after signup.
    if (loading) {
      return;
    }

    // If not loading and no user, redirect to login
    if (!user) {
      // Check for mock authentication as fallback
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [user, loading, navigate, location.pathname]); // Add location.pathname to dependencies

  if (loading) {
    // If on onboarding page and still loading, show a loading indicator
    if (location.pathname === "/onboarding") {
      return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
    }
    // For other pages, just show a generic loading
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not loading and no user, and not on onboarding, it means we should have redirected.
  // This case should ideally be caught by the useEffect above, but as a safeguard:
  if (!user && location.pathname !== "/login" && location.pathname !== "/") {
    // This might happen if the useEffect hasn't triggered a navigate yet,
    // or if the user somehow bypassed the initial redirect.
    // We can return null or a redirecting message here.
    return null; 
  }

  return <>{children}</>;
};

export default RequireAuth;