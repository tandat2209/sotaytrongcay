import { Ellipsis, Archive, Pencil } from "lucide-react-native";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { IconButton } from "@/shared/ui/IconButton";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

type Props = Readonly<{ onArchive: () => void; onEdit: () => void }>;

export function PlantDetailMenu({ onArchive, onEdit }: Props) {
  const buttonRef = useRef<View>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ right: number; top: number }>({
    right: spacing.md,
    top: 0,
  });

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
          accessibilityLabel={t("plants.menu.open")}
          icon={Ellipsis}
          onPress={() => (visible ? setVisible(false) : openMenu())}
        />
      </View>
      {visible ? (
        <Modal onRequestClose={() => setVisible(false)} transparent visible>
          <View style={styles.overlay}>
            <Pressable
              accessibilityLabel={t("common.actions.close")}
              accessibilityRole="button"
              onPress={() => setVisible(false)}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.menu, position]}>
              <SurfaceCard style={styles.card}>
                <MenuAction
                  icon={<Pencil color={colors.text} size={20} />}
                  label={t("plants.edit.action")}
                  onPress={() => {
                    setVisible(false);
                    onEdit();
                  }}
                />
                <MenuAction
                  destructive
                  icon={<Archive color={colors.error} size={20} />}
                  label={t("plants.archive.action")}
                  onPress={() => {
                    setVisible(false);
                    onArchive();
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
  icon,
  label,
  onPress,
}: Readonly<{
  destructive?: boolean;
  icon: ReactNode;
  label: string;
  onPress: () => void;
}>) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.action}
    >
      {icon}
      <Typography color={destructive ? "error" : "text"} variant="bodyLarge">
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
  },
  card: { gap: spacing.xs },
  menu: { position: "absolute", width: 190 },
  overlay: { flex: 1 },
});
