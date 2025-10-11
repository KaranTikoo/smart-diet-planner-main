import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Profile, ActivityLevelEnum, GoalTypeEnum } from "@/lib/supabase";

interface OnboardingStep2GoalsActivityProps {
  onboardingData: Partial<Profile>;
  handleChange: (field: keyof Profile, value: any) => void;
  isButtonDisabled: boolean;
}

const OnboardingStep2GoalsActivity = ({
  onboardingData,
  handleChange,
  isButtonDisabled,
}: OnboardingStep2GoalsActivityProps) => {
  return (
    <div className="space-y-4 mt-4">
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
    </div>
  );
};

export default OnboardingStep2GoalsActivity;