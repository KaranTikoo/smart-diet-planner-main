import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, Calendar } from "lucide-react";

interface WeeklyProgressProps {
  nutritionProgress: {
    calories: number;
    protein: number;
    hydration: number;
  };
  activityProgress: {
    steps: number;
    activeMinutes: number;
    workouts: number;
  };
  avgWorkoutTime: string;
  weeklyProgress: string;
  streak: string;
}

const WeeklyProgress = ({
  nutritionProgress,
  activityProgress,
  avgWorkoutTime,
  weeklyProgress,
  streak,
}: WeeklyProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Track your nutrition and fitness goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="nutrition">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="nutrition" className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Calories</span>
                <span className="text-sm text-muted-foreground">{nutritionProgress.calories}%</span>
              </div>
              <Progress value={nutritionProgress.calories} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Protein</span>
                <span className="text-sm text-muted-foreground">{nutritionProgress.protein}%</span>
              </div>
              <Progress value={nutritionProgress.protein} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Hydration</span>
                <span className="text-sm text-muted-foreground">{nutritionProgress.hydration}%</span>
              </div>
              <Progress value={nutritionProgress.hydration} className="h-2" />
            </div>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Steps</span>
                <span className="text-sm text-muted-foreground">{activityProgress.steps} / 10,000</span>
              </div>
              <Progress value={activityProgress.steps / 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Active Minutes</span>
                <span className="text-sm text-muted-foreground">{activityProgress.activeMinutes} / 60 min</span>
              </div>
              <Progress value={activityProgress.activeMinutes / 0.6} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Workouts</span>
                <span className="text-sm text-muted-foreground">{activityProgress.workouts} / 5</span>
              </div>
              <Progress value={activityProgress.workouts * 20} className="h-2" />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Card className="bg-muted">
            <CardContent className="p-4 flex flex-col items-center">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium text-lg">{avgWorkoutTime}</p>
              <p className="text-sm text-muted-foreground text-center">Avg. Workout Time</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="p-4 flex flex-col items-center">
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium text-lg">{weeklyProgress}</p>
              <p className="text-sm text-muted-foreground text-center">Weekly Progress</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="p-4 flex flex-col items-center">
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium text-lg">{streak}</p>
              <p className="text-sm text-muted-foreground text-center">Streak</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;