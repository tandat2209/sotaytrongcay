import type { LucideIcon } from "lucide-react-native";
import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "./Typography";
import { colors, spacing } from "./theme";

type ScreenProps = PropsWithChildren<{
  floatingAction?: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
  contentGap?: number;
  title: string;
  introduction?: ReactNode;
  titleIcon?: LucideIcon;
  scrollable?: boolean;
}>;

export function Screen({
  children,
  contentGap,
  floatingAction,
  footer,
  headerAction,
  introduction,
  scrollable = true,
  title,
  titleIcon: TitleIcon,
}: ScreenProps) {
  const content = (
    <>
      {!!(title || introduction) && (
        <View style={styles.heading}>
          {title ? (
            <View style={styles.titleRow}>
              {TitleIcon ? (
                <TitleIcon color={colors.primary} size={28} />
              ) : null}
              <Typography style={styles.title} variant="headlineLarge">
                {title}
              </Typography>
              {headerAction}
            </View>
          ) : null}
          {typeof introduction === "string" ? (
            <Typography color="textSecondary" variant="bodyLarge">
              {introduction}
            </Typography>
          ) : (
            introduction
          )}
        </View>
      )}
      {children}
    </>
  );
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.frame}
      >
        <View style={styles.frame}>
          {scrollable ? (
            <ScrollView
              contentContainerStyle={[
                styles.content,
                floatingAction ? styles.contentWithFloatingAction : null,
                footer ? styles.contentWithFooter : null,
              ]}
              contentInsetAdjustmentBehavior="automatic"
            >
              {content}
            </ScrollView>
          ) : (
            <View
              style={[
                styles.content,
                styles.unscrollableContent,
                contentGap === undefined ? null : { gap: contentGap },
              ]}
            >
              {content}
            </View>
          )}
          {footer ? (
            <SafeAreaView edges={["bottom"]} style={styles.footerSafeArea}>
              <View style={styles.footer}>{footer}</View>
            </SafeAreaView>
          ) : null}
          {floatingAction ? (
            <View style={styles.floatingAction}>{floatingAction}</View>
          ) : null}
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
  unscrollableContent: { flex: 1, paddingBottom: 0 },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
  },
  footerSafeArea: { backgroundColor: colors.surface },
  floatingAction: {
    bottom: spacing.lg,
    position: "absolute",
    right: spacing.md,
  },
  heading: { gap: spacing.sm, paddingTop: spacing.md },
  title: { color: colors.text, flex: 1 },
  titleRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
