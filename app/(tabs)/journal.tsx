import { JournalScreen } from "@/features/journal";
import {
  listAllPlants,
  PlantIdentity,
  resolvePlantIdentity,
} from "@/features/plants";

export default function JournalRoute() {
  return (
    <JournalScreen
      listPlants={listAllPlants}
      plantIdentityComponent={PlantIdentity}
      resolvePlantIdentity={resolvePlantIdentity}
    />
  );
}
