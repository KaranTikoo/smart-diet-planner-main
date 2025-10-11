import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Profile, GenderEnum, ActivityLevelEnum, GoalTypeEnum, DietTypeEnum, PrepTimeEnum, CookingSkillEnum, BudgetEnum } from "@/lib/supabase";
import { User } from '@supabase/supabase-js';

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
            
            {/* Step 1: Basic Information */}
            <TabsContent value="step-1" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={onboardingData.full_name || ""}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    placeholder="Enter your name"
                    disabled={isButtonDisabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={onboardingData.age || ""}
                    onChange={(e) => handleChange("age", parseInt(e.target.value) || null)}
                    placeholder="Enter your age"
                    min="18"
                    max="100"
                    disabled={isButtonDisabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={onboardingData.gender || ""}
                    onValueChange={(value: GenderEnum) => handleChange("gender", value)}
                    className="flex gap-4"
                    disabled={isButtonDisabled}
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
                    value={onboardingData.height || ""}
                    onChange={(e) => handleChange("height", parseInt(e.target.value) || null)}
                    placeholder="Enter your height in cm"
                    min="100"
                    max="250"
                    disabled={isButtonDisabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={onboardingData.current_weight || ""}
                    onChange={(e) => handleChange("current_weight", parseFloat(e.target.value) || null)}
                    placeholder="Enter your weight in kg"
                    min="30"
                    max="300"
                    disabled={isButtonDisabled}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Step 2: Goals & Activity */}
            <TabsContent value="step-2" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>What's your main goal?</Label>
                  <RadioGroup
                    value={onboardingData.goal_type || "lose_weight"}
                    onValueChange={(value: GoalTypeEnum) => handleChange("goal_type", value)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
                    disabled={isButtonDisabled}
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
                
                {onboardingData.goal_type === "lose_weight" && (
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={onboardingData.goal_weight || ""}
                      onChange={(e) => handleChange("goal_weight", parseFloat(e.target.value) || null)}
                      placeholder="Enter your target weight"
                      min="30"
                      max="300"
                      disabled={isButtonDisabled}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>How would you describe your activity level?</Label>
                  <Select
                    value={onboardingData.activity_level || "moderately_active"}
                    onValueChange={(value: ActivityLevelEnum) => handleChange("activity_level", value)}
                    disabled={isButtonDisabled}
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
                  <Label>How many meals do you prefer per day?</Label>
                  <div className="pt-2">
                    <Slider
                      value={[onboardingData.meals_per_day || 3]}
                      min={2}
                      max={6}
                      step={1}
                      onValueChange={(value) => handleChange("meals_per_day", value[0])}
                      disabled={isButtonDisabled}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>6</span>
                    </div>
                  </div>
                  <p className="text-center mt-2">{onboardingData.meals_per_day} meals per day</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Step 3: Dietary Preferences */}
            <TabsContent value="step-3" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Dietary Preferences</Label>
                  <Select
                    value={onboardingData.diet_type || "no_restrictions"}
                    onValueChange={(value: DietTypeEnum) => handleChange("diet_type", value)}
                    disabled={isButtonDisabled}
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
                          checked={(onboardingData.allergies || []).includes(allergy)}
                          onCheckedChange={() => handleAllergiesChange(allergy)}
                          disabled={isButtonDisabled}
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
                    value={onboardingData.avoid_foods || ""}
                    onChange={(e) => handleChange("avoid_foods", e.target.value)}
                    placeholder="List any specific foods you want to avoid"
                    rows={3}
                    disabled={isButtonDisabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Budget Preference</Label>
                  <RadioGroup
                    value={onboardingData.budget_preference || "medium"}
                    onValueChange={(value: BudgetEnum) => handleChange("budget_preference", value)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
                    disabled={isButtonDisabled}
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
                    value={onboardingData.preparation_time_preference || "moderate"}
                    onValueChange={(value: PrepTimeEnum) => handleChange("preparation_time_preference", value)}
                    disabled={isButtonDisabled}
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