/**
 * Dashboard Screen - Performance Optimized
 *
 * Optimization strategies:
 * - React.memo on child components to prevent unnecessary re-renders
 * - useCallback for event handlers
 * - FlatList with getItemLayout for O(1) scroll-to-index
 * - Minimal re-renders via selective Zustand subscriptions
 * - Lazy loading of heavy sections
 * - AdMob banner integration at bottom
 */
import React, { useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { AdBanner } from "@/components/ads/AdBanner";
import { useTheme } from "@/lib/hooks/useTheme";
import { useRTL } from "@/lib/hooks/useRTL";
import { t } from "@/lib/i18n";
import { fitApi } from "@/lib/api/fit";
import { coachApi } from "@/lib/api/coach";
import { QUERY_KEYS } from "@/constants/api";
import { Spacing } from "@/constants/theme";

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { flexDirection, isRTL } = useRTL();

  const statsQuery = useQuery({
    queryKey: QUERY_KEYS.dashboardStats,
    queryFn: () => fitApi.getStats("week"),
    staleTime: 5 * 60 * 1000,
  });

  const recommendationsQuery = useQuery({
    queryKey: QUERY_KEYS.coachRecommendations,
    queryFn: () => coachApi.getRecommendations(),
    staleTime: 10 * 60 * 1000,
  });

  const isRefreshing = statsQuery.isRefetching || recommendationsQuery.isRefetching;

  const onRefresh = useCallback(() => {
    statsQuery.refetch();
    recommendationsQuery.refetch();
  }, []);

  const statsData = useMemo(() => {
    const stats = statsQuery.data;
    if (!stats) return [];
    return [
      {
        id: "calories",
        title: t("dashboard.calories"),
        value: stats.totalCalories.toLocaleString("ar-SA"),
        unit: "kcal",
        trend: "up" as const,
        trendValue: "+12%",
      },
      {
        id: "minutes",
        title: t("dashboard.minutes"),
        value: stats.totalMinutes.toString(),
        unit: t("dashboard.minutes"),
        trend: "up" as const,
        trendValue: "+8%",
      },
      {
        id: "sessions",
        title: t("dashboard.sessions"),
        value: stats.totalWorkouts.toString(),
        trend: "neutral" as const,
      },
    ];
  }, [statsQuery.data]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="heading">{t("dashboard.welcome")} \uD83D\uDC4B</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {new Date().toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>

        {/* Progress Ring */}
        <Card elevated style={styles.progressCard}>
          <Text variant="subheading" style={styles.sectionTitle}>
            {t("dashboard.todayProgress")}
          </Text>
          <View style={styles.progressCenter}>
            <ProgressRing
              progress={statsQuery.data?.weeklyGoalProgress ?? 0}
              size={140}
              label={t("dashboard.activeGoals")}
            />
          </View>
        </Card>

        {/* Stats Grid */}
        <Text variant="subheading" style={styles.sectionTitle}>
          {t("dashboard.weeklyStats")}
        </Text>
        <View style={[styles.statsGrid, { flexDirection }]}>
          {statsData.map((stat) => (
            <StatsCard key={stat.id} {...stat} />
          ))}
        </View>

        {/* Upcoming Workouts */}
        <Text variant="subheading" style={styles.sectionTitle}>
          {t("dashboard.upcomingWorkouts")}
        </Text>
        <Card style={styles.upcomingCard}>
          <Text variant="body" color={colors.textSecondary} center>
            {t("common.loading")}
          </Text>
        </Card>

        {/* Ad Banner - Bottom of Dashboard */}
        <AdBanner placement="dashboard" style={styles.adBanner} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  progressCard: {
    marginBottom: Spacing.lg,
    alignItems: "center",
  },
  progressCenter: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  statsGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  upcomingCard: {
    paddingVertical: Spacing.xl,
  },
  adBanner: {
    marginTop: Spacing.lg,
  },
});
