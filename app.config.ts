import type { ExpoConfig } from "expo/config";
import { configT } from "./src/shared/i18n/config-copy";

const config: ExpoConfig = {
  name: configT("app.name"),
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
  plugins: [
    "expo-router",
    "expo-notifications",
    "expo-secure-store",
    "expo-sqlite",
    "@react-native-community/datetimepicker",
    [
      "expo-image-picker",
      {
        cameraPermission: configT("app.permissions.camera"),
        microphonePermission: false,
        photosPermission: configT("app.permissions.photos"),
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
