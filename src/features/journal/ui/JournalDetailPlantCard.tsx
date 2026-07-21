import { StyleSheet, View } from "react-native";
import { PlantIdentity } from "@/features/plants/ui/PlantIdentity";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  imageUri: string | null;
  name: string;
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
  testID?: string;
}>;

export function JournalDetailPlantCard({
  imageUri,
  name,
  speciesTitle,
  stageId,
  stageTitle,
  testID,
}: Props) {
  return (
    <View style={styles.card}>
      <PlantIdentity
        imageUri={imageUri}
        name={name}
        size="list"
        speciesTitle={speciesTitle}
        stageId={stageId}
        stageTitle={stageTitle}
        style={styles.identity}
        {...(testID === undefined ? {} : { testID })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.card,
    padding: spacing.base,
  },
  identity: { flex: 0 },
});
