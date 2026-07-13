import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "./Typography";
import { colors, spacing } from "./theme";

type ScreenProps = PropsWithChildren<{
  floatingAction?: ReactNode;
  title: string;
  introduction?: ReactNode;
}>;

export function Screen({ children, floatingAction, introduction, title }: ScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.frame}>
        <ScrollView
          contentContainerStyle={[styles.content, floatingAction ? styles.contentWithFloatingAction : null]}
          contentInsetAdjustmentBehavior="automatic"
        >
          {!!(title || introduction) && <View style={styles.heading}>
            {title ? <Typography style={styles.title} variant="headlineLarge">{title}</Typography> : null}
            {introduction ? <Typography color="textSecondary" variant="bodyLarge">{introduction}</Typography> : null}
          </View>}
          {children}
        </ScrollView>
        {floatingAction ? <View style={styles.floatingAction}>{floatingAction}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  frame: { flex: 1 },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  contentWithFloatingAction: { paddingBottom: 104 },
  floatingAction: { bottom: spacing.lg, position: "absolute", right: spacing.md },
  heading: { gap: spacing.sm, paddingTop: spacing.md },
  title: { color: colors.text },
});
