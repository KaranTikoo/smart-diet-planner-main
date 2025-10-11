import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface NotificationSettingsProps {
  user: any; // Supabase User object
  isGuest: boolean;
  profileLoading: boolean; // For disabling save button
}

const NotificationSettings = ({ user, isGuest, profileLoading }: NotificationSettingsProps) => {
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    weeklyReports: true,
    goalAchievements: true,
    mealPlans: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    if (isGuest) {
      toast.error("Please log in or sign up to save notification preferences.");
      return;
    }
    // In a real application, you would send these settings to your backend/Supabase
    console.log("Saving notification settings for user:", user?.id, notifications);
    toast.success("Notification settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Control how you receive updates and reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="meal-reminders">Meal Reminders</Label>
          <Switch
            id="meal-reminders"
            checked={notifications.mealReminders}
            onCheckedChange={(value) => handleNotificationChange("mealReminders", value)}
            disabled={isGuest}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="weekly-reports">Weekly Progress Reports</Label>
          <Switch
            id="weekly-reports"
            checked={notifications.weeklyReports}
            onCheckedChange={(value) => handleNotificationChange("weeklyReports", value)}
            disabled={isGuest}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="goal-achievements">Goal Achievements</Label>
          <Switch
            id="goal-achievements"
            checked={notifications.goalAchievements}
            onCheckedChange={(value) => handleNotificationChange("goalAchievements", value)}
            disabled={isGuest}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="meal-plans">New Meal Plans</Label>
          <Switch
            id="meal-plans"
            checked={notifications.mealPlans}
            onCheckedChange={(value) => handleNotificationChange("mealPlans", value)}
            disabled={isGuest}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch
            id="email-notifications"
            checked={notifications.emailNotifications}
            onCheckedChange={(value) => handleNotificationChange("emailNotifications", value)}
            disabled={isGuest}
          />
        </div>
        <p className="text-sm text-muted-foreground -mt-2">
          (This setting controls whether you *receive* emails, not whether you *send* them from the app.)
        </p>
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Push Notifications</Label>
          <Switch
            id="push-notifications"
            checked={notifications.pushNotifications}
            onCheckedChange={(value) => handleNotificationChange("pushNotifications", value)}
            disabled={isGuest}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={profileLoading || isGuest}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;