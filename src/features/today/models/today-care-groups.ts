import type { TodayCareCard } from "./today-projection";

export type TodayCareGroup = Readonly<{
  cards: readonly TodayCareCard[];
  imageUri: string | null;
  plantId: string;
  plantName: string;
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
}>;

export function groupTodayCareCards(
  cards: readonly TodayCareCard[],
): readonly TodayCareGroup[] {
  const groups: TodayCareGroup[] = [];
  const groupIndexes = new Map<string, number>();

  cards.forEach((card) => {
    const groupIndex = groupIndexes.get(card.plantId);
    if (groupIndex !== undefined) {
      const group = groups[groupIndex];
      if (group)
        groups[groupIndex] = { ...group, cards: [...group.cards, card] };
      return;
    }

    groupIndexes.set(card.plantId, groups.length);
    groups.push({
      cards: [card],
      imageUri: card.imageUri,
      plantId: card.plantId,
      plantName: card.plantName,
      speciesTitle: card.speciesTitle,
      stageId: card.stageId,
      stageTitle: card.stageTitle,
    });
  });

  return groups;
}
