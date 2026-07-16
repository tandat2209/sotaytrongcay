import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import type { UserFertilizer } from "../models/user-fertilizer";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  fertilizers: readonly UserFertilizer[];
  onAdd: () => void;
  onBack: () => void;
  onOpen: (fertilizer: UserFertilizer) => void;
}>;

export function FertilizerManagementScreen({
  fertilizers,
  onAdd,
  onBack,
  onOpen,
}: Props) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi-VN");
    return query
      ? fertilizers.filter((item) =>
          item.name.toLocaleLowerCase("vi-VN").includes(query),
        )
      : fertilizers;
  }, [fertilizers, search]);
  return (
    <Screen title="">
      <TopBar onBack={onBack} title={t("fertilizers.management.title")} />
      <View style={styles.search}>
        <Search color={colors.textSecondary} size={20} />
        <TextInput
          accessibilityLabel={t("fertilizers.management.search")}
          onChangeText={setSearch}
          placeholder={t("fertilizers.management.search")}
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
          value={search}
        />
      </View>
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Typography variant="headlineSmall">
            {search.trim()
              ? t("fertilizers.management.noMatch")
              : t("fertilizers.management.empty")}
          </Typography>
          <Typography color="textSecondary" variant="bodyLarge">
            {t("fertilizers.management.emptyDescription")}
          </Typography>
        </View>
      ) : (
        <View style={styles.list}>
          {filtered.map((fertilizer) => (
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
                {fertilizer.npk ? (
                  <Typography color="textSecondary" variant="bodyMedium">
                    {fertilizer.npk}
                  </Typography>
                ) : null}
              </SurfaceCard>
            </Pressable>
          ))}
        </View>
      )}
      <PrimaryButton label={t("fertilizers.management.add")} onPress={onAdd} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs, minHeight: 64 },
  empty: { gap: spacing.sm, paddingVertical: spacing.xl },
  list: { gap: spacing.sm },
  search: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  searchInput: { color: colors.text, flex: 1, fontSize: 16 },
});
