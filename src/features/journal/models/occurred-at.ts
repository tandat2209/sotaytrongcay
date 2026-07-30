export const OCCURRENCE_PERIODS = ["morning", "afternoon", "evening"] as const;

export type OccurrencePeriod = (typeof OCCURRENCE_PERIODS)[number];

const representativeHour: Record<OccurrencePeriod, number> = {
  afternoon: 18,
  evening: 22,
  morning: 8,
};

export function getOccurrencePeriod(value: Date): OccurrencePeriod {
  if (value.getHours() < 12) return "morning";
  if (value.getHours() < 21) return "afternoon";
  return "evening";
}

export function setOccurrencePeriod(
  value: Date,
  period: OccurrencePeriod,
): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    representativeHour[period],
  );
}

export function isOccurrencePeriodAvailable(
  selectedDate: Date,
  period: OccurrencePeriod,
  now: Date,
): boolean {
  const selectedDay = startOfLocalDay(selectedDate).getTime();
  const today = startOfLocalDay(now).getTime();
  if (selectedDay < today) return true;
  if (selectedDay > today) return false;
  return (
    OCCURRENCE_PERIODS.indexOf(period) <=
    OCCURRENCE_PERIODS.indexOf(getOccurrencePeriod(now))
  );
}

export function resolveOccurrenceAt(
  selectedDate: Date,
  period: OccurrencePeriod,
  now: Date,
): Date {
  const representative = setOccurrencePeriod(selectedDate, period);
  return representative.getTime() > now.getTime() &&
    startOfLocalDay(selectedDate).getTime() === startOfLocalDay(now).getTime()
    ? new Date(now)
    : representative;
}

function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}
