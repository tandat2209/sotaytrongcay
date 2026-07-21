import { Camera, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CARE_ACTIVITY_VISUALS,
  getCareActivityLabel,
  type CareActivityType,
} from "@/features/journal";
import { t } from "@/shared/i18n";
import { colors, spacing } from "@/shared/ui/theme";
import {
  CyclingMainActionButton,
  MainActionButton,
  RadialAction,
} from "./PlantRadialAction";
import { usePlantActionCycle } from "./usePlantActionCycle";

type Props = Readonly<{
  onAddJournal: () => void;
  onRecordCare: (type: CareActivityType) => void;
}>;

export function PlantActionMenu({ onAddJournal, onRecordCare }: Props) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progress] = useState(() => new Animated.Value(0));
  const cycle = usePlantActionCycle(open, reduceMotion);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  function show() {
    progress.setValue(reduceMotion ? 1 : 0);
    setOpen(true);
    if (!reduceMotion)
      Animated.spring(progress, {
        damping: 18,
        stiffness: 220,
        toValue: 1,
        useNativeDriver: true,
      }).start();
  }

  function dismiss() {
    progress.stopAnimation();
    setOpen(false);
  }

  function select(action: () => void) {
    dismiss();
    action();
  }

  return (
    <>
      <CyclingMainActionButton
        accessibilityLabel={t("plants.action.open")}
        backgroundColor={reduceMotion ? colors.primary : cycle.backgroundColor}
        icon={reduceMotion ? Plus : cycle.icon}
        onPress={show}
        scale={cycle.scale}
        slideX={cycle.slideX}
      />
      <Modal
        animationType="none"
        onRequestClose={dismiss}
        transparent
        visible={open}
      >
        <View style={styles.overlay}>
          <Pressable
            accessibilityLabel={t("plants.action.closeMenu")}
            accessibilityRole="button"
            onPress={dismiss}
            style={styles.backdrop}
          />
          <View
            accessibilityViewIsModal
            style={[styles.menu, { bottom: spacing.lg + insets.bottom }]}
            testID="plant-action-menu"
          >
            <RadialAction
              backgroundColor={colors.primarySoft}
              color={colors.primary}
              icon={Camera}
              label={t("plants.action.update")}
              onPress={() => select(onAddJournal)}
              position="journal"
              progress={progress}
              reduceMotion={reduceMotion}
            />
            {(["watering", "fertilizing", "spraying"] as const).map((type) => (
              <RadialAction
                backgroundColor={CARE_ACTIVITY_VISUALS[type].backgroundColor}
                color={CARE_ACTIVITY_VISUALS[type].color}
                icon={CARE_ACTIVITY_VISUALS[type].icon}
                key={type}
                label={getCareActivityLabel(type)}
                onPress={() => select(() => onRecordCare(type))}
                position={type}
                progress={progress}
                reduceMotion={reduceMotion}
              />
            ))}
            <View style={styles.mainActionPosition}>
              <MainActionButton
                accessibilityLabel={t("plants.action.close")}
                expanded
                icon={Plus}
                onPress={dismiss}
                rotated
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.scrim,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  mainActionPosition: { bottom: 0, position: "absolute" },
  menu: {
    alignItems: "center",
    height: 320,
    left: 0,
    position: "absolute",
    right: 0,
  },
  overlay: { flex: 1 },
});
