import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { StageIcon } from "@/features/knowledge/stage-icons";
import { t } from "@/shared/i18n";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { PlantDetailProjection } from "../models/plant-detail-projection";

const STEP_WIDTH = 68;
const STEP_GAP = spacing.sm;

export function PlantGrowthJourney({
  projection,
}: Readonly<{ projection: PlantDetailProjection }>) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const currentIndex = projection.lifecycleStages.findIndex(
    (stage) => stage.isCurrent,
  );
  const stageCount = projection.lifecycleStages.length;

  useEffect(() => {
    if (currentIndex < 0 || viewportWidth === 0) return;
    const contentWidth =
      stageCount * STEP_WIDTH + Math.max(0, stageCount - 1) * STEP_GAP;
    const currentStageCenter =
      currentIndex * (STEP_WIDTH + STEP_GAP) + STEP_WIDTH / 2;
    scrollViewRef.current?.scrollTo({
      animated: false,
      x: Math.min(
        Math.max(currentStageCenter - viewportWidth / 2, 0),
        Math.max(0, contentWidth - viewportWidth),
      ),
    });
  }, [currentIndex, stageCount, viewportWidth]);

  return (
    <View style={styles.section}>
      <SectionHeader
        action={
          currentIndex >= 0 ? (
            <View style={styles.position}>
              <Typography color="primary" variant="label">
                {currentIndex + 1}/{stageCount}
              </Typography>
            </View>
          ) : null
        }
        title={t("plants.screen.lifecycle")}
      />
      {stageCount ? (
        <ScrollView
          horizontal
          onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.journey}>
            {projection.lifecycleStages.map((stage, index) => (
              <View
                accessibilityLabel={
                  stage.isCurrent
                    ? t("plants.screen.currentStageAccessibility", {
                        stage: stage.title,
                      })
                    : stage.title
                }
                key={stage.id}
                style={styles.step}
              >
                {index ? <View style={styles.connector} /> : null}
                <View style={[styles.node, stage.isCurrent && styles.current]}>
                  <StageIcon
                    color={
                      stage.isCurrent ? colors.surface : colors.textSecondary
                    }
                    size={16}
                    stageId={stage.id}
                  />
                </View>
                <Typography
                  color={stage.isCurrent ? "primary" : "textSecondary"}
                  style={styles.label}
                  variant="label"
                >
                  {stage.title}
                </Typography>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Typography color="textSecondary" variant="secondary">
          {t("plants.screen.journeyEmpty")}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  connector: {
    backgroundColor: colors.divider,
    height: 1,
    left: -14,
    position: "absolute",
    top: 18,
    width: 20,
  },
  current: { backgroundColor: colors.primary, borderColor: colors.primary },
  journey: { flexDirection: "row", gap: STEP_GAP },
  label: { textAlign: "center" },
  node: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.divider,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  position: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  section: { gap: spacing.base },
  step: { alignItems: "center", gap: spacing.xs, width: STEP_WIDTH },
});
