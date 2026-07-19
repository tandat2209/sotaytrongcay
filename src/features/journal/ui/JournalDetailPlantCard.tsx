import { StyleSheet } from "react-native";
import { PlantIdentity } from "@/features/plants/ui/PlantIdentity";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { spacing } from "@/shared/ui/theme";

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
    <SurfaceCard style={styles.card}>
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
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.md },
  identity: { flex: 0 },
});
