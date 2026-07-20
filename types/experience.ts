import type { ZodSchema } from "zod";
import type { ComponentType } from "react";

export type ExperienceType =
  | "digital_card"
  | "spotify_cassette"
  | "apology_letter"
  | "love_letter"
  | "birthday_page"
  | "memory_timeline"
  | "countdown"
  | "invitation"
  | "gift_reveal"
  | "confession";

export interface EditorProps<TConfig> {
  config: TConfig;
  onChange: (config: TConfig) => void;
  isAuthenticated: boolean;
  returnPath?: string;
}

export interface ViewerProps<TConfig> {
  config: TConfig;
  title: string;
  experienceId?: string;
}

export interface ExperienceMeta {
  type: ExperienceType;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  sortOrder: number;
}

export interface ExperiencePlugin<TConfig = Record<string, unknown>> {
  type: ExperienceType;
  meta: ExperienceMeta;
  defaultConfig: TConfig;
  configSchema: ZodSchema<TConfig>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Editor: ComponentType<EditorProps<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Viewer: ComponentType<ViewerProps<any>>;
}

export interface DigitalCardConfig {
  configVersion: number;
  recipientName: string;
  senderName: string;
  message: string;
  accentColor: string;
  backgroundStyle: "gradient" | "solid" | "pattern";
  imageUrl?: string;
}

export interface ApologyLetterConfig {
  configVersion: number;
  recipientName: string;
  senderName: string;
  greeting: string;
  body: string;
  closing: string;
  signature: string;
  accentColor: string;
}

export interface SpotifyCassetteConfig {
  configVersion: number;
  title: string;
  subtitle: string;
  playlistId?: string;
  playlistName?: string;
  playlistImageUrl?: string;
  coverColor: string;
  customCoverUrl?: string;
}

export interface CountdownConfig {
  configVersion: number;
  title: string;
  message: string;
  targetDate: string;
  accentColor: string;
}

export interface LoveLetterConfig {
  configVersion: number;
  recipientName: string;
  senderName: string;
  message: string;
  accentColor: string;
  photoUrls: string[];
}

export interface BirthdayPageConfig {
  configVersion: number;
  name: string;
  age: number;
  message: string;
  accentColor: string;
}

export interface MemoryTimelineConfig {
  configVersion: number;
  title: string;
  memories: Array<{ date: string; title: string; description: string }>;
  accentColor: string;
}

export interface InvitationConfig {
  configVersion: number;
  eventName: string;
  date: string;
  location: string;
  message: string;
  accentColor: string;
}

export interface GiftRevealConfig {
  configVersion: number;
  title: string;
  revealMessage: string;
  giftDescription: string;
  accentColor: string;
}

export interface ConfessionConfig {
  configVersion: number;
  message: string;
  accentColor: string;
  anonymous: boolean;
}

export type ExperienceConfig =
  | DigitalCardConfig
  | ApologyLetterConfig
  | SpotifyCassetteConfig
  | CountdownConfig
  | LoveLetterConfig
  | BirthdayPageConfig
  | MemoryTimelineConfig
  | InvitationConfig
  | GiftRevealConfig
  | ConfessionConfig;
