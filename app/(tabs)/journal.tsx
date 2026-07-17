import { JournalScreen } from "@/features/journal";
import {
  listPlants,
  PlantIdentity,
  resolvePlantIdentity,
} from "@/features/plants";

export default function JournalRoute() {
  return (
    <JournalScreen
      listPlants={listPlants}
      plantIdentityComponent={PlantIdentity}
      resolvePlantIdentity={resolvePlantIdentity}
    />
  );
}
