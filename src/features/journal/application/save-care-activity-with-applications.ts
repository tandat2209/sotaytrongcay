import { z } from "zod";
import { withDatabaseWriteTransaction } from "@/shared/lib/db/database";
import {
  insertCareActivity,
  updateCareActivity,
} from "../data/care-activity-repository";
import { insertFertilizerApplication } from "../data/fertilizer-application-repository";
import { NewCareActivitySchema } from "../models/care-activity";
import { FertilizerApplicationSchema } from "../models/fertilizer-application";
import type { FertilizerApplication } from "../models/fertilizer-application";

type FertilizerApplicationDetails = Omit<
  FertilizerApplication,
  "careActivityId" | "id" | "position"
>;

const CareActivityWithApplicationsSchema = z
  .object({
    activity: NewCareActivitySchema,
    applications: z.array(FertilizerApplicationSchema),
  })
  .superRefine(({ activity, applications }, context) => {
    if (activity.type !== "fertilizing" && applications.length > 0) {
      context.addIssue({
        code: "custom",
        message: "Fertilizer applications require a fertilizing activity.",
        path: ["applications"],
      });
    }
    applications.forEach((application, index) => {
      if (application.careActivityId !== activity.id) {
        context.addIssue({
          code: "custom",
          message: "Fertilizer application belongs to another activity.",
          path: ["applications", index, "careActivityId"],
        });
      }
      if (application.position !== index) {
        context.addIssue({
          code: "custom",
          message: "Fertilizer application positions must be contiguous.",
          path: ["applications", index, "position"],
        });
      }
    });
  });

export type CareActivityWithApplicationsInput = z.input<
  typeof CareActivityWithApplicationsSchema
>;

export function parseCareActivityWithApplications(
  input: CareActivityWithApplicationsInput,
) {
  return CareActivityWithApplicationsSchema.parse(input);
}

export function createFertilizerApplicationRecords(
  careActivityId: string,
  details: readonly FertilizerApplicationDetails[],
  createId: () => string,
): FertilizerApplication[] {
  return details.map((application, position) =>
    FertilizerApplicationSchema.parse({
      ...application,
      id: createId(),
      careActivityId,
      position,
    }),
  );
}

export async function saveCareActivityWithApplications(
  input: CareActivityWithApplicationsInput,
): Promise<void> {
  const command = parseCareActivityWithApplications(input);
  await withDatabaseWriteTransaction(async (transaction) => {
    const outcome = await insertCareActivity(transaction, command.activity);
    if (outcome === "duplicate") return;
    for (const application of command.applications) {
      await insertFertilizerApplication(transaction, application);
    }
  });
}

export async function updateCareActivityWithApplications(
  input: CareActivityWithApplicationsInput,
): Promise<void> {
  const command = parseCareActivityWithApplications(input);
  await withDatabaseWriteTransaction(async (transaction) => {
    await updateCareActivity(transaction, command.activity);
    await transaction.runAsync(
      "DELETE FROM fertilizer_applications WHERE care_activity_id = ?",
      [command.activity.id],
    );
    for (const application of command.applications) {
      await insertFertilizerApplication(transaction, application);
    }
  });
}
