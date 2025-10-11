import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Profile, GenderEnum } from "@/lib/supabase";

interface OnboardingStep1BasicInfoProps {
  onboardingData: Partial<Profile>;
  handleChange: (field: keyof Profile, value: any) => void;
  isButtonDisabled: boolean;
}

const OnboardingStep1BasicInfo = ({
  onboardingData,
  handleChange,
  isButtonDisabled,
}: OnboardingStep1BasicInfoProps) => {
  return (
    <div className="space-y-4 mt-4">
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
    </div>
  );
};

export default OnboardingStep1BasicInfo;