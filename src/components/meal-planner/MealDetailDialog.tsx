import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { MealPlan as MealPlanType } from "@/lib/supabase"; // Import the Supabase MealPlan type

interface MealDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealPlanType | null;
}

const MealDetailDialog = ({ isOpen, onClose, meal }: MealDetailDialogProps) => {
  if (!meal) return null;

  // Assuming 'foods' is a JSONB array of food items within the meal plan
  const foodItems = (meal.foods as any[] || []);
  const firstFoodItem = foodItems.length > 0 ? foodItems[0] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{meal.plan_name}</DialogTitle>
          <DialogDescription>
            Details for your {meal.meal_type} on {new Date(meal.plan_date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {firstFoodItem?.image && (
            <div className="h-60 overflow-hidden rounded-md">
              <img src={firstFoodItem.image} alt={firstFoodItem.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{meal.total_calories || 0}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{firstFoodItem?.protein || 0}g</p>
              <p className="text-xs text-muted-foreground">Protein</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{firstFoodItem?.carbs || 0}g</p>
              <p className="text-xs text-muted-foreground">Carbs</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{firstFoodItem?.fat || 0}g</p>
              <p className="text-xs text-muted-foreground">Fat</p>
            </div>
          </div>

          {foodItems.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Items in this Meal</h4>
              <ul className="list-disc pl-5 space-y-1">
                {foodItems.map((item: any, index: number) => (
                  <li key={index}>
                    {item.name} ({item.calories} cal, {item.protein || 0}g P, {item.carbs || 0}g C, {item.fat || 0}g F)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {meal.prep_time !== null && (
            <div className="flex items-center gap-2">
              <p className="text-sm">Preparation Time:</p>
              <p className="text-sm font-medium">{meal.prep_time} minutes</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealDetailDialog;