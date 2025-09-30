
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart as BarChartIcon } from "lucide-react";

interface MacronutrientBreakdownProps {
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
  caloriesAvg: number;
}

const MacronutrientBreakdown = ({ macros, caloriesAvg }: MacronutrientBreakdownProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChartIcon className="h-5 w-5" /> Macronutrient Breakdown
        </CardTitle>
        <CardDescription>
          Weekly average distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Carbs", value: macros.carbs },
                { name: "Protein", value: macros.protein },
                { name: "Fat", value: macros.fat },
              ]}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium">{macros.carbs}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="text-xs text-muted-foreground">({Math.round(macros.carbs * 4 / caloriesAvg * 100)}%)</p>
          </div>
          <div>
            <p className="text-sm font-medium">{macros.protein}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="text-xs text-muted-foreground">({Math.round(macros.protein * 4 / caloriesAvg * 100)}%)</p>
          </div>
          <div>
            <p className="text-sm font-medium">{macros.fat}g</p>
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="text-xs text-muted-foreground">({Math.round(macros.fat * 9 / caloriesAvg * 100)}%)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MacronutrientBreakdown;
