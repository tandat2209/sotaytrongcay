import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { Text } from "react-native";
import { t } from "@/shared/i18n";
import { listPlants } from "@/features/plants/data/plant-repository";
import { WelcomeScreen } from "@/features/plants/ui/WelcomeScreen";

export default function StartupRoute() {
  const query = useQuery({ queryKey: ["plants"], queryFn: listPlants });

  if (query.isPending) return <Text>{t("common.state.loading")}</Text>;
  if (query.isError) return <Text>{t("plants.error.openData")}</Text>;
  if (query.data.length > 0) return <Redirect href="/today" />;

  return <WelcomeScreen onStart={() => router.push("/plants/new")} />;
}
