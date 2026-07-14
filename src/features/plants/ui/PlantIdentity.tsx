import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { stageIcon } from "@/features/knowledge/stage-icons";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Size = "detail" | "list" | "rail";

type Props = Readonly<{
  imageUri: string | null;
  name: string;
  size: Size;
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
}>;

const imageDimensions: Record<Size, Readonly<{ height: number; width: number }>> = {
  detail: { height: 72, width: 72 },
  list: { height: 44, width: 44 },
  rail: { height: 104, width: 160 },
};

export function PlantIdentity({ imageUri, name, size, speciesTitle, stageId, stageTitle }: Props) {
  const [failedImageUri, setFailedImageUri] = useState<string | null>(null);
  const dimensions = imageDimensions[size];
  const resolvedImageUri = imageUri && failedImageUri !== imageUri ? imageUri : null;
  return <View style={[styles.container, size === "list" && styles.list, size === "rail" && styles.rail]}>
    <View accessibilityElementsHidden style={[styles.image, dimensions, size === "rail" && styles.railImage]}>
      {resolvedImageUri ? <Image accessibilityIgnoresInvertColors onError={() => setFailedImageUri(resolvedImageUri)} resizeMode="cover" source={{ uri: resolvedImageUri }} style={styles.photo} /> : <Ionicons color={colors.primary} name="leaf-outline" size={size === "detail" ? 34 : size === "rail" ? 32 : 22} />}
    </View>
    <View style={[styles.copy, size === "rail" && styles.railCopy]}>
      <Typography numberOfLines={1} style={[styles.name, size === "rail" && styles.railName]} variant={size === "detail" ? "headlineLarge" : "bodyLarge"}>{name}</Typography>
      <View style={[styles.metadata, size === "rail" && styles.railMetadata]}>
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
  list: { flex: 1 },
  metadata: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, minWidth: 0 },
  name: { fontWeight: "600" },
  photo: { height: "100%", width: "100%" },
  rail: { alignItems: "stretch", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, flexDirection: "column", gap: 0, overflow: "hidden", width: 160 },
  railCopy: { gap: spacing.sm, padding: spacing.md, paddingTop: spacing.sm },
  railImage: { borderRadius: 0 },
  railMetadata: { alignItems: "flex-start" },
  railName: { textAlign: "left" },
  speciesChip: { alignSelf: "flex-start", backgroundColor: colors.primarySoft, borderRadius: radius.chip, maxWidth: "100%", paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  speciesLabel: { flexShrink: 1 },
  stage: { alignItems: "center", flexDirection: "row", flexShrink: 1, gap: spacing.xs, maxWidth: "100%", minWidth: 0 },
  stageTitle: { flexShrink: 1 },
});
