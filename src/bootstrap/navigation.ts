import {
  CalendarDays,
  NotebookPen,
  Sprout,
  Settings,
} from "lucide-react-native";

export const tabDestinations = [
  { name: "today", label: "Hôm nay", icon: CalendarDays },
  { name: "plants", label: "Cây trồng", icon: Sprout },
  { name: "journal", label: "Nhật ký", icon: NotebookPen },
  { name: "settings", label: "Cài đặt", icon: Settings },
] as const;

export type TabDestination = (typeof tabDestinations)[number];
