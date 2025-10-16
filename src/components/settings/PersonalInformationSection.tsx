import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Profile, GenderEnum, ActivityLevelEnum, GoalTypeEnum } from "@/lib/supabase";

interface PersonalInformationSectionProps {
  profile: Partial<Profile>;
  onProfileChange: (field: keyof Profile, value: any) => void;
  isGuest: boolean;
  isSaving: boolean;
}

const PersonalInformationSection = ({
  profile,
  onProfileChange,
  isGuest,
  isSaving,
}: PersonalInformationSectionProps) => {

  return (
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
              value={profile.full_name || ""}
              onChange={(e) => onProfileChange("full_name", e.target.value)}
              placeholder="Enter your name"
              disabled={isGuest || isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={profile.age || ""}
              onChange={(e) => onProfileChange("age", parseInt(e.target.value) || null)}
              placeholder="Enter your age"
              min="18"
              max="100"
              disabled={isGuest || isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={profile.gender || ""}
              onValueChange={(value: GenderEnum) => onProfileChange("gender", value)}
              className="flex gap-4"
              disabled={isGuest || isSaving}
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
              value={profile.height || ""}
              onChange={(e) => onProfileChange("height", parseInt(e.target.value) || null)}
              placeholder="Enter your height in cm"
              min="100"
              max="250"
              disabled={isGuest || isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Current Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={profile.current_weight || ""}
              onChange={(e) => onProfileChange("current_weight", parseFloat(e.target.value) || null)}
              placeholder="Enter your weight in kg"
              min="30"
              max="300"
              disabled={isGuest || isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetWeight">Target Weight (kg)</Label>
            <Input
              id="targetWeight"
              type="number"
              value={profile.goal_weight || ""}
              onChange={(e) => onProfileChange("goal_weight", parseFloat(e.target.value) || null)}
              placeholder="Enter your target weight"
              min="30"
              max="300"
              disabled={isGuest || isSaving}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>What's your main goal?</Label>
            <RadioGroup
              value={profile.goal_type || "lose_weight"}
              onValueChange={(value: GoalTypeEnum) => onProfileChange("goal_type", value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
              disabled={isGuest || isSaving}
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
              value={profile.activity_level || "moderately_active"}
              onValueChange={(value: ActivityLevelEnum) => onProfileChange("activity_level", value)}
              disabled={isGuest || isSaving}
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
              value={profile.daily_calorie_goal || ""}
              placeholder="Calculated automatically"
              disabled // This field is now disabled and auto-calculated
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterGoalMl">Daily Water Goal (ml)</Label>
            <Input
              id="waterGoalMl"
              type="number"
              value={profile.water_goal_ml || ""}
              onChange={(e) => onProfileChange("water_goal_ml", parseInt(e.target.value) || null)}
              placeholder="e.g., 2000"
              min="0"
              disabled={isGuest || isSaving}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationSection;