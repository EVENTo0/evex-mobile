import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  locale: "ar" | "en";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setTokens: (access: string, refresh: string) => void;
  refreshSession: () => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken, isAuthenticated: true }),

  refreshSession: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;
    try {
      return true;
    } catch {
      get().logout();
      return false;
    }
  },

  logout: () =>
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
