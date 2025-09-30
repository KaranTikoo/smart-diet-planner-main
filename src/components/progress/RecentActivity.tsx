import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";

interface RecentActivityProps {
  entries: Array<{
    day: string;
    calories: number;
    weight: number;
    carbs: number;
    protein: number;
    fat: number;
  }>;
}

const RecentActivity = ({ entries }: RecentActivityProps) => {
  const filteredEntries = entries.filter(entry => entry.calories > 0 || entry.weight > 0);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5" /> Recent Activity
        </CardTitle>
        <CardDescription>
          Your latest tracking entries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No recent entries. Add your first entry!
            </div>
          ) : (
            filteredEntries.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{entry.day}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.calories} calories
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{entry.weight} kg</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.carbs}g C / {entry.protein}g P / {entry.fat}g F
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {filteredEntries.length > 0 && (
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              View All Entries
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;