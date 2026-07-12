import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { CARE_ACTIVITY_ICONS, CARE_ACTIVITY_LABELS } from "@/features/journal";
import { stageIcon } from "@/features/knowledge/stage-icons";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import type { TodayPriority } from "../models/today-projection";

type Props = {
  onRecordCare: (plantId: string, type: TodayPriority["activityType"]) => void;
  priorities: readonly TodayPriority[];
};

export function TodayPriorityList({ onRecordCare, priorities }: Props) {
  const [expandedIds, setExpandedIds] = useState<readonly string[]>([]);
  const toggle = (id: string) => setExpandedIds((ids) => ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]);

  if (priorities.length === 0) {
    return <SurfaceCard style={styles.emptyCard}><PlantIconPlaceholder /><Typography color="textSecondary" style={styles.fill} variant="bodyMedium">Hôm nay chưa có việc đến hạn.</Typography></SurfaceCard>;
  }

  return <>{priorities.map((priority) => {
    const isExpanded = expandedIds.includes(priority.id);
    return <TodayPriorityCard isExpanded={isExpanded} key={priority.id} onRecordCare={onRecordCare} onToggle={() => toggle(priority.id)} priority={priority} />;
  })}</>;
}

function TodayPriorityCard({ isExpanded, onRecordCare, onToggle, priority }: { isExpanded: boolean; onRecordCare: Props["onRecordCare"]; onToggle: () => void; priority: TodayPriority }) {
  const detailLabel = `${isExpanded ? "Thu gọn" : "Xem"} lý do và hướng dẫn cho ${priority.title} của ${priority.plantName}`;

  return <SurfaceCard style={styles.card}>
    {/* Plant header: icon, name, badge, stage */}
    <View style={styles.plantHeader}>
      <PlantIconPlaceholder />
      <View style={styles.fill}>
        <View style={styles.nameRow}>
          <Typography style={styles.fill} variant="bodyLarge">{priority.plantName}</Typography>
          <View style={styles.badge}><Typography style={styles.badgeLabel} variant="label">HÔM NAY</Typography></View>
        </View>
        <View style={styles.stageRow}>
          <Ionicons accessibilityElementsHidden color={colors.textSecondary} name={stageIcon(priority.stageId)} size={14} />
          <Typography color="textSecondary" variant="bodyMedium">Giai đoạn: {priority.stageTitle}</Typography>
        </View>
      </View>
    </View>

    {/* Action row with expandable chevron */}
    <Pressable accessibilityLabel={detailLabel} accessibilityRole="button" accessibilityState={{ expanded: isExpanded }} onPress={onToggle} style={styles.actionRow}>
      <Ionicons accessibilityElementsHidden color={colors.primary} name={CARE_ACTIVITY_ICONS[priority.activityType]} size={18} />
      <Typography style={styles.fill} variant="bodyMedium">{priority.title}</Typography>
      <Ionicons color={colors.textSecondary} name={isExpanded ? "chevron-up" : "chevron-down"} size={20} />
    </Pressable>

    {/* Expanded: explanation */}
    {isExpanded ? <View style={styles.expandedContent}>
      <View style={styles.explanationRow}>
        <Ionicons accessibilityElementsHidden color={colors.textSecondary} name="help-circle-outline" size={16} />
        <View style={styles.fill}>
          <Typography variant="bodyMedium"><Typography style={styles.bold} variant="bodyMedium">Tại sao: </Typography>{priority.explanation}</Typography>
        </View>
      </View>
    </View> : null}

    {/* Care action button */}
    <Pressable accessibilityLabel={`${CARE_ACTIVITY_LABELS[priority.activityType]} cho ${priority.plantName}`} accessibilityRole="button" onPress={() => onRecordCare(priority.plantId, priority.activityType)} style={styles.careAction}>
      <Typography style={styles.careActionLabel} variant="bodyMedium">{CARE_ACTIVITY_LABELS[priority.activityType]}</Typography>
    </Pressable>
  </SurfaceCard>;
}

function PlantIconPlaceholder() {
  return <View accessibilityElementsHidden style={styles.plantIcon}><Ionicons color={colors.primary} name="leaf" size={22} /></View>;
}

const styles = StyleSheet.create({
  actionRow: { alignItems: "center", borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: "row", gap: spacing.sm, minHeight: control.iconTarget, paddingTop: spacing.sm },
  badge: { backgroundColor: colors.primarySoft, borderRadius: radius.chip, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  badgeLabel: { color: colors.primary },
  bold: { fontWeight: "600" },
  card: { gap: spacing.sm },
  careAction: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.control, justifyContent: "center", minHeight: control.primaryHeight, paddingHorizontal: spacing.md },
  careActionLabel: { color: colors.surface, fontWeight: "600" },
  emptyCard: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 72 },
  expandedContent: { backgroundColor: colors.surfaceSubtle, borderRadius: radius.chip, gap: spacing.sm, padding: spacing.sm },
  explanationRow: { flexDirection: "row", gap: spacing.sm },
  fill: { flex: 1 },
  nameRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  plantHeader: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  plantIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: radius.control, height: 48, justifyContent: "center", width: 48 },
  stageRow: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
});
