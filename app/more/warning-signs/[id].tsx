import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import { getWarningSign, WarningSignDetailScreen } from "@/features/knowledge";
import { t } from "@/shared/i18n";

const paramsSchema = z.object({ id: z.string().min(1) });

export default function WarningSignDetailRoute() {
  const { id } = paramsSchema.parse(useLocalSearchParams());
  const sign = getWarningSign(id);

  if (!sign) return <Text>{t("warningSigns.notFound")}</Text>;

  return <WarningSignDetailScreen onBack={() => router.back()} sign={sign} />;
}
