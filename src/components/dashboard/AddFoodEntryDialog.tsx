
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddFoodEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddFoodEntryDialog = ({ isOpen, onOpenChange }: AddFoodEntryDialogProps) => {
  const [newFoodEntry, setNewFoodEntry] = useState({
    name: "",
    calories: "",
    mealType: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack"
  });

  const handleSaveFoodEntry = () => {
    if (!newFoodEntry.name || !newFoodEntry.calories) {
      toast.error("Please fill all required fields");
      return;
    }

    // In a real app, you would save this to your database
    toast.success(`Added ${newFoodEntry.name} to your ${newFoodEntry.mealType}`);
    
    // Reset form and close dialog
    setNewFoodEntry({
      name: "",
      calories: "",
      mealType: "breakfast"
    });
    onOpenChange(false);
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
              value={newFoodEntry.name}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, name: e.target.value})}
              className="col-span-3"
              placeholder="e.g., Grilled Chicken Salad"
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
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meal-type" className="text-right">
              Meal
            </Label>
            <Select
              value={newFoodEntry.mealType}
              onValueChange={(value) => setNewFoodEntry({
                ...newFoodEntry, 
                mealType: value as "breakfast" | "lunch" | "dinner" | "snack"
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
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveFoodEntry}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodEntryDialog;
