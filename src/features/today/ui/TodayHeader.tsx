import { StyleSheet, View } from "react-native";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

type Props = { date?: Date };

export function TodayHeader({ date = new Date() }: Props) {
  const greeting = date.getHours() < 12 ? "Chào buổi sáng" : date.getHours() < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  const dateLabel = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "numeric", month: "long" }).format(date);
  return <View style={styles.header}><Typography variant="headlineLarge">{greeting}</Typography><Typography color="textSecondary" variant="bodyLarge">{dateLabel}</Typography></View>;
}

const styles = StyleSheet.create({ header: { gap: spacing.xs } });
