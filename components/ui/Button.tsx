import React from "react";
import { Pressable, PressableProps, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@/lib/hooks/useTheme";
import { BorderRadius, Spacing, FontSizes } from "@/constants/theme";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ title, variant = "primary", size = "md", loading, fullWidth, disabled, style, ...props }: ButtonProps) {
  const { colors } = useTheme();

  const sizeStyles: Record<string, ViewStyle> = {
    sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
    md: { paddingVertical: Spacing.sm + 4, paddingHorizontal: Spacing.lg },
    lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.secondary },
    outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.primary },
    ghost: { backgroundColor: "transparent" },
  };

  const textColor = variant === "outline" || variant === "ghost" ? colors.primary : "#FFFFFF";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && { width: "100%" },
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
        style as ViewStyle,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text variant="label" color={textColor} center style={{ fontSize: size === "lg" ? FontSizes.lg : FontSizes.md }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: BorderRadius.lg, alignItems: "center", justifyContent: "center", flexDirection: "row" },
});

export default Button;
