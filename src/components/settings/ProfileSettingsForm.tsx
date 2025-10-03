import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Profile, GenderEnum, ActivityLevelEnum, GoalTypeEnum } from "@/lib/supabase";

interface ProfileSettingsFormProps {
  user: any; // Supabase User object
  isGuest: boolean;
  profileData: Partial<Profile> | null;
  profileLoading: boolean;
  saveProfile: (user: any, updates: Partial<Profile>) => Promise<any>;
}

const ProfileSettingsForm = ({
  user,
  isGuest,
  profileData,
  profileLoading,
  saveProfile,
}: ProfileSettingsFormProps) => {
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

  useEffect(() => {
    if (profileData) {
      setLocalProfile({
        full_name: profileData.full_name || "",
        age: profileData.age,
        gender: profileData.gender,
        height: profileData.height,
        current_weight: profileData.current_weight,
        goal_type: profileData.goal_type,
        goal_weight: profileData.goal_weight,
        activity_level: profileData.activity_level,
      });
      // If dietary preferences were stored in Supabase, load them here.
      // For now, they remain local to this component.
    }
  }, [profileData]);

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

  const handleSaveChanges = async () => {
    if (!user) {
      toast.error("You must be logged in to save changes.");
      return;
    }
    try {
      await saveProfile(user, localProfile);
      toast.success("Profile settings saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile settings.");
    }
  };

  return (
    <div className="space-y-6">
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
                disabled={isGuest}
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
                disabled={isGuest}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={localProfile.gender || ""}
                onValueChange={(value: GenderEnum) => handleProfileChange("gender", value)}
                className="flex gap-4"
                disabled={isGuest}
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
                disabled={isGuest}
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
                disabled={isGuest}
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
                disabled={isGuest}
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
                disabled={isGuest}
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
                disabled={isGuest}
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
          <Button onClick={handleSaveChanges} disabled={profileLoading || isGuest}>Save Changes</Button>
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
                disabled={isGuest}
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
                      disabled={isGuest}
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
                disabled={isGuest}
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
                  disabled={isGuest}
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
                disabled={isGuest}
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
                disabled={isGuest}
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
          <Button onClick={handleSaveChanges} disabled={profileLoading || isGuest}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSettingsForm;