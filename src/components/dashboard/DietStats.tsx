import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ActivityIcon, TrendingUp, Apple, Beef, Droplets, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DietStatsProps {
  caloriesConsumed: number;
  caloriesGoal: number;
  carbsPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
  waterConsumed: number;
  waterGoal: number;
  onAddWater?: () => void; // New prop for adding water
}

const DietStats = ({
  caloriesConsumed,
  caloriesGoal,
  carbsPercentage,
  proteinPercentage,
  fatPercentage,
  waterConsumed,
  waterGoal,
  onAddWater
}: DietStatsProps) => {
  const caloriesPercentage = caloriesGoal > 0 ? Math.min(100, Math.round((caloriesConsumed / caloriesGoal) * 100)) : 0;
  const waterPercentage = waterGoal > 0 ? Math.min(100, Math.round((waterConsumed / waterGoal) * 100)) : 0;

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
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground">6am</span>
                <div className="h-10 w-4 bg-info/20 rounded-full mt-1 relative">
                  <div className="absolute bottom-0 w-full bg-info rounded-full" style={{ height: "40%" }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground">9am</span>
                <div className="h-10 w-4 bg-info/20 rounded-full mt-1 relative">
                  <div className="absolute bottom-0 w-full bg-info rounded-full" style={{ height: "60%" }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground">12pm</span>
                <div className="h-10 w-4 bg-info/20 rounded-full mt-1 relative">
                  <div className="absolute bottom-0 w-full bg-info rounded-full" style={{ height: "80%" }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground">3pm</span>
                <div className="h-10 w-4 bg-info/20 rounded-full mt-1 relative">
                  <div className="absolute bottom-0 w-full bg-info rounded-full" style={{ height: "50%" }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground">6pm</span>
                <div className="h-10 w-4 bg-info/20 rounded-full mt-1 relative">
                  <div className="absolute bottom-0 w-full bg-info rounded-full" style={{ height: "30%" }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground">9pm</span>
                <div className="h-10 w-4 bg-info/20 rounded-full mt-1 relative">
                  <div className="absolute bottom-0 w-full bg-info rounded-full" style={{ height: "10%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietStats;