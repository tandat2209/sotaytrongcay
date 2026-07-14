import { z } from "zod";

export const PlantStageHistorySchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  fromStageId: z.string().min(1),
  toStageId: z.string().min(1),
  journalEntryId: z.string().uuid(),
  changedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type PlantStageHistory = z.infer<typeof PlantStageHistorySchema>;

export function createPlantStageHistory(
  input: PlantStageHistory,
): PlantStageHistory | null {
  const history = PlantStageHistorySchema.parse(input);
  return history.fromStageId === history.toStageId ? null : history;
}
