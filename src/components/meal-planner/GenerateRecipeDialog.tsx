import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MealTypeEnum } from "@/lib/supabase";
import { useMealPlans } from "@/hooks/useMealPlans";
import { mockFoodDatabase } from "@/data/mockFoodDatabase";
import { FoodItem } from "@/types/food";
import { RefreshCw, PlusCircle } from "lucide-react";

interface GenerateRecipeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onMealPlanUpdated: () => void;
}

const GenerateRecipeDialog = ({
  isOpen,
  onOpenChange,
  selectedDate,
  onMealPlanUpdated,
}: GenerateRecipeDialogProps) => {
  const { addMealPlan } = useMealPlans();
  const [mainIngredient, setMainIngredient] = useState("");
  const [mealType, setMealType] = useState<MealTypeEnum>("dinner");
  const [generatedRecipe, setGeneratedRecipe] = useState<FoodItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingToPlan, setIsAddingToPlan] = useState(false);

  const handleGenerateRecipe = () => {
    setIsGenerating(true);
    setGeneratedRecipe(null); // Clear previous recipe

    setTimeout(() => {
      // Simulate AI recipe generation based on mainIngredient and mealType
      const matchingFoods = mockFoodDatabase.filter(food =>
        food.ingredients.some(ing => ing.toLowerCase().includes(mainIngredient.toLowerCase())) &&
        food.mealType === mealType
      );

      let recipe: FoodItem | null = null;
      if (matchingFoods.length > 0) {
        recipe = matchingFoods[Math.floor(Math.random() * matchingFoods.length)];
      } else {
        // Fallback to a generic recipe if no specific match
        recipe = {
          id: Date.now(),
          title: `Custom ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} with ${mainIngredient || "Mixed Ingredients"}`,
          description: "A delicious and nutritious meal tailored to your request.",
          calories: 400,
          protein: 20,
          carbs: 40,
          fat: 15,
          tags: ["custom", "generated"],
          prepTime: 30,
          image: "/placeholder.svg", // Use a placeholder image
          ingredients: mainIngredient ? [mainIngredient, "vegetables", "spices"] : ["mixed ingredients", "spices"],
          mealType: mealType,
          dietTypes: [],
        };
      }
      setGeneratedRecipe(recipe);
      setIsGenerating(false);
      toast.success("Recipe generated!");
    }, 1000);
  };

  const handleAddToMealPlan = async () => {
    if (!generatedRecipe) {
      toast.error("No recipe generated to add.");
      return;
    }

    setIsAddingToPlan(true);
    try {
      await addMealPlan({
        plan_name: generatedRecipe.title,
        plan_date: selectedDate.toISOString().split('T')[0],
        meal_type: generatedRecipe.mealType,
        foods: [
          {
            name: generatedRecipe.title,
            calories: generatedRecipe.calories,
            protein: generatedRecipe.protein,
            carbs: generatedRecipe.carbs,
            fat: generatedRecipe.fat,
            serving_size: "1 serving",
            serving_quantity: 1,
            prepTime: generatedRecipe.prepTime,
          },
        ],
        total_calories: generatedRecipe.calories,
        prep_time: generatedRecipe.prepTime,
      });
      toast.success(`'${generatedRecipe.title}' added to your meal plan for ${selectedDate.toLocaleDateString()}!`);
      onOpenChange(false);
      onMealPlanUpdated(); // Trigger refetch in parent
    } catch (error) {
      console.error("Error adding generated recipe to meal plan:", error);
      toast.error("Failed to add recipe to meal plan.");
    } finally {
      setIsAddingToPlan(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate New Recipe</DialogTitle>
          <DialogDescription>
            Let AI suggest a recipe based on your preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="main-ingredient">Main Ingredient (e.g., chicken, tofu, lentils)</Label>
            <Input
              id="main-ingredient"
              value={mainIngredient}
              onChange={(e) => setMainIngredient(e.target.value)}
              placeholder="e.g., chicken"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select
              value={mealType}
              onValueChange={(value: MealTypeEnum) => setMealType(value)}
            >
              <SelectTrigger>
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
          <Button onClick={handleGenerateRecipe} disabled={isGenerating || !mainIngredient.trim()}>
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Generate Recipe
              </>
            )}
          </Button>

          {generatedRecipe && (
            <div className="mt-6 p-4 border rounded-md space-y-3">
              <h3 className="text-lg font-semibold">{generatedRecipe.title}</h3>
              {generatedRecipe.image && (
                <img src={generatedRecipe.image} alt={generatedRecipe.title} className="w-full h-32 object-cover rounded-md" />
              )}
              <p className="text-sm text-muted-foreground">{generatedRecipe.description}</p>
              <div className="flex justify-between text-sm">
                <span>Calories: {generatedRecipe.calories}</span>
                <span>Protein: {generatedRecipe.protein}g</span>
                <span>Prep Time: {generatedRecipe.prepTime} min</span>
              </div>
              <Button onClick={handleAddToMealPlan} className="w-full" disabled={isAddingToPlan}>
                {isAddingToPlan ? (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4 animate-pulse" /> Adding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add to Meal Plan
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateRecipeDialog;