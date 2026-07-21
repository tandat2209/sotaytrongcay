import { router } from "expo-router";
import { UsageNoticeScreen } from "@/features/more";

export default function UsageNoticeRoute() {
  return <UsageNoticeScreen onBack={() => router.back()} />;
}
