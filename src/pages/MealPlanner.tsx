
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MealPlanCard from "@/components/ui/MealPlanCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

// Sample meal plan data
const generateMockMealPlan = (date: Date) => {
  const breakfast = {
    title: "Breakfast",
    date,
    mealType: "breakfast" as const,
    items: [
      { name: "Greek Yogurt Parfait", calories: 280, prepTime: 5 },
      { name: "Whole Grain Toast", calories: 80, prepTime: 2 },
    ],
    totalCalories: 360,
  };

  const lunch = {
    title: "Lunch",
    date,
    mealType: "lunch" as const,
    items: [
      { name: "Grilled Chicken Salad", calories: 350, prepTime: 20 },
      { name: "Quinoa", calories: 120, prepTime: 15 },
    ],
    totalCalories: 470,
  };

  const dinner = {
    title: "Dinner",
    date,
    mealType: "dinner" as const,
    items: [
      { name: "Salmon with Asparagus", calories: 380, prepTime: 25 },
      { name: "Brown Rice", calories: 150, prepTime: 20 },
    ],
    totalCalories: 530,
  };

  const snack = {
    title: "Snack",
    date,
    mealType: "snack" as const,
    items: [
      { name: "Apple with Almond Butter", calories: 200, prepTime: 2 },
    ],
    totalCalories: 200,
  };

  return { breakfast, lunch, dinner, snack };
};

const MealPlanner = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [weekMealPlan, setWeekMealPlan] = useState<Record<string, any>>({});
  
  // Initialize meal plan for the current date
  const todayStr = date.toISOString().split('T')[0];
  if (!weekMealPlan[todayStr]) {
    const mockPlan = generateMockMealPlan(date);
    weekMealPlan[todayStr] = mockPlan;
  }

  const currentMealPlan = weekMealPlan[todayStr] || generateMockMealPlan(date);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      
      // Check if we already have a meal plan for this date
      const dateStr = newDate.toISOString().split('T')[0];
      if (!weekMealPlan[dateStr]) {
        const mockPlan = generateMockMealPlan(newDate);
        setWeekMealPlan(prev => ({
          ...prev,
          [dateStr]: mockPlan
        }));
      }
    }
  };

  const handleGenerateMealPlan = () => {
    setIsGeneratingPlan(true);
    
    // Simulate generating a new meal plan
    setTimeout(() => {
      const dateStr = date.toISOString().split('T')[0];
      const mockPlan = generateMockMealPlan(date);
      
      setWeekMealPlan(prev => ({
        ...prev,
        [dateStr]: mockPlan
      }));
      
      setIsGeneratingPlan(false);
      toast.success("New meal plan generated!");
    }, 1500);
  };

  const handleMealClick = (mealType: string) => {
    toast.info(`Viewing details for ${mealType}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meal Planner</h1>
            <p className="text-muted-foreground">
              Plan and customize your meals for optimal nutrition
            </p>
          </div>
          <Button 
            className="mt-4 sm:mt-0" 
            onClick={handleGenerateMealPlan}
            disabled={isGeneratingPlan}
          >
            {isGeneratingPlan ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Generate New Plan
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Calendar and Controls */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" /> Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
              
              <div className="mt-4 space-y-4">
                <Button variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Meal
                </Button>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Daily Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Calories:</span>
                        <span className="font-medium">
                          {currentMealPlan.breakfast.totalCalories + 
                           currentMealPlan.lunch.totalCalories + 
                           currentMealPlan.dinner.totalCalories + 
                           currentMealPlan.snack.totalCalories}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">120g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span className="font-medium">180g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-medium">60g</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Meal Plan for the Selected Day */}
          <div className="col-span-1 lg:col-span-5">
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="daily">Daily View</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="daily" className="space-y-4">
                <h2 className="text-xl font-semibold">
                  {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MealPlanCard 
                    {...currentMealPlan.breakfast}
                    onClick={() => handleMealClick("breakfast")}
                  />
                  <MealPlanCard 
                    {...currentMealPlan.lunch}
                    onClick={() => handleMealClick("lunch")}
                  />
                  <MealPlanCard 
                    {...currentMealPlan.dinner}
                    onClick={() => handleMealClick("dinner")}
                  />
                  <MealPlanCard 
                    {...currentMealPlan.snack}
                    onClick={() => handleMealClick("snack")}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="weekly">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">
                    Week of {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </h2>
                  
                  {/* Sample Weekly Overview */}
                  <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-4">
                    {Array.from({ length: 7 }, (_, i) => {
                      const dayDate = new Date(date);
                      dayDate.setDate(date.getDate() - date.getDay() + i);
                      return dayDate;
                    }).map((day, index) => (
                      <div key={index} className="min-w-[100px]">
                        <div 
                          className={`p-2 text-center rounded-t-md ${
                            day.toDateString() === new Date().toDateString() 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          <br />
                          {day.getDate()}
                        </div>
                        <div className="border rounded-b-md p-2 text-center space-y-2">
                          <div className="text-xs text-muted-foreground">
                            {day.toDateString() === new Date().toDateString() ? '1560 cal' : '~1500 cal'}
                          </div>
                          <div className="space-y-1">
                            <div className="h-6 bg-muted rounded-sm text-xs flex items-center justify-center">B</div>
                            <div className="h-6 bg-muted rounded-sm text-xs flex items-center justify-center">L</div>
                            <div className="h-6 bg-muted rounded-sm text-xs flex items-center justify-center">D</div>
                            <div className="h-6 bg-muted rounded-sm text-xs flex items-center justify-center">S</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MealPlanner;
