import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/lib/hooks/useTheme";
import { t } from "@/lib/i18n";
import { labApi } from "@/lib/api/lab";
import { QUERY_KEYS } from "@/constants/api";
import { Spacing } from "@/constants/theme";

export default function LabScreen() {
  const { colors } = useTheme();
  const resultsQuery = useQuery({
    queryKey: QUERY_KEYS.labResults,
    queryFn: () => labApi.getResults(),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="heading" style={styles.title}>{t("lab.title")}</Text>
        <Card elevated style={styles.section}>
          <Text variant="subheading">{t("lab.bloodWork")}</Text>
          <Text variant="body" color={colors.textSecondary} style={styles.placeholder}>
            {resultsQuery.isLoading ? t("common.loading") : t("lab.metrics")}
          </Text>
        </Card>
        <Card elevated style={styles.section}>
          <Text variant="subheading">{t("lab.trends")}</Text>
          <Text variant="body" color={colors.textSecondary} style={styles.placeholder}>{t("common.loading")}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.md },
  title: { marginBottom: Spacing.lg },
  section: { marginBottom: Spacing.md },
  placeholder: { marginTop: Spacing.sm },
});
