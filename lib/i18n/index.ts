/**
 * EVEX i18n - RTL-first internationalization
 * Arabic is the primary language with full RTL support.
 */
import { I18nManager } from "react-native";
import * as Localization from "expo-localization";

import ar from "./ar.json";
import en from "./en.json";

export type Locale = "ar" | "en";
export type TranslationKeys = typeof ar;

const translations: Record<Locale, TranslationKeys> = { ar, en };

let currentLocale: Locale = "ar";

export function initLocale(): Locale {
  const deviceLocales = Localization.getLocales();
  const deviceLang = deviceLocales[0]?.languageCode ?? "ar";

  if (deviceLang === "en") {
    currentLocale = "en";
  } else {
    currentLocale = "ar";
  }

  const isRTL = currentLocale === "ar";
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }

  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  const isRTL = locale === "ar";
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
}

export function getLocale(): Locale {
  return currentLocale;
}

export function isRTL(): boolean {
  return I18nManager.isRTL;
}

export function t(path: string, params?: Record<string, string>): string {
  const keys = path.split(".");
  let value: unknown = translations[currentLocale];

  for (const key of keys) {
    if (value && typeof value === "object") {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  if (typeof value !== "string") return path;

  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? "");
  }

  return value;
}

export { ar, en };
export default { t, initLocale, setLocale, getLocale, isRTL };
