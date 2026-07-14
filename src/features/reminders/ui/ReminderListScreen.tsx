import { Bell, ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { CARE_ACTIVITY_LABELS } from "@/features/journal";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { CarePlanReminderItem } from "../models/reminder-projection";

type Props = Readonly<{
  items: readonly CarePlanReminderItem[];
  onBack: () => void;
  onOpen: (id: string) => void;
}>;

export function ReminderListScreen({ items, onBack, onOpen }: Props) {
  return (
    <Screen title="">
      <TopBar onBack={onBack} title="Lời nhắc" titleIcon={Bell} />
      <Typography variant="headlineSmall">
        Lời nhắc theo kế hoạch chăm sóc
      </Typography>
      {items.length === 0 ? (
        <SurfaceCard>
          <Typography color="textSecondary" variant="bodyMedium">
            Chưa có kế hoạch chăm sóc phù hợp.
          </Typography>
        </SurfaceCard>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <Pressable
              accessibilityLabel={`Mở lời nhắc ${CARE_ACTIVITY_LABELS[item.activityType]} cho ${item.plantName}`}
              accessibilityRole="button"
              key={item.id}
              onPress={() => onOpen(item.id)}
            >
              <SurfaceCard style={styles.row}>
                <View style={styles.fill}>
                  <Typography variant="bodyLarge">
                    {CARE_ACTIVITY_LABELS[item.activityType]} — {item.plantName}
                  </Typography>
                  <Typography color="textSecondary" variant="bodyMedium">
                    Mỗi {item.effectiveIntervalDays} ngày
                  </Typography>
                  <Typography color="textSecondary" variant="bodyMedium">
                    {item.customIntervalDays === null
                      ? "Theo kế hoạch chăm sóc"
                      : `Tùy chỉnh · Đề xuất: mỗi ${item.recommendedIntervalDays} ngày`}
                  </Typography>
                </View>
                <ChevronRight color={colors.textSecondary} size={20} />
              </SurfaceCard>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, gap: spacing.xs },
  list: { gap: spacing.sm },
  row: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
