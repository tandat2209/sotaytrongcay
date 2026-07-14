import { z } from "zod";

export const WaterAmountSchema = z.object({
  value: z.number().positive(),
  unit: z.literal("liter"),
});

export const CareActivitySchema = z
  .object({
    id: z.string().uuid(),
    mutationId: z.string().uuid(),
    plantId: z.string().uuid(),
    type: z.enum(["watering", "fertilizing", "spraying"]),
    occurredAt: z.string().datetime(),
    origin: z.enum(["today", "reminder", "manual"]),
    amount: WaterAmountSchema.nullable(),
    notes: z.string().nullable(),
    createdAt: z.string().datetime(),
  })
  .superRefine((activity, context) => {
    if (activity.type !== "watering" && activity.amount !== null) {
      context.addIssue({
        code: "custom",
        message: "A liter amount is valid only for watering.",
        path: ["amount"],
      });
    }
  });

export type CareActivity = z.infer<typeof CareActivitySchema>;
export type CareActivityType = CareActivity["type"];
export type CareActivityOrigin = CareActivity["origin"];

export const CARE_ACTIVITY_LABELS: Record<CareActivityType, string> = {
  watering: "Tưới nước",
  fertilizing: "Bón phân",
  spraying: "Phun thuốc",
};

export const CARE_ACTIVITY_ORIGIN_LABELS: Record<CareActivityOrigin, string> = {
  today: "Từ hôm nay",
  reminder: "Từ lời nhắc",
  manual: "Ghi thủ công",
};

export const CARE_ACTIVITY_UNIT_LABELS = {
  liter: "lít",
} as const;

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
