import { useEffect, useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
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
  const { height } = useWindowDimensions();
  const [translateY] = useState(() => new Animated.Value(height));

  useEffect(() => {
    if (visible) {
      translateY.setValue(height);
      Animated.spring(translateY, { damping: 24, stiffness: 240, toValue: 0, useNativeDriver: true }).start();
    }
  }, [height, translateY, visible]);

  return (
    <Modal animationType="fade" onRequestClose={onDismiss} presentationStyle="overFullScreen" transparent visible={visible}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <Pressable accessibilityLabel="Đóng bảng chọn" onPress={onDismiss} style={styles.backdrop} />
        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}>
          <SafeAreaView edges={["bottom"]} style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Typography variant="headlineSmall">{title}</Typography>
              <IconButton accessibilityLabel="Đóng" icon="close" onPress={onDismiss} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: colors.scrim, bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  content: { gap: spacing.md, padding: spacing.md },
  flex: { flex: 1, justifyContent: "flex-end" },
  footer: { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, padding: spacing.md },
  handle: { alignSelf: "center", backgroundColor: colors.border, borderRadius: radius.round, height: 5, marginTop: spacing.sm, width: 36 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.xs },
  sheet: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 16,
    overflow: "hidden",
    shadowColor: colors.text,
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
  sheetContainer: { maxHeight: "85%", width: "100%" },
});
