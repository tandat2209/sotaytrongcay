import { Leaf, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import { PlantAgeTicker } from "./PlantAgeTicker";

type Props = Readonly<{
  ageLabels: readonly string[];
  imageUri: string | null;
  name: string;
  speciesTitle: string;
}>;

export function PlantDetailHero({ ageLabels, imageUri, name, speciesTitle }: Props) {
  const [failedImageUri, setFailedImageUri] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  if (!imageUri || failedImageUri === imageUri) return <PlantIdentityFallback ageLabels={ageLabels} name={name} speciesTitle={speciesTitle} />;

  const handleImageError = () => {
    setViewerOpen(false);
    setFailedImageUri(imageUri);
  };
  const ageDescription = ageLabels.length ? ` ${ageLabels.join(". ")}.` : "";

  return <>
    <Pressable
      accessibilityLabel={`${name}, ${speciesTitle}.${ageDescription} Mở ảnh mới nhất toàn màn hình`}
      accessibilityRole="button"
      onPress={() => setViewerOpen(true)}
      style={({ pressed }) => [styles.hero, pressed && styles.pressed]}
    >
      <Image accessibilityIgnoresInvertColors onError={handleImageError} resizeMode="cover" source={{ uri: imageUri }} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={["transparent", "rgba(11, 24, 10, 0.82)"]} locations={[0.32, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.overlayIdentity}>
        <Typography numberOfLines={2} style={styles.heroName} variant="headlineLarge">{name}</Typography>
        <View style={styles.metadataRow}>
          <View style={styles.heroSpeciesChip}><Typography numberOfLines={1} style={styles.heroSpeciesLabel} variant="label">{speciesTitle}</Typography></View>
          {ageLabels.length ? <PlantAgeTicker appearance="hero" hiddenFromAccessibility labels={ageLabels} /> : null}
        </View>
      </View>
    </Pressable>
    <Modal animationType="fade" onRequestClose={() => setViewerOpen(false)} presentationStyle="overFullScreen" transparent visible={viewerOpen}>
      <SafeAreaView accessibilityViewIsModal edges={["top", "bottom"]} style={styles.viewer}>
        <Pressable accessibilityLabel="Đóng ảnh" accessibilityRole="button" hitSlop={6} onPress={() => setViewerOpen(false)} style={({ pressed }) => [styles.closeButton, pressed && styles.viewerPressed]}>
          <X color={colors.surface} size={28} />
        </Pressable>
        <Image accessibilityLabel={`Ảnh mới nhất của ${name}`} accessible accessibilityIgnoresInvertColors onError={handleImageError} resizeMode="contain" source={{ uri: imageUri }} style={styles.fullImage} />
      </SafeAreaView>
    </Modal>
  </>;
}

function PlantIdentityFallback({ ageLabels, name, speciesTitle }: Omit<Props, "imageUri">) {
  return <View style={styles.fallback}>
    <View accessibilityElementsHidden style={styles.fallbackImage}><Leaf color={colors.primary} size={34} /></View>
    <View style={styles.fallbackCopy}>
      <Typography numberOfLines={2} variant="headlineLarge">{name}</Typography>
      <View style={styles.metadataRow}>
        <View style={styles.fallbackSpeciesChip}><Typography color="primary" numberOfLines={1} variant="label">{speciesTitle}</Typography></View>
        {ageLabels.length ? <PlantAgeTicker appearance="fallback" labels={ageLabels} /> : null}
      </View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  closeButton: { alignItems: "center", alignSelf: "flex-end", height: control.iconTarget, justifyContent: "center", marginHorizontal: spacing.md, width: control.iconTarget, zIndex: 1 },
  fallback: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  fallbackCopy: { flex: 1, gap: spacing.xs, minWidth: 0 },
  fallbackImage: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: radius.card, height: 72, justifyContent: "center", width: 72 },
  fallbackSpeciesChip: { alignSelf: "flex-start", backgroundColor: colors.primarySoft, borderRadius: radius.round, maxWidth: "100%", paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  fullImage: { flex: 1, width: "100%" },
  hero: { aspectRatio: 16 / 9, backgroundColor: colors.primarySoft, borderRadius: 20, justifyContent: "flex-end", overflow: "hidden", width: "100%" },
  heroName: { color: colors.surface },
  heroSpeciesChip: { alignSelf: "flex-start", backgroundColor: "rgba(255, 255, 255, 0.92)", borderRadius: radius.round, maxWidth: "100%", paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  heroSpeciesLabel: { color: colors.primary },
  metadataRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  overlayIdentity: { gap: spacing.xs, padding: spacing.md },
  pressed: { opacity: 0.9 },
  viewer: { backgroundColor: "rgba(0, 0, 0, 0.96)", flex: 1 },
  viewerPressed: { backgroundColor: "rgba(255, 255, 255, 0.16)", borderRadius: radius.round },
});
