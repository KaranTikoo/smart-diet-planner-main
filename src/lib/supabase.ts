import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if running in development without Supabase connection
const isSupabaseConnected = supabaseUrl && supabaseAnonKey

if (!isSupabaseConnected) {
  console.warn('Supabase not connected. Please connect your project to Supabase using the green button in the top right.')
}

export const supabase = isSupabaseConnected 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface Profile {
  id: string
  email: string
  full_name?: string
  age?: number
  gender?: 'male' | 'female' | 'other'
  height?: number
  current_weight?: number
  goal_weight?: number
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  goal_type?: 'lose_weight' | 'maintain_weight' | 'gain_weight'
  daily_calorie_goal?: number
  created_at: string
  updated_at: string
}

export interface FoodEntry {
  id: string
  user_id: string
  food_name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  serving_size?: string
  entry_date: string
  created_at: string
}

export interface WeightEntry {
  id: string
  user_id: string
  weight: number
  entry_date: string
  notes?: string
  created_at: string
}

export interface MealPlan {
  id: string
  user_id: string
  plan_name: string
  plan_date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: Array<{
    name: string
    calories: number
    prepTime?: number
  }>
  total_calories?: number
  prep_time?: number
  created_at: string
  updated_at: string
}

export interface WaterIntake {
  id: string
  user_id: string
  amount_ml: number
  entry_date: string
  created_at: string
}