import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DietStats from "@/components/dashboard/DietStats";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TodaysMealPlan from "@/components/dashboard/TodaysMealPlan";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import AddFoodEntryDialog from "@/components/dashboard/AddFoodEntryDialog";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load user profile data
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Initialize diet stats data to zero
  const dietStats = {
    caloriesConsumed: 0,
    caloriesGoal: 2000, // Keep goal as a target
    carbsPercentage: 0,
    proteinPercentage: 0,
    fatPercentage: 0,
    waterConsumed: 0,
    waterGoal: 64, // Keep goal as a target
  };

  const handleAddFoodEntry = () => {
    setIsAddFoodDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Dashboard Header */}
        <DashboardHeader 
          title="Dashboard"
          description={`Welcome back, ${userProfile?.name || "there"}! Here's your nutrition summary.`}
          buttonText="Add Food Entry"
          onButtonClick={handleAddFoodEntry}
        />

        {/* Diet Stats */}
        <DietStats {...dietStats} />

        {/* Today's Meals - pass an empty array initially */}
        <TodaysMealPlan meals={[]} />

        {/* Weekly Progress - pass zeroed data initially */}
        <WeeklyProgress 
          nutritionProgress={{ calories: 0, protein: 0, hydration: 0 }}
          activityProgress={{ steps: 0, activeMinutes: 0, workouts: 0 }}
          avgWorkoutTime="0 hrs"
          weeklyProgress="0 lbs"
          streak="0 days"
        />

        {/* Add Food Entry Dialog */}
        <AddFoodEntryDialog 
          isOpen={isAddFoodDialogOpen} 
          onOpenChange={setIsAddFoodDialogOpen} 
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;