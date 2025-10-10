import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DietStats from "@/components/dashboard/DietStats";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TodaysMealPlan, { MealPlan as TodaysMealPlanProps } from "@/components/dashboard/TodaysMealPlan"; // Import component's MealPlan type
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import AddFoodEntryDialog from "@/components/dashboard/AddFoodEntryDialog";
import AddWaterEntryDialog from "@/components/dashboard/AddWaterEntryDialog"; // Import the new dialog
import MealDetailDialog from "@/components/meal-planner/MealDetailDialog"; // Import MealDetailDialog
import { useProfile } from "@/hooks/useProfile";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useWaterIntake } from "@/hooks/useWaterIntake";
import { useMealPlans } from "@/hooks/useMealPlans"; // Import useMealPlans
import { useAuth } from "@/providers/AuthProvider"; // Corrected import path for useAuth
import { format } from "date-fns"; // Import format for date formatting
import { MealTypeEnum, MealPlan as SupabaseMealPlan } from "@/lib/supabase"; // Import MealTypeEnum and SupabaseMealPlan

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
  const { mealPlans, loading: mealPlansLoading, refetch: refetchMealPlans } = useMealPlans(today); // Fetch meal plans for today

  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);
  const [isAddWaterDialogOpen, setIsAddWaterDialogOpen] = useState(false);
  const [selectedMealForDetails, setSelectedMealForDetails] = useState<SupabaseMealPlan | null>(null); // State for meal details dialog

  const handleAddFoodEntry = () => {
    setIsAddFoodDialogOpen(true);
  };

  const handleAddWaterEntry = () => {
    setIsAddWaterDialogOpen(true);
  };

  const handleFoodEntryAdded = () => {
    refetchFoodEntries();
  };

  const handleWaterEntryAdded = () => {
    refetchWaterEntries();
  };

  const handleMealCardClick = (mealType: MealTypeEnum) => {
    const meal = mealPlans.find(plan => plan.meal_type === mealType);
    if (meal && meal.foods && (meal.foods as any[]).length > 0) {
      setSelectedMealForDetails(meal);
    } else {
      // If no meal plan exists for this type, but there are food entries, show those
      const foodEntriesForMealType = foodEntries.filter(entry => entry.meal_type === mealType);
      if (foodEntriesForMealType.length > 0) {
        // Create a mock SupabaseMealPlan from food entries to display in the dialog
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
            prepTime: 0, // Not available in food_entries
            image: "/placeholder.svg", // Placeholder image
            ingredients: [], // Not available in food_entries
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

  // Calculate today's stats
  const caloriesConsumed = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const proteinConsumed = foodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const carbsConsumed = foodEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const fatConsumed = foodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);
  const waterConsumedMl = waterEntries.reduce((sum, entry) => sum + entry.amount_ml, 0);
  const waterConsumedOz = Math.round(waterConsumedMl * 0.033814); // Convert ml to oz

  const caloriesGoal = profile?.daily_calorie_goal || 2000; // Use profile's daily_calorie_goal or default to 2000
  const waterGoalOz = 64; // Default water goal in oz (approx 1.9 liters)

  // Calculate macronutrient percentages (assuming 4 cal/g protein/carbs, 9 cal/g fat)
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
    waterEntries: waterEntries, // Pass waterEntries here
  };

  // Prepare meals for TodaysMealPlan component
  const mealsForTodayDisplay: TodaysMealPlanProps[] = [
    { title: "Breakfast", date: new Date(), mealType: "breakfast", items: [], totalCalories: 0 },
    { title: "Lunch", date: new Date(), mealType: "lunch", items: [], totalCalories: 0 },
    { title: "Dinner", date: new Date(), mealType: "dinner", items: [], totalCalories: 0 },
    { title: "Snack", date: new Date(), mealType: "snack", items: [], totalCalories: 0 },
  ];

  // Populate mealsForTodayDisplay from fetched mealPlans
  mealPlans.forEach(plan => {
    const mealTypeIndex = mealsForTodayDisplay.findIndex(meal => meal.mealType === plan.meal_type);
    if (mealTypeIndex !== -1) {
      mealsForTodayDisplay[mealTypeIndex] = mapSupabaseMealPlanToCardProps(plan);
    }
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Dashboard Header */}
        <DashboardHeader 
          title="Dashboard"
          description={`Welcome back, ${profile?.full_name || user?.email || "there"}! Here's your nutrition summary.`}
          buttonText="Add Food Entry"
          onButtonClick={handleAddFoodEntry}
        />

        {/* Diet Stats */}
        <DietStats {...dietStats} onAddWater={handleAddWaterEntry} />

        {/* Today's Meals */}
        <TodaysMealPlan meals={mealsForTodayDisplay} onMealCardClick={handleMealCardClick} />

        {/* Weekly Progress - Placeholder for now, will be connected to real data later */}
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

        {/* Add Food Entry Dialog */}
        <AddFoodEntryDialog 
          isOpen={isAddFoodDialogOpen} 
          onOpenChange={setIsAddFoodDialogOpen} 
          onEntryAdded={handleFoodEntryAdded}
        />

        {/* Add Water Entry Dialog (New) */}
        <AddWaterEntryDialog
          isOpen={isAddWaterDialogOpen}
          onOpenChange={setIsAddWaterDialogOpen}
          onEntryAdded={handleWaterEntryAdded}
        />

        {/* Meal Details Dialog */}
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