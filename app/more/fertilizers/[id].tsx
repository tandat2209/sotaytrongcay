import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Text } from "react-native";
import { z } from "zod";
import {
  deleteUserFertilizer,
  getUserFertilizer,
  saveUserFertilizer,
  UserFertilizerEditorScreen,
  type UserFertilizerFields,
} from "@/features/fertilizers";
import { t } from "@/shared/i18n";
import { createId } from "@/shared/lib/identifiers";

export default function EditUserFertilizerRoute() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["user-fertilizer", id],
    queryFn: () => getUserFertilizer(id),
  });
  if (query.isPending)
    return <Text>{t("common.state.loadingDeviceData")}</Text>;
  if (query.isError) return <Text>{t("fertilizers.error.load")}</Text>;
  if (!query.data) return <Text>{t("fertilizers.error.notFound")}</Text>;
  const fertilizer = query.data;
  async function save(fields: UserFertilizerFields) {
    await saveUserFertilizer({
      ...fertilizer,
      ...fields,
      mutationId: createId(),
      updatedAt: new Date().toISOString(),
    });
    await queryClient.invalidateQueries({ queryKey: ["user-fertilizers"] });
    router.back();
  }
  async function remove() {
    return await new Promise<void>((resolve) => {
      Alert.alert(
        t("fertilizers.delete.title"),
        t("fertilizers.delete.body"),
        [
          {
            text: t("common.actions.cancel"),
            style: "cancel",
            onPress: () => resolve(),
          },
          {
            text: t("fertilizers.editor.delete"),
            style: "destructive",
            onPress: () => {
              void deleteUserFertilizer(id)
                .then(async () => {
                  await queryClient.invalidateQueries({
                    queryKey: ["user-fertilizers"],
                  });
                  router.back();
                })
                .catch(() => Alert.alert(t("fertilizers.error.delete")))
                .finally(() => resolve());
            },
          },
        ],
        { cancelable: false },
      );
    });
  }
  return (
    <UserFertilizerEditorScreen
      fertilizer={fertilizer}
      onBack={() => router.back()}
      onDelete={remove}
      onSave={save}
    />
  );
}
