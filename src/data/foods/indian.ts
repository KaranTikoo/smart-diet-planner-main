import { FoodItem } from "@/types/food";
import { indianMainCourses } from "./indian/main-courses";
import { indianBreakfasts } from "./indian/breakfasts";
import { indianSnacksDesserts } from "./indian/snacks-desserts";
import { southIndianFoods } from "./indian/south-indian";
import { indianBeverages } from "./indian/beverages"; // New import

export const indianFoods: FoodItem[] = [
  ...indianMainCourses,
  ...indianBreakfasts,
  ...indianSnacksDesserts,
  ...southIndianFoods,
  ...indianBeverages, // Include beverages
];