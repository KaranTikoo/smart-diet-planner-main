import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useTheme } from "next-themes"; // Import useTheme from next-themes

interface PreferencesSettingsProps {
  isGuest: boolean;
  profileLoading: boolean; // For disabling save button
}

const PreferencesSettings = ({ isGuest, profileLoading }: PreferencesSettingsProps) => {
  const { theme, setTheme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(theme === "dark");

  useEffect(() => {
    setIsDarkTheme(theme === "dark");
    console.log("Current theme from useTheme:", theme); // Debug log
    console.log("isDarkTheme state:", isDarkTheme); // Debug log
  }, [theme]); // Depend on theme to log changes

  const handleThemeChange = (checked: boolean) => {
    if (isGuest) {
      toast.error("Please log in or sign up to save theme preferences.");
      return;
    }
    setTheme(checked ? "dark" : "light");
    // setIsDarkTheme is updated by the useEffect, no need to set here
    toast.success("Theme preference updated!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Preferences</CardTitle>
        <CardDescription>
          Customize the look and feel of your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-theme">Dark Theme</Label>
          <Switch
            id="dark-theme"
            checked={isDarkTheme}
            onCheckedChange={handleThemeChange}
            disabled={isGuest || profileLoading}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {/* No explicit save button needed as theme changes are applied immediately */}
        <p className="text-sm text-muted-foreground">Changes are applied instantly.</p>
      </CardFooter>
    </Card>
  );
};

export default PreferencesSettings;