import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/lib/hooks/useTheme";
import { useRTL } from "@/lib/hooks/useRTL";
import { Spacing } from "@/constants/theme";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export const StatsCard = memo(function StatsCard({ title, value, unit, trend, trendValue }: StatsCardProps) {
  const { colors } = useTheme();
  const { flexDirection } = useRTL();
  const trendColor = trend === "up" ? colors.success : trend === "down" ? colors.error : colors.textSecondary;

  return (
    <Card elevated style={styles.container}>
      <Text variant="caption" color={colors.textSecondary}>{title}</Text>
      <View style={[styles.valueRow, { flexDirection }]}>
        <Text variant="heading" bold>{value}</Text>
        {unit && <Text variant="caption" color={colors.textSecondary} style={styles.unit}>{unit}</Text>}
      </View>
      {trendValue && <Text variant="caption" color={trendColor}>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}</Text>}
    </Card>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, minWidth: 140 },
  valueRow: { alignItems: "baseline", gap: Spacing.xs, marginTop: Spacing.xs },
  unit: { marginBottom: 2 },
});

export default StatsCard;
