import { FoodItem } from "@/types/food";
import { indianMainCourses } from "./indian/main-courses";
import { indianBreakfasts } from "./indian/breakfasts";
import { indianSnacksDesserts } from "./indian/snacks-desserts";
import { southIndianFoods } from "./indian/south-indian";

export const indianFoods: FoodItem[] = [
  ...indianMainCourses,
  ...indianBreakfasts,
  ...indianSnacksDesserts,
  ...southIndianFoods,
];