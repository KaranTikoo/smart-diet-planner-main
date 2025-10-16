import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Profile, GenderEnum, ActivityLevelEnum, GoalTypeEnum } from "@/lib/supabase";
import AvatarUpload from "@/components/profile/AvatarUpload";
import PersonalInformationSection from "@/components/settings/PersonalInformationSection"; // New import
import DietaryPreferencesSection from "@/components/settings/DietaryPreferencesSection"; // New import

interface ProfileSettingsFormProps {
  user: any; // Supabase User object
  isGuest: boolean;
  profileData: Partial<Profile> | null;
  profileLoading: boolean;
  saveProfile: (user: any, updates: Partial<Profile>) => Promise<any>;
  isSaving: boolean;
}

const ProfileSettingsForm = ({
  user,
  isGuest,
  profileData,
  profileLoading,
  saveProfile,
  isSaving,
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
        diet_type: profileData.diet_type,
        allergies: profileData.allergies || [],
        avoid_foods: profileData.avoid_foods || "",
        meals_per_day: profileData.meals_per_day,
        snacks_per_day: profileData.snacks_per_day,
        preparation_time_preference: profileData.preparation_time_preference,
        cooking_skill_level: profileData.cooking_skill_level,
        budget_preference: profileData.budget_preference,
        avatar_url: profileData.avatar_url,
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (isGuest || !user || profileLoading || isSaving) {
      return;
    }

    const calculatedGoal = calculateDailyCalorieGoal();
    
    if (calculatedGoal !== null && calculatedGoal !== profileData?.daily_calorie_goal) {
      setLocalProfile((prev) => {
        if (prev.daily_calorie_goal !== calculatedGoal) {
          saveProfile(user, { daily_calorie_goal: calculatedGoal });
          return { ...prev, daily_calorie_goal: calculatedGoal };
        }
        return prev;
      });
    }
  }, [calculateDailyCalorieGoal, user, isGuest, profileLoading, isSaving, profileData, saveProfile]);

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

  const handleAvatarChange = (newUrl: string | null) => {
    setLocalProfile((prev) => ({ ...prev, avatar_url: newUrl }));
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
      <AvatarUpload
        currentAvatarUrl={localProfile.avatar_url || null}
        onAvatarChange={handleAvatarChange}
      />

      <PersonalInformationSection
        profile={localProfile}
        onProfileChange={handleProfileChange}
        isGuest={isGuest}
        isSaving={isSaving}
      />
      
      <DietaryPreferencesSection
        profile={localProfile}
        onProfileChange={handleProfileChange}
        onAllergiesChange={handleAllergiesChange}
        isGuest={isGuest}
        isSaving={isSaving}
      />

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={profileLoading || isGuest || isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettingsForm;