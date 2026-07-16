import { BookOpen } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import type { CareGuide } from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { KnowledgeMarkdown } from "./KnowledgeMarkdown";

export function StageInformationalGuideSection({
  guides,
}: {
  guides: readonly CareGuide[];
}) {
  if (guides.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <BookOpen color={colors.primary} size={20} />
        <Typography variant="headlineSmall">
          {t("plants.guide.reference")}
        </Typography>
      </View>
      {guides.map((guide) => (
        <SurfaceCard key={guide.id} style={styles.card}>
          <View style={styles.guideHeading}>
            <View style={styles.icon}>
              <BookOpen color={colors.primary} size={20} />
            </View>
            <Typography style={styles.title} variant="headlineSmall">
              {guide.title}
            </Typography>
          </View>
          {guide.goal !== guide.title ? (
            <Typography variant="bodyLarge">{guide.goal}</Typography>
          ) : null}
          <KnowledgeMarkdown markdown={guide.bodyMarkdown} />
        </SurfaceCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  guideHeading: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  section: { gap: spacing.md },
  title: { flex: 1 },
});
