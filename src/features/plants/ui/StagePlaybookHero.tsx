import { Clock, Target } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { getStageImage } from "@/features/knowledge/stage-images";
import { StageIcon } from "@/features/knowledge/stage-icons";
import type { StagePlaybook } from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

export function StagePlaybookHero({ playbook }: { playbook: StagePlaybook }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = getStageImage(playbook.imageId);

  if (!image || imageFailed) {
    return <HeroContent playbook={playbook} style={styles.fallbackHero} />;
  }

  return (
    <ImageBackground
      accessibilityLabel={t("plants.guide.stageImageAccessibility", {
        stage: playbook.title,
      })}
      accessibilityRole="image"
      imageStyle={styles.image}
      onError={() => setImageFailed(true)}
      source={image}
      style={styles.imageHero}
    >
      <LinearGradient
        colors={["rgba(10, 42, 15, 0.06)", "rgba(10, 42, 15, 0.78)"]}
        locations={[0, 1]}
        style={styles.overlay}
      >
        <HeroContent playbook={playbook} />
      </LinearGradient>
    </ImageBackground>
  );
}

function HeroContent({
  playbook,
  style,
}: {
  playbook: StagePlaybook;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.hero, style]}>
      <View style={styles.heroStageRow}>
        <StageIcon color="#FFFFFF" size={20} stageId={playbook.id} />
        <Typography style={styles.heroTitle} variant="headlineMedium">
          {playbook.title}
        </Typography>
      </View>
      {playbook.estimatedDuration ? (
        <View style={styles.heroDuration}>
          <Clock color="#FFFFFF" size={16} />
          <View style={styles.heroDurationChip}>
            <Typography style={styles.heroDurationText} variant="bodyMedium">
              {playbook.estimatedDuration}
            </Typography>
          </View>
        </View>
      ) : null}
      <View style={styles.heroObjective}>
        <Target color="#FFFFFF" size={16} style={styles.heroObjectiveIcon} />
        <Typography style={styles.heroObjectiveText} variant="bodyLarge">
          {playbook.primaryObjective}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackHero: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    minHeight: 160,
  },
  hero: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: "flex-end",
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  heroDuration: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: spacing.xs,
    marginLeft: 2,
  },
  heroDurationChip: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  heroDurationText: { color: "rgba(255,255,255,0.92)" },
  heroObjective: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    marginLeft: 2,
  },
  heroObjectiveIcon: { marginTop: 4 },
  heroObjectiveText: { color: "#FFFFFF", flex: 1 },
  heroStageRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  heroTitle: { color: "#FFFFFF", flex: 1 },
  image: { borderRadius: 16 },
  imageHero: { borderRadius: 16, minHeight: 220, overflow: "hidden" },
  overlay: { flex: 1 },
});
