import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { signInAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    signInAsGuest();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-muted items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm />
        <div className="mt-4 text-center">
          <Button variant="outline" className="w-full" onClick={handleGuestLogin}>
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;