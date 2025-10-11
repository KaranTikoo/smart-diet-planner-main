import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Profile, DietTypeEnum, PrepTimeEnum, BudgetEnum } from "@/lib/supabase";

interface OnboardingStep3DietaryPreferencesProps {
  onboardingData: Partial<Profile>;
  handleChange: (field: keyof Profile, value: any) => void;
  handleAllergiesChange: (allergy: string) => void;
  isButtonDisabled: boolean;
}

const OnboardingStep3DietaryPreferences = ({
  onboardingData,
  handleChange,
  handleAllergiesChange,
  isButtonDisabled,
}: OnboardingStep3DietaryPreferencesProps) => {
  return (
    <div className="space-y-4 mt-4">
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
    </div>
  );
};

export default OnboardingStep3DietaryPreferences;