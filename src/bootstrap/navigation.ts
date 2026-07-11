export const tabDestinations = [
  { name: "today", label: "Hôm nay", icon: "today-outline" },
  { name: "plants", label: "Cây trồng", icon: "leaf-outline" },
  { name: "journal", label: "Nhật ký", icon: "book-outline" },
  { name: "me", label: "Tôi", icon: "person-outline" },
] as const;

export type TabDestination = (typeof tabDestinations)[number];
