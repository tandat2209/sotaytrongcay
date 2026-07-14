import { z } from "zod";

export const PlantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
  speciesId: z.string().min(1),
  stageId: z.string().min(1),
  growingMethod: z.enum(["ground", "container"]),
  location: z.string().trim().nullable(),
  plantedAt: z.string().date().nullable(),
  stageStartedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export type Plant = z.infer<typeof PlantSchema>;
