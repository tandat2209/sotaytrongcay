import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

import { t } from "@/shared/i18n";
import { Screen } from "./Screen";
import { Typography } from "./Typography";
import { colors, radius, spacing } from "./theme";

const logoSource = require("../../../assets/branding/logo.png");

export function LoadingScreen() {
  return (
    <Screen contentGap={0} scrollable={false} title="">
      <View
        accessibilityLabel={t("common.state.loadingDeviceData")}
        accessibilityLiveRegion="polite"
        accessibilityRole="progressbar"
        accessibilityState={{ busy: true }}
        accessible
        style={styles.container}
      >
        <View accessibilityElementsHidden style={styles.logoFrame}>
          <Image resizeMode="contain" source={logoSource} style={styles.logo} />
        </View>
        <Typography
          color="primary"
          style={styles.centeredText}
          variant="headlineSmall"
        >
          {t("app.name")}
        </Typography>
        <View style={styles.progressRow}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Typography color="textSecondary" variant="bodyMedium">
            {t("common.state.loadingDeviceData")}
          </Typography>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centeredText: { textAlign: "center" },
  container: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    paddingBottom: spacing.xl,
  },
  logo: { height: 56, width: 56 },
  logoFrame: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.round,
    height: 88,
    justifyContent: "center",
    width: 88,
  },
  progressRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center",
  },
});
