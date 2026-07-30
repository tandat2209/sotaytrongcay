import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import { DataManagementScreen } from "@/features/data-management";

export default function DataManagementRoute() {
  const queryClient = useQueryClient();
  return (
    <DataManagementScreen
      onBack={() => router.back()}
      onRestoreComplete={() => {
        queryClient.clear();
        router.replace("/today");
      }}
    />
  );
}
