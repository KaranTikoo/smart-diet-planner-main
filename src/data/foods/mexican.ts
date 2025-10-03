import { FoodItem } from "@/types/food";

export const mexicanFoods: FoodItem[] = [
  {
    id: 31,
    title: "Chicken Fajita Bowl",
    description: "Sizzling chicken and bell peppers served over cilantro-lime rice with black beans and avocado.",
    calories: 480,
    protein: 38,
    carbs: 45,
    fat: 20,
    tags: ["mexican", "high-protein", "gluten-free"],
    prepTime: 30,
    image: "https://images.unsplash.com/photo-1599021400794-e0a26777419c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["chicken breast", "bell peppers", "onions", "rice", "black beans", "avocado", "lime", "cilantro"],
    mealType: "dinner",
    dietTypes: ["gluten-free"],
  },
  {
    id: 32,
    title: "Vegetarian Tacos",
    description: "Soft corn tortillas filled with seasoned black beans, roasted corn, salsa, and fresh cilantro.",
    calories: 350,
    protein: 15,
    carbs: 50,
    fat: 10,
    tags: ["mexican", "vegetarian", "quick"],
    prepTime: 20,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["corn tortillas", "black beans", "corn", "salsa", "cilantro", "lime"],
    mealType: "lunch",
    dietTypes: ["vegetarian", "gluten-free"],
  },
];