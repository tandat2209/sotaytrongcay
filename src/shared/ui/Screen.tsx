import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "./Typography";
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
          {title ? <Typography style={styles.title} variant="headlineLarge">{title}</Typography> : null}
          {introduction ? <Typography color="textSecondary" variant="bodyLarge">{introduction}</Typography> : null}
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
  title: { color: colors.text },
});
