import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CARE_ACTIVITY_LABELS, CARE_ACTIVITY_VISUALS, type CareActivityType } from "@/features/journal";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  onAddJournal: () => void;
  onRecordCare: (type: CareActivityType) => void;
}>;

const CARE_TYPES: readonly CareActivityType[] = ["spraying", "fertilizing", "watering"];

export function PlantActionMenu({ onAddJournal, onRecordCare }: Props) {
  const [open, setOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);

  function show() {
    progress.setValue(reduceMotion ? 1 : 0);
    setOpen(true);
    if (!reduceMotion) Animated.spring(progress, { damping: 18, stiffness: 220, toValue: 1, useNativeDriver: true }).start();
  }

  function dismiss() {
    progress.stopAnimation();
    setOpen(false);
  }

  function select(action: () => void) {
    dismiss();
    action();
  }

  return <>
    <Fab accessibilityLabel="Mở thao tác cho cây" expanded={false} icon="create-outline" onPress={show} />
    <Modal animationType="none" onRequestClose={dismiss} transparent visible={open}>
      <SafeAreaView edges={["bottom"]} style={styles.overlay}>
        <Pressable accessibilityLabel="Đóng menu thao tác" accessibilityRole="button" onPress={dismiss} style={styles.backdrop} />
        <View style={styles.menu}>
          <AnimatedAction backgroundColor={colors.primarySoft} color={colors.primary} icon="camera-outline" index={3} label="Thêm nhật ký" onPress={() => select(onAddJournal)} progress={progress} reduceMotion={reduceMotion} />
          {CARE_TYPES.map((type, index) => <AnimatedAction backgroundColor={CARE_ACTIVITY_VISUALS[type].backgroundColor} color={CARE_ACTIVITY_VISUALS[type].color} icon={CARE_ACTIVITY_VISUALS[type].icon} index={2 - index} key={type} label={CARE_ACTIVITY_LABELS[type]} onPress={() => select(() => onRecordCare(type))} progress={progress} reduceMotion={reduceMotion} />)}
          <Fab accessibilityLabel="Đóng thao tác cho cây" expanded icon="close" onPress={dismiss} />
        </View>
      </SafeAreaView>
    </Modal>
  </>;
}

function AnimatedAction({ backgroundColor, color, icon, index, label, onPress, progress, reduceMotion }: Readonly<{
  backgroundColor: string; color: string; icon: React.ComponentProps<typeof Ionicons>["name"]; index: number; label: string; onPress: () => void; progress: Animated.Value; reduceMotion: boolean;
}>) {
  const animatedStyle = reduceMotion ? undefined : {
    opacity: progress,
    transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [16 + index * 5, 0] }) }, { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
  };
  return <Animated.View style={[styles.actionWrap, animatedStyle]}>
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <View style={styles.label}><Typography variant="bodyLarge">{label}</Typography></View>
      <View style={[styles.actionIcon, { backgroundColor }]}><Ionicons color={color} name={icon} size={23} /></View>
    </Pressable>
  </Animated.View>;
}

function Fab({ accessibilityLabel, expanded, icon, onPress }: Readonly<{ accessibilityLabel: string; expanded: boolean; icon: "close" | "create-outline"; onPress: () => void }>) {
  return <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" accessibilityState={{ expanded }} onPress={onPress} style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
    <Ionicons color={colors.surface} name={icon} size={28} />
  </Pressable>;
}

const styles = StyleSheet.create({
  action: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, actionIcon: { alignItems: "center", borderRadius: radius.round, height: 48, justifyContent: "center", width: 48 }, actionWrap: { alignItems: "flex-end" },
  backdrop: { backgroundColor: colors.scrim, bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  fab: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.round, elevation: 5, height: 56, justifyContent: "center", shadowColor: colors.text, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.22, shadowRadius: 6, width: 56 }, fabPressed: { opacity: 0.82, transform: [{ scale: 0.96 }] },
  label: { backgroundColor: colors.surface, borderRadius: radius.control, elevation: 2, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, shadowColor: colors.text, shadowOffset: { height: 1, width: 0 }, shadowOpacity: 0.12, shadowRadius: 4 },
  menu: { alignItems: "flex-end", bottom: spacing.lg, gap: spacing.sm, position: "absolute", right: spacing.md }, overlay: { flex: 1 }, pressed: { opacity: 0.82 },
});
