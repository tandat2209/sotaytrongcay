import type {
  CareActivityOrigin,
  CareActivityType,
  WateringIntensity,
} from "../models/care-activity";
import { t } from "@/shared/i18n";

export function getCareActivityLabel(type: CareActivityType): string {
  return t(
    (
      {
        fertilizing: "journal.activity.fertilizing",
        spraying: "journal.activity.spraying",
        watering: "journal.activity.watering",
      } as const
    )[type],
  );
}

export function getCareActivityOriginLabel(origin: CareActivityOrigin): string {
  return t(
    (
      {
        manual: "journal.activityOrigin.manual",
        reminder: "journal.activityOrigin.reminder",
        today: "journal.activityOrigin.today",
      } as const
    )[origin],
  );
}

export function getCareActivityUnitLabel(unit: "liter"): string {
  return t("journal.activityUnit.liter");
}

export function getWateringIntensityLabel(
  intensity: WateringIntensity,
): string {
  return t(
    (
      {
        deep: "journal.careEntry.intensity.deep.label",
        light: "journal.careEntry.intensity.light.label",
        moderate: "journal.careEntry.intensity.moderate.label",
        rain: "journal.careEntry.intensity.rain.label",
      } as const
    )[intensity],
  );
}

export function getWateringIntensityDescription(
  intensity: WateringIntensity,
): string {
  return t(
    (
      {
        deep: "journal.careEntry.intensity.deep.description",
        light: "journal.careEntry.intensity.light.description",
        moderate: "journal.careEntry.intensity.moderate.description",
        rain: "journal.careEntry.intensity.rain.description",
      } as const
    )[intensity],
  );
}
