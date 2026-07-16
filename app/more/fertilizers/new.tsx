import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  saveUserFertilizer,
  UserFertilizerEditorScreen,
  type UserFertilizerFields,
} from "@/features/fertilizers";
import { createId } from "@/shared/lib/identifiers";

export default function NewUserFertilizerRoute() {
  const queryClient = useQueryClient();
  async function save(fields: UserFertilizerFields) {
    const now = new Date().toISOString();
    await saveUserFertilizer({
      ...fields,
      id: createId(),
      mutationId: createId(),
      createdAt: now,
      updatedAt: now,
    });
    await queryClient.invalidateQueries({ queryKey: ["user-fertilizers"] });
    router.back();
  }
  return (
    <UserFertilizerEditorScreen onBack={() => router.back()} onSave={save} />
  );
}
