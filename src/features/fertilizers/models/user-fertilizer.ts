import { z } from "zod";

export const FertilizerGroupSchema = z.enum([
  "organic",
  "npk",
  "single",
  "supplement",
  "other",
]);

const UserFertilizerFieldsSchema = z.object({
  id: z.string().uuid(),
  mutationId: z.string().uuid(),
  name: z.string().trim().min(1),
  group: FertilizerGroupSchema.nullable(),
  npk: z.string().trim().min(1).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserFertilizerSchema = UserFertilizerFieldsSchema;
export const NewUserFertilizerSchema = UserFertilizerFieldsSchema;

export type FertilizerGroup = z.infer<typeof FertilizerGroupSchema>;
export type NewUserFertilizer = z.infer<typeof NewUserFertilizerSchema>;
export type UserFertilizer = z.infer<typeof UserFertilizerSchema>;
