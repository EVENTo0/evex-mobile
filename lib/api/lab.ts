import { createApiClient } from "./client";
import { API_CONFIG } from "@/constants/api";

const labClient = createApiClient({ baseURL: API_CONFIG.lab.baseUrl, timeout: API_CONFIG.lab.timeout });

export interface LabResult {
  id: string;
  testDate: string;
  category: string;
  markers: LabMarker[];
  status: "normal" | "attention" | "critical";
  notes?: string;
}

export interface LabMarker {
  id: string;
  name: string;
  nameAr: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "low" | "normal" | "high" | "critical";
}

export interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  recordedAt: string;
}

export interface TrendData {
  markerId: string;
  dataPoints: { date: string; value: number }[];
  trend: "improving" | "stable" | "declining";
}

export const labApi = {
  async getResults(page = 1, limit = 20): Promise<{ data: LabResult[]; total: number }> {
    const res = await labClient.get("/results", { params: { page, limit } });
    return res.data;
  },
  async getResultById(id: string): Promise<LabResult> {
    const res = await labClient.get(`/results/${id}`);
    return res.data;
  },
  async getMetrics(type?: string): Promise<HealthMetric[]> {
    const res = await labClient.get("/metrics", { params: { type } });
    return res.data;
  },
  async recordMetric(data: Omit<HealthMetric, "id" | "recordedAt">): Promise<HealthMetric> {
    const res = await labClient.post("/metrics", data);
    return res.data;
  },
  async getTrend(markerId: string, period = "3m"): Promise<TrendData> {
    const res = await labClient.get(`/trends/${markerId}`, { params: { period } });
    return res.data;
  },
};

export default labApi;
