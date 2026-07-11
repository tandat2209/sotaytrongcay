import { z } from "zod";

export const ObservationTypeEnum = z.enum(["visual_state", "measurement", "pest_presence"]);
export type ObservationType = z.infer<typeof ObservationTypeEnum>;

export const ObservationSchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  observationType: ObservationTypeEnum,
  value: z.record(z.string(), z.any()), // Flexible JSON for arbitrary observations
  createdAt: z.string().datetime(),
});

export type Observation = z.infer<typeof ObservationSchema>;
