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
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-sqlite",
    "@react-native-community/datetimepicker",
    ["expo-image-picker", {
      cameraPermission: "Cho phép Sổ tay trồng cây dùng camera để chụp ảnh cây.",
      microphonePermission: false,
      photosPermission: "Cho phép Sổ tay trồng cây truy cập ảnh để lưu vào nhật ký.",
    }],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
