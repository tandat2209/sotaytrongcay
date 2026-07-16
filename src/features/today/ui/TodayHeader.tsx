import { Image, StyleSheet, View } from "react-native";

import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

const logoSource = require("../../../../assets/branding/logo.png");

export function TodayHeader() {
  return (
    <View style={styles.brand}>
      <Image
        accessibilityLabel={t("app.logo.accessibility")}
        accessibilityRole="image"
        resizeMode="contain"
        source={logoSource}
        style={styles.logo}
      />
      <Typography color="primary" variant="headlineSmall">
        {t("app.name")}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  logo: { height: 32, width: 32 },
});
