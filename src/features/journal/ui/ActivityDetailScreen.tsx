import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { CARE_ACTIVITY_ICONS } from "../models/care-activity-icon";
import {
  CARE_ACTIVITY_LABELS,
  CARE_ACTIVITY_ORIGIN_LABELS,
  CARE_ACTIVITY_UNIT_LABELS,
  CareActivity,
} from "../models/care-activity";

type Props = {
  activity: CareActivity;
  onBack?: () => void;
  plantName: string;
};

export function ActivityDetailScreen({ activity, onBack, plantName }: Props) {
  const title = `Chi tiết ${CARE_ACTIVITY_LABELS[activity.type].toLowerCase()}`;
  return (
    <Screen title="">
      {onBack ? <TopBar backAccessibilityLabel="Quay lại Nhật ký" onBack={onBack} title={title} /> : <Typography variant="headlineLarge">{title}</Typography>}
      <Typography color="textSecondary" variant="bodyLarge">{plantName}</Typography>
      <SurfaceCard style={styles.summary}>
        <View style={styles.icon}><Ionicons color={colors.primary} name={CARE_ACTIVITY_ICONS[activity.type]} size={22} /></View>
        <View style={styles.copy}>
          <Typography variant="headlineSmall">{CARE_ACTIVITY_LABELS[activity.type]}</Typography>
          <Typography color="textSecondary" variant="bodyMedium">{new Date(activity.occurredAt).toLocaleString("vi-VN")}</Typography>
        </View>
      </SurfaceCard>
      <SurfaceCard style={styles.card}>
        <Detail label="Nguồn" value={CARE_ACTIVITY_ORIGIN_LABELS[activity.origin]} />
        {activity.type === "watering" ? <Detail label="Lượng nước" value={activity.amount ? `${activity.amount.value.toLocaleString("vi-VN")} ${CARE_ACTIVITY_UNIT_LABELS[activity.amount.unit]}` : "Không ghi"} /> : null}
        {activity.notes ? <Detail label="Ghi chú" value={activity.notes} /> : null}
      </SurfaceCard>
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.row}><Typography color="textSecondary" variant="label">{label}</Typography><Typography variant="bodyLarge">{value}</Typography></View>;
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  icon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 22, height: 44, justifyContent: "center", width: 44 },
  row: { gap: spacing.xs },
  summary: { alignItems: "center", flexDirection: "row", gap: spacing.md },
});
