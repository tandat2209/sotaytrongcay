import { LinearGradient } from "expo-linear-gradient";
import { Leaf } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { PlantAgeTicker } from "./PlantAgeTicker";
import { PlantPhotoViewer } from "./PlantPhotoViewer";

type Props = Readonly<{
  ageLabels: readonly string[];
  imageUri: string | null;
  name: string;
  speciesTitle: string;
}>;

export function PlantDetailHero({
  ageLabels,
  imageUri,
  name,
  speciesTitle,
}: Props) {
  const [failedImageUri, setFailedImageUri] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  if (!imageUri || failedImageUri === imageUri)
    return (
      <PlantIdentityFallback
        ageLabels={ageLabels}
        name={name}
        speciesTitle={speciesTitle}
      />
    );

  const handleImageError = () => {
    setViewerOpen(false);
    setFailedImageUri(imageUri);
  };
  const ageDescription = ageLabels.length ? ` ${ageLabels.join(". ")}.` : "";

  return (
    <>
      <Pressable
        accessibilityLabel={t("plants.photo.openLatest", {
          age: ageDescription,
          plant: name,
          species: speciesTitle,
        })}
        accessibilityRole="button"
        onPress={() => setViewerOpen(true)}
        style={({ pressed }) => [styles.hero, pressed && styles.pressed]}
      >
        <Image
          accessibilityIgnoresInvertColors
          onError={handleImageError}
          resizeMode="cover"
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["transparent", "rgba(17, 24, 14, 0.9)"]}
          locations={[0.28, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlayIdentity}>
          <Typography
            numberOfLines={2}
            style={styles.heroName}
            variant="display"
          >
            {name}
          </Typography>
          <View style={styles.metadataRow}>
            <View style={styles.heroSpeciesChip}>
              <Typography
                numberOfLines={1}
                style={styles.heroSpeciesLabel}
                variant="label"
              >
                {speciesTitle}
              </Typography>
            </View>
            {ageLabels.length ? (
              <PlantAgeTicker
                appearance="hero"
                hiddenFromAccessibility
                labels={ageLabels}
              />
            ) : null}
          </View>
        </View>
      </Pressable>
      <PlantPhotoViewer
        imageUri={imageUri}
        onDismiss={() => setViewerOpen(false)}
        onImageError={handleImageError}
        plantName={name}
        visible={viewerOpen}
      />
    </>
  );
}

function PlantIdentityFallback({
  ageLabels,
  name,
  speciesTitle,
}: Omit<Props, "imageUri">) {
  return (
    <View style={styles.fallback}>
      <View accessibilityElementsHidden style={styles.fallbackImage}>
        <Leaf color={colors.primary} size={34} />
      </View>
      <View style={styles.fallbackCopy}>
        <Typography numberOfLines={2} variant="screenTitle">
          {name}
        </Typography>
        <View style={styles.metadataRow}>
          <View style={styles.fallbackSpeciesChip}>
            <Typography color="primary" numberOfLines={1} variant="label">
              {speciesTitle}
            </Typography>
          </View>
          {ageLabels.length ? (
            <PlantAgeTicker appearance="fallback" labels={ageLabels} />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.card,
    flexDirection: "row",
    gap: spacing.base,
    padding: spacing.base,
  },
  fallbackCopy: { flex: 1, gap: spacing.sm, minWidth: 0 },
  fallbackImage: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  fallbackSpeciesChip: {
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    maxWidth: "100%",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  hero: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: "100%",
  },
  heroName: { color: colors.surface },
  heroSpeciesChip: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: radius.pill,
    maxWidth: "100%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  heroSpeciesLabel: { color: colors.primaryStrong },
  metadataRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  overlayIdentity: { gap: spacing.sm, padding: spacing.lg },
  pressed: { opacity: 0.9 },
});
