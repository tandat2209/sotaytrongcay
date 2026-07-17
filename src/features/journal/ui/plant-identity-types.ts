import type { ComponentType } from "react";

export type PlantIdentityViewProps = Readonly<{
  imageUri: string | null;
  name: string;
  size: "list";
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
}>;

export type PlantIdentityComponent = ComponentType<PlantIdentityViewProps>;
