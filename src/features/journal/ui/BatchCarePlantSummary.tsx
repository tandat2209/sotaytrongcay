import { ListChecks } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import type { Plant } from "@/features/plants";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  plants: readonly Pick<Plant, "id" | "name">[];
}>;

export function BatchCarePlantSummary({ plants }: Props) {
  return (
    <SurfaceCard style={styles.card}>
      <View accessibilityElementsHidden style={styles.icon}>
        <ListChecks color={colors.primary} size={22} />
      </View>
      <View style={styles.text}>
        <Typography variant="bodyLarge">
          {t("plants.batch.selectedSummary", { count: plants.length })}
        </Typography>
        <Typography color="textSecondary" variant="bodyMedium">
          {plants.map((plant) => plant.name).join(" · ")}
        </Typography>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  icon: { alignItems: "center", justifyContent: "center", width: 32 },
  text: { flex: 1, gap: spacing.xs },
});
