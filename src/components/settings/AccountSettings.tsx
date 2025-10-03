import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AccountSettingsProps {
  user: any; // Supabase User object
  isGuest: boolean;
  profileLoading: boolean; // For disabling buttons
  signOut: () => Promise<void>;
}

const AccountSettings = ({ user, isGuest, profileLoading, signOut }: AccountSettingsProps) => {
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    toast.info("Account deletion functionality is not yet implemented.");
  };

  const handleResetPassword = () => {
    toast.info("Password reset functionality is not yet implemented.");
  };

  const handleLogout = async () => {
    await signOut();
    // The AuthProvider will handle navigation to /login after signOut
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          {isGuest ? "Create an account or log in to save your progress." : "Manage your account settings and security"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isGuest ? (
          <div className="text-center space-y-4 py-8">
            <p className="text-lg font-medium">You are currently browsing as a guest.</p>
            <p className="text-muted-foreground">Create an account or log in to unlock all features and save your data.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button variant="outline" onClick={() => navigate("/login")}>Sign Up</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary">
                <span className="text-2xl font-semibold text-primary-foreground">
                  {user?.email ? user.email[0].toUpperCase() : "U"}
                </span>
              </div>
              <div>
                <p className="font-medium">{user?.email || "User"}</p>
                <p className="text-sm text-muted-foreground">Free Plan</p>
              </div>
              <div className="ml-auto flex items-center text-primary">
                <BadgeCheck className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Address</h3>
              <div className="flex items-center gap-2">
                <Input
                  value={user?.email || ""}
                  disabled
                  className="flex-grow"
                />
                <Button variant="outline" disabled>Change</Button> {/* Change email not implemented */}
              </div>
              <p className="text-sm text-muted-foreground">
                This is the email address associated with your account
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Password</h3>
              <Button variant="outline" onClick={handleResetPassword}>
                Reset Password
              </Button>
              <p className="text-sm text-muted-foreground">
                We'll send a password reset link to your email
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data & Privacy</h3>
              <div className="flex space-x-2">
                <Button variant="outline" disabled>Download My Data</Button> {/* Download data not implemented */}
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Deleting your account will remove all your data permanently
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive/10" onClick={handleLogout} disabled={profileLoading}>
          <LogOut className="h-4 w-4" /> {isGuest ? "Exit Guest Mode" : "Logout"}
        </Button>
        {/* No "Save Changes" button for authenticated users in AccountSettings as changes are handled by specific actions */}
      </CardFooter>
    </Card>
  );
};

export default AccountSettings;