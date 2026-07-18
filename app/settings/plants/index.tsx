import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import {
  listPlants,
  PlantIdentity,
  resolvePlantIdentity,
} from "@/features/plants";
import { t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

export default function PlantScheduleListRoute() {
  const query = useQuery({ queryKey: ["plants"], queryFn: listPlants });
  if (query.isPending) return <LoadingScreen />;

  return (
    <Screen title="">
      <TopBar onBack={() => router.back()} title={t("settings.plants.title")} />
      {query.data?.length === 0 ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("settings.plants.noPlants")}
        </Typography>
      ) : null}
      <View style={styles.list}>
        {query.data?.map((plant) => {
          const identity = resolvePlantIdentity(plant);
          return (
            <Pressable
              accessibilityLabel={t("settings.plants.openAccessibility", {
                plant: plant.name,
              })}
              accessibilityRole="button"
              key={plant.id}
              onPress={() =>
                router.push({
                  pathname: "/settings/plants/[id]",
                  params: { id: plant.id },
                })
              }
            >
              <SurfaceCard>
                <PlantIdentity
                  imageUri={null}
                  name={plant.name}
                  size="list"
                  speciesTitle={identity.speciesTitle}
                  stageId={plant.stageId}
                  stageTitle={identity.stageTitle}
                />
              </SurfaceCard>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { gap: spacing.sm } });
