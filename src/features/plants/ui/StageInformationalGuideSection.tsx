import { BookOpen, ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
        <InformationalGuideCard guide={guide} key={guide.id} />
      ))}
    </View>
  );
}

function InformationalGuideCard({ guide }: { guide: CareGuide }) {
  const [expanded, setExpanded] = useState(false);
  const ToggleIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <SurfaceCard style={styles.card}>
      <Pressable
        accessibilityLabel={t("plants.guide.referenceToggleAccessibility", {
          title: guide.title,
        })}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [
          styles.guideHeading,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.icon}>
          <BookOpen color={colors.primary} size={20} />
        </View>
        <Typography style={styles.title} variant="headlineSmall">
          {guide.title}
        </Typography>
        <ToggleIcon color={colors.textSecondary} size={20} />
      </Pressable>
      {expanded ? (
        <View style={styles.content}>
          {guide.goal !== guide.title ? (
            <Typography variant="bodyLarge">{guide.goal}</Typography>
          ) : null}
          <KnowledgeMarkdown markdown={withoutRepeatedTitle(guide)} />
        </View>
      ) : null}
    </SurfaceCard>
  );
}

function withoutRepeatedTitle(guide: CareGuide): string {
  const markdown = guide.bodyMarkdown.trimStart();
  const heading = `# ${guide.title}`;

  return markdown.startsWith(`${heading}\n`)
    ? markdown.slice(heading.length).trimStart()
    : guide.bodyMarkdown;
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  content: { gap: spacing.md },
  guideHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 44,
  },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  pressed: { opacity: 0.72 },
  section: { gap: spacing.md },
  title: { flex: 1 },
});
