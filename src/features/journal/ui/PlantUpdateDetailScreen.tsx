import {
  CalendarDays,
  FileText,
  Leaf,
  type LucideIcon,
} from "lucide-react-native";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { PlantIdentity } from "@/features/plants";
import { formatDateTime, t } from "@/shared/i18n";
import type { PlantUpdate } from "../models/plant-update";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  imageUri?: string | null;
  onBack: () => void;
  plantName: string;
  speciesTitle: string;
  stageTitle: string;
  update: PlantUpdate;
}>;

export function PlantUpdateDetailScreen({
  imageUri,
  onBack,
  plantName,
  speciesTitle,
  stageTitle,
  update,
}: Props) {
  return (
    <Screen title="">
      <TopBar
        backAccessibilityLabel={t("common.actions.backToJournal")}
        onBack={onBack}
        title={t("journal.update.detailTitle")}
        titleIcon={FileText}
      />
      <PlantIdentity
        imageUri={imageUri ?? null}
        name={plantName}
        size="list"
        speciesTitle={speciesTitle}
        stageId={update.stageId}
        stageTitle={stageTitle}
      />
      {update.photos.length ? (
        <ScrollView
          contentContainerStyle={styles.photos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {update.photos
            .slice()
            .sort((left, right) => left.position - right.position)
            .map((photo, index) => (
              <Image
                accessibilityLabel={t("journal.photo.imageAccessibility", {
                  index: index + 1,
                })}
                key={photo.id}
                source={{ uri: photo.localUri }}
                style={styles.photo}
              />
            ))}
        </ScrollView>
      ) : null}
      <SurfaceCard style={styles.card}>
        <Detail
          icon={CalendarDays}
          label={t("journal.filter.date")}
          value={formatDateTime(new Date(update.occurredAt))}
        />
        <Detail
          icon={Leaf}
          label={t("journal.update.savedStage")}
          value={stageTitle}
        />
        {update.notes ? (
          <Detail
            icon={FileText}
            label={t("journal.activityDetail.notes")}
            value={update.notes}
          />
        ) : null}
      </SurfaceCard>
    </Screen>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: Readonly<{ icon: LucideIcon; label: string; value: string }>) {
  return (
    <View style={styles.detail}>
      <Icon color={colors.primary} size={20} />
      <View style={styles.copy}>
        <Typography color="textSecondary" variant="label">
          {label}
        </Typography>
        <Typography variant="bodyLarge">{value}</Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  detail: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md },
  photo: { borderRadius: radius.card, height: 280, width: 320 },
  photos: { gap: spacing.md, paddingRight: spacing.md },
});
