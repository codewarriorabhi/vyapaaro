export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          shop_id: string
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items?: Json
          shop_id: string
          status?: string
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          shop_id?: string
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string
          destination: string
          expires_at: string
          id: string
          type: string
          verified: boolean
        }
        Insert: {
          code: string
          created_at?: string
          destination: string
          expires_at: string
          id?: string
          type: string
          verified?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          destination?: string
          expires_at?: string
          id?: string
          type?: string
          verified?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image: string
          images: string[] | null
          in_stock: boolean
          name: string
          original_price: number | null
          price: number
          rating: number
          review_count: number
          shop_id: string
          specifications: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          images?: string[] | null
          in_stock?: boolean
          name: string
          original_price?: number | null
          price: number
          rating?: number
          review_count?: number
          shop_id: string
          specifications?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          images?: string[] | null
          in_stock?: boolean
          name?: string
          original_price?: number | null
          price?: number
          rating?: number
          review_count?: number
          shop_id?: string
          specifications?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string
          avatar_url: string | null
          created_at: string
          email: string
          email_verified: boolean
          first_name: string
          id: string
          phone: string
          phone_verified: boolean
          surname: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          avatar_url?: string | null
          created_at?: string
          email: string
          email_verified?: boolean
          first_name: string
          id?: string
          phone: string
          phone_verified?: boolean
          surname: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          avatar_url?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean
          first_name?: string
          id?: string
          phone?: string
          phone_verified?: boolean
          surname?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          shop_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          shop_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          shop_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_events_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          owner_reply: string | null
          owner_reply_at: string | null
          rating: number
          shop_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string
          created_at?: string
          id?: string
          owner_reply?: string | null
          owner_reply_at?: string | null
          rating: number
          shop_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          owner_reply?: string | null
          owner_reply_at?: string | null
          rating?: number
          shop_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_reviews_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string
          category: string
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          owner_id: string
          phone: string | null
          photos: string[] | null
          tags: string[] | null
          updated_at: string
          whatsapp: string | null
          working_hours: string | null
        }
        Insert: {
          address: string
          category: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          owner_id: string
          phone?: string | null
          photos?: string[] | null
          tags?: string[] | null
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Update: {
          address?: string
          category?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          owner_id?: string
          phone?: string | null
          photos?: string[] | null
          tags?: string[] | null
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          allow_contact: boolean
          auto_detect_location: boolean
          created_at: string
          email_notifs: boolean
          id: string
          language: string
          location_radius: string
          manual_location: string
          new_shops_nearby: boolean
          order_updates: boolean
          promo_offers: boolean
          public_profile: boolean
          review_notifs: boolean
          review_replies: boolean
          review_visibility: boolean
          show_email: boolean
          show_phone: boolean
          show_reviews: boolean
          sms_notifs: boolean
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_contact?: boolean
          auto_detect_location?: boolean
          created_at?: string
          email_notifs?: boolean
          id?: string
          language?: string
          location_radius?: string
          manual_location?: string
          new_shops_nearby?: boolean
          order_updates?: boolean
          promo_offers?: boolean
          public_profile?: boolean
          review_notifs?: boolean
          review_replies?: boolean
          review_visibility?: boolean
          show_email?: boolean
          show_phone?: boolean
          show_reviews?: boolean
          sms_notifs?: boolean
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_contact?: boolean
          auto_detect_location?: boolean
          created_at?: string
          email_notifs?: boolean
          id?: string
          language?: string
          location_radius?: string
          manual_location?: string
          new_shops_nearby?: boolean
          order_updates?: boolean
          promo_offers?: boolean
          public_profile?: boolean
          review_notifs?: boolean
          review_replies?: boolean
          review_visibility?: boolean
          show_email?: boolean
          show_phone?: boolean
          show_reviews?: boolean
          sms_notifs?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      shop_daily_stats: {
        Row: {
          calls: number | null
          clicks: number | null
          inquiries: number | null
          shares: number | null
          shop_id: string | null
          stat_date: string | null
          views: number | null
          whatsapp_clicks: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_events_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_shop_analytics: {
        Args: { _days?: number; _shop_id: string }
        Returns: {
          calls: number
          clicks: number
          inquiries: number
          shares: number
          stat_date: string
          views: number
          whatsapp_clicks: number
        }[]
      }
      get_shop_rating: {
        Args: { _shop_id: string }
        Returns: {
          avg_rating: number
          review_count: number
        }[]
      }
      get_shop_totals: {
        Args: { _days?: number; _shop_id: string }
        Returns: {
          total_calls: number
          total_clicks: number
          total_inquiries: number
          total_shares: number
          total_views: number
          total_whatsapp: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_shops: {
        Args: {
          filter_categories?: string[]
          filter_min_rating?: number
          result_limit?: number
          result_offset?: number
          search_query?: string
          sort_by?: string
        }
        Returns: {
          address: string
          category: string
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          owner_id: string
          phone: string | null
          photos: string[] | null
          tags: string[] | null
          updated_at: string
          whatsapp: string | null
          working_hours: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "shops"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      app_role: "customer" | "shop_owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "shop_owner"],
    },
  },
} as const
