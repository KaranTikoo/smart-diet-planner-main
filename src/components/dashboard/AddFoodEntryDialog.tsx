import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { MealTypeEnum } from "@/lib/supabase";

interface AddFoodEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryAdded?: () => void; // Callback to refresh dashboard data
}

const AddFoodEntryDialog = ({ isOpen, onOpenChange, onEntryAdded }: AddFoodEntryDialogProps) => {
  const { addEntry } = useFoodEntries();
  const [newFoodEntry, setNewFoodEntry] = useState({
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    meal_type: "breakfast" as MealTypeEnum,
    entry_date: new Date().toISOString().split('T')[0], // Current date
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveFoodEntry = async () => {
    if (!newFoodEntry.food_name || !newFoodEntry.calories) {
      toast.error("Please fill in food name and calories.");
      return;
    }

    setIsLoading(true);
    try {
      await addEntry({
        food_name: newFoodEntry.food_name,
        calories: parseInt(newFoodEntry.calories),
        protein: parseInt(newFoodEntry.protein) || 0,
        carbs: parseInt(newFoodEntry.carbs) || 0,
        fat: parseInt(newFoodEntry.fat) || 0,
        meal_type: newFoodEntry.meal_type,
        entry_date: newFoodEntry.entry_date,
      });
      
      // Reset form and close dialog
      setNewFoodEntry({
        food_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        meal_type: "breakfast",
        entry_date: new Date().toISOString().split('T')[0],
      });
      onOpenChange(false);
      if (onEntryAdded) {
        onEntryAdded();
      }
    } catch (error) {
      console.error("Error adding food entry:", error);
      toast.error("Failed to add food entry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Food Entry</DialogTitle>
          <DialogDescription>
            Record what you've eaten to track your nutrition.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="food-name" className="text-right">
              Food
            </Label>
            <Input
              id="food-name"
              value={newFoodEntry.food_name}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, food_name: e.target.value})}
              className="col-span-3"
              placeholder="e.g., Grilled Chicken Salad"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calories" className="text-right">
              Calories
            </Label>
            <Input
              id="calories"
              value={newFoodEntry.calories}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, calories: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 350"
              min="0"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="protein" className="text-right">
              Protein (g)
            </Label>
            <Input
              id="protein"
              value={newFoodEntry.protein}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, protein: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 30"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="carbs" className="text-right">
              Carbs (g)
            </Label>
            <Input
              id="carbs"
              value={newFoodEntry.carbs}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, carbs: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 15"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fat" className="text-right">
              Fat (g)
            </Label>
            <Input
              id="fat"
              value={newFoodEntry.fat}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, fat: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 18"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meal-type" className="text-right">
              Meal
            </Label>
            <Select
              value={newFoodEntry.meal_type}
              onValueChange={(value: MealTypeEnum) => setNewFoodEntry({
                ...newFoodEntry, 
                meal_type: value
              })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-date" className="text-right">
              Date
            </Label>
            <Input
              id="entry-date"
              value={newFoodEntry.entry_date}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, entry_date: e.target.value})}
              className="col-span-3"
              type="date"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSaveFoodEntry} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodEntryDialog;