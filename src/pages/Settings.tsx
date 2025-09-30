import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Bell, UserCog, Lock, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Profile, GenderEnum, ActivityLevelEnum, GoalTypeEnum } from "@/lib/supabase";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const [localProfile, setLocalProfile] = useState<Partial<Profile>>({});

  // Local state for preferences not directly in Supabase 'profiles' table
  const [localDietaryPreferences, setLocalDietaryPreferences] = useState({
    diet: "no_restrictions",
    allergies: [] as string[],
    avoidFoods: "",
    mealsPerDay: 3,
    snacksPerDay: 1,
    preparationTime: "moderate",
    cookingSkill: "beginner",
    budget: "medium",
  });

  const [notifications, setNotifications] = useState({
    mealReminders: true,
    weeklyReports: true,
    goalAchievements: true,
    mealPlans: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        full_name: profile.full_name || "",
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        current_weight: profile.current_weight,
        goal_type: profile.goal_type,
        goal_weight: profile.goal_weight,
        activity_level: profile.activity_level,
      });
      // For now, dietary preferences are not stored in Supabase 'profiles' table
      // If they were, you would load them here.
    }
  }, [profile]);

  const handleProfileChange = (field: keyof Profile, value: any) => {
    setLocalProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocalDietaryChange = (field: string, value: any) => {
    setLocalDietaryPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllergiesChange = (allergy: string) => {
    setLocalDietaryPreferences((prev) => {
      const allergies = [...prev.allergies];
      if (allergies.includes(allergy)) {
        return { ...prev, allergies: allergies.filter((a) => a !== allergy) };
      } else {
        return { ...prev, allergies: [...allergies, allergy] };
      }
    });
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user) {
      toast.error("You must be logged in to save changes.");
      return;
    }
    try {
      await updateProfile(localProfile);
      toast.success("Profile settings saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile settings.");
    }
  };

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
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and app preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Account
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={localProfile.full_name || ""}
                      onChange={(e) => handleProfileChange("full_name", e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={localProfile.age || ""}
                      onChange={(e) => handleProfileChange("age", parseInt(e.target.value) || null)}
                      placeholder="Enter your age"
                      min="18"
                      max="100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={localProfile.gender || ""}
                      onValueChange={(value: GenderEnum) => handleProfileChange("gender", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="gender-male" />
                        <Label htmlFor="gender-male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="gender-female" />
                        <Label htmlFor="gender-female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="gender-other" />
                        <Label htmlFor="gender-other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={localProfile.height || ""}
                      onChange={(e) => handleProfileChange("height", parseInt(e.target.value) || null)}
                      placeholder="Enter your height in cm"
                      min="100"
                      max="250"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Current Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={localProfile.current_weight || ""}
                      onChange={(e) => handleProfileChange("current_weight", parseFloat(e.target.value) || null)}
                      placeholder="Enter your weight in kg"
                      min="30"
                      max="300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={localProfile.goal_weight || ""}
                      onChange={(e) => handleProfileChange("goal_weight", parseFloat(e.target.value) || null)}
                      placeholder="Enter your target weight"
                      min="30"
                      max="300"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>What's your main goal?</Label>
                    <RadioGroup
                      value={localProfile.goal_type || "lose_weight"}
                      onValueChange={(value: GoalTypeEnum) => handleProfileChange("goal_type", value)}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
                    >
                      <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                        <RadioGroupItem value="lose_weight" id="goal-weight-loss" />
                        <Label htmlFor="goal-weight-loss">Weight Loss</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                        <RadioGroupItem value="maintain_weight" id="goal-maintenance" />
                        <Label htmlFor="goal-maintenance">Maintenance</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                        <RadioGroupItem value="gain_weight" id="goal-muscle-gain" />
                        <Label htmlFor="goal-muscle-gain">Muscle Gain</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>How would you describe your activity level?</Label>
                    <Select
                      value={localProfile.activity_level || "moderately_active"}
                      onValueChange={(value: ActivityLevelEnum) => handleProfileChange("activity_level", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                        <SelectItem value="lightly_active">Light (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderately_active">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="very_active">Active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="extremely_active">Very Active (hard daily exercise & physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={profileLoading}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>
                  Customize your meal planning preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Dietary Preferences</Label>
                    <Select
                      value={localDietaryPreferences.diet}
                      onValueChange={(value) => handleLocalDietaryChange("diet", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_restrictions">No Restrictions</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="low_carb">Low Carb</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="gluten_free">Gluten Free</SelectItem>
                        <SelectItem value="dairy_free">Dairy Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Allergies (select all that apply)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                      {["nuts", "dairy", "eggs", "soy", "gluten", "shellfish", "fish", "wheat"].map((allergy) => (
                        <div key={allergy} className="flex items-center space-x-2">
                          <Checkbox
                            id={`allergy-${allergy}`}
                            checked={localDietaryPreferences.allergies.includes(allergy)}
                            onCheckedChange={() => handleAllergiesChange(allergy)}
                          />
                          <Label htmlFor={`allergy-${allergy}`} className="capitalize">
                            {allergy}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avoidFoods">Foods you want to avoid</Label>
                    <Textarea
                      id="avoidFoods"
                      value={localDietaryPreferences.avoidFoods}
                      onChange={(e) => handleLocalDietaryChange("avoidFoods", e.target.value)}
                      placeholder="List any specific foods you want to avoid"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>How many meals do you prefer per day?</Label>
                    <div className="pt-2">
                      <Slider
                        value={[localDietaryPreferences.mealsPerDay]}
                        min={2}
                        max={6}
                        step={1}
                        onValueChange={(value) => handleLocalDietaryChange("mealsPerDay", value[0])}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                      </div>
                    </div>
                    <p className="text-center mt-2">{localDietaryPreferences.mealsPerDay} meals per day</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Budget Preference</Label>
                    <RadioGroup
                      value={localDietaryPreferences.budget}
                      onValueChange={(value) => handleLocalDietaryChange("budget", value)}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
                    >
                      <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                        <RadioGroupItem value="low" id="budget-low" />
                        <Label htmlFor="budget-low">Budget-friendly</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                        <RadioGroupItem value="medium" id="budget-medium" />
                        <Label htmlFor="budget-medium">Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                        <RadioGroupItem value="high" id="budget-high" />
                        <Label htmlFor="budget-high">Premium</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cooking Time Preference</Label>
                    <Select
                      value={localDietaryPreferences.preparationTime}
                      onValueChange={(value) => handleLocalDietaryChange("preparationTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cooking time preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick (under 15 minutes)</SelectItem>
                        <SelectItem value="moderate">Moderate (15-30 minutes)</SelectItem>
                        <SelectItem value="extended">Extended (30+ minutes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={profileLoading}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mealReminders">Meal Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders for your scheduled meals</p>
                    </div>
                    <Switch
                      id="mealReminders"
                      checked={notifications.mealReminders}
                      onCheckedChange={(checked) => handleNotificationChange("mealReminders", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly summary of your nutrition and progress</p>
                    </div>
                    <Switch
                      id="weeklyReports"
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="goalAchievements">Goal Achievements</Label>
                      <p className="text-sm text-muted-foreground">Notifications when you reach a milestone or goal</p>
                    </div>
                    <Switch
                      id="goalAchievements"
                      checked={notifications.goalAchievements}
                      onCheckedChange={(checked) => handleNotificationChange("goalAchievements", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mealPlans">New Meal Plans</Label>
                      <p className="text-sm text-muted-foreground">Notifications when new meal plans are generated</p>
                    </div>
                    <Switch
                      id="mealPlans"
                      checked={notifications.mealPlans}
                      onCheckedChange={(checked) => handleNotificationChange("mealPlans", checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={profileLoading}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account settings and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive/10" onClick={handleLogout} disabled={profileLoading}>
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
                <Button onClick={handleSaveChanges} disabled={profileLoading}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;