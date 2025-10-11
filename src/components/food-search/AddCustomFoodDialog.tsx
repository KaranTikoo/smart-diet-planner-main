import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCustomFoods } from "@/hooks/useCustomFoods";
import { Plus } from "lucide-react";

interface AddCustomFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFoodAdded?: () => void;
}

const AddCustomFoodDialog = ({ isOpen, onOpenChange, onFoodAdded }: AddCustomFoodDialogProps) => {
  const { addCustomFood } = useCustomFoods();
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
    serving_size: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveCustomFood = async () => {
    if (!newFood.name.trim() || !newFood.calories) {
      toast.error("Please enter a food name and calorie count.");
      return;
    }
    if (parseFloat(newFood.calories) <= 0) {
      toast.error("Calories must be a positive number.");
      return;
    }

    setIsLoading(true);
    try {
      await addCustomFood({
        name: newFood.name.trim(),
        calories: parseFloat(newFood.calories),
        protein: parseFloat(newFood.protein) || 0,
        carbs: parseFloat(newFood.carbs) || 0,
        fat: parseFloat(newFood.fat) || 0,
        fiber: parseFloat(newFood.fiber) || 0,
        sugar: parseFloat(newFood.sugar) || 0,
        sodium: parseFloat(newFood.sodium) || 0,
        serving_size: newFood.serving_size.trim() || null,
      });
      
      // Reset form and close dialog
      setNewFood({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        sugar: "",
        sodium: "",
        serving_size: "",
      });
      onOpenChange(false);
      if (onFoodAdded) {
        onFoodAdded();
      }
    } catch (error) {
      console.error("Error adding custom food:", error);
      toast.error("Failed to add custom food.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Food</DialogTitle>
          <DialogDescription>
            Create your own food entry with detailed nutritional information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="food-name" className="text-right">
              Name
            </Label>
            <Input
              id="food-name"
              value={newFood.name}
              onChange={(e) => setNewFood({...newFood, name: e.target.value})}
              className="col-span-3"
              placeholder="e.g., Homemade Granola"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calories" className="text-right">
              Calories
            </Label>
            <Input
              id="calories"
              value={newFood.calories}
              onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 250"
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
              value={newFood.protein}
              onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 10"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="carbs" className="text-right">
              Carbs (g)
            </Label>
            <Input
              id="carbs"
              value={newFood.carbs}
              onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 30"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fat" className="text-right">
              Fat (g)
            </Label>
            <Input
              id="fat"
              value={newFood.fat}
              onChange={(e) => setNewFood({...newFood, fat: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 12"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fiber" className="text-right">
              Fiber (g)
            </Label>
            <Input
              id="fiber"
              value={newFood.fiber}
              onChange={(e) => setNewFood({...newFood, fiber: e.target.value})}
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
              value={newFood.sugar}
              onChange={(e) => setNewFood({...newFood, sugar: e.target.value})}
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
              value={newFood.sodium}
              onChange={(e) => setNewFood({...newFood, sodium: e.target.value})}
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
              value={newFood.serving_size}
              onChange={(e) => setNewFood({...newFood, serving_size: e.target.value})}
              className="col-span-3"
              placeholder="e.g., 1 cup, 100g"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSaveCustomFood} disabled={isLoading}>
            {isLoading ? "Saving..." : <><Plus className="mr-2 h-4 w-4" /> Add Food</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomFoodDialog;