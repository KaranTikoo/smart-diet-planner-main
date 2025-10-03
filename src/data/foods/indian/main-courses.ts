import { FoodItem } from "@/types/food";
import { indianChickenMainCourses } from "./main-courses/chicken";
import { indianPaneerMainCourses } from "./main-courses/paneer";
import { indianDalMainCourses } from "./main-courses/dal";
import { indianVegetableCurries } from "./main-courses/vegetable-curries";
import { indianLambMuttonMainCourses } from "./main-courses/lamb-mutton";
import { indianRiceMainCourses } from "./main-courses/rice-dishes";

export const indianMainCourses: FoodItem[] = [
  ...indianChickenMainCourses,
  ...indianPaneerMainCourses,
  ...indianDalMainCourses,
  ...indianVegetableCurries,
  ...indianLambMuttonMainCourses,
  ...indianRiceMainCourses,
];