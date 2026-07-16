import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { t } from "@/shared/i18n";
import {
  hasAnyJournalEntries,
  listJournalPage,
} from "../data/journal-page-repository";
import { listLatestPlantPhotoUris } from "../data/plant-update-repository";
import {
  emptyJournalCriteria,
  type JournalCursor,
} from "../models/journal-query";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import { listPlants } from "@/features/plants/data/plant-repository";
import { JournalScreen } from "./JournalScreen";

export function JournalRouteScreen() {
  const [criteria, setCriteria] = useState(emptyJournalCriteria);
  const contextQuery = useQuery({
    queryKey: ["journal", "context"],
    queryFn: async () => {
      const [hasAnyEntries, photoUris, plants] = await Promise.all([
        hasAnyJournalEntries(),
        listLatestPlantPhotoUris(),
        listPlants(),
      ]);
      return { hasAnyEntries, photoUris, plants };
    },
  });
  const query = useInfiniteQuery({
    queryKey: ["journal", "entries", criteria],
    queryFn: ({ pageParam }) =>
      listJournalPage({ criteria, cursor: pageParam }),
    initialPageParam: null as JournalCursor | null,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
  if (contextQuery.isPending || query.isPending)
    return <Text>{t("common.state.loading")}</Text>;
  if (contextQuery.isError || query.isError)
    return <Text>{t("journal.error.loadJournal")}</Text>;
  const activities = query.data.pages.flatMap((page) => page.activities);
  const updates = query.data.pages.flatMap((page) => page.updates);
  const fertilizerApplications = query.data.pages.flatMap(
    (page) => page.fertilizerApplications,
  );
  const plants = Object.fromEntries(
    contextQuery.data.plants.map((plant) => [
      plant.id,
      {
        ...resolvePlantIdentity(plant),
        imageUri: contextQuery.data.photoUris[plant.id] ?? null,
        name: plant.name,
        speciesId: plant.speciesId,
        stageId: plant.stageId,
      },
    ]),
  );
  const fertilizerNamesByActivity = fertilizerApplications.reduce<
    Record<string, string[]>
  >(
    (namesByActivity, application) => ({
      ...namesByActivity,
      [application.careActivityId]: [
        ...(namesByActivity[application.careActivityId] ?? []),
        application.nameSnapshot,
      ],
    }),
    {},
  );
  return (
    <JournalScreen
      activities={activities}
      criteria={criteria}
      fertilizerNamesByActivity={fertilizerNamesByActivity}
      hasAnyEntries={contextQuery.data.hasAnyEntries}
      hasMore={query.hasNextPage}
      isLoadingMore={query.isFetchingNextPage}
      loadMoreError={query.isFetchNextPageError}
      onCriteriaChange={setCriteria}
      onLoadMore={() => void query.fetchNextPage()}
      onOpenActivity={(id) => router.push(`/entries/${id}`)}
      onOpenUpdate={(id) => router.push(`/updates/${id}`)}
      onRetryLoadMore={() => void query.fetchNextPage()}
      plants={plants}
      updates={updates}
    />
  );
}
