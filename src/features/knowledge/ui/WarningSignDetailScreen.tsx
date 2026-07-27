import { AlertTriangle } from "lucide-react-native";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { WarningSign } from "../preview-knowledge";
import { getWarningSignImage } from "../warning-sign-images";
import { KnowledgeMarkdown } from "./KnowledgeMarkdown";

export function WarningSignDetailScreen({
  onBack,
  sign,
}: {
  onBack: () => void;
  sign: WarningSign;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = getWarningSignImage(sign.imageId);

  return (
    <Screen introduction={null} title="">
      <TopBar
        onBack={onBack}
        title={t("warningSigns.detail.title")}
        titleIcon={AlertTriangle}
      />
      <View style={styles.heading}>
        <Typography variant="headlineLarge">{sign.title}</Typography>
        <Typography color="textSecondary" variant="bodyLarge">
          {sign.summary}
        </Typography>
      </View>
      {image && !imageFailed ? (
        <View style={styles.imageFrame}>
          <Image
            accessibilityLabel={t("warningSigns.imageAccessibility", {
              title: sign.title,
            })}
            accessibilityRole="image"
            onError={() => setImageFailed(true)}
            resizeMode="contain"
            source={image}
            style={styles.image}
          />
        </View>
      ) : null}
      <SurfaceCard style={styles.notice}>
        <AlertTriangle color={colors.secondary} size={20} />
        <Typography
          color="textSecondary"
          style={styles.noticeCopy}
          variant="bodyMedium"
        >
          {t("warningSigns.disclaimer")}
        </Typography>
      </SurfaceCard>
      <KnowledgeMarkdown markdown={sign.bodyMarkdown} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.sm },
  image: { height: "100%", width: "100%" },
  imageFrame: {
    aspectRatio: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },
  notice: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  noticeCopy: { flex: 1 },
});
