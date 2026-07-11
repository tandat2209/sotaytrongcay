import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

type WelcomeScreenProps = { onStart: () => void };

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <Screen title="Chăm cây dễ hơn mỗi ngày">
      <View style={styles.hero}>
        <View accessibilityElementsHidden style={styles.heroMark}><Ionicons color={colors.primary} name="leaf" size={52} /></View>
        <Typography color="textSecondary" style={styles.description} variant="bodyLarge">
          Ghi lại lần tưới, bón phân và phun thuốc để luôn nhớ cây đã được chăm khi nào.
        </Typography>
      </View>
      <SurfaceCard style={styles.benefits}>
        <Benefit icon="time-outline" text="Xem lần chăm sóc gần nhất" />
        <Benefit icon="book-outline" text="Hiểu bối cảnh giai đoạn sinh trưởng" />
      </SurfaceCard>
      <PrimaryButton label="Bắt đầu với cây đầu tiên" onPress={onStart} />
    </Screen>
  );
}

type IconName = React.ComponentProps<typeof Ionicons>["name"];
function Benefit({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitIcon}><Ionicons color={colors.primary} name={icon} size={20} /></View>
      <Typography style={styles.benefitText} variant="bodyLarge">{text}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  benefit: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 44 },
  benefitIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 20, height: 40, justifyContent: "center", width: 40 },
  benefitText: { flex: 1 },
  benefits: { gap: spacing.md },
  description: { textAlign: "center" },
  hero: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.lg },
  heroMark: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 48, height: 96, justifyContent: "center", width: 96 },
});
