import React from "react";
import { Text as RNText, TextProps } from "react-native";
import { useTheme } from "@/lib/hooks/useTheme";
import { useRTL } from "@/lib/hooks/useRTL";
import { FontSizes } from "@/constants/theme";

interface EVEXTextProps extends TextProps {
  variant?: "display" | "heading" | "subheading" | "body" | "caption" | "label";
  color?: string;
  bold?: boolean;
  center?: boolean;
}

export function Text({ variant = "body", color, bold, center, style, ...props }: EVEXTextProps) {
  const { colors } = useTheme();
  const { textAlign } = useRTL();

  const variantStyles = {
    display: { fontSize: FontSizes.display, fontWeight: "700" as const },
    heading: { fontSize: FontSizes.xxl, fontWeight: "600" as const },
    subheading: { fontSize: FontSizes.xl, fontWeight: "600" as const },
    body: { fontSize: FontSizes.lg, fontWeight: "400" as const },
    caption: { fontSize: FontSizes.sm, fontWeight: "400" as const },
    label: { fontSize: FontSizes.md, fontWeight: "500" as const },
  };

  return (
    <RNText
      style={[
        { color: color ?? colors.text, textAlign: center ? "center" : textAlign, writingDirection: "auto" },
        variantStyles[variant],
        bold && { fontWeight: "700" },
        style,
      ]}
      {...props}
    />
  );
}

export default Text;
