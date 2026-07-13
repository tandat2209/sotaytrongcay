import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { z } from "zod";

import { evaluateCarePlans } from "@/features/guidance";
import { listCareActivities } from "@/features/journal";
import { listCarePlans } from "@/features/knowledge";
import { listPlants } from "@/features/plants";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { Typography } from "@/shared/ui/Typography";
import { createTodayProjection } from "../models/today-projection";
import { TodayOverview } from "./TodayOverview";

export function TodayScreen() {
  const query = useQuery({
    queryKey: ["today"],
    queryFn: async () => {
      const [activities, plants] = await Promise.all([listCareActivities(), listPlants()]);
      const evaluations = plants.flatMap((plant) => evaluateCarePlans({
        activities,
        evaluatedAt: new Date(),
        plant,
        plans: listCarePlans({
          speciesId: plant.speciesId,
          stageId: plant.stageId,
        }),
      }));
      return createTodayProjection({ activities, evaluations, plants });
    },
  });
  const errorMessage = query.error instanceof z.ZodError ? "Dữ liệu trên thiết bị chưa hợp lệ." : "Chưa thể tải trang Hôm nay.";

  return <Screen introduction="Theo dõi việc chăm sóc cần chú ý trong ngày." title="Hôm nay">
    {query.isPending ? <Typography color="textSecondary" variant="bodyLarge">Đang tải dữ liệu trên thiết bị…</Typography> : null}
    {query.isError ? <><Typography color="textSecondary" variant="bodyLarge">{errorMessage}</Typography><PrimaryButton label="Thử lại" onPress={() => void query.refetch()} /></> : null}
    {query.data ? <TodayOverview onAddPlant={() => router.push("/plants/new")} onOpenActivity={(id) => router.push(`/entries/${id}`)} onOpenJournal={() => router.push("/journal")} onOpenPlant={(id) => router.push(`/plants/${id}`)} onRecordCare={(plantId, type) => router.push({ pathname: "/plants/[id]/care", params: { id: plantId, type, origin: "today" } })} projection={query.data} /> : null}
  </Screen>;
}
