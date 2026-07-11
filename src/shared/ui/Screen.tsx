import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "./theme";

type ScreenProps = PropsWithChildren<{
  title: string;
  introduction?: ReactNode;
}>;

export function Screen({ children, introduction, title }: ScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {introduction ? (
            <Text style={styles.introduction}>{introduction}</Text>
          ) : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  heading: { gap: spacing.sm, paddingTop: spacing.md },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 34,
  },
  introduction: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
});
