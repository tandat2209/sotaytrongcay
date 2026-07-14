import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import {
  listPlants,
  PlantIdentity,
  resolvePlantIdentity,
} from "@/features/plants";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

export default function PlantScheduleListRoute() {
  const query = useQuery({ queryKey: ["plants"], queryFn: listPlants });
  return (
    <Screen title="">
      <TopBar onBack={() => router.back()} title="Tùy chỉnh theo cây" />
      {query.isPending ? (
        <Typography variant="bodyMedium">Đang tải cây trồng…</Typography>
      ) : null}
      {query.data?.length === 0 ? (
        <Typography color="textSecondary" variant="bodyMedium">
          Chưa có cây trồng để tùy chỉnh.
        </Typography>
      ) : null}
      <View style={styles.list}>
        {query.data?.map((plant) => {
          const identity = resolvePlantIdentity(plant);
          return (
            <Pressable
              accessibilityLabel={`Tùy chỉnh kế hoạch cho ${plant.name}`}
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
