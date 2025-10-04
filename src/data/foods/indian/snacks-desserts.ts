import { FoodItem } from "@/types/food";
import { indianSavorySnacks } from "./snacks-desserts/snacks";
import { indianDesserts } from "./snacks-desserts/desserts";

export const indianSnacksDesserts: FoodItem[] = [
  ...indianSavorySnacks,
  ...indianDesserts,
];