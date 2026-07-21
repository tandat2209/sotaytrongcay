import { X } from "lucide-react-native";
import { Image, Modal, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { t } from "@/shared/i18n";
import { colors, control, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  imageUri: string;
  onDismiss: () => void;
  onImageError: () => void;
  plantName: string;
  visible: boolean;
}>;

export function PlantPhotoViewer({
  imageUri,
  onDismiss,
  onImageError,
  plantName,
  visible,
}: Props) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onDismiss}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <SafeAreaView
        accessibilityViewIsModal
        edges={["top", "bottom"]}
        style={styles.viewer}
      >
        <Pressable
          accessibilityLabel={t("plants.photo.close")}
          accessibilityRole="button"
          hitSlop={6}
          onPress={onDismiss}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
        >
          <X color={colors.surface} size={28} />
        </Pressable>
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel={t("plants.photo.latest", { plant: plantName })}
          accessible
          onError={onImageError}
          resizeMode="contain"
          source={{ uri: imageUri }}
          style={styles.fullImage}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    borderRadius: radius.pill,
    height: control.iconTarget,
    justifyContent: "center",
    marginHorizontal: spacing.base,
    width: control.iconTarget,
    zIndex: 1,
  },
  closeButtonPressed: { backgroundColor: "rgba(255, 255, 255, 0.16)" },
  fullImage: { flex: 1, width: "100%" },
  viewer: { backgroundColor: "rgba(0, 0, 0, 0.96)", flex: 1 },
});
