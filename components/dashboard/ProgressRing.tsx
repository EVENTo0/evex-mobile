import React, { memo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/lib/hooks/useTheme";

interface ProgressRingProps {
  progress: number;
  size?: number;
  label?: string;
}

export const ProgressRing = memo(function ProgressRing({ progress, size = 120, label }: ProgressRingProps) {
  const { colors } = useTheme();
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${(animatedProgress.value / 100) * 360}deg` }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: colors.border }]} />
      <Animated.View style={[styles.progressArc, { width: size, height: size, borderRadius: size / 2, borderTopColor: colors.primary, borderRightColor: progress > 25 ? colors.primary : "transparent", borderBottomColor: progress > 50 ? colors.primary : "transparent", borderLeftColor: progress > 75 ? colors.primary : "transparent" }, animatedStyle]} />
      <View style={styles.center}>
        <Text variant="heading" bold center>{Math.round(progress)}%</Text>
        {label && <Text variant="caption" color={colors.textSecondary} center>{label}</Text>}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  ring: { position: "absolute", borderWidth: 8 },
  progressArc: { position: "absolute", borderWidth: 8 },
  center: { alignItems: "center" },
});

export default ProgressRing;
