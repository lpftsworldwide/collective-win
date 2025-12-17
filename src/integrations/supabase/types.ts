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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      demo_sessions: {
        Row: {
          created_at: string
          demo_balance: number
          ended_at: string | null
          game_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          demo_balance?: number
          ended_at?: string | null
          game_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          demo_balance?: number
          ended_at?: string | null
          game_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      demo_spins: {
        Row: {
          created_at: string
          id: string
          outcome_json: Json
          rng_seed: string | null
          session_id: string
          spin_index: number
          wager: number
          win_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          outcome_json: Json
          rng_seed?: string | null
          session_id: string
          spin_index: number
          wager: number
          win_amount?: number
        }
        Update: {
          created_at?: string
          id?: string
          outcome_json?: Json
          rng_seed?: string | null
          session_id?: string
          spin_index?: number
          wager?: number
          win_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_spins_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "demo_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      deposit_tracking: {
        Row: {
          amount: number
          created_at: string
          deposit_date: string
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          deposit_date?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          deposit_date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      fairplay_audit_log: {
        Row: {
          action: string
          client_ip: unknown
          created_at: string
          game_id: string
          id: string
          outcome_hash: string | null
          payout_amount: number | null
          rng_seed_hash: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          wager_amount: number | null
        }
        Insert: {
          action: string
          client_ip?: unknown
          created_at?: string
          game_id: string
          id?: string
          outcome_hash?: string | null
          payout_amount?: number | null
          rng_seed_hash?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          wager_amount?: number | null
        }
        Update: {
          action?: string
          client_ip?: unknown
          created_at?: string
          game_id?: string
          id?: string
          outcome_hash?: string | null
          payout_amount?: number | null
          rng_seed_hash?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          wager_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fairplay_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_providers: {
        Row: {
          api_endpoint: string | null
          code: string
          created_at: string
          id: string
          integration_type: string | null
          license_info: string | null
          license_jurisdiction: string | null
          name: string
          rng_certification: string | null
          status: Database["public"]["Enums"]["provider_status"]
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          code: string
          created_at?: string
          id?: string
          integration_type?: string | null
          license_info?: string | null
          license_jurisdiction?: string | null
          name: string
          rng_certification?: string | null
          status?: Database["public"]["Enums"]["provider_status"]
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          code?: string
          created_at?: string
          id?: string
          integration_type?: string | null
          license_info?: string | null
          license_jurisdiction?: string | null
          name?: string
          rng_certification?: string | null
          status?: Database["public"]["Enums"]["provider_status"]
          updated_at?: string
        }
        Relationships: []
      }
      game_rtp_config: {
        Row: {
          base_rtp: number
          current_rtp: number
          game_id: string
          rtp_max: number
          rtp_min: number
          updated_at: string
        }
        Insert: {
          base_rtp: number
          current_rtp: number
          game_id: string
          rtp_max: number
          rtp_min: number
          updated_at?: string
        }
        Update: {
          base_rtp?: number
          current_rtp?: number
          game_id?: string
          rtp_max?: number
          rtp_min?: number
          updated_at?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          end_time: string | null
          game_id: string
          id: string
          payout_amount: number
          start_time: string
          user_id: string
          wager_amount: number
        }
        Insert: {
          end_time?: string | null
          game_id: string
          id?: string
          payout_amount?: number
          start_time?: string
          user_id: string
          wager_amount: number
        }
        Update: {
          end_time?: string | null
          game_id?: string
          id?: string
          payout_amount?: number
          start_time?: string
          user_id?: string
          wager_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          document_type: Database["public"]["Enums"]["kyc_document_type"]
          file_name: string
          file_path: string
          file_size_bytes: number | null
          id: string
          mime_type: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          uploaded_at: string
          user_id: string
          verification_id: string
        }
        Insert: {
          document_type: Database["public"]["Enums"]["kyc_document_type"]
          file_name: string
          file_path: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          uploaded_at?: string
          user_id: string
          verification_id: string
        }
        Update: {
          document_type?: Database["public"]["Enums"]["kyc_document_type"]
          file_name?: string
          file_path?: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          uploaded_at?: string
          user_id?: string
          verification_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_documents_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "kyc_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_verifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          provider_reference: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string
          verification_provider: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          provider_reference?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id: string
          verification_provider?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          provider_reference?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
          verification_provider?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      licensed_games: {
        Row: {
          category: string
          created_at: string
          game_code: string
          id: string
          is_demo_available: boolean | null
          launch_url_template: string | null
          max_bet_aud: number | null
          min_bet_aud: number | null
          name: string
          provider_id: string | null
          release_date: string | null
          rtp_certified: number | null
          status: Database["public"]["Enums"]["game_status"]
          thumbnail_url: string | null
          updated_at: string
          volatility: string | null
        }
        Insert: {
          category: string
          created_at?: string
          game_code: string
          id?: string
          is_demo_available?: boolean | null
          launch_url_template?: string | null
          max_bet_aud?: number | null
          min_bet_aud?: number | null
          name: string
          provider_id?: string | null
          release_date?: string | null
          rtp_certified?: number | null
          status?: Database["public"]["Enums"]["game_status"]
          thumbnail_url?: string | null
          updated_at?: string
          volatility?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          game_code?: string
          id?: string
          is_demo_available?: boolean | null
          launch_url_template?: string | null
          max_bet_aud?: number | null
          min_bet_aud?: number | null
          name?: string
          provider_id?: string | null
          release_date?: string | null
          rtp_certified?: number | null
          status?: Database["public"]["Enums"]["game_status"]
          thumbnail_url?: string | null
          updated_at?: string
          volatility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licensed_games_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "game_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      responsible_gambling_settings: {
        Row: {
          cool_off_until: string | null
          created_at: string
          daily_deposit_limit: number | null
          id: string
          loss_limit_per_session: number | null
          monthly_deposit_limit: number | null
          reality_check_enabled: boolean | null
          self_exclusion_permanent: boolean | null
          self_exclusion_until: string | null
          session_reminder_interval: number | null
          session_time_limit: number | null
          updated_at: string
          user_id: string
          weekly_deposit_limit: number | null
        }
        Insert: {
          cool_off_until?: string | null
          created_at?: string
          daily_deposit_limit?: number | null
          id?: string
          loss_limit_per_session?: number | null
          monthly_deposit_limit?: number | null
          reality_check_enabled?: boolean | null
          self_exclusion_permanent?: boolean | null
          self_exclusion_until?: string | null
          session_reminder_interval?: number | null
          session_time_limit?: number | null
          updated_at?: string
          user_id: string
          weekly_deposit_limit?: number | null
        }
        Update: {
          cool_off_until?: string | null
          created_at?: string
          daily_deposit_limit?: number | null
          id?: string
          loss_limit_per_session?: number | null
          monthly_deposit_limit?: number | null
          reality_check_enabled?: boolean | null
          self_exclusion_permanent?: boolean | null
          self_exclusion_until?: string | null
          session_reminder_interval?: number | null
          session_time_limit?: number | null
          updated_at?: string
          user_id?: string
          weekly_deposit_limit?: number | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          transaction_hash: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status: string
          transaction_hash?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          transaction_hash?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          bonus_balance: number
          created_at: string
          display_name: string
          id: string
          is_bonus_claimed: boolean
          is_kyc_verified: boolean
          referral_code: string | null
          total_balance_aud: number
        }
        Insert: {
          bonus_balance?: number
          created_at?: string
          display_name: string
          id: string
          is_bonus_claimed?: boolean
          is_kyc_verified?: boolean
          referral_code?: string | null
          total_balance_aud?: number
        }
        Update: {
          bonus_balance?: number
          created_at?: string
          display_name?: string
          id?: string
          is_bonus_claimed?: boolean
          is_kyc_verified?: boolean
          referral_code?: string | null
          total_balance_aud?: number
        }
        Relationships: []
      }
      vip_profiles: {
        Row: {
          cashback_rate: number
          created_at: string
          free_spins_balance: number
          id: string
          points: number
          tier: Database["public"]["Enums"]["vip_tier"]
          tier_updated_at: string | null
          total_deposited: number
          total_wagered: number
          updated_at: string
          user_id: string
          weekly_bonus_multiplier: number
        }
        Insert: {
          cashback_rate?: number
          created_at?: string
          free_spins_balance?: number
          id?: string
          points?: number
          tier?: Database["public"]["Enums"]["vip_tier"]
          tier_updated_at?: string | null
          total_deposited?: number
          total_wagered?: number
          updated_at?: string
          user_id: string
          weekly_bonus_multiplier?: number
        }
        Update: {
          cashback_rate?: number
          created_at?: string
          free_spins_balance?: number
          id?: string
          points?: number
          tier?: Database["public"]["Enums"]["vip_tier"]
          tier_updated_at?: string | null
          total_deposited?: number
          total_wagered?: number
          updated_at?: string
          user_id?: string
          weekly_bonus_multiplier?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_play: { Args: { p_user_id: string }; Returns: boolean }
      check_deposit_limit: {
        Args: { p_amount: number; p_user_id: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_deposit: {
        Args: {
          p_amount: number
          p_transaction_hash?: string
          p_user_id: string
        }
        Returns: Json
      }
      process_wager_transaction: {
        Args: {
          p_game_id: string
          p_payout_amount?: number
          p_user_id: string
          p_wager_amount: number
        }
        Returns: Json
      }
      process_withdrawal: {
        Args: {
          p_amount: number
          p_transaction_hash?: string
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      game_status: "active" | "demo_only" | "coming_soon" | "disabled"
      kyc_document_type:
        | "passport"
        | "drivers_license"
        | "national_id"
        | "proof_of_address"
        | "bank_statement"
        | "selfie"
      kyc_status:
        | "pending"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "expired"
      provider_status:
        | "active"
        | "inactive"
        | "pending_integration"
        | "suspended"
      vip_tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
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
      app_role: ["admin", "moderator", "user"],
      game_status: ["active", "demo_only", "coming_soon", "disabled"],
      kyc_document_type: [
        "passport",
        "drivers_license",
        "national_id",
        "proof_of_address",
        "bank_statement",
        "selfie",
      ],
      kyc_status: [
        "pending",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "expired",
      ],
      provider_status: [
        "active",
        "inactive",
        "pending_integration",
        "suspended",
      ],
      vip_tier: ["bronze", "silver", "gold", "platinum", "diamond"],
    },
  },
} as const
