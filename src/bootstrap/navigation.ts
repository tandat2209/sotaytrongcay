import { CalendarDays, NotebookPen, Sprout, UserRound } from "lucide-react-native";

export const tabDestinations = [
  { name: "today", label: "Hôm nay", icon: CalendarDays },
  { name: "plants", label: "Cây trồng", icon: Sprout },
  { name: "journal", label: "Nhật ký", icon: NotebookPen },
  { name: "me", label: "Tôi", icon: UserRound },
] as const;

export type TabDestination = (typeof tabDestinations)[number];
