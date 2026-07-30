import type {
  CareActivityOrigin,
  CareActivityType,
  WateringIntensity,
} from "../models/care-activity";
import {
  getOccurrencePeriod,
  type OccurrencePeriod,
} from "../models/occurred-at";
import { formatDate, t } from "@/shared/i18n";

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

export function getOccurrencePeriodLabel(period: OccurrencePeriod): string {
  return t(
    (
      {
        afternoon: "journal.careEntry.period.afternoon",
        evening: "journal.careEntry.period.evening",
        morning: "journal.careEntry.period.morning",
      } as const
    )[period],
  );
}

export function formatCareOccurrence(value: Date): string {
  return `${formatDate(value)} · ${getOccurrencePeriodLabel(
    getOccurrencePeriod(value),
  )}`;
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
