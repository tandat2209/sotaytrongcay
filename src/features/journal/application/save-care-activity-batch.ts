import { z } from "zod";
import { withDatabaseWriteTransaction } from "@/shared/lib/db/database";
import { insertCareActivity } from "../data/care-activity-repository";
import { insertFertilizerApplication } from "../data/fertilizer-application-repository";
import type {
  CareActivityType,
  WateringIntensity,
} from "../models/care-activity";
import type { FertilizerApplicationDetails } from "../models/fertilizer-application";
import {
  createFertilizerApplicationRecords,
  parseCareActivityWithApplications,
  type CareActivityWithApplicationsInput,
} from "./save-care-activity-with-applications";

type SharedCareDetails = Readonly<{
  estimatedAmountLiters: number | null;
  fertilizerApplications: readonly FertilizerApplicationDetails[];
  intensity: WateringIntensity | null;
  notes: string | null;
  occurredAt: string;
  sprayTargetId: string | null;
  sprayTargetNameSnapshot: string | null;
}>;

type CreateCareActivityBatchInput = Readonly<{
  createId: () => string;
  createdAt: string;
  details: SharedCareDetails;
  plantIds: readonly string[];
  type: CareActivityType;
}>;

const BatchScopeSchema = z
  .array(
    z.object({
      occurredAt: z.string().datetime(),
      plantId: z.string().uuid(),
      sharedDetails: z.string(),
      type: z.enum(["watering", "fertilizing", "spraying"]),
    }),
  )
  .min(2)
  .superRefine((items, context) => {
    const first = items[0];
    const plantIds = new Set<string>();
    items.forEach((item, index) => {
      if (plantIds.has(item.plantId)) {
        context.addIssue({
          code: "custom",
          message: "Each Plant may appear only once in a care batch.",
          path: [index, "plantId"],
        });
      }
      plantIds.add(item.plantId);
      if (
        first &&
        (item.type !== first.type ||
          item.occurredAt !== first.occurredAt ||
          item.sharedDetails !== first.sharedDetails)
      ) {
        context.addIssue({
          code: "custom",
          message: "Every activity in a care batch must share care details.",
          path: [index],
        });
      }
    });
  });

export function parseCareActivityBatch(
  input: readonly CareActivityWithApplicationsInput[],
) {
  const commands = input.map(parseCareActivityWithApplications);
  BatchScopeSchema.parse(
    commands.map(({ activity, applications }) => ({
      occurredAt: activity.occurredAt,
      plantId: activity.plantId,
      sharedDetails: JSON.stringify({
        estimatedAmountLiters: activity.estimatedAmountLiters,
        fertilizerApplications: applications.map((application) => ({
          applicationMethod: application.applicationMethod,
          amountUnit: application.amountUnit,
          amountValue: application.amountValue,
          groupSnapshot: application.groupSnapshot,
          knowledgeIdSnapshot: application.knowledgeIdSnapshot,
          nameSnapshot: application.nameSnapshot,
          notes: application.notes,
          position: application.position,
          userFertilizerId: application.userFertilizerId,
        })),
        intensity: activity.intensity,
        notes: activity.notes,
        origin: activity.origin,
        sprayTargetId: activity.sprayTargetId ?? null,
        sprayTargetNameSnapshot: activity.sprayTargetNameSnapshot ?? null,
      }),
      type: activity.type,
    })),
  );
  return commands;
}

export function createCareActivityBatchCommands(
  input: CreateCareActivityBatchInput,
) {
  const commands = input.plantIds.map((plantId) => {
    const activityId = input.createId();
    return {
      activity: {
        id: activityId,
        mutationId: input.createId(),
        plantId,
        type: input.type,
        occurredAt: input.details.occurredAt,
        origin: "manual" as const,
        intensity: input.details.intensity,
        estimatedAmountLiters: input.details.estimatedAmountLiters,
        sprayTargetId: input.details.sprayTargetId,
        sprayTargetNameSnapshot: input.details.sprayTargetNameSnapshot,
        notes: input.details.notes,
        createdAt: input.createdAt,
      },
      applications: createFertilizerApplicationRecords(
        activityId,
        input.details.fertilizerApplications,
        input.createId,
      ),
    };
  });
  return parseCareActivityBatch(commands);
}

export type CareActivityBatchCommand = ReturnType<
  typeof createCareActivityBatchCommands
>[number];

export async function saveCareActivityBatch(
  input: readonly CareActivityWithApplicationsInput[],
): Promise<void> {
  const commands = parseCareActivityBatch(input);
  await withDatabaseWriteTransaction(async (transaction) => {
    for (const command of commands) {
      const outcome = await insertCareActivity(transaction, command.activity);
      if (outcome === "duplicate") continue;
      for (const application of command.applications) {
        await insertFertilizerApplication(transaction, application);
      }
    }
  });
}
