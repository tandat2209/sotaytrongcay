import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
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
type IconName = ComponentProps<typeof Ionicons>["name"];
type IdleAction = Readonly<{ backgroundColor: string; icon: IconName }>;
const IDLE_ACTIONS: readonly IdleAction[] = [
  { backgroundColor: CARE_ACTIVITY_VISUALS.watering.color, icon: CARE_ACTIVITY_VISUALS.watering.icon },
  { backgroundColor: CARE_ACTIVITY_VISUALS.fertilizing.color, icon: CARE_ACTIVITY_VISUALS.fertilizing.icon },
  { backgroundColor: CARE_ACTIVITY_VISUALS.spraying.color, icon: CARE_ACTIVITY_VISUALS.spraying.icon },
  { backgroundColor: colors.primary, icon: "camera-outline" },
];

export function PlantActionMenu({ onAddJournal, onRecordCare }: Props) {
  const [open, setOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);
  const [progress] = useState(() => new Animated.Value(0));
  const [slideX] = useState(() => new Animated.Value(0));
  const [fabScale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion || open) {
      slideX.setValue(0);
      fabScale.setValue(1);
      return;
    }

    const swapIcon = () => {
      Animated.parallel([
        Animated.timing(slideX, { duration: 240, toValue: 28, useNativeDriver: true }),
        Animated.timing(fabScale, { duration: 240, toValue: 0.94, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (!finished) return;
        setIconIndex((current) => (current + 1) % IDLE_ACTIONS.length);
        slideX.setValue(-28);
        Animated.parallel([
          Animated.spring(slideX, { damping: 18, stiffness: 180, toValue: 0, useNativeDriver: true }),
          Animated.sequence([
            Animated.spring(fabScale, { damping: 11, stiffness: 250, toValue: 1.06, useNativeDriver: true }),
            Animated.spring(fabScale, { damping: 14, stiffness: 220, toValue: 1, useNativeDriver: true }),
          ]),
        ]).start();
      });
    };
    const interval = setInterval(swapIcon, 3000);
    return () => {
      clearInterval(interval);
      slideX.stopAnimation();
      fabScale.stopAnimation();
    };
  }, [fabScale, open, reduceMotion, slideX]);

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

  const idleAction = IDLE_ACTIONS[iconIndex] ?? { backgroundColor: colors.primary, icon: "create-outline" };

  return <>
    <CyclingFab backgroundColor={reduceMotion ? colors.primary : idleAction.backgroundColor} fabScale={fabScale} icon={reduceMotion ? "create-outline" : idleAction.icon} onPress={show} slideX={slideX} />
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
  backgroundColor: string; color: string; icon: IconName; index: number; label: string; onPress: () => void; progress: Animated.Value; reduceMotion: boolean;
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

function CyclingFab({ backgroundColor, fabScale, icon, onPress, slideX }: Readonly<{ backgroundColor: string; fabScale: Animated.Value; icon: IconName; onPress: () => void; slideX: Animated.Value }>) {
  const iconStyle = {
    opacity: slideX.interpolate({ inputRange: [-28, 0, 28], outputRange: [0, 1, 0] }),
    transform: [{ translateX: slideX }],
  };
  return <Animated.View style={{ transform: [{ scale: fabScale }] }}>
    <Pressable accessibilityLabel="Mở thao tác cho cây" accessibilityRole="button" accessibilityState={{ expanded: false }} onPress={onPress} style={({ pressed }) => [styles.fab, { backgroundColor }, pressed && styles.fabPressed]}>
      <Animated.View style={iconStyle}><Ionicons color={colors.surface} name={icon} size={27} /></Animated.View>
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
