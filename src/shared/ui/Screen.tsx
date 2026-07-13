import type { PropsWithChildren, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "./Typography";
import { colors, spacing } from "./theme";

type ScreenProps = PropsWithChildren<{
  floatingAction?: ReactNode;
  footer?: ReactNode;
  title: string;
  introduction?: ReactNode;
}>;

export function Screen({ children, floatingAction, footer, introduction, title }: ScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.frame}>
        <View style={styles.frame}>
          <ScrollView
            contentContainerStyle={[styles.content, floatingAction ? styles.contentWithFloatingAction : null, footer ? styles.contentWithFooter : null]}
            contentInsetAdjustmentBehavior="automatic"
          >
            {!!(title || introduction) && <View style={styles.heading}>
              {title ? <Typography style={styles.title} variant="headlineLarge">{title}</Typography> : null}
              {introduction ? <Typography color="textSecondary" variant="bodyLarge">{introduction}</Typography> : null}
            </View>}
            {children}
          </ScrollView>
          {footer ? <SafeAreaView edges={["bottom"]} style={styles.footerSafeArea}><View style={styles.footer}>{footer}</View></SafeAreaView> : null}
          {floatingAction ? <View style={styles.floatingAction}>{floatingAction}</View> : null}
        </View>
      </KeyboardAvoidingView>
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
  contentWithFooter: { paddingBottom: spacing.lg },
  footer: { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, padding: spacing.md },
  footerSafeArea: { backgroundColor: colors.surface },
  floatingAction: { bottom: spacing.lg, position: "absolute", right: spacing.md },
  heading: { gap: spacing.sm, paddingTop: spacing.md },
  title: { color: colors.text },
});
