/**
 * EVEX Ramadan Adaptive Planner API Client v1.2.0
 * Connects to evex-fit backend's Ramadan planner endpoints.
 * Handles fasting-aware workout adjustments for MENA region.
 *
 * ENHANCED (v1.2.0):
 * - Added: gender, ramadan_day, is_ramadan fields in request
 * - Added: outdoor_warning, fasting_hours, progressive notes in response
 * - Added: progressive load awareness (day tracking)
 */
import { createApiClient } from "./client";
import { API_CONFIG } from "@/constants/api";

const fitClient = createApiClient({
  baseURL: API_CONFIG.fit.baseUrl,
  timeout: API_CONFIG.fit.timeout,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type MENACity =
  | "riyadh"
  | "dubai"
  | "cairo"
  | "jeddah"
  | "doha"
  | "kuwait"
  | "muscat"
  | "amman"
  | "manama"
  | "abu_dhabi";

export type FastingStatus =
  | "fasting"
  | "not_fasting"
  | "pre_iftar"
  | "post_iftar"
  | "suhoor_window";

export type RamadanWorkoutWindow =
  | "pre_suhoor"
  | "morning_fasting"
  | "afternoon_fasting"
  | "pre_iftar"
  | "post_iftar"
  | "late_night";

export interface IntensityModifier {
  volume_multiplier: number;
  intensity_multiplier: number;
  rest_multiplier: number;
  max_duration_minutes: number;
  hydration_warning: boolean;
  outdoor_warning: boolean;
  recommendation_ar: string;
  recommendation_en: string;
}

export interface RamadanExercise {
  name_ar: string;
  name_en: string;
  duration_min: number;
  type: string;
}

export interface RamadanPlanRequest {
  city: MENACity;
  current_time_override?: string;
  user_fitness_level?: string;
  preferred_workout_type?: string;
  gender?: "male" | "female";
  ramadan_day?: number; // Day 1-30 for progressive adjustment
  is_ramadan?: boolean; // False = return normal (non-Ramadan) plan
}

export interface RamadanPlanResponse {
  city: string;
  fasting_status: FastingStatus;
  workout_window: RamadanWorkoutWindow;
  fajr_time: string;
  maghrib_time: string;
  current_local_time: string;
  intensity_modifier: IntensityModifier;
  recommended_exercises: RamadanExercise[];
  tips_ar: string[];
  tips_en: string[];
  fasting_hours: number;
  ramadan_day: number | null;
  progressive_note_ar: string;
  progressive_note_en: string;
}

export interface FastingStatusResponse {
  city: string;
  current_local_time: string;
  fasting_status: FastingStatus;
  workout_window: RamadanWorkoutWindow;
  intensity_modifier: IntensityModifier;
  can_train_full_intensity: boolean;
  fasting_hours: number;
}

export interface CityInfo {
  id: MENACity;
  name_ar: string;
  name_en: string;
  fajr: string;
  maghrib: string;
  tz_offset: number;
  avg_temp_c: number;
}

export interface WorkoutWindowInfo {
  window: RamadanWorkoutWindow;
  modifier: IntensityModifier;
  recommended_exercises: RamadanExercise[];
}

// ─── API Methods ──────────────────────────────────────────────────────────────

export const ramadanApi = {
  /** Generate a Ramadan-adapted workout plan based on current time and city */
  async getPlan(request: RamadanPlanRequest): Promise<RamadanPlanResponse> {
    const res = await fitClient.post("/api/ramadan/plan", request);
    return res.data;
  },

  /** Get current fasting status for a city */
  async getFastingStatus(
    city: MENACity = "dubai",
    timeOverride?: string
  ): Promise<FastingStatusResponse> {
    const params: Record<string, string> = { city };
    if (timeOverride) params.time_override = timeOverride;
    const res = await fitClient.get("/api/ramadan/status", { params });
    return res.data;
  },

  /** Get all supported MENA cities with prayer times */
  async getCities(): Promise<{ cities: CityInfo[] }> {
    const res = await fitClient.get("/api/ramadan/cities");
    return res.data;
  },

  /** Get all Ramadan workout windows with intensity modifiers */
  async getWorkoutWindows(): Promise<{ windows: WorkoutWindowInfo[] }> {
    const res = await fitClient.get("/api/ramadan/windows");
    return res.data;
  },
};

export default ramadanApi;
