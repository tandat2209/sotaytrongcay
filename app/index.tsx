import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { Text } from "react-native";
import { listPlants } from "@/features/plants/data/plant-repository";
import { WelcomeScreen } from "@/features/plants/ui/WelcomeScreen";

export default function StartupRoute() {
  const query = useQuery({ queryKey: ["plants"], queryFn: listPlants });

  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError) return <Text>Chưa thể mở dữ liệu cây trồng. Hãy thử lại.</Text>;
  if (query.data.length > 0) return <Redirect href="/today" />;

  return <WelcomeScreen onStart={() => router.push("/plants/new")} />;
}
