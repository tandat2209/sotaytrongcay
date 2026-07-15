import { t } from "@/shared/i18n";
import {
  CalendarDays,
  NotebookPen,
  Sprout,
  Settings,
} from "lucide-react-native";

export const tabDestinations = [
  { name: "today", label: t("navigation.tabs.today"), icon: CalendarDays },
  { name: "plants", label: t("navigation.tabs.plants"), icon: Sprout },
  { name: "journal", label: t("navigation.tabs.journal"), icon: NotebookPen },
  { name: "settings", label: t("navigation.tabs.settings"), icon: Settings },
] as const;

export type TabDestination = (typeof tabDestinations)[number];
