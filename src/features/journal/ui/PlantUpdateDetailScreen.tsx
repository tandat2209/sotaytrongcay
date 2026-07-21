import { Camera, FileText, Leaf } from "lucide-react-native";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { t } from "@/shared/i18n";
import type { PlantUpdate } from "../models/plant-update";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { JournalDetailHero } from "./JournalDetailHero";
import { JournalDetailPlantCard } from "./JournalDetailPlantCard";
import { JournalDetailRow, JournalDetailSection } from "./JournalDetailSection";

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
  const { width } = useWindowDimensions();
  const photoWidth = Math.max(width - spacing.base * 2, 240);
  const photos = update.photos
    .slice()
    .sort((left, right) => left.position - right.position);

  return (
    <Screen title="">
      <TopBar
        backAccessibilityLabel={t("common.actions.backToJournal")}
        onBack={onBack}
        title={t("journal.update.detailTitle")}
      />
      <JournalDetailHero
        accentColor={colors.primary}
        backgroundColor={colors.primarySoft}
        badge={t("journal.update.recordType")}
        icon={Camera}
        occurredAt={update.occurredAt}
        title={t("journal.update.recordTitle")}
      />
      <JournalDetailPlantCard
        imageUri={imageUri ?? null}
        name={plantName}
        speciesTitle={speciesTitle}
        stageId={update.stageId}
        stageTitle={stageTitle}
      />
      {photos.length ? (
        <View style={styles.photoSection}>
          <Typography variant="headlineSmall">
            {t("journal.update.recordedPhotos")}
          </Typography>
          <ScrollView
            contentContainerStyle={styles.photos}
            decelerationRate="fast"
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={photoWidth + spacing.base}
            snapToAlignment="start"
          >
            {photos.map((photo, index) => (
              <View
                key={photo.id}
                style={[styles.photoFrame, { width: photoWidth }]}
              >
                <Image
                  accessibilityLabel={t("journal.photo.imageAccessibility", {
                    index: index + 1,
                  })}
                  source={{ uri: photo.localUri }}
                  style={styles.photo}
                />
                <View style={styles.photoCount}>
                  <Typography color="surface" variant="label">
                    {`${index + 1} / ${photos.length}`}
                  </Typography>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
      <JournalDetailSection title={t("journal.activityDetail.details")}>
        <JournalDetailRow
          icon={Leaf}
          label={t("journal.update.savedStage")}
          value={stageTitle}
        />
        <JournalDetailRow
          icon={FileText}
          label={t("journal.activityDetail.notes")}
          value={update.notes ?? t("journal.activityDetail.noNotes")}
        />
        <JournalDetailRow
          icon={Camera}
          label={t("journal.update.images")}
          last
          value={t("journal.update.photoCount", { count: photos.length })}
        />
      </JournalDetailSection>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { height: "100%", width: "100%" },
  photoCount: {
    backgroundColor: "rgba(28, 27, 27, 0.72)",
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: "absolute",
    right: spacing.base,
    top: spacing.base,
  },
  photoFrame: {
    aspectRatio: 4 / 3,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  photoSection: { gap: spacing.sm },
  photos: { gap: spacing.base, paddingRight: spacing.base },
});
