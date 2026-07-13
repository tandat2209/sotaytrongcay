import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
    <Modal animationType="fade" onRequestClose={onDismiss} presentationStyle="overFullScreen" transparent visible={visible}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <Pressable accessibilityLabel="Đóng bảng chọn" onPress={onDismiss} style={styles.backdrop} />
        <SafeAreaView edges={["bottom"]} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Typography variant="headlineSmall">{title}</Typography>
            <IconButton accessibilityLabel="Đóng" icon="close" onPress={onDismiss} />
          </View>
          <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
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
  handle: { alignSelf: "center", backgroundColor: colors.border, borderRadius: radius.round, height: 5, marginTop: spacing.sm, width: 36 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.xs },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    elevation: 16,
    maxHeight: "85%",
    overflow: "hidden",
    shadowColor: colors.text,
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
});
