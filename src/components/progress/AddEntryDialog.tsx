import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWeightEntries } from "@/hooks/useWeightEntries";
import { useFoodEntries } from "@/hooks/useFoodEntries"; // To potentially add calorie entry
import { MealTypeEnum } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components

interface AddEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryAdded?: () => void; // Callback to refresh progress data
}

const AddEntryDialog = ({ 
  isOpen, 
  onOpenChange, 
  onEntryAdded 
}: AddEntryDialogProps) => {
  const { addEntry: addWeightEntry } = useWeightEntries();
  const { addEntry: addFoodEntry } = useFoodEntries(); // For calorie tracking
  const [newEntry, setNewEntry] = useState({
    weight: "",
    calories: "",
    date: new Date().toISOString().split('T')[0],
    mealType: "breakfast" as MealTypeEnum, // Default meal type for calorie entry
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveEntry = async () => {
    if (!newEntry.weight && !newEntry.calories) {
      toast.error("Please enter either weight or calories.");
      return;
    }

    setIsLoading(true);
    try {
      if (newEntry.weight) {
        await addWeightEntry({
          weight: parseFloat(newEntry.weight),
          entry_date: newEntry.date,
          notes: null, // No notes field in this dialog
        });
      }
      if (newEntry.calories) {
        // For simplicity, if calories are entered here, we'll add a generic food entry
        // In a real app, this might be a more detailed food entry or a separate calorie log.
        await addFoodEntry({
          food_name: "General Calorie Entry",
          calories: parseInt(newEntry.calories),
          protein: 0, carbs: 0, fat: 0, // Default to 0 for general entry
          meal_type: newEntry.mealType,
          serving_size: null, // Add serving_size as it's required by the FoodEntry type
          entry_date: newEntry.date,
        });
      }
      
      // Reset form and close dialog
      setNewEntry({
        weight: "",
        calories: "",
        date: new Date().toISOString().split('T')[0],
        mealType: "breakfast",
      });
      onOpenChange(false);
      if (onEntryAdded) {
        onEntryAdded();
      }
    } catch (error) {
      console.error("Error saving progress entry:", error);
      toast.error("Failed to save progress entry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Progress Entry</DialogTitle>
          <DialogDescription>
            Track your weight and calorie consumption.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-date" className="text-right">
              Date
            </Label>
            <Input
              id="entry-date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
              className="col-span-3"
              type="date"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-weight" className="text-right">
              Weight (kg)
            </Label>
            <Input
              id="entry-weight"
              value={newEntry.weight}
              onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
              className="col-span-3"
              type="number"
              step="0.1"
              placeholder="e.g., 75.5"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-calories" className="text-right">
              Calories
            </Label>
            <Input
              id="entry-calories"
              value={newEntry.calories}
              onChange={(e) => setNewEntry({...newEntry, calories: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 1800"
            />
          </div>
          {newEntry.calories && ( // Only show meal type if calories are being entered
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meal-type" className="text-right">
                Meal Type
              </Label>
              <Select
                value={newEntry.mealType}
                onValueChange={(value: MealTypeEnum) => setNewEntry({ ...newEntry, mealType: value })}
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
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSaveEntry} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;