import { Bell } from "lucide-react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

import { ensureReminderNotificationPermission } from "@/features/reminders";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";

export default function NotificationSettingsRoute() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    void Notifications.getPermissionsAsync().then((status) =>
      setEnabled(status.granted),
    );
  }, []);
  return (
    <Screen title="">
      <TopBar onBack={() => router.back()} title="Thông báo" titleIcon={Bell} />
      <Typography variant="bodyLarge">
        {enabled === null
          ? "Đang kiểm tra quyền thông báo…"
          : enabled
            ? "Thông báo hệ thống đang được bật."
            : "Thông báo hệ thống đang tắt."}
      </Typography>
      {enabled ? null : (
        <PrimaryButton
          label="Bật thông báo"
          onPress={() =>
            void ensureReminderNotificationPermission().then(setEnabled)
          }
        />
      )}
    </Screen>
  );
}
