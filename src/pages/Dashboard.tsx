
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

  // Mock diet stats data
  const dietStats = {
    caloriesConsumed: 1700,
    caloriesGoal: 2000,
    carbsPercentage: 45,
    proteinPercentage: 30,
    fatPercentage: 25,
    waterConsumed: 48,
    waterGoal: 64,
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

        {/* Today's Meals */}
        <TodaysMealPlan />

        {/* Weekly Progress */}
        <WeeklyProgress />

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
