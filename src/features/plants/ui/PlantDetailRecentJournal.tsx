import { ChevronRight, FileText } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  CARE_ACTIVITY_VISUALS,
  getCareActivityLabel,
  getWateringIntensityLabel,
  type JournalItem,
  type PlantUpdate,
} from "@/features/journal";
import { formatDateTime, formatNumber, t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  items: readonly JournalItem[];
  onOpenActivity: (id: string) => void;
  onOpenUpdate: (id: string) => void;
}>;

export function PlantDetailRecentJournal({
  items,
  onOpenActivity,
  onOpenUpdate,
}: Props) {
  return (
    <View style={styles.section}>
      <Typography variant="headlineSmall">
        {t("plants.recentJournal.title")}
      </Typography>
      {items.length ? (
        <SurfaceCard style={styles.list}>
          {items.map((item) =>
            item.kind === "care" ? (
              <CareRow
                activity={item.record}
                key={`care:${item.id}`}
                onPress={() => onOpenActivity(item.id)}
              />
            ) : (
              <UpdateRow
                key={`update:${item.id}`}
                onPress={() => onOpenUpdate(item.id)}
                update={item.record}
              />
            ),
          )}
        </SurfaceCard>
      ) : (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("plants.recentJournal.empty")}
        </Typography>
      )}
    </View>
  );
}

function CareRow({
  activity,
  onPress,
}: Readonly<{
  activity: Extract<JournalItem, { kind: "care" }>["record"];
  onPress: () => void;
}>) {
  const label = getCareActivityLabel(activity.type);
  const visual = CARE_ACTIVITY_VISUALS[activity.type];
  const ActivityIcon = visual.icon;
  const occurredAt = formatDateTime(new Date(activity.occurredAt));
  return (
    <Pressable
      accessibilityLabel={t("plants.recentJournal.open", {
        label: label.toLowerCase(),
        time: occurredAt,
      })}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { backgroundColor: visual.backgroundColor }]}>
        <ActivityIcon color={visual.color} size={20} />
      </View>
      <View style={styles.copy}>
        <Typography variant="bodyLarge">{label}</Typography>
        {activity.type === "watering" && activity.intensity ? (
          <Typography color="textSecondary" variant="bodyMedium">
            {getWateringIntensityLabel(activity.intensity)}
          </Typography>
        ) : null}
        {activity.type === "spraying" && activity.sprayTargetNameSnapshot ? (
          <Typography color="textSecondary" variant="bodyMedium">
            {activity.sprayTargetNameSnapshot}
          </Typography>
        ) : null}
        <Typography color="textSecondary" variant="bodyMedium">
          {occurredAt}
        </Typography>
      </View>
      <ChevronRight color={colors.textSecondary} size={18} />
    </Pressable>
  );
}

function UpdateRow({
  onPress,
  update,
}: Readonly<{ onPress: () => void; update: PlantUpdate }>) {
  const photoUri = update.photos
    .slice()
    .sort((left, right) => left.position - right.position)[0]?.localUri;
  const occurredAt = formatDateTime(new Date(update.occurredAt));
  const summary =
    update.notes ??
    t("plants.recentJournal.photoCount", {
      count: formatNumber(update.photos.length),
    });
  return (
    <Pressable
      accessibilityLabel={t("journal.update.openAccessibility", {
        time: occurredAt,
      })}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {photoUri ? (
        <Image
          accessibilityIgnoresInvertColors
          source={{ uri: photoUri }}
          style={styles.thumbnail}
        />
      ) : (
        <View style={[styles.icon, styles.updateIcon]}>
          <FileText color={colors.primary} size={20} />
        </View>
      )}
      <View style={styles.copy}>
        <Typography variant="bodyLarge">
          {t("journal.filter.update")}
        </Typography>
        <Typography
          color="textSecondary"
          numberOfLines={1}
          variant="bodyMedium"
        >
          {summary}
        </Typography>
        <Typography color="textSecondary" variant="label">
          {occurredAt}
        </Typography>
      </View>
      <ChevronRight color={colors.textSecondary} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  copy: { flex: 1, minWidth: 0 },
  icon: {
    alignItems: "center",
    borderRadius: radius.control,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  list: { paddingVertical: 0 },
  pressed: { backgroundColor: colors.surfaceSubtle },
  row: {
    alignItems: "center",
    borderRadius: radius.control,
    flexDirection: "row",
    gap: spacing.base,
    minHeight: 64,
    paddingVertical: spacing.sm,
  },
  section: { gap: spacing.base },
  thumbnail: { borderRadius: radius.control, height: 40, width: 40 },
  updateIcon: { backgroundColor: colors.primarySoft },
});
