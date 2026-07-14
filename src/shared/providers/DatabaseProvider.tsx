import React, { useEffect, useState } from "react";
import { initializeDatabase } from "../lib/db/database";

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initializeDatabase()
      .then(() => setIsReady(true))
      .catch((e) => setError(e instanceof Error ? e : new Error(String(e))));
  }, []);

  if (error) {
    // Propagate error to the nearest ErrorBoundary
    throw error;
  }

  if (!isReady) {
    // Render nothing while initializing. We could render a splash screen or spinner here later.
    return null;
  }

  return <>{children}</>;
}
