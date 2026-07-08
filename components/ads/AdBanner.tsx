/**
 * AdBanner Component - Reusable ad banner for EVEX screens
 *
 * Wraps react-native-google-mobile-ads BannerAd with:
 * - Premium user detection (hides ads for premium)
 * - Error handling with graceful fallback
 * - Loading state
 * - RTL support
 * - Consistent styling across screens
 */
import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { MonetizationService, AD_UNIT_IDS } from "@/lib/services/MonetizationService";
import { Spacing } from "@/constants/theme";

type AdPlacement = "dashboard" | "workout" | "coach";

interface AdBannerProps {
  placement: AdPlacement;
  style?: object;
}

const PLACEMENT_AD_UNITS: Record<AdPlacement, string> = {
  dashboard: AD_UNIT_IDS.BANNER_DASHBOARD,
  workout: AD_UNIT_IDS.BANNER_WORKOUT,
  coach: AD_UNIT_IDS.BANNER_COACH,
};

export const AdBanner: React.FC<AdBannerProps> = React.memo(({ placement, style }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  if (!MonetizationService.shouldShowAds()) {
    return null;
  }

  const onAdLoaded = useCallback(() => {
    setAdLoaded(true);
    setAdError(false);
  }, []);

  const onAdError = useCallback((error: Error) => {
    console.warn(`[AdBanner] Error on ${placement}:`, error.message);
    setAdError(true);
    setAdLoaded(false);
  }, [placement]);

  if (adError) {
    return null;
  }

  return (
    <View style={[styles.container, !adLoaded && styles.loading, style]}>
      <BannerAd
        unitId={PLACEMENT_AD_UNITS[placement]}
        size={MonetizationService.getBannerSize(placement)}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ["fitness", "health", "diet", "workout", "nutrition"],
        }}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdError}
      />
    </View>
  );
});

AdBanner.displayName = "AdBanner";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: Spacing.xs,
    marginTop: Spacing.sm,
  },
  loading: {
    minHeight: 50,
  },
});

export default AdBanner;
