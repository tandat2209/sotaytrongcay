import { router } from "expo-router";
import {
  Bell,
  AlertTriangle,
  DatabaseBackup,
  Ellipsis,
  Info,
  ListTree,
  PackageOpen,
  Sprout,
} from "lucide-react-native";
import { t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import {
  MoreNavigationGroup,
  type MoreDestination,
} from "./MoreNavigationGroup";

const knowledgeDestinations: readonly MoreDestination[] = [
  {
    description: t("more.row.warningSignsDescription"),
    icon: AlertTriangle,
    label: t("more.row.warningSigns"),
    path: "/more/warning-signs",
  },
  {
    description: t("more.row.carePlansDescription"),
    icon: ListTree,
    label: t("settings.row.carePlans"),
    path: "/settings/care-plans",
  },
];

const dataDestinations: readonly MoreDestination[] = [
  {
    description: t("more.row.plantsDescription"),
    icon: Sprout,
    label: t("more.row.plants"),
    path: "/settings/plants",
  },
  {
    description: t("more.row.fertilizersDescription"),
    icon: PackageOpen,
    label: t("more.row.fertilizers"),
    path: "/more/fertilizers",
  },
  {
    description: t("more.row.dataManagementDescription"),
    icon: DatabaseBackup,
    label: t("more.row.dataManagement"),
    path: "/data-management",
  },
];

const settingsDestinations: readonly MoreDestination[] = [
  {
    description: t("more.row.notificationsDescription"),
    icon: Bell,
    label: t("settings.row.notifications"),
    path: "/settings/notifications",
  },
  {
    description: t("more.row.usageNoticeDescription"),
    icon: Info,
    label: t("usageNotice.title"),
    path: "/settings/usage-notice",
  },
];

export function MoreScreen() {
  return (
    <Screen
      introduction={t("more.introduction")}
      title={t("navigation.tabs.more")}
      titleIcon={Ellipsis}
    >
      <MoreNavigationGroup
        destinations={knowledgeDestinations}
        onOpen={(path) => router.push(path)}
        title={t("more.section.knowledge")}
      />
      <MoreNavigationGroup
        destinations={dataDestinations}
        onOpen={(path) => router.push(path)}
        title={t("more.section.data")}
      />
      <MoreNavigationGroup
        destinations={settingsDestinations}
        onOpen={(path) => router.push(path)}
        title={t("more.section.settings")}
      />
    </Screen>
  );
}
