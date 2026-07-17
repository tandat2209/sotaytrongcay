export type FertilizerUsage = Readonly<{
  occurredAt: string;
  plantName: string;
}>;

export function getFertilizerUsageElapsedDays(
  occurredAt: string,
  now: Date = new Date(),
): number {
  return Math.max(
    0,
    Math.floor((now.getTime() - new Date(occurredAt).getTime()) / 86_400_000),
  );
}
