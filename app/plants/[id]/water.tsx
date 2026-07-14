import { Redirect, useLocalSearchParams } from "expo-router";
import { z } from "zod";

export default function WateringRedirect() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  return (
    <Redirect
      href={{ pathname: "/plants/[id]/care", params: { id, type: "watering" } }}
    />
  );
}
