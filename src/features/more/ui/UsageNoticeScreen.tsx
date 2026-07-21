import { ShieldCheck } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{ onBack: () => void }>;

const sections = [
  {
    paragraphs: [
      t("usageNotice.schedule.paragraph1"),
      t("usageNotice.schedule.paragraph2"),
    ],
    title: t("usageNotice.schedule.title"),
  },
  {
    paragraphs: [
      t("usageNotice.products.paragraph1"),
      t("usageNotice.products.paragraph2"),
      t("usageNotice.products.paragraph3"),
    ],
    title: t("usageNotice.products.title"),
  },
  {
    paragraphs: [
      t("usageNotice.symptoms.paragraph1"),
      t("usageNotice.symptoms.paragraph2"),
    ],
    title: t("usageNotice.symptoms.title"),
  },
  {
    paragraphs: [
      t("usageNotice.responsibility.paragraph1"),
      t("usageNotice.responsibility.paragraph2"),
      t("usageNotice.responsibility.paragraph3"),
    ],
    title: t("usageNotice.responsibility.title"),
  },
] as const;

export function UsageNoticeScreen({ onBack }: Props) {
  return (
    <Screen title="">
      <TopBar
        onBack={onBack}
        title={t("usageNotice.title")}
        titleIcon={ShieldCheck}
      />
      <View style={styles.article}>
        <View style={styles.introduction}>
          <View accessibilityElementsHidden style={styles.icon}>
            <ShieldCheck color={colors.primary} size={24} />
          </View>
          <Typography variant="bodyStrong">
            {t("usageNotice.introduction.paragraph1")}
          </Typography>
          <Typography color="textSecondary" variant="secondary">
            {t("usageNotice.introduction.paragraph2")}
          </Typography>
        </View>
        <View style={styles.sections}>
          {sections.map((section, index) => (
            <View
              key={section.title}
              style={[
                styles.section,
                index < sections.length - 1 ? styles.sectionDivider : null,
              ]}
            >
              <Typography variant="cardTitle">{section.title}</Typography>
              {section.paragraphs.map((paragraph) => (
                <Typography
                  color="textSecondary"
                  key={paragraph}
                  variant="secondary"
                >
                  {paragraph}
                </Typography>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  article: { gap: spacing.lg },
  icon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.medium,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  introduction: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.card,
    gap: spacing.md,
    padding: spacing.base,
  },
  section: { gap: spacing.sm, paddingVertical: spacing.base },
  sectionDivider: {
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sections: { paddingBottom: spacing.base },
});
