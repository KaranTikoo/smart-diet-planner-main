import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Profile, DietTypeEnum, PrepTimeEnum, CookingSkillEnum, BudgetEnum } from "@/lib/supabase";

interface DietaryPreferencesSectionProps {
  profile: Partial<Profile>;
  onProfileChange: (field: keyof Profile, value: any) => void;
  onAllergiesChange: (allergy: string) => void;
  isGuest: boolean;
  isSaving: boolean;
}

const DietaryPreferencesSection = ({
  profile,
  onProfileChange,
  onAllergiesChange,
  isGuest,
  isSaving,
}: DietaryPreferencesSectionProps) => {
  return (
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
              value={profile.diet_type || "no_restrictions"}
              onValueChange={(value: DietTypeEnum) => onProfileChange("diet_type", value)}
              disabled={isGuest || isSaving}
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
                    checked={(profile.allergies || []).includes(allergy)}
                    onCheckedChange={() => onAllergiesChange(allergy)}
                    disabled={isGuest || isSaving}
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
              value={profile.avoid_foods || ""}
              onChange={(e) => onProfileChange("avoid_foods", e.target.value)}
              placeholder="List any specific foods you want to avoid"
              rows={3}
              disabled={isGuest || isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label>How many meals do you prefer per day?</Label>
            <div className="pt-2">
              <Slider
                value={[profile.meals_per_day || 3]}
                min={2}
                max={6}
                step={1}
                onValueChange={(value) => onProfileChange("meals_per_day", value[0])}
                disabled={isGuest || isSaving}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
            </div>
            <p className="text-center mt-2">{profile.meals_per_day || 3} meals per day</p>
          </div>

          <div className="space-y-2">
            <Label>Snacks per day</Label>
            <div className="pt-2">
              <Slider
                value={[profile.snacks_per_day || 1]}
                min={0}
                max={3}
                step={1}
                onValueChange={(value) => onProfileChange("snacks_per_day", value[0])}
                disabled={isGuest || isSaving}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
              </div>
            </div>
            <p className="text-center mt-2">{profile.snacks_per_day || 1} snacks per day</p>
          </div>
          
          <div className="space-y-2">
            <Label>Cooking Time Preference</Label>
            <Select
              value={profile.preparation_time_preference || "moderate"}
              onValueChange={(value: PrepTimeEnum) => onProfileChange("preparation_time_preference", value)}
              disabled={isGuest || isSaving}
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

          <div className="space-y-2">
            <Label>Cooking Skill Level</Label>
            <Select
              value={profile.cooking_skill_level || "beginner"}
              onValueChange={(value: CookingSkillEnum) => onProfileChange("cooking_skill_level", value)}
              disabled={isGuest || isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Budget Preference</Label>
            <RadioGroup
              value={profile.budget_preference || "medium"}
              onValueChange={(value: BudgetEnum) => onProfileChange("budget_preference", value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
              disabled={isGuest || isSaving}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DietaryPreferencesSection;