import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MealPlanCard from "@/components/ui/MealPlanCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useMealPlans } from "@/hooks/useMealPlans";
import { MealPlan as SupabaseMealPlan, MealTypeEnum, supabase } from "@/lib/supabase";
import { useInventory } from "@/hooks/useInventory"; // Import useInventory
import { mockFoodDatabase } from "@/data/mockFoodDatabase"; // For simulated generation
import GenerateRecipeDialog from "@/components/meal-planner/GenerateRecipeDialog"; // New dialog import
import MealDetailDialog from "@/components/meal-planner/MealDetailDialog"; // New import for meal details dialog
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Helper to map Supabase MealPlan to what MealPlanCard expects
const mapSupabaseMealPlanToCardProps = (supabasePlan: SupabaseMealPlan) => {
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

const MealPlanner = () => {
  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');
  const { mealPlans, loading: isLoadingMealPlans, refetch: refetchMealPlans, addMealPlan } = useMealPlans(formattedDate);
  const { items: inventoryItems, loading: isLoadingInventory } = useInventory(); // Fetch inventory
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isGenerateRecipeDialogOpen, setIsGenerateRecipeDialogOpen] = useState(false);
  const [prioritizeInventory, setPrioritizeInventory] = useState(false);
  const [selectedMealForDetails, setSelectedMealForDetails] = useState<SupabaseMealPlan | null>(null); // New state for meal details dialog

  // Group meal plans by meal type for easy access
  const mealsForSelectedDay: Record<MealTypeEnum, SupabaseMealPlan | null> = {
    breakfast: null,
    lunch: null,
    dinner: null,
    snack: null,
  };

  mealPlans.forEach(plan => {
    mealsForSelectedDay[plan.meal_type] = plan;
  });

  // Fallback to a default empty structure if no plan exists for a meal type
  const getMealPlanCardProps = (mealType: MealTypeEnum) => {
    const plan = mealsForSelectedDay[mealType];
    if (plan) {
      return mapSupabaseMealPlanToCardProps(plan);
    }
    return {
      title: mealType.charAt(0).toUpperCase() + mealType.slice(1),
      date: date,
      mealType: mealType,
      items: [],
      totalCalories: 0,
    };
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleGenerateMealPlan = async () => {
    setIsGeneratingPlan(true);
    toast.info("Generating new meal plan...");

    try {
      // Delete existing plans for the day before adding new ones
      const { error: deleteError } = await supabase
        .from('meal_plans')
        .delete()
        .eq('plan_date', formattedDate);

      if (deleteError) throw deleteError;

      // Simulate generating a new meal plan, potentially prioritizing inventory
      const availableInventoryNames = inventoryItems.map(item => item.name.toLowerCase());
      const mealTypes: MealTypeEnum[] = ["breakfast", "lunch", "dinner", "snack"];
      const newPlans = [];

      for (const type of mealTypes) {
        let potentialFoods = mockFoodDatabase.filter(food => food.mealType === type);

        if (prioritizeInventory && availableInventoryNames.length > 0) {
          // Simple prioritization: filter for foods that use at least one inventory item
          const inventoryPrioritizedFoods = potentialFoods.filter(food =>
            food.ingredients.some(ing => availableInventoryNames.includes(ing.toLowerCase()))
          );
          if (inventoryPrioritizedFoods.length > 0) {
            potentialFoods = inventoryPrioritizedFoods;
          }
        }

        const selectedFood = potentialFoods.length > 0
          ? potentialFoods[Math.floor(Math.random() * potentialFoods.length)]
          : null;

        if (selectedFood) {
          newPlans.push({
            plan_name: selectedFood.title,
            plan_date: formattedDate,
            meal_type: type,
            foods: [
              {
                name: selectedFood.title,
                calories: selectedFood.calories,
                protein: selectedFood.protein,
                carbs: selectedFood.carbs,
                fat: selectedFood.fat,
                serving_size: "1 serving",
                serving_quantity: 1,
                prepTime: selectedFood.prepTime,
                image: selectedFood.image, // Include image for display in details
                ingredients: selectedFood.ingredients, // Include ingredients for display
                description: selectedFood.description, // Include description
              },
            ],
            total_calories: selectedFood.calories,
            prep_time: selectedFood.prepTime,
          });
        }
      }

      for (const planData of newPlans) {
        await addMealPlan(planData);
      }
      toast.success("New meal plan generated and saved!");
      refetchMealPlans(); // Refetch to display the new plans
    } catch (error) {
      console.error("Error generating/saving meal plan:", error);
      toast.error("Failed to generate new meal plan.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleMealCardClick = (mealType: MealTypeEnum) => {
    const meal = mealsForSelectedDay[mealType];
    if (meal && meal.foods && (meal.foods as any[]).length > 0) {
      setSelectedMealForDetails(meal);
    } else {
      toast.info(`No ${mealType} planned for this day.`);
    }
  };

  // Calculate daily summary from fetched meal plans
  const dailyTotalCalories = mealPlans.reduce((sum, plan) => sum + (plan.total_calories || 0), 0);
  const dailyTotalProtein = mealPlans.reduce((sum, plan) => sum + (plan.foods as any[] || []).reduce((foodSum, food) => foodSum + (food.protein || 0), 0), 0);
  const dailyTotalCarbs = mealPlans.reduce((sum, plan) => sum + (plan.foods as any[] || []).reduce((foodSum, food) => foodSum + (food.carbs || 0), 0), 0);
  const dailyTotalFat = mealPlans.reduce((sum, plan) => sum + (plan.foods as any[] || []).reduce((foodSum, food) => foodSum + (food.fat || 0), 0), 0);

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
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="prioritize-inventory"
                checked={prioritizeInventory}
                onCheckedChange={(checked: boolean) => setPrioritizeInventory(checked)}
                disabled={isLoadingInventory || isGeneratingPlan}
              />
              <Label htmlFor="prioritize-inventory">Prioritize Inventory</Label>
            </div>
            <Button 
              onClick={handleGenerateMealPlan}
              disabled={isGeneratingPlan || isLoadingMealPlans || isLoadingInventory}
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
                <Button variant="outline" className="w-full" onClick={() => setIsGenerateRecipeDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Meal
                </Button>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Daily Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Calories:</span>
                        <span className="font-medium">
                          {dailyTotalCalories}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">{dailyTotalProtein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span className="font-medium">{dailyTotalCarbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-medium">{dailyTotalFat}g</span>
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
                
                {isLoadingMealPlans ? (
                  <div className="text-center py-8 text-muted-foreground">Loading meal plans...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MealPlanCard 
                      {...getMealPlanCardProps("breakfast")}
                      onClick={() => handleMealCardClick("breakfast")}
                    />
                    <MealPlanCard 
                      {...getMealPlanCardProps("lunch")}
                      onClick={() => handleMealCardClick("lunch")}
                    />
                    <MealPlanCard 
                      {...getMealPlanCardProps("dinner")}
                      onClick={() => handleMealCardClick("dinner")}
                    />
                    <MealPlanCard 
                      {...getMealPlanCardProps("snack")}
                      onClick={() => handleMealCardClick("snack")}
                    />
                  </div>
                )}
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

        {/* Generate Recipe Dialog */}
        <GenerateRecipeDialog
          isOpen={isGenerateRecipeDialogOpen}
          onOpenChange={setIsGenerateRecipeDialogOpen}
          selectedDate={date}
          onMealPlanUpdated={refetchMealPlans}
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

export default MealPlanner;