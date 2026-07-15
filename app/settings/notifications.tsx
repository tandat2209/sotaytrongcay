import { Bell } from "lucide-react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

import { t } from "@/shared/i18n";
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
      <TopBar
        onBack={() => router.back()}
        title={t("settings.notifications.title")}
        titleIcon={Bell}
      />
      <Typography variant="bodyLarge">
        {enabled === null
          ? t("settings.notifications.checking")
          : enabled
            ? t("settings.notifications.enabled")
            : t("settings.notifications.disabled")}
      </Typography>
      {enabled ? null : (
        <PrimaryButton
          label={t("settings.notifications.enable")}
          onPress={() =>
            void ensureReminderNotificationPermission().then(setEnabled)
          }
        />
      )}
    </Screen>
  );
}
