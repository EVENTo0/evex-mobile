import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useTheme } from "@/lib/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: keyof typeof Spacing;
}

export function Card({ elevated, padding = "md", style, children, ...props }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
          borderRadius: BorderRadius.lg,
          padding: Spacing[padding],
          borderWidth: 1,
          borderColor: colors.border,
        },
        elevated && styles.elevated,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default Card;
