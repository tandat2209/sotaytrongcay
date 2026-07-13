import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, View } from "react-native";
import { stageIcon } from "@/features/knowledge/stage-icons";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Size = "detail" | "list" | "rail";

type Props = Readonly<{
  imageUri?: string;
  name: string;
  size: Size;
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
}>;

const imageSize: Record<Size, number> = { detail: 72, list: 44, rail: 64 };

export function PlantIdentity({ imageUri, name, size, speciesTitle, stageId, stageTitle }: Props) {
  const dimension = imageSize[size];
  return <View style={[styles.container, size === "rail" && styles.rail]}>
    <View accessibilityElementsHidden style={[styles.image, { height: dimension, width: dimension }, size === "rail" && styles.railImage]}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.photo} /> : <Ionicons color={colors.primary} name="leaf-outline" size={size === "detail" ? 34 : size === "rail" ? 28 : 22} />}
    </View>
    <View style={styles.copy}>
      <Typography numberOfLines={size === "rail" ? 2 : 1} style={[styles.name, size === "rail" && styles.railName]} variant={size === "detail" ? "headlineLarge" : "bodyLarge"}>{name}</Typography>
      <View style={styles.metadata}>
        <View style={styles.speciesChip}><Typography color="primary" numberOfLines={1} style={styles.speciesLabel} variant="label">{speciesTitle}</Typography></View>
        <View style={styles.stage}><Ionicons accessibilityElementsHidden color={colors.textSecondary} name={stageIcon(stageId)} size={16} /><Typography color="textSecondary" numberOfLines={1} style={styles.stageTitle} variant="bodyMedium">{stageTitle}</Typography></View>
      </View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: spacing.md, minWidth: 0 },
  copy: { flex: 1, gap: spacing.xs, minWidth: 0 },
  image: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: radius.card, justifyContent: "center", overflow: "hidden" },
  metadata: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, minWidth: 0 },
  name: { fontWeight: "600" },
  photo: { height: "100%", width: "100%" },
  rail: { alignItems: "center", flexDirection: "column", gap: spacing.sm, width: 116 },
  railImage: { borderColor: colors.primary, borderRadius: radius.round, borderWidth: 2 },
  railName: { textAlign: "center" },
  speciesChip: { alignSelf: "flex-start", backgroundColor: colors.primarySoft, borderRadius: radius.chip, maxWidth: "100%", paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  speciesLabel: { flexShrink: 1 },
  stage: { alignItems: "center", flexDirection: "row", flexShrink: 1, gap: spacing.xs, maxWidth: "100%", minWidth: 0 },
  stageTitle: { flexShrink: 1 },
});
