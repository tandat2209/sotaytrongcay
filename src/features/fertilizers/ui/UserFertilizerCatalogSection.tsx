import { Pressable, StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { FertilizerUsage } from "../models/fertilizer-usage";
import type { UserFertilizer } from "../models/user-fertilizer";
import { FERTILIZER_GROUP_ICONS } from "./fertilizer-group-visual";
import { FertilizerUsageLabel } from "./FertilizerUsageLabel";

type Props = Readonly<{
  filtered: boolean;
  fertilizers: readonly UserFertilizer[];
  onAdd: () => void;
  onOpen: (fertilizer: UserFertilizer) => void;
  usages: Readonly<Record<string, FertilizerUsage>>;
}>;

export function UserFertilizerCatalogSection({
  filtered,
  fertilizers,
  onAdd,
  onOpen,
  usages,
}: Props) {
  return (
    <View style={styles.section}>
      <SectionHeader title={t("fertilizers.management.mine")} />
      {fertilizers.length === 0 ? (
        <View style={styles.empty}>
          <Typography variant="headlineSmall">
            {t(
              filtered
                ? "fertilizers.management.noMatch"
                : "fertilizers.management.empty",
            )}
          </Typography>
          <Typography color="textSecondary" variant="bodyLarge">
            {t("fertilizers.management.emptyDescription")}
          </Typography>
        </View>
      ) : (
        <View style={styles.list}>
          {fertilizers.map((fertilizer) => {
            const usage = usages[fertilizer.id];
            const GroupIcon = fertilizer.group
              ? FERTILIZER_GROUP_ICONS[fertilizer.group]
              : null;
            return (
              <Pressable
                accessibilityLabel={t("fertilizers.management.open", {
                  name: fertilizer.name,
                })}
                accessibilityRole="button"
                key={fertilizer.id}
                onPress={() => onOpen(fertilizer)}
              >
                <SurfaceCard style={styles.card}>
                  <Typography variant="bodyLarge">{fertilizer.name}</Typography>
                  {fertilizer.group && GroupIcon ? (
                    <View style={styles.group}>
                      <GroupIcon color={colors.textSecondary} size={16} />
                      <Typography color="textSecondary" variant="label">
                        {t(`fertilizers.group.${fertilizer.group}`)}
                      </Typography>
                    </View>
                  ) : null}
                  {usage ? <FertilizerUsageLabel usage={usage} /> : null}
                </SurfaceCard>
              </Pressable>
            );
          })}
        </View>
      )}
      <PrimaryButton label={t("fertilizers.management.add")} onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs, minHeight: 64 },
  empty: { gap: spacing.sm, paddingVertical: spacing.xl },
  group: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  list: { gap: spacing.sm },
  section: { gap: spacing.sm },
});
