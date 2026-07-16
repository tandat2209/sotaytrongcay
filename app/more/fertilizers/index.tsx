import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "react-native";
import {
  FertilizerManagementScreen,
  listUserFertilizers,
} from "@/features/fertilizers";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";

export default function FertilizerManagementRoute() {
  const query = useQuery({
    queryKey: ["user-fertilizers"],
    queryFn: listUserFertilizers,
  });
  if (query.isPending)
    return <Text>{t("common.state.loadingDeviceData")}</Text>;
  if (query.isError)
    return (
      <>
        <Text>{t("fertilizers.error.load")}</Text>
        <PrimaryButton
          label={t("common.actions.retry")}
          onPress={() => void query.refetch()}
        />
      </>
    );
  return (
    <FertilizerManagementScreen
      fertilizers={query.data}
      onAdd={() => router.push("/more/fertilizers/new")}
      onBack={() => router.back()}
      onOpen={(fertilizer) =>
        router.push({
          pathname: "/more/fertilizers/[id]",
          params: { id: fertilizer.id },
        })
      }
    />
  );
}
