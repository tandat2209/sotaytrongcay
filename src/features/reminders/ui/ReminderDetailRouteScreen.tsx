import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getPlant } from "@/features/plants";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { getCarePlanReminderPreference } from "../data/care-plan-reminder-repository";
import {
  ensureReminderNotificationPermission,
} from "../notifications/reminder-notification";
import { updateCarePlanReminderPreference } from "../application/reconcile-reminders";
import { ReminderDetailScreen } from "./ReminderDetailScreen";

type Props = Readonly<{ id: string; onBack: () => void }>;

export function ReminderDetailRouteScreen({ id, onBack }: Props) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["reminder", id],
    queryFn: async () => {
      const preference = await getCarePlanReminderPreference(id);
      if (!preference) return null;
      return { plant: await getPlant(preference.plantId), preference };
    },
  });
  if (query.isPending) return <Typography variant="bodyMedium">Đang tải lời nhắc…</Typography>;
  if (query.isError)
    return (
      <>
        <Typography color="error" variant="bodyMedium">Chưa thể tải lời nhắc.</Typography>
        <PrimaryButton label="Thử lại" onPress={() => void query.refetch()} />
      </>
    );
  if (!query.data?.plant)
    return <Typography variant="bodyMedium">Không tìm thấy lời nhắc.</Typography>;

  return (
    <ReminderDetailScreen
      onBack={onBack}
      onSave={async (preference) => {
        const permissionGranted =
          !preference.notificationEnabled ||
          (await ensureReminderNotificationPermission());
        await updateCarePlanReminderPreference({
          ...preference,
          notificationEnabled:
            preference.notificationEnabled && permissionGranted,
        });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["reminders"] }),
          queryClient.invalidateQueries({ queryKey: ["reminder", id] }),
          queryClient.invalidateQueries({ queryKey: ["today"] }),
        ]);
      }}
      plantName={query.data.plant.name}
      preference={query.data.preference}
    />
  );
}
