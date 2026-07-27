import { router } from "expo-router";
import { listWarningSigns, WarningSignListScreen } from "@/features/knowledge";

export default function WarningSignLibraryRoute() {
  return (
    <WarningSignListScreen
      onBack={() => router.back()}
      onOpenSign={(id) =>
        router.push({ pathname: "/more/warning-signs/[id]", params: { id } })
      }
      signs={listWarningSigns()}
    />
  );
}
