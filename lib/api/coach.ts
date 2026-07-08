import { createApiClient } from "./client";
import { API_CONFIG } from "@/constants/api";

const coachClient = createApiClient({ baseURL: API_CONFIG.coach.baseUrl, timeout: API_CONFIG.coach.timeout });

export interface CoachMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  timestamp: string;
  metadata?: { exerciseRef?: string; planRef?: string; confidence?: number };
}

export interface CoachConversation {
  id: string;
  messages: CoachMessage[];
  topic: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoachPlan {
  id: string;
  type: "workout" | "nutrition" | "recovery";
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  duration: string;
  generatedAt: string;
  status: "active" | "completed" | "paused";
  steps: CoachPlanStep[];
}

export interface CoachPlanStep {
  id: string;
  order: number;
  instruction: string;
  instructionAr: string;
  completed: boolean;
  dueDate?: string;
}

export interface CoachRecommendation {
  id: string;
  type: "exercise" | "rest" | "nutrition" | "habit";
  title: string;
  titleAr: string;
  reasoning: string;
  reasoningAr: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
}

export const coachApi = {
  async sendMessage(conversationId: string | null, message: string): Promise<CoachMessage> {
    const res = await coachClient.post("/chat", { conversationId, message });
    return res.data;
  },
  async getConversations(): Promise<CoachConversation[]> {
    const res = await coachClient.get("/conversations");
    return res.data;
  },
  async getConversation(id: string): Promise<CoachConversation> {
    const res = await coachClient.get(`/conversations/${id}`);
    return res.data;
  },
  async getPlans(type?: string): Promise<CoachPlan[]> {
    const res = await coachClient.get("/plans", { params: { type } });
    return res.data;
  },
  async generatePlan(params: { type: "workout" | "nutrition" | "recovery"; goal: string; duration: string }): Promise<CoachPlan> {
    const res = await coachClient.post("/plans/generate", params);
    return res.data;
  },
  async getRecommendations(): Promise<CoachRecommendation[]> {
    const res = await coachClient.get("/recommendations");
    return res.data;
  },
  async completeStep(planId: string, stepId: string): Promise<CoachPlanStep> {
    const res = await coachClient.post(`/plans/${planId}/steps/${stepId}/complete`);
    return res.data;
  },
};

export default coachApi;
