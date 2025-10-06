import { FoodItem } from "@/types/food";
import { americanFoods } from "@/data/foods/american";
import { mexicanFoods } from "@/data/foods/mexican";
import { italianFoods } from "@/data/foods/italian";
import { japaneseFoods } from "@/data/foods/japanese";
import { mediterraneanFoods } from "@/data/foods/mediterranean";
import { thaiFoods } from "@/data/foods/thai";
import { meatFoods } from "@/data/foods/meat";
import { seafoodFoods } from "@/data/foods/seafood";
import { vegetarianFoods } from "@/data/foods/vegetarian";

// Import specific Indian food categories
import { indianBeverages } from "@/data/foods/indian-foods/beverages";
import { indianBreakfasts } from "@/data/foods/indian-foods/breakfasts";
import { indianChickenMainCourses } from "@/data/foods/indian-foods/main-courses/chicken";
import { indianDalMainCourses } from "@/data/foods/indian-foods/main-courses/dal";
import { indianLambMuttonMainCourses } from "@/data/foods/indian-foods/main-courses/lamb-mutton";
import { indianPaneerMainCourses } from "@/data/foods/indian-foods/main-courses/paneer";
import { indianRiceMainCourses } from "@/data/foods/indian-foods/main-courses/rice-dishes";
import { indianVegetableCurries } from "@/data/foods/indian-foods/main-courses/vegetable-curries";
import { indianDesserts } from "@/data/foods/indian-foods/snacks-desserts/desserts";
import { indianSavorySnacks } from "@/data/foods/indian-foods/snacks-desserts/snacks";
import { southIndianFoods } from "@/data/foods/indian-foods/south-indian";


export const mockFoodDatabase: FoodItem[] = [
  ...americanFoods,
  ...mexicanFoods,
  ...italianFoods,
  ...japaneseFoods,
  ...mediterraneanFoods,
  ...thaiFoods,
  ...meatFoods,
  ...seafoodFoods,
  ...vegetarianFoods,
  // Add all specific Indian food categories
  ...indianBeverages,
  ...indianBreakfasts,
  ...indianChickenMainCourses,
  ...indianDalMainCourses,
  ...indianLambMuttonMainCourses,
  ...indianPaneerMainCourses,
  ...indianRiceMainCourses,
  ...indianVegetableCurries,
  ...indianDesserts,
  ...indianSavorySnacks,
  ...southIndianFoods,
];