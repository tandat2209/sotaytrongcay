export type SharedSprayTarget = Readonly<{
  id: string;
  kind: "disease" | "pest";
  title: string;
}>;

export function intersectSharedSprayTargets(
  targetGroups: readonly (readonly SharedSprayTarget[])[],
): readonly SharedSprayTarget[] {
  const firstGroup = targetGroups[0] ?? [];
  return firstGroup.filter((target) =>
    targetGroups.every((group) =>
      group.some((candidate) => candidate.id === target.id),
    ),
  );
}
