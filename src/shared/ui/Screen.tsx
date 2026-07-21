import type { LucideIcon } from "lucide-react-native";
import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Typography } from "./Typography";
import { colors, spacing } from "./theme";

const FLOATING_ACTION_CONTENT_BOTTOM_SPACE = 104;

type ScreenProps = PropsWithChildren<{
  floatingAction?: ReactNode;
  floatingActionAlignment?: "center" | "end";
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
  floatingActionAlignment = "end",
  footer,
  headerAction,
  introduction,
  scrollable = true,
  title,
  titleIcon: TitleIcon,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.frame}
      >
        <View style={styles.frame}>
          {scrollable ? (
            <ScrollView
              automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
              contentContainerStyle={[
                styles.content,
                floatingAction ? styles.contentWithFloatingAction : null,
                floatingAction
                  ? {
                      paddingBottom:
                        FLOATING_ACTION_CONTENT_BOTTOM_SPACE + insets.bottom,
                    }
                  : null,
                footer ? styles.contentWithFooter : null,
              ]}
              contentInsetAdjustmentBehavior="automatic"
              keyboardShouldPersistTaps="handled"
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
            <View
              style={[
                styles.floatingAction,
                floatingActionAlignment === "center"
                  ? styles.floatingActionCentered
                  : null,
                { bottom: spacing.lg + insets.bottom },
              ]}
            >
              {floatingAction}
            </View>
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
    gap: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
  },
  contentWithFloatingAction: {
    paddingBottom: FLOATING_ACTION_CONTENT_BOTTOM_SPACE,
  },
  contentWithFooter: { paddingBottom: spacing.lg },
  unscrollableContent: { flex: 1, paddingBottom: 0 },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: spacing.base,
  },
  footerSafeArea: { backgroundColor: colors.surface },
  floatingAction: {
    position: "absolute",
    right: spacing.screen,
  },
  floatingActionCentered: { alignItems: "center", left: 0, right: 0 },
  heading: { gap: spacing.sm, paddingTop: spacing.base },
  title: { color: colors.text, flex: 1 },
  titleRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
