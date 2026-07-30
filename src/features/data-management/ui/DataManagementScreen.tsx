import { ArchiveRestore, DatabaseBackup } from "lucide-react-native";
import { useState } from "react";
import { Alert, Platform } from "react-native";

import { formatDateTime, t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors } from "@/shared/ui/theme";
import {
  chooseBackupDestination,
  chooseBackupForRestore,
  createLocalBackup,
  restoreLocalBackup,
  summarize,
  type PreparedRestore,
} from "../application/local-backup";
import { DataManagementActionCard } from "./DataManagementActionCard";

type Props = Readonly<{
  onBack: () => void;
  onRestoreComplete: () => void;
}>;

type Operation = "backup" | "restore" | null;

export function DataManagementScreen({ onBack, onRestoreComplete }: Props) {
  const [operation, setOperation] = useState<Operation>(null);
  const [message, setMessage] = useState<string | null>(null);
  const supported = Platform.OS !== "web";

  async function backup() {
    setOperation("backup");
    setMessage(null);
    try {
      const destination = await chooseBackupDestination();
      if (!destination) return;
      const result = await createLocalBackup(destination);
      setMessage(
        t("dataManagement.backup.success", { folder: result.folderName }),
      );
    } catch {
      setMessage(t("dataManagement.backup.error"));
    } finally {
      setOperation(null);
    }
  }

  async function chooseRestore() {
    setOperation("restore");
    setMessage(null);
    try {
      const prepared = await chooseBackupForRestore();
      if (prepared) confirmRestore(prepared);
    } catch {
      setMessage(t("dataManagement.restore.invalid"));
    } finally {
      setOperation(null);
    }
  }

  function confirmRestore(prepared: PreparedRestore) {
    const summary = summarize(
      prepared.manifest,
      prepared.archiveDirectory.name,
    );
    Alert.alert(
      t("dataManagement.restore.confirmTitle"),
      t("dataManagement.restore.confirmBody", {
        date: formatDateTime(new Date(summary.createdAt)),
        entries: summary.careEntryCount,
        plants: summary.plantCount,
      }),
      [
        { style: "cancel", text: t("common.actions.cancel") },
        {
          style: "destructive",
          text: t("dataManagement.restore.action"),
          onPress: () => void restore(prepared),
        },
      ],
    );
  }

  async function restore(prepared: PreparedRestore) {
    setOperation("restore");
    setMessage(null);
    try {
      const result = await restoreLocalBackup(prepared);
      Alert.alert(
        t("dataManagement.restore.successTitle"),
        result.remindersReconciled
          ? t("dataManagement.restore.successBody")
          : t("dataManagement.restore.successReminderWarning"),
        [{ text: t("common.actions.done"), onPress: onRestoreComplete }],
      );
    } catch {
      setMessage(t("dataManagement.restore.error"));
    } finally {
      setOperation(null);
    }
  }

  return (
    <Screen title="">
      <TopBar
        onBack={onBack}
        title={t("dataManagement.title")}
        titleIcon={DatabaseBackup}
      />
      <Typography color="textSecondary" variant="bodyLarge">
        {t("dataManagement.introduction")}
      </Typography>
      <DataManagementActionCard
        description={t("dataManagement.backup.description")}
        icon={DatabaseBackup}
        title={t("dataManagement.backup.title")}
      >
        <PrimaryButton
          disabled={!supported || operation !== null}
          label={t("dataManagement.backup.action")}
          loading={operation === "backup"}
          onPress={() => void backup()}
        />
      </DataManagementActionCard>
      <DataManagementActionCard
        description={t("dataManagement.restore.description")}
        icon={ArchiveRestore}
        title={t("dataManagement.restore.title")}
      >
        <PrimaryButton
          backgroundColor={colors.dangerSoft}
          disabled={!supported || operation !== null}
          label={t("dataManagement.restore.action")}
          loading={operation === "restore"}
          onPress={() => void chooseRestore()}
          textColor={colors.danger}
        />
      </DataManagementActionCard>
      {!supported ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("dataManagement.unsupported")}
        </Typography>
      ) : null}
      {message ? (
        <Typography accessibilityRole="alert" variant="bodyMedium">
          {message}
        </Typography>
      ) : null}
    </Screen>
  );
}
