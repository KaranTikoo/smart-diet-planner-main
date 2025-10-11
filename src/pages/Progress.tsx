import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

// Import refactored components
import ProgressHeader from "@/components/progress/ProgressHeader";
import SummaryCards from "@/components/progress/SummaryCards";
import WeightTrendChart from "@/components/progress/WeightTrendChart";
import CalorieIntakeChart from "@/components/progress/CalorieIntakeChart";
import MacronutrientBreakdown from "@/components/progress/MacronutrientBreakdown";
import RecentActivity from "@/components/progress/RecentActivity";
import AddEntryDialog from "@/components/progress/AddEntryDialog";

import { useWeightEntries } from "@/hooks/useWeightEntries";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile"; // Import useProfile

const Progress = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile(); // Fetch profile
  const [period, setPeriod] = useState("week");
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);

  const today = new Date();
  const startDate = period === "week" ? startOfWeek(today, { weekStartsOn: 1 }) : startOfMonth(today);
  const endDate = period === "week" ? endOfWeek(today, { weekStartsOn: 1 }) : endOfMonth(today);

  const { entries: weightEntries, loading: weightLoading, refetch: refetchWeightEntries } = useWeightEntries();
  const { entries: foodEntries, loading: foodLoading, refetch: refetchFoodEntries } = useFoodEntries();

  const handleEntryAdded = () => {
    refetchWeightEntries();
    refetchFoodEntries();
  };

  // Filter and process data based on the selected period
  const filteredWeightEntries = weightEntries.filter(entry => {
    const entryDate = new Date(entry.entry_date);
    return entryDate >= startDate && entryDate <= endDate;
  });

  const filteredFoodEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.entry_date);
    return entryDate >= startDate && entryDate <= endDate;
  });

  // Generate data for charts
  const chartDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weightChartData = chartDays.map(day => {
    const formattedDay = format(day, 'MMM dd');
    const entryForDay = filteredWeightEntries.find(entry => format(new Date(entry.entry_date), 'MMM dd') === formattedDay);
    return {
      day: formattedDay,
      weight: entryForDay ? entryForDay.weight : null, // Use null for missing data points
    };
  }).filter(data => data.weight !== null); // Filter out days with no weight entries

  const calorieChartData = chartDays.map(day => {
    const formattedDay = format(day, 'MMM dd');
    const caloriesForDay = filteredFoodEntries
      .filter(entry => format(new Date(entry.entry_date), 'MMM dd') === formattedDay)
      .reduce((sum, entry) => sum + entry.calories, 0);
    return {
      day: formattedDay,
      calories: caloriesForDay,
    };
  });

  // Calculate summary metrics
  const currentWeight = filteredWeightEntries.length > 0 
    ? filteredWeightEntries.sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())[0].weight
    : 0;

  const initialWeight = filteredWeightEntries.length > 0 
    ? filteredWeightEntries.sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())[0].weight
    : 0;
  
  const weightChange = currentWeight !== 0 && initialWeight !== 0 
    ? parseFloat((currentWeight - initialWeight).toFixed(1))
    : 0;
  const isWeightLoss = weightChange < 0;

  const totalCaloriesConsumed = filteredFoodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const averageCalories = chartDays.length > 0 ? Math.round(totalCaloriesConsumed / chartDays.length) : 0;

  const totalProtein = filteredFoodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const totalCarbs = filteredFoodEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFat = filteredFoodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);

  const averageMacros = {
    carbs: chartDays.length > 0 ? Math.round(totalCarbs / chartDays.length) : 0,
    protein: chartDays.length > 0 ? Math.round(totalProtein / chartDays.length) : 0,
    fat: chartDays.length > 0 ? Math.round(totalFat / chartDays.length) : 0,
  };

  // --- Goal Progress Calculation ---
  let goalProgressPercentage = 0;
  let goalProgressText = "N/A";
  let goalTypeText = "Not set";

  if (profile && profile.goal_type && profile.goal_weight !== null) {
    goalTypeText = profile.goal_type.replace(/_/g, ' ');
    const targetWeight = profile.goal_weight;

    if (initialWeight !== 0 && currentWeight !== 0) {
      if (profile.goal_type === "lose_weight") {
        if (initialWeight <= targetWeight) { // Handle invalid or already met goal
          goalProgressText = "Goal met or invalid";
          goalProgressPercentage = 100;
        } else {
          const totalChangeNeeded = initialWeight - targetWeight;
          const actualChange = initialWeight - currentWeight;
          if (totalChangeNeeded > 0) {
            goalProgressPercentage = Math.round((actualChange / totalChangeNeeded) * 100);
            goalProgressText = `${Math.max(0, goalProgressPercentage)}%`;
          } else {
            goalProgressText = "Goal invalid (no change needed)";
          }
        }
      } else if (profile.goal_type === "gain_weight") {
        if (initialWeight >= targetWeight) { // Handle invalid or already met goal
          goalProgressText = "Goal met or invalid";
          goalProgressPercentage = 100;
        } else {
          const totalChangeNeeded = targetWeight - initialWeight;
          const actualChange = currentWeight - initialWeight;
          if (totalChangeNeeded > 0) {
            goalProgressPercentage = Math.round((actualChange / totalChangeNeeded) * 100);
            goalProgressText = `${Math.max(0, goalProgressPercentage)}%`;
          } else {
            goalProgressText = "Goal invalid (no change needed)";
          }
        }
      } else if (profile.goal_type === "maintain_weight") {
        const maintenanceRange = 1; // +/- 1kg for maintenance
        if (currentWeight >= initialWeight - maintenanceRange && currentWeight <= initialWeight + maintenanceRange) {
          goalProgressText = "Maintaining";
          goalProgressPercentage = 100;
        } else {
          goalProgressText = "Off track";
          goalProgressPercentage = Math.round(100 - (Math.abs(currentWeight - initialWeight) / initialWeight) * 100); // Simple deviation
        }
      }
    } else {
      goalProgressText = "No weight entries";
    }
  } else if (profile && (!profile.goal_type || profile.goal_weight === null)) {
    goalProgressText = "Set a goal in settings";
    goalTypeText = "Not set";
  }
  // --- End Goal Progress Calculation ---

  const dailyCalorieGoal = profile?.daily_calorie_goal || 2000; // Get from profile or default

  const handleAddEntry = () => {
    setIsAddEntryDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Progress Header */}
        <ProgressHeader 
          period={period} 
          setPeriod={setPeriod} 
          onAddEntry={handleAddEntry} 
        />

        {/* Summary Cards */}
        <SummaryCards 
          currentWeight={currentWeight} 
          weightChange={weightChange}
          isWeightLoss={isWeightLoss}
          averageCalories={averageCalories}
          dailyCalorieGoal={dailyCalorieGoal} // Pass new prop
          goalProgressPercentage={goalProgressPercentage}
          goalProgressText={goalProgressText}
          goalTypeText={goalTypeText}
        />

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeightTrendChart data={weightChartData} />
          <CalorieIntakeChart data={calorieChartData} />
        </div>

        {/* Macros and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MacronutrientBreakdown macros={averageMacros} caloriesAvg={averageCalories} />
          <RecentActivity 
            entries={
              [...filteredWeightEntries.map(e => ({
                day: format(new Date(e.entry_date), 'MMM dd'),
                weight: e.weight,
                calories: 0, protein: 0, carbs: 0, fat: 0, // Weight entries don't have macros
              })),
              ...filteredFoodEntries.map(e => ({
                day: format(new Date(e.entry_date), 'MMM dd'),
                calories: e.calories,
                protein: e.protein || 0,
                carbs: e.carbs || 0,
                fat: e.fat || 0,
                weight: 0, // Food entries don't have weight
              }))]
              .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()) // Sort by date descending
            } 
          />
        </div>

        {/* Add Entry Dialog */}
        <AddEntryDialog
          isOpen={isAddEntryDialogOpen}
          onOpenChange={setIsAddEntryDialogOpen}
          onEntryAdded={handleEntryAdded}
        />
      </div>
    </MainLayout>
  );
};

export default Progress;