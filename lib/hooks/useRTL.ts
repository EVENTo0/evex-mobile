import { I18nManager, ViewStyle } from "react-native";
import { useMemo } from "react";

interface RTLStyles {
  isRTL: boolean;
  direction: "rtl" | "ltr";
  textAlign: "right" | "left";
  flexDirection: "row-reverse" | "row";
  alignSelf: "flex-end" | "flex-start";
  marginStart: (value: number) => ViewStyle;
  marginEnd: (value: number) => ViewStyle;
  paddingStart: (value: number) => ViewStyle;
  paddingEnd: (value: number) => ViewStyle;
}

export function useRTL(): RTLStyles {
  return useMemo(() => {
    const isRTL = I18nManager.isRTL;
    return {
      isRTL,
      direction: isRTL ? "rtl" : "ltr",
      textAlign: isRTL ? "right" : "left",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignSelf: isRTL ? "flex-end" : "flex-start",
      marginStart: (value: number): ViewStyle =>
        isRTL ? { marginRight: value } : { marginLeft: value },
      marginEnd: (value: number): ViewStyle =>
        isRTL ? { marginLeft: value } : { marginRight: value },
      paddingStart: (value: number): ViewStyle =>
        isRTL ? { paddingRight: value } : { paddingLeft: value },
      paddingEnd: (value: number): ViewStyle =>
        isRTL ? { paddingLeft: value } : { paddingRight: value },
    };
  }, []);
}

export default useRTL;
