import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import type { CareActivityType } from "../models/care-activity";
import { t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  amount: string;
  amountError?: string | null;
  notes: string;
  onAmountChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  type: CareActivityType;
}>;

export function CareEntryDetailsSection({
  amount,
  amountError,
  notes,
  onAmountChange,
  onNotesChange,
  type,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const Icon = expanded ? ChevronUp : ChevronDown;
  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((value) => !value)}
        style={styles.toggle}
      >
        <Typography color="primary" variant="bodyLarge">
          {t(
            expanded
              ? "journal.careEntry.details.collapse"
              : "journal.careEntry.details.expand",
          )}
        </Typography>
        <Icon color={colors.primary} size={20} />
      </Pressable>
      {expanded ? (
        <View style={styles.fields}>
          {type === "watering" ? (
            <FormField
              {...(amountError !== undefined ? { error: amountError } : {})}
              label={t("journal.careEntry.amountLabel")}
            >
              <View style={styles.amountRow}>
                <TextInput
                  accessibilityLabel={t(
                    "journal.careEntry.amountAccessibility",
                  )}
                  inputMode="decimal"
                  onChangeText={onAmountChange}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                  value={amount}
                />
                <Typography style={styles.unit} variant="bodyLarge">
                  {t("journal.activityUnit.liter")}
                </Typography>
              </View>
            </FormField>
          ) : null}
          <FormField label={t("journal.careEntry.notesLabel")}>
            <TextInput
              accessibilityLabel={t("journal.careEntry.notesAccessibility")}
              multiline
              onChangeText={onNotesChange}
              placeholder={t("journal.careEntry.notesPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, styles.notes]}
              value={notes}
            />
          </FormField>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  amountRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  fields: { gap: spacing.md },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  notes: { minHeight: 112, paddingTop: spacing.md, textAlignVertical: "top" },
  section: { gap: spacing.md },
  toggle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
  },
  unit: { minWidth: 32 },
});
