
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SearchFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const SearchFilters = ({ onApplyFilters }: SearchFiltersProps) => {
  const [filters, setFilters] = useState({
    caloriesRange: [0, 1000],
    mealType: "",
    dietTypes: [] as string[],
    ingredients: [] as string[],
    ingredientInput: "",
    prepTime: "",
  });

  const handleCaloriesChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, caloriesRange: value }));
  };

  const handleMealTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, mealType: value }));
  };

  const handleDietTypeToggle = (dietType: string) => {
    setFilters((prev) => {
      const dietTypes = [...prev.dietTypes];
      if (dietTypes.includes(dietType)) {
        return { ...prev, dietTypes: dietTypes.filter((d) => d !== dietType) };
      } else {
        return { ...prev, dietTypes: [...dietTypes, dietType] };
      }
    });
  };

  const handleAddIngredient = () => {
    if (filters.ingredientInput.trim() && !filters.ingredients.includes(filters.ingredientInput.trim())) {
      setFilters((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, prev.ingredientInput.trim()],
        ingredientInput: "",
      }));
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setFilters((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i !== ingredient),
    }));
  };

  const handlePrepTimeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, prepTime: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      caloriesRange: [0, 1000],
      mealType: "",
      dietTypes: [],
      ingredients: [],
      ingredientInput: "",
      prepTime: "",
    });
    onApplyFilters({
      caloriesRange: [0, 1000],
      mealType: "",
      dietTypes: [],
      ingredients: [],
      prepTime: "",
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="font-medium mb-2 block">Calories</Label>
            <div className="pt-2 px-2">
              <Slider
                value={filters.caloriesRange}
                min={0}
                max={1000}
                step={50}
                onValueChange={handleCaloriesChange}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{filters.caloriesRange[0]} cal</span>
                <span>{filters.caloriesRange[1]} cal</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="font-medium mb-2 block">Meal Type</Label>
            <Select value={filters.mealType} onValueChange={handleMealTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any_meal">Any meal type</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-medium mb-2 block">Diet Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {["vegetarian", "vegan", "gluten-free", "keto", "low-carb", "paleo"].map((dietType) => (
                <div key={dietType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diet-${dietType}`}
                    checked={filters.dietTypes.includes(dietType)}
                    onCheckedChange={() => handleDietTypeToggle(dietType)}
                  />
                  <Label htmlFor={`diet-${dietType}`} className="capitalize">
                    {dietType}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="font-medium mb-2 block">Ingredients</Label>
            <div className="flex space-x-2">
              <Input
                value={filters.ingredientInput}
                onChange={(e) => setFilters((prev) => ({ ...prev, ingredientInput: e.target.value }))}
                placeholder="Enter ingredient"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
              <Button type="button" size="sm" onClick={handleAddIngredient}>
                Add
              </Button>
            </div>
            {filters.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient)}
                      className="text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="font-medium mb-2 block">Preparation Time</Label>
            <Select value={filters.prepTime} onValueChange={handlePrepTimeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any prep time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any_time">Any prep time</SelectItem>
                <SelectItem value="under15">Under 15 minutes</SelectItem>
                <SelectItem value="under30">Under 30 minutes</SelectItem>
                <SelectItem value="under60">Under 1 hour</SelectItem>
                <SelectItem value="over60">Over 1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button type="button" className="w-full" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button type="button" variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
