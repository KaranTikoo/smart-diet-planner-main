import { Button } from "@/components/ui/button";
import MealPlanCard from "@/components/ui/MealPlanCard";
import { Calendar } from "lucide-react";
import { MealTypeEnum } from "@/lib/supabase"; // Import MealTypeEnum
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { format } from "date-fns"; // Import format for date formatting

interface MealItem {
  name: string;
  calories: number;
  prepTime: number;
}

// Define the MealPlan interface for the component's props
export interface MealPlan {
  title: string;
  date: Date;
  mealType: MealTypeEnum;
  items: MealItem[];
  totalCalories: number;
}

interface TodaysMealPlanProps {
  meals: MealPlan[];
  onMealCardClick: (mealType: MealTypeEnum) => void; // New prop for handling card clicks
}

const TodaysMealPlan = ({ meals, onMealCardClick }: TodaysMealPlanProps) => {
  const navigate = useNavigate();

  const handleViewFullPlan = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    navigate(`/meal-planner?date=${today}`);
  };

  // Ensure all meal types are represented, even if empty
  const mealTypes: MealTypeEnum[] = ["breakfast", "lunch", "dinner", "snack"];
  const mealsToDisplay = mealTypes.map(type => {
    const existingMeal = meals.find(meal => meal.mealType === type);
    return existingMeal || {
      title: type.charAt(0).toUpperCase() + type.slice(1),
      date: new Date(),
      mealType: type,
      items: [],
      totalCalories: 0,
    };
  });

  const hasAnyMeals = mealsToDisplay.some(meal => meal.items.length > 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Meal Plan</h2>
        <Button variant="outline" size="sm" onClick={handleViewFullPlan}>
          <Calendar className="mr-2 h-4 w-4" /> View Full Plan
        </Button>
      </div>
      {!hasAnyMeals ? (
        <div className="text-center py-8 text-muted-foreground">
          No meals planned or logged for today. Add some food entries or generate a meal plan!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mealsToDisplay.map((meal, index) => (
            <MealPlanCard key={meal.mealType} {...meal} onClick={() => onMealCardClick(meal.mealType)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaysMealPlan;