/**
 * EVEX API Configuration
 * Isolated endpoints for each microservice.
 */

export const API_CONFIG = {
  /** EVEX Lab - Blood work, health metrics */
  lab: {
    baseUrl: process.env.EXPO_PUBLIC_LAB_API_URL ?? "https://api.evex.app/lab/v1",
    timeout: 15000,
  },
  /** EVEX Fit - Workout tracking, exercise library */
  fit: {
    baseUrl: process.env.EXPO_PUBLIC_FIT_API_URL ?? "https://api.evex.app/fit/v1",
    timeout: 15000,
  },
  /** EVEX Coach - AI coaching, personalized plans */
  coach: {
    baseUrl: process.env.EXPO_PUBLIC_COACH_API_URL ?? "https://api.evex.app/coach/v1",
    timeout: 30000,
  },
  /** Auth service */
  auth: {
    baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL ?? "https://api.evex.app/auth/v1",
    timeout: 10000,
  },
} as const;

export const QUERY_KEYS = {
  dashboardStats: ["dashboard", "stats"] as const,
  weeklyProgress: ["dashboard", "weekly"] as const,
  labResults: ["lab", "results"] as const,
  labMetrics: ["lab", "metrics"] as const,
  labTrends: ["lab", "trends"] as const,
  workoutHistory: ["fit", "history"] as const,
  workoutPlans: ["fit", "plans"] as const,
  exercises: ["fit", "exercises"] as const,
  activeWorkout: ["fit", "active"] as const,
  coachChat: ["coach", "chat"] as const,
  coachPlans: ["coach", "plans"] as const,
  coachRecommendations: ["coach", "recommendations"] as const,
} as const;
