import { z } from "zod";

export const WateringIntensitySchema = z.enum([
  "light",
  "moderate",
  "deep",
  "rain",
]);

const CareActivityFieldsSchema = z.object({
  id: z.string().uuid(),
  mutationId: z.string().uuid(),
  plantId: z.string().uuid(),
  type: z.enum(["watering", "fertilizing", "spraying"]),
  occurredAt: z.string().datetime(),
  origin: z.enum(["today", "reminder", "manual"]),
  intensity: WateringIntensitySchema.nullable(),
  estimatedAmountLiters: z.number().positive().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const CareActivitySchema = CareActivityFieldsSchema.superRefine(
  (activity, context) => {
    if (
      activity.type !== "watering" &&
      (activity.intensity !== null || activity.estimatedAmountLiters !== null)
    ) {
      context.addIssue({
        code: "custom",
        message: "Watering details are valid only for watering.",
        path: ["intensity"],
      });
    }
  },
);

export const NewCareActivitySchema = CareActivityFieldsSchema.superRefine(
  (activity, context) => {
    if (activity.type === "watering" && activity.intensity === null) {
      context.addIssue({
        code: "custom",
        message: "Watering intensity is required for new watering activity.",
        path: ["intensity"],
      });
    }
    if (
      activity.type !== "watering" &&
      (activity.intensity !== null || activity.estimatedAmountLiters !== null)
    ) {
      context.addIssue({
        code: "custom",
        message: "Watering details are valid only for watering.",
        path: ["intensity"],
      });
    }
  },
);

export type CareActivity = z.infer<typeof CareActivitySchema>;
export type NewCareActivity = z.infer<typeof NewCareActivitySchema>;
export type CareActivityType = CareActivity["type"];
export type CareActivityOrigin = CareActivity["origin"];
export type WateringIntensity = z.infer<typeof WateringIntensitySchema>;

export function findLatestCareActivity(
  activities: readonly CareActivity[],
  plantId: string,
  type: CareActivityType,
): CareActivity | null {
  return activities.reduce<CareActivity | null>((latest, activity) => {
    if (activity.plantId !== plantId || activity.type !== type) return latest;
    return latest === null || activity.occurredAt > latest.occurredAt
      ? activity
      : latest;
  }, null);
}
