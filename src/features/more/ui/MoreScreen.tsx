import { router } from "expo-router";
import {
  Bell,
  Ellipsis,
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

const managementDestinations: readonly MoreDestination[] = [
  {
    description: t("more.row.fertilizersDescription"),
    icon: PackageOpen,
    label: t("more.row.fertilizers"),
    path: "/more/fertilizers",
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
    description: t("more.row.carePlansDescription"),
    icon: ListTree,
    label: t("settings.row.carePlans"),
    path: "/settings/care-plans",
  },
  {
    description: t("more.row.plantsDescription"),
    icon: Sprout,
    label: t("settings.row.plants"),
    path: "/settings/plants",
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
        destinations={managementDestinations}
        onOpen={(path) => router.push(path)}
        title={t("more.section.management")}
      />
      <MoreNavigationGroup
        destinations={settingsDestinations}
        onOpen={(path) => router.push(path)}
        title={t("more.section.settings")}
      />
    </Screen>
  );
}
