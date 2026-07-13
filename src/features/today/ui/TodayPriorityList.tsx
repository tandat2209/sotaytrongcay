import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { CARE_ACTIVITY_LABELS, CARE_ACTIVITY_VISUALS } from "@/features/journal";
import { PlantIdentity } from "@/features/plants";
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
  const visual = CARE_ACTIVITY_VISUALS[priority.activityType];

  return <SurfaceCard style={styles.card}>
    <View style={styles.plantHeader}>
      <PlantIdentity name={priority.plantName} size="list" speciesTitle={priority.speciesTitle} stageId={priority.stageId} stageTitle={priority.stageTitle} />
    </View>

    {/* Action row with expandable chevron */}
    <Pressable accessibilityLabel={detailLabel} accessibilityRole="button" accessibilityState={{ expanded: isExpanded }} onPress={onToggle} style={styles.actionRow}>
      <Ionicons accessibilityElementsHidden color={visual.color} name={visual.icon} size={18} />
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
    <Pressable accessibilityLabel={`${CARE_ACTIVITY_LABELS[priority.activityType]} cho ${priority.plantName}`} accessibilityRole="button" onPress={() => onRecordCare(priority.plantId, priority.activityType)} style={[styles.careAction, { backgroundColor: visual.backgroundColor }]}>
      <Ionicons accessibilityElementsHidden color={visual.color} name={visual.icon} size={20} />
      <Typography style={[styles.careActionLabel, { color: visual.color }]} variant="bodyMedium">{CARE_ACTIVITY_LABELS[priority.activityType]}</Typography>
    </Pressable>
  </SurfaceCard>;
}

function PlantIconPlaceholder() {
  return <View accessibilityElementsHidden style={styles.plantIcon}><Ionicons color={colors.primary} name="leaf" size={22} /></View>;
}

const styles = StyleSheet.create({
  actionRow: { alignItems: "center", borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: "row", gap: spacing.sm, minHeight: control.iconTarget, paddingTop: spacing.sm },
  bold: { fontWeight: "600" },
  card: { gap: spacing.sm },
  careAction: { alignItems: "center", borderRadius: radius.control, flexDirection: "row", gap: spacing.sm, justifyContent: "center", minHeight: control.primaryHeight, paddingHorizontal: spacing.md },
  careActionLabel: { fontWeight: "600" },
  emptyCard: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 72 },
  expandedContent: { backgroundColor: colors.surfaceSubtle, borderRadius: radius.chip, gap: spacing.sm, padding: spacing.sm },
  explanationRow: { flexDirection: "row", gap: spacing.sm },
  fill: { flex: 1 },
  plantHeader: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  plantIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: radius.control, height: 48, justifyContent: "center", width: 48 },
});
