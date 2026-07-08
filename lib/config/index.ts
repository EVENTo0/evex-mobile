/**
 * EVEX App Configuration
 */
import Constants from "expo-constants";

export const AppConfig = {
  name: "EVEX",
  version: Constants.expoConfig?.version ?? "1.0.0",
  environment: __DEV__ ? "development" : "production",
  defaultLocale: "ar" as const,
  supportedLocales: ["ar", "en"] as const,
  rtlEnabled: true,
  queryStaleTime: 5 * 60 * 1000,
  queryCacheTime: 30 * 60 * 1000,
  defaultPageSize: 20,
  maxPageSize: 50,
} as const;

export default AppConfig;
