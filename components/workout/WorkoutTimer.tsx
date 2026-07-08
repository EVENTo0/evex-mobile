import React, { memo, useCallback, useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface WorkoutTimerProps {
  mode?: "stopwatch" | "countdown";
  initialSeconds?: number;
  onComplete?: () => void;
}

export const WorkoutTimer = memo(function WorkoutTimer({ mode = "stopwatch", initialSeconds = 0, onComplete }: WorkoutTimerProps) {
  const { colors } = useTheme();
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scale = useSharedValue(1);

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);

  const start = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (mode === "countdown") {
          if (prev <= 1) { clearInterval(intervalRef.current!); setIsRunning(false); onComplete?.(); return 0; }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);
  }, [mode, onComplete]);

  const pause = useCallback(() => { setIsRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); }, []);
  const reset = useCallback(() => { setIsRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); setSeconds(initialSeconds); }, [initialSeconds]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerDisplay, pulseStyle]}>
        <Text variant="display" bold center color={isRunning ? colors.primary : colors.text}>{formatTime(seconds)}</Text>
      </Animated.View>
      <View style={styles.controls}>
        {!isRunning ? <Button title="ابدأ" variant="primary" onPress={start} /> : <Button title="إيقاف" variant="outline" onPress={pause} />}
        <Button title="إعادة" variant="ghost" onPress={reset} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: Spacing.lg },
  timerDisplay: { marginBottom: Spacing.lg },
  controls: { flexDirection: "row", gap: Spacing.md },
});

export default WorkoutTimer;
