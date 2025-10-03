import { FoodItem } from "@/types/food";

export const japaneseFoods: FoodItem[] = [
  {
    id: 37,
    title: "Salmon Sushi Bowl",
    description: "Deconstructed sushi bowl with seasoned rice, fresh salmon, avocado, cucumber, and nori.",
    calories: 450,
    protein: 28,
    carbs: 40,
    fat: 22,
    tags: ["japanese", "seafood", "healthy"],
    prepTime: 25,
    image: "https://images.unsplash.com/photo-1563612116625-30123f730e83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["sushi rice", "salmon", "avocado", "cucumber", "nori", "soy sauce"],
    mealType: "lunch",
    dietTypes: ["gluten-free"],
  },
  {
    id: 38,
    title: "Vegetable Tempura",
    description: "Lightly battered and fried assorted vegetables, served with a dashi-based dipping sauce.",
    calories: 300,
    protein: 8,
    carbs: 40,
    fat: 12,
    tags: ["japanese", "vegetarian", "snack"],
    prepTime: 20,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7247?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["assorted vegetables", "tempura batter", "dashi", "soy sauce", "mirin"],
    mealType: "snack",
    dietTypes: ["vegetarian"],
  },
];