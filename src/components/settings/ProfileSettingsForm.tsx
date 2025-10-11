import { useState, useEffect, useCallback } from "react";
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
import { Profile, GenderEnum, ActivityLevelEnum, GoalTypeEnum, DietTypeEnum, PrepTimeEnum, CookingSkillEnum, BudgetEnum } from "@/lib/supabase";

interface ProfileSettingsFormProps {
  user: any; // Supabase User object
  isGuest: boolean;
  profileData: Partial<Profile> | null;
  profileLoading: boolean;
  saveProfile: (user: any, updates: Partial<Profile>) => Promise<any>;
  isSaving: boolean; // New prop for global saving state
}

const ProfileSettingsForm = ({
  user,
  isGuest,
  profileData,
  profileLoading,
  saveProfile,
  isSaving, // Destructure new prop
}: ProfileSettingsFormProps) => {
  const [localProfile, setLocalProfile] = useState<Partial<Profile>>({});

  // Function to calculate daily calorie goal
  const calculateDailyCalorieGoal = useCallback(() => {
    const { age, gender, height, current_weight, activity_level, goal_type } = localProfile;

    if (!age || !gender || !height || !current_weight || !activity_level || !goal_type) {
      return null; // Cannot calculate if essential data is missing
    }

    let bmr: number; // Basal Metabolic Rate
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      bmr = (10 * current_weight) + (6.25 * height) - (5 * age) + 5;
    } else { // female or other, using female equation as a default for 'other'
      bmr = (10 * current_weight) + (6.25 * height) - (5 * age) - 161;
    }

    let activityFactor: number;
    switch (activity_level) {
      case 'sedentary':
        activityFactor = 1.2;
        break;
      case 'lightly_active':
        activityFactor = 1.375;
        break;
      case 'moderately_active':
        activityFactor = 1.55;
        break;
      case 'very_active':
        activityFactor = 1.725;
        break;
      case 'extremely_active':
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2; // Default to sedentary if not set
    }

    let tdee = bmr * activityFactor; // Total Daily Energy Expenditure

    // Adjust for goal type
    if (goal_type === 'lose_weight') {
      tdee -= 500; // Moderate deficit for weight loss
    } else if (goal_type === 'gain_weight') {
      tdee += 500; // Moderate surplus for weight gain
    }
    // For 'maintain_weight', tdee is used directly

    return Math.round(tdee);
  }, [localProfile.age, localProfile.gender, localProfile.height, localProfile.current_weight, localProfile.activity_level, localProfile.goal_type]);

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
        daily_calorie_goal: profileData.daily_calorie_goal,
        water_goal_ml: profileData.water_goal_ml,
        // Initialize new dietary preferences from profile
        diet_type: profileData.diet_type || "no_restrictions",
        allergies: profileData.allergies || [],
        avoid_foods: profileData.avoid_foods || "",
        meals_per_day: profileData.meals_per_day || 3,
        snacks_per_day: profileData.snacks_per_day || 1,
        preparation_time_preference: profileData.preparation_time_preference || "moderate",
        cooking_skill_level: profileData.cooking_skill_level || "beginner",
        budget_preference: profileData.budget_preference || "medium",
      });
    }
  }, [profileData]);

  // NEW useEffect to automatically save calculated daily_calorie_goal
  useEffect(() => {
    if (isGuest || !user || profileLoading || isSaving) {
      return; // Don't auto-save if guest, no user, profile loading, or already saving
    }

    const calculatedGoal = calculateDailyCalorieGoal();
    
    // Only save if the calculated goal is different from the current *persisted* profile data
    // and different from the current local state (to avoid immediate re-save after setting local state)
    if (calculatedGoal !== null && calculatedGoal !== profileData?.daily_calorie_goal) {
      // Update local state first to reflect the change immediately in the UI
      setLocalProfile((prev) => {
        if (prev.daily_calorie_goal !== calculatedGoal) {
          // Only trigger save if the calculated goal is truly new
          saveProfile(user, { daily_calorie_goal: calculatedGoal });
          return { ...prev, daily_calorie_goal: calculatedGoal };
        }
        return prev;
      });
    }
  }, [calculateDailyCalorieGoal, user, isGuest, profileLoading, isSaving, profileData, saveProfile]); // Add dependencies

  const handleProfileChange = (field: keyof Profile, value: any) => {
    setLocalProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllergiesChange = (allergy: string) => {
    setLocalProfile((prev) => {
      const currentAllergies = (prev.allergies || []) as string[];
      if (currentAllergies.includes(allergy)) {
        return { ...prev, allergies: currentAllergies.filter((a) => a !== allergy) };
      } else {
        return { ...prev, allergies: [...currentAllergies, allergy] };
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

            <div className="space-y-2">
              <Label htmlFor="dailyCalorieGoal">Daily Calorie Goal</Label>
              <Input
                id="dailyCalorieGoal"
                type="number"
                value={localProfile.daily_calorie_goal || ""}
                placeholder="Calculated automatically"
                disabled // This field is now disabled and auto-calculated
              />
            </div>

            {/* New: Water Goal Input */}
            <div className="space-y-2">
              <Label htmlFor="waterGoalMl">Daily Water Goal (ml)</Label>
              <Input
                id="waterGoalMl"
                type="number"
                value={localProfile.water_goal_ml || ""}
                onChange={(e) => handleProfileChange("water_goal_ml", parseInt(e.target.value) || null)}
                placeholder="e.g., 2000"
                min="0"
                disabled={isGuest}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={profileLoading || isGuest || isSaving}>Save Changes</Button>
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
                value={localProfile.diet_type || "no_restrictions"}
                onValueChange={(value: DietTypeEnum) => handleProfileChange("diet_type", value)}
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
                      checked={(localProfile.allergies || []).includes(allergy)}
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
                value={localProfile.avoid_foods || ""}
                onChange={(e) => handleProfileChange("avoid_foods", e.target.value)}
                placeholder="List any specific foods you want to avoid"
                rows={3}
                disabled={isGuest}
              />
            </div>
            
            <div className="space-y-2">
              <Label>How many meals do you prefer per day?</Label>
              <div className="pt-2">
                <Slider
                  value={[localProfile.meals_per_day || 3]}
                  min={2}
                  max={6}
                  step={1}
                  onValueChange={(value) => handleProfileChange("meals_per_day", value[0])}
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
              <p className="text-center mt-2">{localProfile.meals_per_day} meals per day</p>
            </div>
            
            <div className="space-y-2">
              <Label>Budget Preference</Label>
              <RadioGroup
                value={localProfile.budget_preference || "medium"}
                onValueChange={(value: BudgetEnum) => handleProfileChange("budget_preference", value)}
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
                value={localProfile.preparation_time_preference || "moderate"}
                onValueChange={(value: PrepTimeEnum) => handleProfileChange("preparation_time_preference", value)}
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
          <Button onClick={handleSaveChanges} disabled={profileLoading || isGuest || isSaving}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSettingsForm;