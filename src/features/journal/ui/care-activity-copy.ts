import type {
  CareActivityOrigin,
  CareActivityType,
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
