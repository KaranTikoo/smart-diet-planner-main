import { supabase as generatedSupabase } from '@/integrations/supabase/client'
import { Database, Tables, Enums } from '@/integrations/supabase/types'

export const supabase = generatedSupabase

// Export types for convenience
export type Profile = Tables<'profiles'>
export type FoodEntry = Tables<'food_entries'>
export type WeightEntry = Tables<'weight_entries'>
export type MealPlan = Tables<'meal_plans'>
export type WaterIntake = Tables<'water_intake'>
export type InventoryItem = Tables<'inventory_items'>
export type CustomFood = Tables<'custom_foods'>

// Export enums for convenience
export type GenderEnum = Enums<'gender_enum'>
export type ActivityLevelEnum = Enums<'activity_level_enum'>
export type GoalTypeEnum = Enums<'goal_type_enum'>
export type MealTypeEnum = Enums<'meal_type_enum'>
export type DietTypeEnum = Enums<'diet_type_enum'> // New enum export
export type PrepTimeEnum = Enums<'prep_time_enum'> // New enum export
export type CookingSkillEnum = Enums<'cooking_skill_enum'> // New enum export
export type BudgetEnum = Enums<'budget_enum'> // New enum export

// Also export the full Database type if needed
export type AppDatabase = Database