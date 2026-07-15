import { BookOpen, Clock, Leaf, type LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

type WelcomeScreenProps = { onStart: () => void };

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <Screen title={t("plants.welcome.title")} titleIcon={Leaf}>
      <View style={styles.hero}>
        <View accessibilityElementsHidden style={styles.heroMark}>
          <Leaf color={colors.primary} size={52} />
        </View>
        <Typography
          color="textSecondary"
          style={styles.description}
          variant="bodyLarge"
        >
          {t("plants.welcome.body")}
        </Typography>
      </View>
      <SurfaceCard style={styles.benefits}>
        <Benefit icon={Clock} text={t("plants.welcome.benefitHistory")} />
        <Benefit icon={BookOpen} text={t("plants.welcome.benefitStage")} />
      </SurfaceCard>
      <PrimaryButton label={t("plants.welcome.start")} onPress={onStart} />
    </Screen>
  );
}

function Benefit({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitIcon}>
        <Icon color={colors.primary} size={20} />
      </View>
      <Typography style={styles.benefitText} variant="bodyLarge">
        {text}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  benefit: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 44,
  },
  benefitIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  benefitText: { flex: 1 },
  benefits: { gap: spacing.md },
  description: { textAlign: "center" },
  hero: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.lg },
  heroMark: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 48,
    height: 96,
    justifyContent: "center",
    width: 96,
  },
});
