import { z } from "zod";

export const PlantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
  speciesId: z.string().min(1),
  stageId: z.string().min(1),
  plantedAt: z.string().date().nullable(),
  createdAt: z.string().datetime(),
});

export type Plant = z.infer<typeof PlantSchema>;
