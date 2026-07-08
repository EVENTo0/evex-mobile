/// <reference types="expo/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_LAB_API_URL?: string;
    EXPO_PUBLIC_FIT_API_URL?: string;
    EXPO_PUBLIC_COACH_API_URL?: string;
    EXPO_PUBLIC_AUTH_API_URL?: string;
  }
}
