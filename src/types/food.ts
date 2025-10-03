export interface FoodItem {
  id: number;
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  prepTime: number;
  image: string;
  ingredients: string[];
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  dietTypes: string[];
}