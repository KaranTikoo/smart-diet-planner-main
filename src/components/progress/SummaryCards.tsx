
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface SummaryCardsProps {
  currentWeight: number;
  weightChange: number;
  isWeightLoss: boolean;
  averageCalories: number;
}

const SummaryCards = ({ 
  currentWeight, 
  weightChange, 
  isWeightLoss, 
  averageCalories 
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Weight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold">{currentWeight} kg</div>
            <div className={`flex items-center ${isWeightLoss ? "text-success" : "text-destructive"}`}>
              {isWeightLoss ? <ArrowDown className="h-4 w-4 mr-1" /> : <ArrowUp className="h-4 w-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(weightChange)} kg</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Daily Calories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold">{averageCalories}</div>
            <div className="text-sm text-muted-foreground">of 2000 goal</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold">18 days</div>
            <div className="text-sm text-muted-foreground">Best: 24 days</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold">65%</div>
            <div className="text-sm text-muted-foreground">Weight loss</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
