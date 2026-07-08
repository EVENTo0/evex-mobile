import React, { useState, useCallback } from "react";
import { View, ScrollView, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/hooks/useTheme";
import { useRTL } from "@/lib/hooks/useRTL";
import { t } from "@/lib/i18n";
import { coachApi } from "@/lib/api/coach";
import { QUERY_KEYS } from "@/constants/api";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function CoachScreen() {
  const { colors } = useTheme();
  const { textAlign } = useRTL();
  const [message, setMessage] = useState("");

  const recommendationsQuery = useQuery({
    queryKey: QUERY_KEYS.coachRecommendations,
    queryFn: () => coachApi.getRecommendations(),
    staleTime: 10 * 60 * 1000,
  });

  const sendMutation = useMutation({ mutationFn: (msg: string) => coachApi.sendMessage(null, msg) });

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    sendMutation.mutate(message);
    setMessage("");
  }, [message]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}><Text variant="heading">{t("coach.aiCoach")}</Text></View>
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        <Card style={styles.welcomeCard}>
          <Text variant="body" center>{t("coach.title")} 🤖</Text>
          <Text variant="caption" color={colors.textSecondary} center>{t("app.tagline")}</Text>
        </Card>
      </ScrollView>
      <View style={[styles.inputArea, { backgroundColor: colors.surface }]}>
        <TextInput value={message} onChangeText={setMessage} placeholder={t("coach.chat")} placeholderTextColor={colors.textTertiary} style={[styles.input, { color: colors.text, backgroundColor: colors.background, textAlign }]} multiline maxLength={500} />
        <Button title="→" variant="primary" size="sm" onPress={handleSend} loading={sendMutation.isPending} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.md },
  chatArea: { flex: 1 },
  chatContent: { padding: Spacing.md },
  welcomeCard: { marginBottom: Spacing.md, paddingVertical: Spacing.xl },
  inputArea: { flexDirection: "row", padding: Spacing.sm, alignItems: "flex-end", gap: Spacing.sm, borderTopWidth: 1, borderTopColor: "#2A2A2A" },
  input: { flex: 1, borderRadius: BorderRadius.lg, padding: Spacing.sm, maxHeight: 100, fontSize: 15 },
});
