/**
 * MonetizationService - AdMob Integration for EVEX
 *
 * Manages ad loading, display, and revenue tracking using react-native-google-mobile-ads.
 * Uses placeholder IDs for development; replace with real AdMob unit IDs before production release.
 *
 * Production Checklist:
 * - Replace all ca-app-pub-xxxxx IDs with real AdMob unit IDs
 * - Set up AdMob account at https://admob.google.com
 * - Configure app-ads.txt on your domain
 * - Enable GDPR consent for EU users
 */

import {
  InterstitialAd,
  RewardedAd,
  BannerAdSize,
  TestIds,
  AdEventType,
  RewardedAdEventType,
  type AdShowOptions,
} from "react-native-google-mobile-ads";

// ============================================================
// AD UNIT IDS - PLACEHOLDER (Replace with real IDs for production)
// ============================================================
export const AD_UNIT_IDS = {
  // Banner Ads
  BANNER_DASHBOARD: __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-xxxxxxxxxxxxxxxx/dashboard-banner",
  BANNER_WORKOUT: __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-xxxxxxxxxxxxxxxx/workout-banner",
  BANNER_COACH: __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-xxxxxxxxxxxxxxxx/coach-banner",

  // Interstitial Ads
  INTERSTITIAL_WORKOUT_COMPLETE: __DEV__
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-xxxxxxxxxxxxxxxx/workout-complete",
  INTERSTITIAL_SESSION_END: __DEV__
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-xxxxxxxxxxxxxxxx/session-end",

  // Rewarded Ads
  REWARDED_PREMIUM_FEATURE: __DEV__
    ? TestIds.REWARDED
    : "ca-app-pub-xxxxxxxxxxxxxxxx/premium-unlock",
  REWARDED_EXTRA_COACHING: __DEV__
    ? TestIds.REWARDED
    : "ca-app-pub-xxxxxxxxxxxxxxxx/extra-coaching",
} as const;

// ============================================================
// CONFIGURATION
// ============================================================
export const MONETIZATION_CONFIG = {
  interstitialFrequency: 3,
  interstitialCooldown: 5 * 60 * 1000,
  showAdsToPremium: false,
  bannerRefreshInterval: 30 * 1000,
};

// ============================================================
// SERVICE CLASS
// ============================================================
class MonetizationServiceImpl {
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;
  private lastInterstitialTime: number = 0;
  private workoutCompletionCount: number = 0;
  private isInitialized: boolean = false;
  private isPremiumUser: boolean = false;

  async initialize(isPremium: boolean = false): Promise<void> {
    if (this.isInitialized) return;
    this.isPremiumUser = isPremium;
    this.isInitialized = true;
    if (!isPremium || MONETIZATION_CONFIG.showAdsToPremium) {
      this.preloadInterstitial();
      this.preloadRewarded();
    }
    console.log("[MonetizationService] Initialized", { isPremium });
  }

  setPremiumStatus(isPremium: boolean): void {
    this.isPremiumUser = isPremium;
  }

  shouldShowAds(): boolean {
    if (this.isPremiumUser && !MONETIZATION_CONFIG.showAdsToPremium) {
      return false;
    }
    return true;
  }

  private preloadInterstitial(): void {
    this.interstitialAd = InterstitialAd.createForAdRequest(
      AD_UNIT_IDS.INTERSTITIAL_WORKOUT_COMPLETE,
      {
        requestNonPersonalizedAdsOnly: false,
        keywords: ["fitness", "health", "diet", "workout"],
      }
    );
    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log("[MonetizationService] Interstitial loaded");
    });
    this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn("[MonetizationService] Interstitial error:", error);
    });
    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.preloadInterstitial();
    });
    this.interstitialAd.load();
  }

  private preloadRewarded(): void {
    this.rewardedAd = RewardedAd.createForAdRequest(
      AD_UNIT_IDS.REWARDED_PREMIUM_FEATURE,
      {
        requestNonPersonalizedAdsOnly: false,
        keywords: ["fitness", "health", "diet", "workout"],
      }
    );
    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("[MonetizationService] Rewarded ad loaded");
    });
    this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log("[MonetizationService] Reward earned:", reward);
    });
    this.rewardedAd.load();
  }

  async showInterstitial(reason: string = "generic"): Promise<boolean> {
    if (!this.shouldShowAds()) return false;
    const now = Date.now();
    if (now - this.lastInterstitialTime < MONETIZATION_CONFIG.interstitialCooldown) {
      return false;
    }
    if (!this.interstitialAd) {
      this.preloadInterstitial();
      return false;
    }
    try {
      await this.interstitialAd.show();
      this.lastInterstitialTime = now;
      return true;
    } catch (error) {
      console.warn("[MonetizationService] Failed to show interstitial:", error);
      return false;
    }
  }

  async showPostWorkoutAd(): Promise<boolean> {
    this.workoutCompletionCount++;
    if (this.workoutCompletionCount % MONETIZATION_CONFIG.interstitialFrequency === 0) {
      return this.showInterstitial("workout_complete");
    }
    return false;
  }

  async showRewardedAd(): Promise<{ success: boolean; reward?: { type: string; amount: number } }> {
    if (!this.rewardedAd) {
      this.preloadRewarded();
      return { success: false };
    }
    return new Promise((resolve) => {
      let rewarded = false;
      this.rewardedAd!.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        rewarded = true;
        resolve({ success: true, reward: { type: reward.type, amount: reward.amount } });
      });
      this.rewardedAd!.addAdEventListener(AdEventType.CLOSED, () => {
        if (!rewarded) resolve({ success: false });
        this.preloadRewarded();
      });
      this.rewardedAd!.show().catch(() => resolve({ success: false }));
    });
  }

  getBannerSize(placement: "dashboard" | "workout" | "coach"): BannerAdSize {
    switch (placement) {
      case "dashboard": return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
      case "workout": return BannerAdSize.BANNER;
      case "coach": return BannerAdSize.LARGE_BANNER;
      default: return BannerAdSize.BANNER;
    }
  }

  destroy(): void {
    this.interstitialAd = null;
    this.rewardedAd = null;
    this.isInitialized = false;
  }
}

export const MonetizationService = new MonetizationServiceImpl();
export default MonetizationService;
