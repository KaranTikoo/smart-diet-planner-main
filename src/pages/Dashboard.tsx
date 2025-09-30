import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DietStats from "@/components/dashboard/DietStats";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TodaysMealPlan from "@/components/dashboard/TodaysMealPlan";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import AddFoodEntryDialog from "@/components/dashboard/AddFoodEntryDialog";
import AddWaterEntryDialog from "@/components/dashboard/AddWaterEntryDialog"; // Import the new dialog
import { useProfile } from "@/hooks/useProfile";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useWaterIntake } from "@/hooks/useWaterIntake";
import { useAuth } from "@/providers/AuthProvider"; // Corrected import path for useAuth
import { format } from "date-fns";
import { MealPlan } from "@/lib/supabase"; // Import MealPlan type

const Dashboard = () => {
  const { user } = useAuth(); // Use useAuth from AuthProvider
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { entries: foodEntries, loading: foodEntriesLoading, refetch: refetchFoodEntries } = useFoodEntries(today);
  const { entries: waterEntries, loading: waterEntriesLoading, refetch: refetchWaterEntries } = useWaterIntake(today);
  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);
  const [isAddWaterDialogOpen, setIsAddWaterDialogOpen] = useState(false); // New state for water dialog

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

  // Calculate today's stats
  const caloriesConsumed = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const proteinConsumed = foodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const carbsConsumed = foodEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const fatConsumed = foodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);
  const waterConsumedMl = waterEntries.reduce((sum, entry) => sum + entry.amount_ml, 0);
  const waterConsumedOz = Math.round(waterConsumedMl * 0.033814); // Convert ml to oz

  const caloriesGoal = profile?.daily_calorie_goal || 2000; // Default goal
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
  };

  // Group food entries by meal type for TodaysMealPlan
  const mealsForToday: MealPlan[] = [
    { title: "Breakfast", date: new Date(), mealType: "breakfast", items: [], totalCalories: 0 },
    { title: "Lunch", date: new Date(), mealType: "lunch", items: [], totalCalories: 0 },
    { title: "Dinner", date: new Date(), mealType: "dinner", items: [], totalCalories: 0 },
    { title: "Snack", date: new Date(), mealType: "snack", items: [], totalCalories: 0 },
  ];

  foodEntries.forEach(entry => {
    const mealTypeIndex = mealsForToday.findIndex(meal => meal.mealType === entry.meal_type);
    if (mealTypeIndex !== -1) {
      mealsForToday[mealTypeIndex].items.push({
        name: entry.food_name,
        calories: entry.calories,
        prepTime: 0, // Prep time not available in food_entries, default to 0
      });
      mealsForToday[mealTypeIndex].totalCalories += entry.calories;
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
        <TodaysMealPlan meals={mealsForToday} />

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
      </div>
    </MainLayout>
  );
};

export default Dashboard;