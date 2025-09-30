import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    // Show a loading indicator while auth state is being determined
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }

  // If we reach here and user is null, it means the useEffect above should have redirected.
  // This case should ideally not be reached.
  if (!user) {
    return null; 
  }

  return <>{children}</>;
};

export default RequireAuth;