import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { listCareActivities } from "@/features/journal";
import { listCarePlans } from "@/features/knowledge";
import { listPlants } from "@/features/plants";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { listCarePlanReminderPreferences } from "../data/care-plan-reminder-repository";
import { createReminderItems } from "../models/reminder-projection";
import { ReminderListScreen } from "./ReminderListScreen";

type Props = Readonly<{
  onBack: () => void;
  onOpen: (id: string) => void;
}>;

export function ReminderListRouteScreen({ onBack, onOpen }: Props) {
  const query = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const [activities, plants, preferences] = await Promise.all([
        listCareActivities(),
        listPlants(),
        listCarePlanReminderPreferences(true),
      ]);
      return createReminderItems({
        activities,
        evaluatedAt: new Date(),
        plansByPlant: new Map(
          plants.map((plant) => [
            plant.id,
            listCarePlans({
              speciesId: plant.speciesId,
              stageId: plant.stageId,
            }),
          ]),
        ),
        plants,
        preferences,
      });
    },
  });
  if (query.isPending)
    return <Typography color="textSecondary" variant="bodyMedium">Đang tải lời nhắc…</Typography>;
  if (query.isError)
    return (
      <>
        <Typography color="textSecondary" variant="bodyMedium">
          {query.error instanceof z.ZodError
            ? "Dữ liệu lời nhắc trên thiết bị chưa hợp lệ."
            : "Chưa thể tải lời nhắc."}
        </Typography>
        <PrimaryButton label="Thử lại" onPress={() => void query.refetch()} />
      </>
    );
  return (
    <ReminderListScreen items={query.data} onBack={onBack} onOpen={onOpen} />
  );
}
