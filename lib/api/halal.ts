/**
 * EVEX Halal Intelligence API Client
 * Connects to evex-coach backend's halal nutrition endpoints.
 * MENA-specific food analysis with protein profiling.
 */
import { createApiClient } from "./client";
import { API_CONFIG } from "@/constants/api";

const coachClient = createApiClient({
  baseURL: API_CONFIG.coach.baseUrl,
  timeout: API_CONFIG.coach.timeout,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type HalalStatus =
  | "halal"
  | "halal_certified"
  | "vegetarian_halal"
  | "doubtful"
  | "not_halal";

export type ProteinTier = "high" | "moderate" | "low";

export type FoodCategory =
  | "meat"
  | "poultry"
  | "seafood"
  | "dairy"
  | "legumes"
  | "grains"
  | "vegetables"
  | "fruits"
  | "mixed"
  | "dessert"
  | "beverage";

export type CuisineOrigin =
  | "gulf"
  | "levantine"
  | "egyptian"
  | "moroccan"
  | "yemeni"
  | "turkish"
  | "persian"
  | "pan_arab";

export type FitnessGoal = "muscle_gain" | "fat_loss" | "maintain";

export interface FoodItem {
  id: string;
  name_ar: string;
  name_en: string;
  category: FoodCategory;
  cuisine_origin: CuisineOrigin;
  halal_status: HalalStatus;
  protein_tier: ProteinTier;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  serving_size_g: number;
  is_high_protein: boolean;
  halal_notes_ar: string;
  halal_notes_en: string;
  preparation_tips_ar: string;
  preparation_tips_en: string;
  tags: string[];
}

export interface HalalAnalysisRequest {
  min_protein_g?: number;
  cuisine_filter?: CuisineOrigin;
  category_filter?: FoodCategory;
  halal_only?: boolean;
  sort_by?: "protein" | "calories" | "name";
}

export interface HalalAnalysisResponse {
  total_items: number;
  high_protein_halal_count: number;
  items: FoodItem[];
  protein_summary: {
    high_protein_count: number;
    moderate_protein_count: number;
    avg_protein_per_serving: number;
    max_protein_item: string | null;
    best_protein_per_calorie: string | null;
  };
  cuisine_breakdown: Record<string, { count: number; avg_protein: number; items: string[] }>;
}

export interface SmartRecommendationRequest {
  goal?: FitnessGoal;
  calories_target?: number;
  protein_target_g?: number;
  cuisine_preference?: CuisineOrigin;
  meals_remaining?: number;
}

export interface RestaurantRecommendation {
  food_item: FoodItem;
  score: number;
  reason_ar: string;
  reason_en: string;
}

export interface SmartRecommendationResponse {
  recommendations: RestaurantRecommendation[];
  total_protein_achievable: number;
  total_calories: number;
  coverage_percentage: number;
}

export interface CuisineInfo {
  id: CuisineOrigin;
  name_ar: string;
  name_en: string;
  food_count: number;
  avg_protein_g: number;
}

export interface ProteinRankingItem {
  rank: number;
  food: FoodItem;
  protein_per_100cal: number;
}

// ─── API Methods ──────────────────────────────────────────────────────────────

export const halalApi = {
  /** Analyze MENA foods for halal compliance and protein profiling */
  async analyzeFoods(request: HalalAnalysisRequest = {}): Promise<HalalAnalysisResponse> {
    const res = await coachClient.post("/api/halal/analyze", request);
    return res.data;
  },

  /** Get smart food recommendations based on fitness goals */
  async getRecommendations(request: SmartRecommendationRequest = {}): Promise<SmartRecommendationResponse> {
    const res = await coachClient.post("/api/halal/recommend", request);
    return res.data;
  },

  /** List all MENA foods with optional filters */
  async listFoods(params?: {
    cuisine?: CuisineOrigin;
    category?: FoodCategory;
    high_protein_only?: boolean;
  }): Promise<{ total: number; foods: FoodItem[] }> {
    const res = await coachClient.get("/api/halal/foods", { params });
    return res.data;
  },

  /** Get detailed info about a specific food */
  async getFoodById(foodId: string): Promise<FoodItem> {
    const res = await coachClient.get(`/api/halal/foods/${foodId}`);
    return res.data;
  },

  /** List supported MENA cuisines with stats */
  async getCuisines(): Promise<{ cuisines: CuisineInfo[] }> {
    const res = await coachClient.get("/api/halal/cuisines");
    return res.data;
  },

  /** Get protein ranking of all foods */
  async getProteinRanking(topN: number = 10, halalOnly: boolean = true): Promise<{
    ranking: ProteinRankingItem[];
    best_efficiency: ProteinRankingItem | null;
  }> {
    const res = await coachClient.get("/api/halal/protein-ranking", {
      params: { top_n: topN, halal_only: halalOnly },
    });
    return res.data;
  },
};

export default halalApi;
