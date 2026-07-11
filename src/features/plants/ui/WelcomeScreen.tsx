import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/shared/ui/Screen";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { colors, radius, spacing } from "@/shared/ui/theme";

type WelcomeScreenProps = { onStart: () => void };

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <Screen title="Chăm cây dễ hơn mỗi ngày">
      <View style={styles.hero}>
        <Ionicons accessibilityElementsHidden color={colors.primary} name="leaf" size={72} />
        <Text style={styles.description}>
          Ghi lại lần tưới, bón phân và phun thuốc để luôn nhớ cây đã được chăm khi nào.
        </Text>
      </View>
      <View style={styles.benefits}>
        <Benefit icon="time-outline" text="Xem lần chăm sóc gần nhất" />
        <Benefit icon="notifications-outline" text="Theo dõi lời nhắc quan trọng" />
        <Benefit icon="book-outline" text="Hiểu bối cảnh giai đoạn sinh trưởng" />
      </View>
      <PrimaryButton label="Bắt đầu với cây đầu tiên" onPress={onStart} />
    </Screen>
  );
}

type IconName = React.ComponentProps<typeof Ionicons>["name"];
function Benefit({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.benefit}>
      <Ionicons color={colors.primary} name={icon} size={24} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.lg },
  description: { color: colors.textSecondary, fontSize: 16, lineHeight: 24, textAlign: "center" },
  benefits: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, gap: spacing.md, padding: spacing.md },
  benefit: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 44 },
  benefitText: { color: colors.text, flex: 1, fontSize: 16, lineHeight: 24 },
});
