import { Bug, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { StageThreat } from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { KnowledgeMarkdown } from "./KnowledgeMarkdown";

export function StageThreatSection({
  threats,
}: {
  threats: readonly StageThreat[];
}) {
  if (threats.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <ShieldAlert color={colors.primary} size={20} />
        <Typography variant="headlineSmall">
          {t("plants.guide.threats")}
        </Typography>
      </View>
      <Typography color="textSecondary" variant="bodyMedium">
        {t("plants.guide.threatDisclaimer")}
      </Typography>
      {threats.map((threat) => (
        <ThreatCard key={threat.id} threat={threat} />
      ))}
    </View>
  );
}

function ThreatCard({ threat }: { threat: StageThreat }) {
  const [expanded, setExpanded] = useState(false);
  const isDisease = threat.kind === "disease";
  const label = t(
    isDisease ? "plants.guide.threatDisease" : "plants.guide.threatPest",
  );
  const Icon = isDisease ? ShieldAlert : Bug;
  const ToggleIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <SurfaceCard style={styles.card}>
      <Pressable
        accessibilityLabel={t("plants.guide.threatToggleAccessibility", {
          title: threat.title,
        })}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <View style={styles.icon}>
          <Icon color={colors.primary} size={20} />
        </View>
        <View style={styles.copy}>
          <Typography color="textSecondary" variant="label">
            {label.toUpperCase()}
          </Typography>
          <Typography variant="headlineSmall">{threat.title}</Typography>
        </View>
        <ToggleIcon color={colors.textSecondary} size={20} />
      </Pressable>
      {expanded ? <KnowledgeMarkdown markdown={threat.bodyMarkdown} /> : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.base },
  copy: { flex: 1, gap: spacing.xs },
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
  section: { gap: spacing.base },
  trigger: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.base,
    minHeight: 44,
  },
});
