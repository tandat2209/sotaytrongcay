import { useRef, useState } from "react";
import { Ellipsis, Pencil, Trash2, type LucideIcon } from "lucide-react-native";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { t } from "@/shared/i18n";
import { IconButton } from "@/shared/ui/IconButton";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  onDelete: () => void;
  onEdit: () => void;
}>;

export function ActivityDetailMenu({ onDelete, onEdit }: Props) {
  const buttonRef = useRef<View>(null);
  const [position, setPosition] = useState<{ right: number; top: number }>({
    right: spacing.md,
    top: 0,
  });
  const [visible, setVisible] = useState(false);
  function openMenu() {
    setVisible(true);
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        right: Dimensions.get("window").width - x - width,
        top: y + height + spacing.sm,
      });
    });
  }
  return (
    <View>
      <View ref={buttonRef}>
        <IconButton
          accessibilityLabel={t("journal.activityDetail.menu")}
          icon={Ellipsis}
          onPress={() => (visible ? setVisible(false) : openMenu())}
        />
      </View>
      {visible ? (
        <Modal
          onRequestClose={() => setVisible(false)}
          transparent
          visible={visible}
        >
          <View style={styles.overlay}>
            <Pressable
              accessibilityLabel={t("common.actions.close")}
              accessibilityRole="button"
              onPress={() => setVisible(false)}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[styles.menu, { right: position.right, top: position.top }]}
              testID="activity-detail-menu"
            >
              <SurfaceCard style={styles.menuCard}>
                <MenuAction
                  icon={Pencil}
                  label={t("common.actions.edit")}
                  onPress={() => {
                    setVisible(false);
                    onEdit();
                  }}
                />
                <MenuAction
                  destructive
                  icon={Trash2}
                  label={t("journal.activityDetail.delete")}
                  onPress={() => {
                    setVisible(false);
                    onDelete();
                  }}
                />
              </SurfaceCard>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

function MenuAction({
  destructive = false,
  icon: Icon,
  label,
  onPress,
}: Readonly<{
  destructive?: boolean;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}>) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.menuAction}
    >
      <Icon color={destructive ? colors.error : colors.text} size={20} />
      <Typography color={destructive ? "error" : "text"} variant="bodyLarge">
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    width: 190,
  },
  menuCard: { gap: spacing.xs },
  overlay: { flex: 1 },
  menuAction: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
  },
});
