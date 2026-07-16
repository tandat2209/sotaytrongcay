export type IdempotentInsertOutcome = "inserted" | "duplicate";

export function resolveIdempotentInsertOutcome({
  changes,
  expectedId,
  savedId,
}: Readonly<{
  changes: number;
  expectedId: string;
  savedId: string | null;
}>): IdempotentInsertOutcome {
  if (changes === 1) return "inserted";
  if (changes !== 0) {
    throw new Error(`Unexpected insert change count: ${changes}.`);
  }
  if (savedId === expectedId) return "duplicate";
  throw new Error("Idempotent insert conflict.");
}
