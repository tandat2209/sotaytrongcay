import { CircleHelp, Lightbulb, type LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { OccurredAtField } from "./OccurredAtField";

type Props = Readonly<{
  dateError?: string | null;
  occurredAt: Date;
  onOccurredAtChange: (value: Date) => void;
  reason?: string;
  suggestion?: string;
}>;

export function CareEntryContextFields({
  dateError,
  occurredAt,
  onOccurredAtChange,
  reason,
  suggestion,
}: Props) {
  return (
    <>
      {suggestion ? (
        <ContextRow
          icon={Lightbulb}
          label={t("journal.careEntry.suggestionLabel")}
          text={suggestion}
        />
      ) : null}
      {reason ? (
        <ContextRow
          icon={CircleHelp}
          label={t("journal.careEntry.reasonLabel")}
          text={reason}
        />
      ) : null}
      <OccurredAtField
        accessibilityLabel={t("journal.careEntry.dateAccessibility")}
        {...(dateError !== undefined ? { error: dateError } : {})}
        label={t("journal.careEntry.dateLabel")}
        onChange={onOccurredAtChange}
        value={occurredAt}
      />
    </>
  );
}

function ContextRow({
  icon: Icon,
  label,
  text,
}: Readonly<{ icon: LucideIcon; label: string; text: string }>) {
  return (
    <View style={styles.context}>
      <View style={styles.contextTitle}>
        <Icon color={colors.textSecondary} size={18} />
        <Typography variant="bodyLarge">{label}</Typography>
      </View>
      <Typography color="textSecondary" variant="bodyMedium">
        {text}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  context: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.control,
    gap: spacing.xs,
    padding: spacing.md,
  },
  contextTitle: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
