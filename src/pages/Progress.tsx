import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import refactored components
import ProgressHeader from "@/components/progress/ProgressHeader";
import SummaryCards from "@/components/progress/SummaryCards";
import WeightTrendChart from "@/components/progress/WeightTrendChart";
import CalorieIntakeChart from "@/components/progress/CalorieIntakeChart";
import MacronutrientBreakdown from "@/components/progress/MacronutrientBreakdown";
import RecentActivity from "@/components/progress/RecentActivity";
import AddEntryDialog from "@/components/progress/AddEntryDialog";
import { weeklyData, generateMonthlyData } from "@/components/progress/mockData";

const Progress = () => {
  const [period, setPeriod] = useState("week");
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: "",
    calories: "",
    date: new Date().toISOString().split('T')[0],
  });
  
  // Generate monthly data
  const monthlyData = generateMonthlyData();
  
  // Calculate metrics from the (initially zeroed) data
  const currentData = period === "week" ? weeklyData : monthlyData;
  
  const weightChange = currentData.length > 1 
    ? parseFloat((currentData[currentData.length - 1].weight - currentData[0].weight).toFixed(1))
    : 0;
  const isWeightLoss = weightChange < 0;
  
  const totalCalories = currentData.reduce((sum, day) => sum + day.calories, 0);
  const averageCalories = currentData.length > 0 ? Math.round(totalCalories / currentData.length) : 0;
  
  const averageMacros = {
    carbs: currentData.length > 0 ? Math.round(currentData.reduce((sum, day) => sum + day.carbs, 0) / currentData.length) : 0,
    protein: currentData.length > 0 ? Math.round(currentData.reduce((sum, day) => sum + day.protein, 0) / currentData.length) : 0,
    fat: currentData.length > 0 ? Math.round(currentData.reduce((sum, day) => sum + day.fat, 0) / currentData.length) : 0,
  };

  const handleAddEntry = () => {
    setIsAddEntryDialogOpen(true);
  };

  const handleSaveEntry = () => {
    // In a real app, you would save this to your database
    toast.success("Progress entry saved successfully");
    
    // Reset form and close dialog
    setNewEntry({
      weight: "",
      calories: "",
      date: new Date().toISOString().split('T')[0],
    });
    setIsAddEntryDialogOpen(false);
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
          currentWeight={currentData.length > 0 ? currentData[currentData.length - 1].weight : 0} 
          weightChange={weightChange}
          isWeightLoss={isWeightLoss}
          averageCalories={averageCalories}
        />

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeightTrendChart data={currentData} />
          <CalorieIntakeChart data={currentData} />
        </div>

        {/* Macros and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MacronutrientBreakdown macros={averageMacros} caloriesAvg={averageCalories} />
          <RecentActivity entries={currentData} />
        </div>

        {/* Add Entry Dialog */}
        <AddEntryDialog
          isOpen={isAddEntryDialogOpen}
          onOpenChange={setIsAddEntryDialogOpen}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onSave={handleSaveEntry}
        />
      </div>
    </MainLayout>
  );
};

export default Progress;