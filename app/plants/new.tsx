import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { createId } from "@/shared/lib/identifiers";
import { savePlant } from "@/features/plants/data/plant-repository";
import { CreatePlantScreen } from "@/features/plants/ui/CreatePlantScreen";

export default function NewPlantRoute() {
  const queryClient = useQueryClient();

  return <CreatePlantScreen onBack={() => router.back()} onSave={async (draft) => {
    const id = createId();
    await savePlant({ ...draft, id, createdAt: new Date().toISOString() });
    await queryClient.invalidateQueries({ queryKey: ["plants"] });
    router.replace({ pathname: "/plants/[id]", params: { id } });
  }} />;
}
