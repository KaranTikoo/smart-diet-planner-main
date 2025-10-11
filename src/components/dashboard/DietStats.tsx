import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ActivityIcon, TrendingUp, Apple, Beef, Droplets, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaterIntake } from "@/lib/supabase";
import { parseISO, getHours } from "date-fns";

interface DietStatsProps {
  caloriesConsumed: number;
  caloriesGoal: number;
  carbsPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
  waterConsumed: number; // Total water in oz
  waterGoal: number; // Water goal in oz
  waterEntries: WaterIntake[];
  onAddWater?: () => void;
}

const DietStats = ({
  caloriesConsumed,
  caloriesGoal,
  carbsPercentage,
  proteinPercentage,
  fatPercentage,
  waterConsumed,
  waterGoal,
  waterEntries,
  onAddWater
}: DietStatsProps) => {
  const caloriesPercentage = caloriesGoal > 0 ? Math.min(100, Math.round((caloriesConsumed / caloriesGoal) * 100)) : 0;
  const waterPercentage = waterGoal > 0 ? Math.min(100, Math.round((waterConsumed / waterGoal) * 100)) : 0;

  const waterGoalMl = waterGoal * 29.5735; // Convert water goal from oz to ml

  // Define 8 time slots covering the full 24 hours in 3-hour intervals
  const timeSlots = [
    { label: "12-3am", startHour: 0, endHour: 3 },
    { label: "3-6am", startHour: 3, endHour: 6 },
    { label: "6-9am", startHour: 6, endHour: 9 },
    { label: "9-12pm", startHour: 9, endHour: 12 },
    { label: "12-3pm", startHour: 12, endHour: 15 },
    { label: "3-6pm", startHour: 15, endHour: 18 },
    { label: "6-9pm", startHour: 18, endHour: 21 },
    { label: "9-12pm", startHour: 21, endHour: 24 }, // Corrected label
  ];

  const proportionalSlotGoal = waterGoalMl / timeSlots.length; // Distribute daily goal evenly across slots

  const waterIntakeBySlot = timeSlots.map(slot => {
    const totalMlInSlot = waterEntries
      .filter(entry => {
        const entryHour = getHours(parseISO(entry.created_at));
        return entryHour >= slot.startHour && entryHour < slot.endHour;
      })
      .reduce((sum, entry) => sum + entry.amount_ml, 0);
    
    // Calculate fill percentage based on the proportional goal for this slot
    const fillPercentage = proportionalSlotGoal > 0 ? Math.min(100, (totalMlInSlot / proportionalSlotGoal) * 100) : 0;
    return { ...slot, totalMlInSlot, fillPercentage };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ActivityIcon className="h-5 w-5 text-primary" />
            Calorie Intake
          </CardTitle>
          <CardDescription>Daily calorie goal and consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold">{caloriesConsumed}</span>
              <span className="text-muted-foreground">of {caloriesGoal} kcal</span>
            </div>
            <Progress value={caloriesPercentage} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="text-center p-2 bg-muted rounded-md">
                <div className="flex justify-center mb-1">
                  <Apple className="h-4 w-4 text-secondary" />
                </div>
                <div className="text-sm font-medium">{carbsPercentage}%</div>
                <div className="text-xs text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-2 bg-muted rounded-md">
                <div className="flex justify-center mb-1">
                  <Beef className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm font-medium">{proteinPercentage}%</div>
                <div className="text-xs text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-2 bg-muted rounded-md">
                <div className="flex justify-center mb-1">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div className="text-sm font-medium">{fatPercentage}%</div>
                <div className="text-xs text-muted-foreground">Fat</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Droplets className="h-5 w-5 text-info" />
            Hydration
          </CardTitle>
          {onAddWater && (
            <Button variant="ghost" size="sm" onClick={onAddWater}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Water
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold">{waterConsumed} oz</span>
              <span className="text-muted-foreground">of {waterGoal} oz</span>
            </div>
            <Progress value={waterPercentage} className="h-2 bg-muted" />
            
            <div className="flex justify-between mt-4 text-sm">
              {waterIntakeBySlot.map((slot, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-muted-foreground text-xs mb-1">{slot.label}</span>
                  <div className="relative h-20 w-8 bg-info/10 rounded-b-lg overflow-hidden border border-info/30">
                    {/* Water fill level */}
                    <div 
                      className="absolute bottom-0 w-full bg-info transition-all duration-500 ease-out" 
                      style={{ height: `${slot.fillPercentage}%` }}
                    ></div>
                    {/* Text overlay for amount */}
                    {slot.totalMlInSlot > 0 && (
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-semibold drop-shadow-sm z-10">
                        {Math.round(slot.totalMlInSlot)}ml
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietStats;