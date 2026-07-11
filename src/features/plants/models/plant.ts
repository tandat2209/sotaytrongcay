import { z } from "zod";

export const PlantSchema = z.object({
  id: z.string().uuid(),
  speciesId: z.string(),
  stageId: z.string(),
  createdAt: z.string().datetime(),
});

export type Plant = z.infer<typeof PlantSchema>;
