import {
  BellRing,
  BookOpen,
  Clock3,
  Droplets,
  type LucideIcon,
} from "lucide-react-native";
import { Image, StyleSheet, View } from "react-native";

import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type WelcomeScreenProps = { onStart: () => void };

const logoSource = require("../../../../assets/branding/logo.png");
const heroSource = require("../../../../assets/onboarding/welcome-grapes.webp");

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <Screen title="">
      <View style={styles.content}>
        <View style={styles.brand}>
          <Image
            accessibilityLabel={t("app.logo.accessibility")}
            accessibilityRole="image"
            resizeMode="contain"
            source={logoSource}
            style={styles.brandLogo}
          />
          <Typography
            color="primary"
            style={styles.brandName}
            variant="headlineSmall"
          >
            {t("app.brandName")}
          </Typography>
        </View>

        <View style={styles.heroCopy}>
          <Typography
            accessibilityRole="header"
            color="primary"
            style={styles.title}
            variant="headlineLarge"
          >
            {t("plants.welcome.title")}
          </Typography>
          <Typography color="textSecondary" variant="bodyLarge">
            {t("plants.welcome.body")}
          </Typography>
        </View>

        <View style={styles.heroFrame}>
          <Image
            accessibilityLabel={t("plants.welcome.imageAccessibility")}
            accessibilityRole="image"
            resizeMode="cover"
            source={heroSource}
            style={styles.heroImage}
          />
        </View>

        <View style={styles.benefits}>
          <Benefit
            description={t("plants.welcome.benefitCareDescription")}
            icon={Droplets}
            title={t("plants.welcome.benefitCare")}
          />
          <Benefit
            description={t("plants.welcome.benefitReminderDescription")}
            icon={BellRing}
            title={t("plants.welcome.benefitReminder")}
          />
          <Benefit
            description={t("plants.welcome.benefitStageDescription")}
            icon={BookOpen}
            title={t("plants.welcome.benefitStage")}
          />
        </View>

        <View style={styles.actionArea}>
          <PrimaryButton label={t("plants.welcome.start")} onPress={onStart} />
          <View style={styles.duration}>
            <Clock3 color={colors.primaryContainer} size={16} />
            <Typography color="primaryContainer" variant="bodyMedium">
              {t("plants.welcome.duration")}
            </Typography>
          </View>
        </View>
      </View>
    </Screen>
  );
}

function Benefit({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <View style={styles.benefit}>
      <View accessibilityElementsHidden style={styles.benefitIcon}>
        <Icon color={colors.primary} size={24} strokeWidth={2} />
      </View>
      <View style={styles.benefitCopy}>
        <Typography style={styles.benefitTitle} variant="bodyLarge">
          {title}
        </Typography>
        <Typography color="textSecondary" variant="bodyMedium">
          {description}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionArea: { gap: spacing.xs },
  brand: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  brandLogo: { height: 40, width: 40 },
  brandName: { lineHeight: 22 },
  benefit: {
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.card,
    flexDirection: "row",
    gap: spacing.sm,
    padding: 12,
  },
  benefitCopy: { flex: 1, gap: 2 },
  benefitIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.round,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  benefitTitle: { fontWeight: "600" },
  benefits: { gap: spacing.sm },
  content: { gap: spacing.base },
  duration: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
  },
  heroCopy: { gap: spacing.sm },
  heroFrame: {
    aspectRatio: 1.9,
    borderRadius: radius.card,
    marginHorizontal: spacing.sm,
    overflow: "hidden",
  },
  heroImage: { height: "100%", width: "100%" },
  title: { fontSize: 28, fontWeight: "700", lineHeight: 34, maxWidth: 360 },
});
