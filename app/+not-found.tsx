import { Link, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "404" }} />
      <View style={styles.container}>
        <Text variant="heading" center>الصفحة غير موجودة</Text>
        <Link href="/" style={styles.link}>
          <Text variant="body" color="#6C63FF" center>العودة للرئيسية</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  link: { marginTop: 16 },
});
