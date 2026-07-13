export const colors = {
  background: "#FCF9F8",
  surface: "#FFFFFF",
  surfaceSubtle: "#F6F3F2",
  primary: "#154212",
  primaryContainer: "#2D5A27",
  primarySoft: "#E7F0E4",
  secondary: "#65558F",
  secondarySoft: "#E9DDFF",
  activityWater: "#1D4ED8",
  activityWaterSoft: "#DBEAFE",
  activityFertilizing: "#8A4B00",
  activityFertilizingSoft: "#FFF3E0",
  text: "#1C1B1B",
  textSecondary: "#42493E",
  border: "#C2C9BB",
  error: "#BA1A1A",
  scrim: "rgba(28, 27, 27, 0.42)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  chip: 8,
  control: 12,
  card: 16,
  sheet: 24,
  round: 999,
} as const;

export const control = {
  iconTarget: 44,
  primaryHeight: 48,
  tabBarHeight: 64,
} as const;

export const typography = {
  headlineLarge: { fontSize: 28, fontWeight: "600" as const, lineHeight: 34 },
  headlineMedium: { fontSize: 22, fontWeight: "600" as const, lineHeight: 28 },
  headlineSmall: { fontSize: 18, fontWeight: "600" as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: "600" as const, letterSpacing: 0.2, lineHeight: 16 },
} as const;
