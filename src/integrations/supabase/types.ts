export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          age: number | null
          gender: Database['public']['Enums']['gender_enum'] | null
          height: number | null
          current_weight: number | null
          goal_weight: number | null
          activity_level: Database['public']['Enums']['activity_level_enum'] | null
          goal_type: Database['public']['Enums']['goal_type_enum'] | null
          daily_calorie_goal: number | null
          water_goal_ml: number | null
          diet_type: Database['public']['Enums']['diet_type_enum'] | null
          allergies: string[] | null
          avoid_foods: string | null
          meals_per_day: number | null
          snacks_per_day: number | null
          preparation_time_preference: Database['public']['Enums']['prep_time_enum'] | null
          cooking_skill_level: Database['public']['Enums']['cooking_skill_enum'] | null
          budget_preference: Database['public']['Enums']['budget_enum'] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          age?: number | null
          gender?: Database['public']['Enums']['gender_enum'] | null
          height?: number | null
          current_weight?: number | null
          goal_weight?: number | null
          activity_level?: Database['public']['Enums']['activity_level_enum'] | null
          goal_type?: Database['public']['Enums']['goal_type_enum'] | null
          daily_calorie_goal?: number | null
          water_goal_ml?: number | null
          diet_type?: Database['public']['Enums']['diet_type_enum'] | null
          allergies?: string[] | null
          avoid_foods?: string | null
          meals_per_day?: number | null
          snacks_per_day?: number | null
          preparation_time_preference?: Database['public']['Enums']['prep_time_enum'] | null
          cooking_skill_level?: Database['public']['Enums']['cooking_skill_enum'] | null
          budget_preference?: Database['public']['Enums']['budget_enum'] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          age?: number | null
          gender?: Database['public']['Enums']['gender_enum'] | null
          height?: number | null
          current_weight?: number | null
          goal_weight?: number | null
          activity_level?: Database['public']['Enums']['activity_level_enum'] | null
          goal_type?: Database['public']['Enums']['goal_type_enum'] | null
          daily_calorie_goal?: number | null
          water_goal_ml?: number | null
          diet_type?: Database['public']['Enums']['diet_type_enum'] | null
          allergies?: string[] | null
          avoid_foods?: string | null
          meals_per_day?: number | null
          snacks_per_day?: number | null
          preparation_time_preference?: Database['public']['Enums']['prep_time_enum'] | null
          cooking_skill_level?: Database['public']['Enums']['cooking_skill_enum'] | null
          budget_preference?: Database['public']['Enums']['budget_enum'] | null
          created_at?: string
          updated_at?: string
        }
      }
      food_entries: {
        Row: {
          id: string
          user_id: string
          food_name: string
          calories: number
          protein: number | null
          carbs: number | null
          fat: number | null
          meal_type: Database['public']['Enums']['meal_type_enum']
          serving_size: string | null
          entry_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_name: string
          calories: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          meal_type: Database['public']['Enums']['meal_type_enum']
          serving_size?: string | null
          entry_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_name?: string
          calories?: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          meal_type?: Database['public']['Enums']['meal_type_enum']
          serving_size?: string | null
          entry_date?: string
          created_at?: string
        }
      }
      weight_entries: {
        Row: {
          id: string
          user_id: string
          weight: number
          entry_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          entry_date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          entry_date?: string
          notes?: string | null
          created_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          plan_name: string
          plan_date: string
          meal_type: Database['public']['Enums']['meal_type_enum']
          foods: Json | null // Added foods column
          total_calories: number | null
          prep_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_name: string
          plan_date: string
          meal_type: Database['public']['Enums']['meal_type_enum']
          foods?: Json | null // Added foods column
          total_calories?: number | null
          prep_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_name?: string
          plan_date?: string
          meal_type?: Database['public']['Enums']['meal_type_enum']
          foods?: Json | null // Added foods column
          total_calories?: number | null
          prep_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      water_intake: {
        Row: {
          id: string
          user_id: string
          amount_ml: number
          entry_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_ml: number
          entry_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount_ml?: number
          entry_date?: string
          created_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          user_id: string
          name: string
          quantity: number
          unit: string | null
          category: string | null
          expiration_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          quantity?: number
          unit?: string | null
          category?: string | null
          expiration_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          quantity?: number
          unit?: string | null
          category?: string | null
          expiration_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_enum: 'male' | 'female' | 'other'
      activity_level_enum: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
      goal_type_enum: 'lose_weight' | 'maintain_weight' | 'gain_weight'
      meal_type_enum: 'breakfast' | 'lunch' | 'dinner' | 'snack'
      diet_type_enum: 'no_restrictions' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'low_carb' | 'mediterranean' | 'gluten_free' | 'dairy_free'
      prep_time_enum: 'quick' | 'moderate' | 'extended'
      cooking_skill_enum: 'beginner' | 'intermediate' | 'advanced'
      budget_enum: 'low' | 'medium' | 'high'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  EnumName extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumTableName extends EnumName extends { schema: keyof Database }
    ? keyof Database[EnumName["schema"]]["Enums"]
    : never = never,
> = EnumName extends { schema: keyof Database }
  ? Database[EnumName["schema"]]["Enums"][EnumTableName]
  : EnumName extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][EnumName]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_enum: {
        male: 'male',
        female: 'female',
        other: 'other',
      },
      activity_level_enum: {
        sedentary: 'sedentary',
        lightly_active: 'lightly_active',
        moderately_active: 'moderately_active',
        very_active: 'very_active',
        extremely_active: 'extremely_active',
      },
      goal_type_enum: {
        lose_weight: 'lose_weight',
        maintain_weight: 'maintain_weight',
        gain_weight: 'gain_weight',
      },
      meal_type_enum: {
        breakfast: 'breakfast',
        lunch: 'lunch',
        dinner: 'dinner',
        snack: 'snack',
      },
      diet_type_enum: {
        no_restrictions: 'no_restrictions',
        vegetarian: 'vegetarian',
        vegan: 'vegan',
        keto: 'keto',
        paleo: 'paleo',
        low_carb: 'low_carb',
        mediterranean: 'mediterranean',
        gluten_free: 'gluten_free',
        dairy_free: 'dairy_free',
      },
      prep_time_enum: {
        quick: 'quick',
        moderate: 'moderate',
        extended: 'extended',
      },
      cooking_skill_enum: {
        beginner: 'beginner',
        intermediate: 'intermediate',
        advanced: 'advanced',
      },
      budget_enum: {
        low: 'low',
        medium: 'medium',
        high: 'high',
      },
    },
  },
} as const