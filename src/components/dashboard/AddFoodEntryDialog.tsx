import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { MealTypeEnum } from "@/lib/supabase";
import { useCustomFoods } from "@/hooks/useCustomFoods"; // New import

interface AddFoodEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryAdded?: () => void; // Callback to refresh dashboard data
}

const AddFoodEntryDialog = ({ isOpen, onOpenChange, onEntryAdded }: AddFoodEntryDialogProps) => {
  const { addEntry } = useFoodEntries();
  const { customFoods, loading: customFoodsLoading } = useCustomFoods(); // Fetch custom foods
  const [newFoodEntry, setNewFoodEntry] = useState({
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "", // Added fiber
    sugar: "", // Added sugar
    sodium: "", // Added sodium
    meal_type: "breakfast" as MealTypeEnum,
    serving_size: "" as string | null,
    entry_date: new Date().toISOString().split('T')[0], // Current date
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomFoodId, setSelectedCustomFoodId] = useState<string | null>(null); // State for selected custom food

  // Effect to populate form fields when a custom food is selected
  useEffect(() => {
    if (selectedCustomFoodId) {
      const selectedFood = customFoods.find(food => food.id === selectedCustomFoodId);
      if (selectedFood) {
        setNewFoodEntry(prev => ({
          ...prev,
          food_name: selectedFood.name,
          calories: selectedFood.calories.toString(),
          protein: selectedFood.protein?.toString() || "",
          carbs: selectedFood.carbs?.toString() || "",
          fat: selectedFood.fat?.toString() || "",
          fiber: selectedFood.fiber?.toString() || "",
          sugar: selectedFood.sugar?.toString() || "",
          sodium: selectedFood.sodium?.toString() || "",
          serving_size: selectedFood.serving_size || "",
        }));
      }
    } else {
      // Clear fields if no custom food is selected or selection is cleared
      setNewFoodEntry(prev => ({
        ...prev,
        food_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        sugar: "",
        sodium: "",
        serving_size: "",
      }));
    }
  }, [selectedCustomFoodId, customFoods]);

  const handleSaveFoodEntry = async () => {
    if (!newFoodEntry.food_name || !newFoodEntry.calories) {
      toast.error("Please fill in food name and calories.");
      return;
    }
    if (parseFloat(newFoodEntry.calories) <= 0) {
      toast.error("Calories must be a positive number.");
      return;
    }

    setIsLoading(true);
    try {
      await addEntry({
        food_name: newFoodEntry.food_name,
        calories: parseFloat(newFoodEntry.calories),
        protein: parseFloat(newFoodEntry.protein) || 0,
        carbs: parseFloat(newFoodEntry.carbs) || 0,
        fat: parseFloat(newFoodEntry.fat) || 0,
        fiber: parseFloat(newFoodEntry.fiber) || 0, // Include fiber
        sugar: parseFloat(newFoodEntry.sugar) || 0, // Include sugar
        sodium: parseFloat(newFoodEntry.sodium) || 0, // Include sodium
        meal_type: newFoodEntry.meal_type,
        serving_size: newFoodEntry.serving_size || null,
        entry_date: newFoodEntry.entry_date,
      });
      
      // Reset form and close dialog
      setNewFoodEntry({
        food_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        sugar: "",
        sodium: "",
        meal_type: "breakfast",
        serving_size: null,
        entry_date: new Date().toISOString().split('T')[0],
      });
      setSelectedCustomFoodId(null); // Reset custom food selection
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
          {customFoods.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="select-custom-food" className="text-right">
                Custom Food
              </Label>
              <Select
                value={selectedCustomFoodId || ""}
                onValueChange={(value) => setSelectedCustomFoodId(value === "none" ? null : value)}
                disabled={customFoodsLoading}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a custom food (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Clear Selection --</SelectItem>
                  {customFoods.map(food => (
                    <SelectItem key={food.id} value={food.id}>
                      {food.name} ({food.calories} kcal)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
            <Label htmlFor="fiber" className="text-right">
              Fiber (g)
            </Label>
            <Input
              id="fiber"
              value={newFoodEntry.fiber}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, fiber: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 5"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sugar" className="text-right">
              Sugar (g)
            </Label>
            <Input
              id="sugar"
              value={newFoodEntry.sugar}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, sugar: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 8"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sodium" className="text-right">
              Sodium (mg)
            </Label>
            <Input
              id="sodium"
              value={newFoodEntry.sodium}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, sodium: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 150"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serving-size" className="text-right">
              Serving Size
            </Label>
            <Input
              id="serving-size"
              value={newFoodEntry.serving_size || ""}
              onChange={(e) => setNewFoodEntry({...newFoodEntry, serving_size: e.target.value})}
              className="col-span-3"
              placeholder="e.g., 1 cup, 150g"
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