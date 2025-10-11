import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { useState } from "react"; // Import useState

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
  const [showAllEntries, setShowAllEntries] = useState(false); // New state to toggle all entries
  
  // Filter out entries that are completely zero (no calories and no weight)
  const meaningfulEntries = entries.filter(entry => entry.calories > 0 || entry.weight > 0);

  // Determine which entries to display based on showAllEntries state
  const entriesToDisplay = showAllEntries ? meaningfulEntries : meaningfulEntries.slice(0, 5);

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
          {meaningfulEntries.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No recent entries. Add your first entry!
            </div>
          ) : (
            entriesToDisplay.map((entry, index) => (
              <div key={index} className="flex justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{entry.day}</p>
                  {entry.calories > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {entry.calories} calories ({entry.protein}g P / {entry.carbs}g C / {entry.fat}g F)
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {entry.weight > 0 && (
                    <p className="font-medium">{entry.weight} kg</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {meaningfulEntries.length > 5 && ( // Only show button if there are more than 5 entries
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={() => setShowAllEntries(!showAllEntries)}>
              {showAllEntries ? "Show Less" : "View All Entries"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;