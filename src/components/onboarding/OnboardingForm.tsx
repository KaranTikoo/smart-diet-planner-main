import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Profile, GenderEnum, ActivityLevelEnum, GoalTypeEnum, DietTypeEnum, PrepTimeEnum, CookingSkillEnum, BudgetEnum } from "@/lib/supabase";
import { User } from '@supabase/supabase-js';

// Import new modular step components
import OnboardingStep1BasicInfo from "./OnboardingStep1BasicInfo";
import OnboardingStep2GoalsActivity from "./OnboardingStep2GoalsActivity";
import OnboardingStep3DietaryPreferences from "./OnboardingStep3DietaryPreferences";

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, saveProfile, loading: profileLoading, isSaving } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<Profile>>({
    full_name: "",
    age: null,
    gender: null,
    height: null,
    current_weight: null,
    goal_type: "lose_weight",
    goal_weight: null,
    activity_level: "moderately_active",
    daily_calorie_goal: null,
    water_goal_ml: 2000, // Default water goal
    // New dietary preferences
    diet_type: "no_restrictions",
    allergies: [],
    avoid_foods: "",
    meals_per_day: 3,
    snacks_per_day: 1,
    preparation_time_preference: "moderate",
    cooking_skill_level: "beginner",
    budget_preference: "medium",
  });

  // Function to calculate daily calorie goal
  const calculateDailyCalorieGoal = useCallback(() => {
    const { age, gender, height, current_weight, activity_level, goal_type } = onboardingData;

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
  }, [onboardingData.age, onboardingData.gender, onboardingData.height, onboardingData.current_weight, onboardingData.activity_level, onboardingData.goal_type]);


  useEffect(() => {
    if (profile && !profileLoading) {
      setOnboardingData({
        full_name: profile.full_name || "",
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        current_weight: profile.current_weight,
        goal_type: profile.goal_type,
        goal_weight: profile.goal_weight,
        activity_level: profile.activity_level,
        daily_calorie_goal: profile.daily_calorie_goal,
        water_goal_ml: profile.water_goal_ml,
        // Initialize new dietary preferences from profile
        diet_type: profile.diet_type || "no_restrictions",
        allergies: profile.allergies || [],
        avoid_foods: profile.avoid_foods || "",
        meals_per_day: profile.meals_per_day || 3,
        snacks_per_day: profile.snacks_per_day || 1,
        preparation_time_preference: profile.preparation_time_preference || "moderate",
        cooking_skill_level: profile.cooking_skill_level || "beginner",
        budget_preference: profile.budget_preference || "medium",
      });
    }
  }, [profile, profileLoading]);

  // NEW useEffect to automatically save calculated daily_calorie_goal
  useEffect(() => {
    if (authLoading || profileLoading || isSaving) {
      return; // Don't auto-calculate/save if auth/profile is loading or already saving
    }

    const calculatedGoal = calculateDailyCalorieGoal();
    
    // Only update local state if the calculated goal is different
    if (calculatedGoal !== null && calculatedGoal !== onboardingData.daily_calorie_goal) {
      setOnboardingData((prev) => ({ ...prev, daily_calorie_goal: calculatedGoal }));
    }
  }, [calculateDailyCalorieGoal, authLoading, profileLoading, isSaving, onboardingData.daily_calorie_goal]);


  const handleChange = (field: keyof Profile, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllergiesChange = (allergy: string) => {
    setOnboardingData((prev) => {
      const currentAllergies = (prev.allergies || []) as string[];
      if (currentAllergies.includes(allergy)) {
        return { ...prev, allergies: currentAllergies.filter((a) => a !== allergy) };
      } else {
        return { ...prev, allergies: [...currentAllergies, allergy] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Authentication error: User not found. Please log in again.");
      navigate("/login");
      return;
    }

    if (currentStep === 1 && (!onboardingData.full_name || !onboardingData.age || !onboardingData.gender || !onboardingData.height || !onboardingData.current_weight)) {
      toast.error("Please fill all basic information fields.");
      return;
    }
    if (currentStep === 2 && (!onboardingData.goal_type || !onboardingData.activity_level || (onboardingData.goal_type === "lose_weight" && !onboardingData.goal_weight))) {
      toast.error("Please fill all goals and activity fields.");
      return;
    }

    try {
      const profileDataToSave: Partial<Profile> = {
        full_name: onboardingData.full_name || null,
        age: onboardingData.age || null,
        gender: onboardingData.gender as GenderEnum || null,
        height: onboardingData.height || null,
        current_weight: onboardingData.current_weight || null,
        goal_type: onboardingData.goal_type as GoalTypeEnum || null,
        goal_weight: onboardingData.goal_weight || null,
        activity_level: onboardingData.activity_level as ActivityLevelEnum || null,
        daily_calorie_goal: onboardingData.daily_calorie_goal || 2000,
        water_goal_ml: onboardingData.water_goal_ml || 2000,
        // Include new dietary preferences
        diet_type: onboardingData.diet_type as DietTypeEnum || "no_restrictions",
        allergies: onboardingData.allergies || [],
        avoid_foods: onboardingData.avoid_foods || null,
        meals_per_day: onboardingData.meals_per_day || 3,
        snacks_per_day: onboardingData.snacks_per_day || 1,
        preparation_time_preference: onboardingData.preparation_time_preference as PrepTimeEnum || "moderate",
        cooking_skill_level: onboardingData.cooking_skill_level as CookingSkillEnum || "beginner",
        budget_preference: onboardingData.budget_preference as BudgetEnum || "medium",
      };

      await saveProfile(user, profileDataToSave);
      
      toast.success("Profile created/updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!onboardingData.full_name || !onboardingData.age || !onboardingData.gender || !onboardingData.height || !onboardingData.current_weight) {
        toast.error("Please fill all basic information fields before proceeding.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!onboardingData.goal_type || !onboardingData.activity_level || (onboardingData.goal_type === "lose_weight" && !onboardingData.goal_weight)) {
        toast.error("Please fill all goals and activity fields before proceeding.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const isButtonDisabled = authLoading || profileLoading || isSaving;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading user session...</p>
      </div>
    );
  }

  if (!user) {
    useEffect(() => {
      toast.error("You must be logged in to complete onboarding.");
      navigate("/login");
    }, [navigate]);
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Diet Profile</CardTitle>
        <CardDescription>
          Let's customize your meal plans to match your specific needs and preferences
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Tabs value={`step-${currentStep}`} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="step-1" onClick={() => setCurrentStep(1)} disabled={isButtonDisabled}>
                Basic Information
              </TabsTrigger>
              <TabsTrigger value="step-2" onClick={() => setCurrentStep(2)} disabled={isButtonDisabled}>
                Goals & Activity
              </TabsTrigger>
              <TabsTrigger value="step-3" onClick={() => setCurrentStep(3)} disabled={isButtonDisabled}>
                Dietary Preferences
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="step-1">
              <OnboardingStep1BasicInfo
                onboardingData={onboardingData}
                handleChange={handleChange}
                isButtonDisabled={isButtonDisabled}
              />
            </TabsContent>
            
            <TabsContent value="step-2">
              <OnboardingStep2GoalsActivity
                onboardingData={onboardingData}
                handleChange={handleChange}
                isButtonDisabled={isButtonDisabled}
              />
            </TabsContent>
            
            <TabsContent value="step-3">
              <OnboardingStep3DietaryPreferences
                onboardingData={onboardingData}
                handleChange={handleChange}
                handleAllergiesChange={handleAllergiesChange}
                isButtonDisabled={isButtonDisabled}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isButtonDisabled}
          >
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep} disabled={isButtonDisabled}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isButtonDisabled}>
              {isButtonDisabled ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default OnboardingForm;