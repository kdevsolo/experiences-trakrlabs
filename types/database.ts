export type ExperienceStatus = "published" | "archived";
export type PaymentStatus = "pending" | "completed" | "failed";
export type AnalyticsEventType = "view" | "open" | "click" | "share" | "accept_apology";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string | null;
  thumbnail_url: string | null;
  default_config: Record<string, unknown>;
  editor_schema: Record<string, unknown> | null;
  sort_order: number;
  available: boolean;
}

export interface Theme {
  id: string;
  name: string;
  tokens: Record<string, unknown>;
  preview_url: string | null;
}

export interface Draft {
  id: string;
  user_id: string;
  template_id: string | null;
  theme_id: string | null;
  experience_type: string;
  title: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  user_id: string;
  template_id: string | null;
  theme_id: string | null;
  experience_type: string;
  title: string;
  slug: string;
  share_slug: string | null;
  config: Record<string, unknown>;
  status: ExperienceStatus;
  creator_ip: string | null;
  share_unlocked: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  experience_id: string;
  provider: string;
  provider_payment_id: string | null;
  amount_inr: number;
  status: PaymentStatus;
  created_at: string;
  completed_at: string | null;
}

export interface AnalyticsEvent {
  id: string;
  experience_id: string;
  event_type: AnalyticsEventType;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface MusicConnection {
  id: string;
  user_id: string;
  provider: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: Partial<Profile>;
        Relationships: [];
      };
      templates: {
        Row: Template;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          type: string;
          description?: string | null;
          thumbnail_url?: string | null;
          default_config?: Record<string, unknown>;
          editor_schema?: Record<string, unknown> | null;
          sort_order?: number;
          available?: boolean;
        };
        Update: Partial<Template>;
        Relationships: [];
      };
      themes: {
        Row: Theme;
        Insert: {
          id?: string;
          name: string;
          tokens?: Record<string, unknown>;
          preview_url?: string | null;
        };
        Update: Partial<Theme>;
        Relationships: [];
      };
      drafts: {
        Row: Draft;
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          theme_id?: string | null;
          experience_type: string;
          title?: string;
          config?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Draft>;
        Relationships: [];
      };
      experiences: {
        Row: Experience;
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          theme_id?: string | null;
          experience_type: string;
          title: string;
          slug: string;
          config?: Record<string, unknown>;
          status?: ExperienceStatus;
          creator_ip?: string | null;
          share_unlocked?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Experience>;
        Relationships: [];
      };
      payments: {
        Row: Payment;
        Insert: {
          id?: string;
          user_id: string;
          experience_id: string;
          provider?: string;
          provider_payment_id?: string | null;
          amount_inr?: number;
          status?: PaymentStatus;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Payment>;
        Relationships: [];
      };
      analytics: {
        Row: AnalyticsEvent;
        Insert: {
          id?: string;
          experience_id: string;
          event_type: AnalyticsEventType;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: Partial<AnalyticsEvent>;
        Relationships: [];
      };
      music_connections: {
        Row: MusicConnection;
        Insert: {
          id?: string;
          user_id: string;
          provider?: string;
          access_token: string;
          refresh_token?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: Partial<MusicConnection>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      experience_status: ExperienceStatus;
      payment_status: PaymentStatus;
      analytics_event_type: AnalyticsEventType;
    };
    CompositeTypes: Record<string, never>;
  };
}
