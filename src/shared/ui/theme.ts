export const colors = {
  background: "#F6F4EE",
  surface: "#FFFFFF",
  surfaceMuted: "#ECEAE3",
  primary: "#536B3E",
  primaryStrong: "#40552F",
  primarySoft: "#DDE8CC",
  textPrimary: "#24251F",
  textSecondary: "#6E7066",
  textMuted: "#929489",
  divider: "#DEDDD5",
  activityWater: "#176B9C",
  activityWaterAccent: "#2D9CDB",
  activityWaterSoft: "#DCEFF9",
  activityFertilizing: "#8A531A",
  activityFertilizingAccent: "#D99036",
  activityFertilizingSoft: "#F8E8D1",
  activitySpraying: "#247A6B",
  activitySprayingAccent: "#289A83",
  activitySprayingSoft: "#D9EFEA",
  activityObservation: "#6D559D",
  activityObservationAccent: "#8067B7",
  activityObservationSoft: "#E8E1F4",
  danger: "#A8453D",
  dangerAccent: "#C9584D",
  dangerSoft: "#F5DFDC",
  scrim: "rgba(36, 37, 31, 0.42)",

  // Compatibility aliases while existing screens migrate to semantic names.
  border: "#DEDDD5",
  error: "#A8453D",
  primaryContainer: "#40552F",
  secondary: "#6D559D",
  secondarySoft: "#E8E1F4",
  surfaceSubtle: "#ECEAE3",
  text: "#24251F",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  screen: 20,
  lg: 24,
  xl: 32,
  section: 40,
  sectionLarge: 48,
} as const;

export const radius = {
  small: 12,
  medium: 16,
  card: 20,
  large: 28,
  pill: 999,

  // Compatibility aliases while existing surfaces migrate.
  chip: 12,
  control: 12,
  round: 999,
  sheet: 28,
} as const;

export const control = {
  iconTarget: 44,
  primaryHeight: 52,
  tabBarHeight: 64,
} as const;

export const elevation = {
  floating: {
    elevation: 4,
    shadowColor: "#24251F",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  sheet: {
    elevation: 12,
    shadowColor: "#24251F",
    shadowOffset: { height: -3, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
} as const;

export const fontFamily = {
  regular: "NunitoSans_400Regular",
  medium: "NunitoSans_500Medium",
  semiBold: "NunitoSans_600SemiBold",
  bold: "NunitoSans_700Bold",
  extraBold: "NunitoSans_800ExtraBold",
} as const;

const display = {
  fontFamily: fontFamily.extraBold,
  fontSize: 32,
  fontWeight: "800" as const,
  lineHeight: 38,
};
const screenTitle = {
  fontFamily: fontFamily.extraBold,
  fontSize: 28,
  fontWeight: "800" as const,
  lineHeight: 34,
};
const sectionTitle = {
  fontFamily: fontFamily.bold,
  fontSize: 22,
  fontWeight: "700" as const,
  lineHeight: 28,
};
const cardTitle = {
  fontFamily: fontFamily.bold,
  fontSize: 18,
  fontWeight: "700" as const,
  lineHeight: 24,
};
const body = {
  fontFamily: fontFamily.medium,
  fontSize: 16,
  fontWeight: "500" as const,
  lineHeight: 24,
};
const bodyStrong = {
  fontFamily: fontFamily.semiBold,
  fontSize: 16,
  fontWeight: "600" as const,
  lineHeight: 24,
};
const secondary = {
  fontFamily: fontFamily.regular,
  fontSize: 14,
  fontWeight: "400" as const,
  lineHeight: 20,
};
const label = {
  fontFamily: fontFamily.bold,
  fontSize: 13,
  fontWeight: "700" as const,
  letterSpacing: 0.1,
  lineHeight: 17,
};

export const typography = {
  display,
  screenTitle,
  sectionTitle,
  cardTitle,
  body,
  bodyStrong,
  secondary,
  label,

  // Compatibility aliases while feature screens adopt the new hierarchy.
  headlineLarge: screenTitle,
  headlineMedium: sectionTitle,
  headlineSmall: cardTitle,
  bodyLarge: body,
  bodyMedium: secondary,
} as const;
