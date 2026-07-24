import { Bell } from "lucide-react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { StyleSheet, Switch, View } from "react-native";

import { t } from "@/shared/i18n";
import {
  ensureReminderNotificationPermission,
  getReminderPreferences,
  reconcileAllCarePlanReminders,
  saveReminderPreferences,
} from "@/features/reminders";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

type NotificationSettingsState = Readonly<{
  notificationEnabled: boolean;
  permissionGranted: boolean;
}>;

export default function NotificationSettingsRoute() {
  const [settings, setSettings] = useState<NotificationSettingsState | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      getReminderPreferences(),
      Notifications.getPermissionsAsync(),
    ])
      .then(([preferences, permission]) => {
        if (!active) return;
        setSettings({
          notificationEnabled: preferences.notificationEnabled,
          permissionGranted: permission.granted,
        });
      })
      .catch(() => {
        if (active) setError(t("settings.notifications.loadError"));
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  async function updateNotificationPreference(notificationEnabled: boolean) {
    if (!settings || saving) return;
    setSaving(true);
    setError(null);
    try {
      const permissionGranted = notificationEnabled
        ? await ensureReminderNotificationPermission()
        : settings.permissionGranted;
      if (notificationEnabled && !permissionGranted) {
        setSettings({ ...settings, permissionGranted: false });
        setError(t("settings.notifications.permissionDenied"));
        return;
      }
      await saveReminderPreferences({ notificationEnabled });
      setSettings({ notificationEnabled, permissionGranted });
      try {
        await reconcileAllCarePlanReminders();
      } catch {
        setError(t("settings.notifications.reconcileError"));
      }
    } catch {
      setError(t("settings.notifications.saveError"));
    } finally {
      setSaving(false);
    }
  }

  if (!settings && !error) return <LoadingScreen />;

  return (
    <Screen title="">
      <TopBar
        onBack={() => router.back()}
        title={t("settings.notifications.title")}
        titleIcon={Bell}
      />
      {settings ? (
        <>
          <View style={styles.toggleRow}>
            <Typography style={styles.fill} variant="bodyLarge">
              {t("settings.notifications.masterLabel")}
            </Typography>
            <Switch
              accessibilityLabel={t("settings.notifications.masterLabel")}
              disabled={saving}
              onValueChange={(value) =>
                void updateNotificationPreference(value)
              }
              value={settings.notificationEnabled}
            />
          </View>
          <Typography color="textSecondary" variant="bodyMedium">
            {settings.notificationEnabled
              ? settings.permissionGranted
                ? t("settings.notifications.enabled")
                : t("settings.notifications.permissionOff")
              : t("settings.notifications.disabled")}
          </Typography>
        </>
      ) : null}
      {settings?.notificationEnabled && !settings.permissionGranted ? (
        <PrimaryButton
          label={t("settings.notifications.enable")}
          onPress={() => void updateNotificationPreference(true)}
        />
      ) : null}
      {saving ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("common.actions.saving")}
        </Typography>
      ) : null}
      {error ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {error}
        </Typography>
      ) : null}
      {!settings && error ? (
        <PrimaryButton
          label={t("common.actions.retry")}
          onPress={() => {
            setError(null);
            setReloadKey((value) => value + 1);
          }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.base,
    justifyContent: "space-between",
    minHeight: 52,
  },
});
