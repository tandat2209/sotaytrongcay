import { z } from "zod";

export const FertilizerAmountUnitSchema = z.enum([
  "handful",
  "spoon",
  "cap",
  "gram",
  "milliliter",
  "other",
]);

export const FertilizerApplicationMethodSchema = z.enum([
  "root",
  "drench",
  "foliar",
  "topdress",
]);

export const FertilizerSnapshotGroupSchema = z.enum([
  "organic",
  "npk",
  "single",
  "supplement",
  "other",
]);

export const FertilizerApplicationSchema = z
  .object({
    id: z.string().uuid(),
    careActivityId: z.string().uuid(),
    userFertilizerId: z.string().uuid().nullable(),
    position: z.number().int().nonnegative(),
    nameSnapshot: z.string().trim().min(1),
    groupSnapshot: FertilizerSnapshotGroupSchema.nullable(),
    knowledgeIdSnapshot: z.string().trim().min(1).nullable(),
    amountValue: z.number().positive().nullable(),
    amountUnit: FertilizerAmountUnitSchema.nullable(),
    applicationMethod: FertilizerApplicationMethodSchema.nullable(),
    notes: z.string().trim().min(1).nullable(),
  })
  .superRefine((application, context) => {
    if (
      (application.amountValue === null) !==
      (application.amountUnit === null)
    ) {
      context.addIssue({
        code: "custom",
        message: "Fertilizer amount and unit must be recorded together.",
        path: ["amountValue"],
      });
    }
  });

export type FertilizerAmountUnit = z.infer<typeof FertilizerAmountUnitSchema>;
export type FertilizerApplication = z.infer<typeof FertilizerApplicationSchema>;
export type FertilizerApplicationMethod = z.infer<
  typeof FertilizerApplicationMethodSchema
>;
export type FertilizerSnapshotGroup = z.infer<
  typeof FertilizerSnapshotGroupSchema
>;

export type FertilizerApplicationDetails = Readonly<{
  userFertilizerId: string | null;
  nameSnapshot: string;
  groupSnapshot: FertilizerSnapshotGroup | null;
  knowledgeIdSnapshot: string | null;
  amountValue: number | null;
  amountUnit: FertilizerAmountUnit | null;
  applicationMethod: FertilizerApplicationMethod | null;
  notes: string | null;
}>;
