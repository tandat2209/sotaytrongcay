import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DatabaseProvider } from "@/shared/providers/DatabaseProvider";
import { ReminderBootstrap } from "./ReminderBootstrap";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
