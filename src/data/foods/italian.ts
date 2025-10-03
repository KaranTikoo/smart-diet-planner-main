import { FoodItem } from "@/types/food";

export const italianFoods: FoodItem[] = [
  {
    id: 33,
    title: "Spaghetti Aglio e Olio",
    description: "A simple yet flavorful pasta dish with garlic, olive oil, chili flakes, and parsley.",
    calories: 420,
    protein: 10,
    carbs: 60,
    fat: 18,
    tags: ["italian", "vegetarian", "quick"],
    prepTime: 15,
    image: "https://images.unsplash.com/photo-1551183053-bc37891171d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["spaghetti", "garlic", "olive oil", "chili flakes", "parsley"],
    mealType: "dinner",
    dietTypes: ["vegetarian"],
  },
  {
    id: 34,
    title: "Caprese Salad",
    description: "Fresh mozzarella, ripe tomatoes, and basil leaves drizzled with balsamic glaze.",
    calories: 250,
    protein: 12,
    carbs: 10,
    fat: 18,
    tags: ["italian", "vegetarian", "light"],
    prepTime: 10,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["mozzarella", "tomatoes", "basil", "balsamic glaze", "olive oil"],
    mealType: "lunch",
    dietTypes: ["vegetarian", "gluten-free"],
  },
];