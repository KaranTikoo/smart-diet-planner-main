import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DietStats from "@/components/dashboard/DietStats";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TodaysMealPlan, { MealPlan as TodaysMealPlanProps } from "@/components/dashboard/TodaysMealPlan"; // Import component's MealPlan type
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import AddFoodEntryDialog from "@/components/dashboard/AddFoodEntryDialog";
import AddWaterEntryDialog from "@/components/dashboard/AddWaterEntryDialog";
import AddCustomFoodDialog from "@/components/food-search/AddCustomFoodDialog"; // New import
import MealDetailDialog from "@/components/meal-planner/MealDetailDialog";
import { useProfile } from "@/hooks/useProfile";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useWaterIntake } from "@/hooks/useWaterIntake";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useAuth } from "@/providers/AuthProvider";
import { format } from "date-fns";
import { MealTypeEnum, MealPlan as SupabaseMealPlan } from "@/lib/supabase";
import { Button } from "@/components/ui/button"; // Ensure Button is imported
import { PlusCircle } from "lucide-react"; // Ensure PlusCircle is imported

// Helper to map Supabase MealPlan to what TodaysMealPlanProps expects
const mapSupabaseMealPlanToCardProps = (supabasePlan: SupabaseMealPlan): TodaysMealPlanProps => {
  return {
    title: supabasePlan.meal_type.charAt(0).toUpperCase() + supabasePlan.meal_type.slice(1), // Capitalize meal type
    date: new Date(supabasePlan.plan_date),
    mealType: supabasePlan.meal_type,
    items: (supabasePlan.foods as any[] || []).map(food => ({
      name: food.name,
      calories: food.calories,
      prepTime: food.prepTime || 0,
    })),
    totalCalories: supabasePlan.total_calories || 0,
  };
};

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { entries: foodEntries, loading: foodEntriesLoading, refetch: refetchFoodEntries } = useFoodEntries(today);
  const { entries: waterEntries, loading: waterEntriesLoading, refetch: refetchWaterEntries } = useWaterIntake(today);
  const { mealPlans, loading: mealPlansLoading, refetch: refetchMealPlans } = useMealPlans(today);

  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);
  const [isAddWaterDialogOpen, setIsAddWaterDialogOpen] = useState(false);
  const [isAddCustomFoodDialogOpen, setIsAddCustomFoodDialogOpen] = useState(false); // New state
  const [selectedMealForDetails, setSelectedMealForDetails] = useState<SupabaseMealPlan | null>(null);

  const handleAddFoodEntry = () => {
    setIsAddFoodDialogOpen(true);
  };

  const handleAddWaterEntry = () => {
    setIsAddWaterDialogOpen(true);
  };

  const handleAddCustomFood = () => { // New handler
    setIsAddCustomFoodDialogOpen(true);
  };

  const handleFoodEntryAdded = () => {
    refetchFoodEntries();
  };

  const handleWaterEntryAdded = () => {
    refetchWaterEntries();
  };

  const handleCustomFoodAdded = () => { // New handler
    // Optionally refetch food entries if you want custom foods to immediately appear in a food entry selection
    // For now, just close the dialog.
  };

  const handleMealCardClick = (mealType: MealTypeEnum) => {
    const meal = mealPlans.find(plan => plan.meal_type === mealType);
    if (meal && meal.foods && (meal.foods as any[]).length > 0) {
      setSelectedMealForDetails(meal);
    } else {
      const foodEntriesForMealType = foodEntries.filter(entry => entry.meal_type === mealType);
      if (foodEntriesForMealType.length > 0) {
        const mockMealPlan: SupabaseMealPlan = {
          id: "mock-" + mealType,
          user_id: user?.id || "",
          plan_name: mealType.charAt(0).toUpperCase() + mealType.slice(1) + " Entries",
          plan_date: today,
          meal_type: mealType,
          foods: foodEntriesForMealType.map(entry => ({
            name: entry.food_name,
            calories: entry.calories,
            protein: entry.protein || 0,
            carbs: entry.carbs || 0,
            fat: entry.fat || 0,
            serving_size: entry.serving_size || "1 serving",
            serving_quantity: entry.serving_quantity || 1,
            prepTime: 0,
            image: "/placeholder.svg",
            ingredients: [],
            description: "Manually logged food entries.",
          })),
          total_calories: foodEntriesForMealType.reduce((sum, entry) => sum + entry.calories, 0),
          prep_time: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setSelectedMealForDetails(mockMealPlan);
      } else {
        toast.info(`No ${mealType} planned or logged for today.`);
      }
    }
  };

  const caloriesConsumed = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const proteinConsumed = foodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const carbsConsumed = foodEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const fatConsumed = foodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);
  const waterConsumedMl = waterEntries.reduce((sum, entry) => sum + entry.amount_ml, 0);
  const waterConsumedOz = Math.round(waterConsumedMl * 0.033814);

  const caloriesGoal = profile?.daily_calorie_goal || 2000;
  const waterGoalMl = profile?.water_goal_ml || 2000;
  const waterGoalOz = Math.round(waterGoalMl * 0.033814);

  const totalMacroCalories = (proteinConsumed * 4) + (carbsConsumed * 4) + (fatConsumed * 9);
  const proteinPercentage = totalMacroCalories > 0 ? Math.round((proteinConsumed * 4 / totalMacroCalories) * 100) : 0;
  const carbsPercentage = totalMacroCalories > 0 ? Math.round((carbsConsumed * 4 / totalMacroCalories) * 100) : 0;
  const fatPercentage = totalMacroCalories > 0 ? Math.round((fatConsumed * 9 / totalMacroCalories) * 100) : 0;

  const dietStats = {
    caloriesConsumed,
    caloriesGoal,
    carbsPercentage,
    proteinPercentage,
    fatPercentage,
    waterConsumed: waterConsumedOz,
    waterGoal: waterGoalOz,
    waterEntries: waterEntries,
  };

  const mealsForTodayDisplay: TodaysMealPlanProps[] = [
    { title: "Breakfast", date: new Date(), mealType: "breakfast", items: [], totalCalories: 0 },
    { title: "Lunch", date: new Date(), mealType: "lunch", items: [], totalCalories: 0 },
    { title: "Dinner", date: new Date(), mealType: "dinner", items: [], totalCalories: 0 },
    { title: "Snack", date: new Date(), mealType: "snack", items: [], totalCalories: 0 },
  ];

  mealPlans.forEach(plan => {
    const mealTypeIndex = mealsForTodayDisplay.findIndex(meal => meal.mealType === plan.meal_type);
    if (mealTypeIndex !== -1) {
      mealsForTodayDisplay[mealTypeIndex] = mapSupabaseMealPlanToCardProps(plan);
    }
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              {`Welcome back, ${profile?.full_name || user?.email || "there"}! Here's your nutrition summary.`}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleAddCustomFood}> {/* New button */}
              <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Food
            </Button>
            <Button onClick={handleAddFoodEntry}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Food Entry
            </Button>
          </div>
        </div>

        <DietStats {...dietStats} onAddWater={handleAddWaterEntry} />

        <TodaysMealPlan meals={mealsForTodayDisplay} onMealCardClick={handleMealCardClick} />

        <WeeklyProgress 
          nutritionProgress={{ 
            calories: caloriesGoal > 0 ? Math.min(100, Math.round((caloriesConsumed / caloriesGoal) * 100)) : 0, 
            protein: proteinPercentage, 
            hydration: waterGoalOz > 0 ? Math.min(100, Math.round((waterConsumedOz / waterGoalOz) * 100)) : 0 
          }}
          activityProgress={{ steps: 0, activeMinutes: 0, workouts: 0 }}
          avgWorkoutTime="0 hrs"
          weeklyProgress="0 lbs"
          streak="0 days"
        />

        <AddFoodEntryDialog 
          isOpen={isAddFoodDialogOpen} 
          onOpenChange={setIsAddFoodDialogOpen} 
          onEntryAdded={handleFoodEntryAdded}
        />

        <AddWaterEntryDialog
          isOpen={isAddWaterDialogOpen}
          onOpenChange={setIsAddWaterDialogOpen}
          onEntryAdded={handleWaterEntryAdded}
        />

        {/* New: Add Custom Food Dialog */}
        <AddCustomFoodDialog
          isOpen={isAddCustomFoodDialogOpen}
          onOpenChange={setIsAddCustomFoodDialogOpen}
          onFoodAdded={handleCustomFoodAdded}
        />

        <MealDetailDialog
          isOpen={!!selectedMealForDetails}
          onClose={() => setSelectedMealForDetails(null)}
          meal={selectedMealForDetails}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;