
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarIcon, Utensils } from "lucide-react";

interface MealItem {
  name: string;
  calories: number;
  prepTime: number;
}

interface MealPlanCardProps {
  title: string;
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: MealItem[];
  totalCalories: number;
  onClick?: () => void;
}

const getMealTypeIcon = (type: string) => {
  switch (type) {
    case "breakfast":
      return <Badge className="bg-warning text-warning-foreground">Breakfast</Badge>;
    case "lunch":
      return <Badge className="bg-info text-info-foreground">Lunch</Badge>;
    case "dinner":
      return <Badge className="bg-secondary text-secondary-foreground">Dinner</Badge>;
    case "snack":
      return <Badge className="bg-accent text-accent-foreground">Snack</Badge>;
    default:
      return <Badge>Meal</Badge>;
  }
};

const MealPlanCard = ({
  title,
  date,
  mealType,
  items,
  totalCalories,
  onClick,
}: MealPlanCardProps) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);

  return (
    <Card
      className="h-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {getMealTypeIcon(mealType)}
        </div>
        <CardDescription className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          {formattedDate}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{item.calories} cal</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {item.prepTime} min
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full pt-2 border-t flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Calories</span>
          <span className="font-semibold">{totalCalories} cal</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MealPlanCard;
