import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { useAuth } from "@/providers/AuthProvider"; // Import useAuth

const Onboarding = () => {
  const { user, loading: authLoading } = useAuth(); // Get user and authLoading state

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted py-8 px-4">
        <p className="text-lg text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  if (!user && !authLoading) {
    // If not loading and no user, it means they are not logged in.
    // They should not be on the onboarding page.
    // A redirect to /login would be more appropriate in a production app,
    // but for now, we'll display a message.
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted py-8 px-4">
        <p className="text-lg text-destructive">You must be logged in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <OnboardingForm />
    </div>
  );
};

export default Onboarding;