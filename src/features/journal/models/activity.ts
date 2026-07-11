import { z } from "zod";

export const ActivityTypeEnum = z.enum(["watering", "fertilizing", "spraying", "pruning"]);
export type ActivityType = z.infer<typeof ActivityTypeEnum>;

export const ActivityStatusEnum = z.enum(["scheduled", "completed", "skipped"]);
export type ActivityStatus = z.infer<typeof ActivityStatusEnum>;

export const ActivitySchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  activityType: ActivityTypeEnum,
  status: ActivityStatusEnum,
  metadata: z.record(z.string(), z.any()).nullable().optional(), // Flexible JSON metadata
  createdAt: z.string().datetime(),
});

export type Activity = z.infer<typeof ActivitySchema>;
