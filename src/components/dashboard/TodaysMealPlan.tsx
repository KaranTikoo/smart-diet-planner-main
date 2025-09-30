import { Button } from "@/components/ui/button";
import MealPlanCard from "@/components/ui/MealPlanCard";
import { Calendar } from "lucide-react";

interface MealItem {
  name: string;
  calories: number;
  prepTime: number;
}

interface MealPlan {
  title: string;
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: MealItem[];
  totalCalories: number;
}

interface TodaysMealPlanProps {
  meals: MealPlan[];
}

const TodaysMealPlan = ({ meals }: TodaysMealPlanProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Meal Plan</h2>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" /> View Full Plan
        </Button>
      </div>
      {meals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No meals planned for today. Add some food entries or generate a meal plan!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meals.map((meal, index) => (
            <MealPlanCard key={index} {...meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaysMealPlan;