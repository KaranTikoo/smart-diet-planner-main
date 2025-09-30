import { useState } from "react";
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

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    // Basic info
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    
    // Goals
    goal: "weight_loss",
    targetWeight: "",
    activityLevel: "moderate",
    
    // Dietary preferences
    diet: "no_restrictions",
    allergies: [] as string[],
    avoidFoods: "",
    
    // Meal preferences
    mealsPerDay: 3,
    snacksPerDay: 1,
    preparationTime: "moderate",
    cookingSkill: "beginner",
    budget: "medium",
  });

  const handleChange = (field: string, value: any) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllergiesChange = (allergy: string) => {
    setUserProfile((prev) => {
      const allergies = [...prev.allergies];
      if (allergies.includes(allergy)) {
        return { ...prev, allergies: allergies.filter((a) => a !== allergy) };
      } else {
        return { ...prev, allergies: [...allergies, allergy] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save user profile data (this would typically go to a backend)
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    
    toast.success("Profile created successfully!");
    navigate("/dashboard");
  };

  const nextStep = () => {
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
              {/* ... keep existing code (basic information form fields) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="Enter your age"
                    min="18"
                    max="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={userProfile.gender}
                    onValueChange={(value) => handleChange("gender", value)}
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
                    value={userProfile.height}
                    onChange={(e) => handleChange("height", e.target.value)}
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
                    value={userProfile.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
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
                    value={userProfile.goal}
                    onValueChange={(value) => handleChange("goal", value)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
                  >
                    <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                      <RadioGroupItem value="weight_loss" id="goal-weight-loss" />
                      <Label htmlFor="goal-weight-loss">Weight Loss</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                      <RadioGroupItem value="maintenance" id="goal-maintenance" />
                      <Label htmlFor="goal-maintenance">Maintenance</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                      <RadioGroupItem value="muscle_gain" id="goal-muscle-gain" />
                      <Label htmlFor="goal-muscle-gain">Muscle Gain</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {userProfile.goal === "weight_loss" && (
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={userProfile.targetWeight}
                      onChange={(e) => handleChange("targetWeight", e.target.value)}
                      placeholder="Enter your target weight"
                      min="30"
                      max="300"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>How would you describe your activity level?</Label>
                  <Select
                    value={userProfile.activityLevel}
                    onValueChange={(value) => handleChange("activityLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (hard daily exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>How many meals do you prefer per day?</Label>
                  <div className="pt-2">
                    <Slider
                      value={[userProfile.mealsPerDay]}
                      min={2}
                      max={6}
                      step={1}
                      onValueChange={(value) => handleChange("mealsPerDay", value[0])}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>6</span>
                    </div>
                  </div>
                  <p className="text-center mt-2">{userProfile.mealsPerDay} meals per day</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Step 3: Dietary Preferences */}
            <TabsContent value="step-3" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Dietary Preferences</Label>
                  <Select
                    value={userProfile.diet}
                    onValueChange={(value) => handleChange("diet", value)}
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
                          checked={userProfile.allergies.includes(allergy)}
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
                    value={userProfile.avoidFoods}
                    onChange={(e) => handleChange("avoidFoods", e.target.value)}
                    placeholder="List any specific foods you want to avoid"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Budget Preference</Label>
                  <RadioGroup
                    value={userProfile.budget}
                    onValueChange={(value) => handleChange("budget", value)}
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
                    value={userProfile.preparationTime}
                    onValueChange={(value) => handleChange("preparationTime", value)}
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
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit">
              Complete Setup
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default OnboardingForm;
