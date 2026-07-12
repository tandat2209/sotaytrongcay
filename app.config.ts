import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Sổ tay trồng cây",
  slug: "so-tay-trong-cay",
  version: "0.1.0",
  orientation: "portrait",
  scheme: "sotaytrongcay",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "vn.sotaytrongcay.app",
  },
  android: {
    package: "vn.sotaytrongcay.app",
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
  },
  plugins: ["expo-router", "expo-secure-store", "expo-sqlite", "@react-native-community/datetimepicker"],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
