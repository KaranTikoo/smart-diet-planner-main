import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const { user, loading, isGuest } = useAuth(); // Get isGuest from useAuth
  
  useEffect(() => {
    // If not loading and neither user nor guest, redirect to login
    if (!loading && !user && !isGuest) {
      navigate("/login");
    }
  }, [user, loading, isGuest, navigate]);

  if (loading) {
    // Show a loading indicator while auth state is being determined
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }

  // If we reach here and neither user nor guest is true, it means the useEffect above should have redirected.
  if (!user && !isGuest) {
    return null; 
  }

  return <>{children}</>;
};

export default RequireAuth;