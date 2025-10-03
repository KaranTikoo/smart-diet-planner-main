import { FoodItem } from "@/types/food";
import { americanFoods } from "./foods/american";
import { indianFoods } from "./foods/indian";
import { mexicanFoods } from "./foods/mexican";
import { italianFoods } from "./foods/italian";
import { thaiFoods } from "./foods/thai";
import { japaneseFoods } from "./foods/japanese";
import { mediterraneanFoods } from "./foods/mediterranean";
import { seafoodFoods } from "./foods/seafood";
import { vegetarianFoods } from "./foods/vegetarian";
import { meatFoods } from "./foods/meat";

export const mockFoodDatabase: FoodItem[] = [
  ...americanFoods,
  ...indianFoods,
  ...mexicanFoods,
  ...italianFoods,
  ...thaiFoods,
  ...japaneseFoods,
  ...mediterraneanFoods,
  ...seafoodFoods,
  ...vegetarianFoods,
  ...meatFoods,
];

export default mockFoodDatabase;