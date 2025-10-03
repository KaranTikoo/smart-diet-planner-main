import { FoodItem } from "@/types/food";

export const thaiFoods: FoodItem[] = [
  {
    id: 35,
    title: "Green Curry with Tofu",
    description: "Aromatic Thai green curry with coconut milk, tofu, bamboo shoots, and basil.",
    calories: 400,
    protein: 20,
    carbs: 35,
    fat: 22,
    tags: ["thai", "vegan", "spicy"],
    prepTime: 35,
    image: "https://images.unsplash.com/photo-1563612116625-30123f730e83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["tofu", "green curry paste", "coconut milk", "bamboo shoots", "bell peppers", "basil"],
    mealType: "dinner",
    dietTypes: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    id: 36,
    title: "Pad Thai with Shrimp",
    description: "Classic Thai stir-fried noodles with shrimp, peanuts, bean sprouts, and a tangy sauce.",
    calories: 520,
    protein: 30,
    carbs: 60,
    fat: 20,
    tags: ["thai", "seafood"],
    prepTime: 30,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7247?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["rice noodles", "shrimp", "eggs", "bean sprouts", "peanuts", "tamarind paste", "fish sauce"],
    mealType: "dinner",
    dietTypes: ["gluten-free"],
  },
];