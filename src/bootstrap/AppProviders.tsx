import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { t } from "@/shared/i18n";
import { DatabaseProvider } from "@/shared/providers/DatabaseProvider";
import { ReminderBootstrap } from "./ReminderBootstrap";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (process.env.EXPO_PUBLIC_SHOW_QUERY_ERRORS !== "true") return;

            Alert.alert(
              t("common.error.queryDiagnosticTitle"),
              `${JSON.stringify(query.queryKey)}\n\n${error.message}`,
            );
          },
        }),
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <DatabaseProvider>
          <ReminderBootstrap>{children}</ReminderBootstrap>
        </DatabaseProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
