
import { Button } from "@/components/ui/button";
import MealPlanCard from "@/components/ui/MealPlanCard";
import { Calendar } from "lucide-react";

// Mock data for today's meals
const todayMeals = [
  {
    title: "Breakfast",
    date: new Date(),
    mealType: "breakfast" as const,
    items: [
      { name: "Avocado Toast with Egg", calories: 350, prepTime: 15 },
      { name: "Greek Yogurt with Berries", calories: 200, prepTime: 5 },
    ],
    totalCalories: 550,
  },
  {
    title: "Lunch",
    date: new Date(),
    mealType: "lunch" as const,
    items: [
      { name: "Grilled Chicken Salad", calories: 400, prepTime: 20 },
      { name: "Whole Grain Roll", calories: 150, prepTime: 0 },
    ],
    totalCalories: 550,
  },
  {
    title: "Dinner",
    date: new Date(),
    mealType: "dinner" as const,
    items: [
      { name: "Salmon with Roasted Vegetables", calories: 450, prepTime: 25 },
      { name: "Quinoa", calories: 150, prepTime: 15 },
    ],
    totalCalories: 600,
  },
];

const TodaysMealPlan = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Meal Plan</h2>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" /> View Full Plan
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {todayMeals.map((meal, index) => (
          <MealPlanCard key={index} {...meal} />
        ))}
      </div>
    </div>
  );
};

export default TodaysMealPlan;
