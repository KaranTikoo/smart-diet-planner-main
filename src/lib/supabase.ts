import { supabase as generatedSupabase } from '@/integrations/supabase/client'
import { Database, Tables, Enums } from '@/integrations/supabase/types'

export const supabase = generatedSupabase

// Export types for convenience
export type Profile = Tables<'profiles'>
export type FoodEntry = Tables<'food_entries'>
export type WeightEntry = Tables<'weight_entries'>
export type MealPlan = Tables<'meal_plans'>
export type WaterIntake = Tables<'water_intake'>

// Export enums for convenience
export type GenderEnum = Enums<'gender_enum'>
export type ActivityLevelEnum = Enums<'activity_level_enum'>
export type GoalTypeEnum = Enums<'goal_type_enum'>
export type MealTypeEnum = Enums<'meal_type_enum'>

// Also export the full Database type if needed
export type AppDatabase = Database