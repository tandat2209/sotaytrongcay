import type { TodayCareCard } from "./today-projection";
import { groupTodayCareCards } from "./today-care-groups";

function createCard(
  id: string,
  plantId: string,
  activityType: TodayCareCard["activityType"],
): TodayCareCard {
  return {
    activityType,
    carePlanId: `plan-${id}`,
    dueStatus: null,
    explanation: `Reason ${id}`,
    fertilizerSuggestions: [],
    id,
    imageUri: null,
    plantId,
    plantName: `Plant ${plantId}`,
    priority: 1,
    speciesTitle: "Nho",
    stageId: "grape.stage.seedling",
    stageTitle: "Cây con",
    suggestion: null,
    title: `Activity ${id}`,
  };
}

describe("groupTodayCareCards", () => {
  it("shows one plant group while preserving ranked activity order", () => {
    const firstWatering = createCard("water-a", "plant-a", "watering");
    const secondPlant = createCard("spray-b", "plant-b", "spraying");
    const laterFertilizing = createCard(
      "fertilize-a",
      "plant-a",
      "fertilizing",
    );

    const groups = groupTodayCareCards([
      firstWatering,
      secondPlant,
      laterFertilizing,
    ]);

    expect(groups.map(({ plantId }) => plantId)).toEqual([
      "plant-a",
      "plant-b",
    ]);
    expect(groups[0]?.cards).toEqual([firstWatering, laterFertilizing]);
    expect(groups[1]?.cards).toEqual([secondPlant]);
  });
});
