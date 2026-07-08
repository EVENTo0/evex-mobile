import React, { memo, useCallback } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/lib/hooks/useTheme";
import { useRTL } from "@/lib/hooks/useRTL";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ExerciseCardProps {
  id: string;
  name: string;
  nameAr: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight?: number;
  onPress?: (id: string) => void;
}

export const ExerciseCard = memo(function ExerciseCard({ id, name, nameAr, muscleGroup, sets, reps, weight, onPress }: ExerciseCardProps) {
  const { colors } = useTheme();
  const { flexDirection, isRTL } = useRTL();
  const handlePress = useCallback(() => { onPress?.(id); }, [id, onPress]);
  const displayName = isRTL ? nameAr : name;

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.container, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.7 }]}>
      <View style={[styles.header, { flexDirection }]}>
        <View style={styles.info}>
          <Text variant="body" bold>{displayName}</Text>
          <Text variant="caption" color={colors.textSecondary}>{muscleGroup}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.primary + "20" }]}>
          <Text variant="caption" color={colors.primary}>{sets} x {reps}</Text>
        </View>
      </View>
      {weight !== undefined && <Text variant="caption" color={colors.textSecondary}>{weight} kg</Text>}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.sm },
  header: { alignItems: "center", justifyContent: "space-between" },
  info: { flex: 1 },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
});

export default ExerciseCard;
