import { useState, useEffect } from "react";
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
import { Profile, GenderEnum, ActivityLevelEnum, GoalTypeEnum } from "@/lib/supabase";

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, createProfile, updateProfile, loading: profileLoading, isSaving } = useProfile();
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
  });

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
      });
    }
  }, [profile, profileLoading]);

  const handleChange = (field: keyof Profile, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // The user object is guaranteed to be present here because RequireAuth protects this route.
    // If for some reason user is null, it indicates a deeper issue with auth state management
    // or a bypass of RequireAuth, which should be addressed at that level.

    if (currentStep === 1 && (!onboardingData.full_name || !onboardingData.age || !onboardingData.gender || !onboardingData.height || !onboardingData.current_weight)) {
      toast.error("Please fill all basic information fields.");
      return;
    }
    if (currentStep === 2 && (!onboardingData.goal_type || !onboardingData.activity_level || (onboardingData.goal_type === "lose_weight" && !onboardingData.goal_weight))) {
      toast.error("Please fill all goals and activity fields.");
      return;
    }

    try {
      const profileDataToSave: Omit<Profile, 'id' | 'created_at' | 'updated_at'> = {
        email: user!.email || "", // user is guaranteed to be non-null here
        full_name: onboardingData.full_name || null,
        age: onboardingData.age || null,
        gender: onboardingData.gender as GenderEnum || null,
        height: onboardingData.height || null,
        current_weight: onboardingData.current_weight || null,
        goal_type: onboardingData.goal_type as GoalTypeEnum || null,
        goal_weight: onboardingData.goal_weight || null,
        activity_level: onboardingData.activity_level as ActivityLevelEnum || null,
        daily_calorie_goal: onboardingData.daily_calorie_goal || 2000, // Provide a default if null
      };

      if (profile) {
        await updateProfile(profileDataToSave);
      } else {
        await createProfile(profileDataToSave);
      }
      
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
              <TabsTrigger value="step-1" onClick={() => setCurrentStep(1)}>
                Basic Information
              </TabsTrigger>
              <TabsTrigger value="step-2" onClick={() => setCurrentStep(2)}>
                Goals & Activity
              </TabsTrigger>
              <TabsTrigger value="step-3" onClick={() => setCurrentStep(3)}>
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={onboardingData.gender || ""}
                    onValueChange={(value: GenderEnum) => handleChange("gender", value)}
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
                    value={onboardingData.height || ""}
                    onChange={(e) => handleChange("height", parseInt(e.target.value) || null)}
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
                    value={onboardingData.current_weight || ""}
                    onChange={(e) => handleChange("current_weight", parseFloat(e.target.value) || null)}
                    placeholder="Enter your weight in kg"
                    min="30"
                    max="300"
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
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>How would you describe your activity level?</Label>
                  <Select
                    value={onboardingData.activity_level || "moderately_active"}
                    onValueChange={(value: ActivityLevelEnum) => handleChange("activity_level", value)}
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
              </div>
            </TabsContent>
            
            {/* Step 3: Dietary Preferences */}
            <TabsContent value="step-3" className="space-y-4 mt-4">
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
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSaving}
          >
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep} disabled={isSaving}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default OnboardingForm;