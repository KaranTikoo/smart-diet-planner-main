import { FoodItem } from "@/types/food";

export const mediterraneanFoods: FoodItem[] = [
  {
    id: 39,
    title: "Chicken Gyro Bowl",
    description: "Grilled chicken, fresh salad, tzatziki, and feta cheese served over a bed of quinoa.",
    calories: 480,
    protein: 40,
    carbs: 35,
    fat: 20,
    tags: ["mediterranean", "high-protein"],
    prepTime: 30,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2380&q=80",
    ingredients: ["chicken", "quinoa", "cucumber", "tomatoes", "feta cheese", "tzatziki"],
    mealType: "lunch",
    dietTypes: ["gluten-free"],
  },
  {
    id: 40,
    title: "Falafel Wrap",
    description: "Crispy falafel, hummus, fresh vegetables, and tahini sauce wrapped in a warm pita.",
    calories: 390,
    protein: 15,
    carbs: 50,
    fat: 15,
    tags: ["mediterranean", "vegan", "quick"],
    prepTime: 20,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    ingredients: ["falafel", "pita bread", "hummus", "cucumber", "tomatoes", "tahini"],
    mealType: "lunch",
    dietTypes: ["vegan", "vegetarian"],
  },
];