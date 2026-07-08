import { createApiClient } from "./client";
import { API_CONFIG } from "@/constants/api";

const fitClient = createApiClient({ baseURL: API_CONFIG.fit.baseUrl, timeout: API_CONFIG.fit.timeout });

export interface Exercise {
  id: string;
  name: string;
  nameAr: string;
  muscleGroup: string;
  equipment: string;
  instructions: string[];
  instructionsAr: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  unit: "kg" | "lbs";
  restSeconds: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  nameAr: string;
  date: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercises: WorkoutExercise[];
  status: "planned" | "in_progress" | "completed";
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  daysPerWeek: number;
  durationWeeks: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  workouts: Workout[];
}

export interface FitStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  weeklyGoalProgress: number;
}

export const fitApi = {
  async getWorkouts(page = 1, limit = 20): Promise<{ data: Workout[]; total: number }> {
    const res = await fitClient.get("/workouts", { params: { page, limit } });
    return res.data;
  },
  async getWorkoutById(id: string): Promise<Workout> {
    const res = await fitClient.get(`/workouts/${id}`);
    return res.data;
  },
  async startWorkout(planWorkoutId?: string): Promise<Workout> {
    const res = await fitClient.post("/workouts/start", { planWorkoutId });
    return res.data;
  },
  async logSet(workoutId: string, set: Omit<WorkoutSet, "id">): Promise<WorkoutSet> {
    const res = await fitClient.post(`/workouts/${workoutId}/sets`, set);
    return res.data;
  },
  async completeWorkout(workoutId: string): Promise<Workout> {
    const res = await fitClient.post(`/workouts/${workoutId}/complete`);
    return res.data;
  },
  async getExercises(muscleGroup?: string): Promise<Exercise[]> {
    const res = await fitClient.get("/exercises", { params: { muscleGroup } });
    return res.data;
  },
  async getPlans(): Promise<WorkoutPlan[]> {
    const res = await fitClient.get("/plans");
    return res.data;
  },
  async getStats(period = "week"): Promise<FitStats> {
    const res = await fitClient.get("/stats", { params: { period } });
    return res.data;
  },
};

export default fitApi;
