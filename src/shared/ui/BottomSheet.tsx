import type { PropsWithChildren, ReactNode } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "./IconButton";
import { Typography } from "./Typography";
import { colors, radius, spacing } from "./theme";

type BottomSheetProps = PropsWithChildren<{
  footer?: ReactNode;
  onDismiss: () => void;
  title: string;
  visible: boolean;
}>;

export function BottomSheet({ children, footer, onDismiss, title, visible }: BottomSheetProps) {
  return (
    <Modal animationType="slide" onRequestClose={onDismiss} presentationStyle="overFullScreen" transparent visible={visible}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <Pressable accessibilityLabel="Đóng bảng chọn" onPress={onDismiss} style={styles.backdrop} />
        <SafeAreaView edges={["bottom"]} style={styles.sheet}>
          <View style={styles.header}>
            <Typography variant="headlineSmall">{title}</Typography>
            <IconButton accessibilityLabel="Đóng" icon="close" onPress={onDismiss} />
          </View>
          <View style={styles.content}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: colors.scrim, flex: 1 },
  content: { gap: spacing.md, padding: spacing.md },
  flex: { flex: 1, justifyContent: "flex-end" },
  footer: { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, padding: spacing.md },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet },
});
