import { useEffect, useState } from "react";
import { Platform, SafeAreaView, StyleSheet, Text } from "react-native";
import {
  runAndroidDatabaseSmokeCheck,
  type DatabaseSmokeResult,
} from "@/shared/lib/db/database-smoke";
import { colors, spacing } from "@/shared/ui/theme";

type SmokeState =
  | Readonly<{ status: "running" }>
  | Readonly<{ result: DatabaseSmokeResult; status: "passed" }>
  | Readonly<{ message: string; status: "failed" }>
  | Readonly<{ status: "unavailable" }>;

const enabled = process.env.EXPO_PUBLIC_ENABLE_DATABASE_SMOKE_CHECK === "true";

export default function DatabaseSmokeRoute() {
  const [state, setState] = useState<SmokeState>(
    enabled && Platform.OS === "android"
      ? { status: "running" }
      : { status: "unavailable" },
  );

  useEffect(() => {
    if (!enabled || Platform.OS !== "android") return;
    let active = true;
    runAndroidDatabaseSmokeCheck()
      .then((result) => {
        if (active) setState({ result, status: "passed" });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        if (active) setState({ message, status: "failed" });
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Kiểm tra cơ sở dữ liệu Android</Text>
      <SmokeResult state={state} />
    </SafeAreaView>
  );
}

function SmokeResult({ state }: Readonly<{ state: SmokeState }>) {
  if (state.status === "running") {
    return <Text style={styles.body}>Đang kiểm tra…</Text>;
  }
  if (state.status === "passed") {
    return (
      <>
        <Text style={styles.pass}>DATABASE_SMOKE_CHECK_PASS</Text>
        <Text style={styles.body}>
          V{state.result.userVersion} · WAL · Khóa ngoại đã bật
        </Text>
      </>
    );
  }
  if (state.status === "failed") {
    return (
      <>
        <Text style={styles.fail}>DATABASE_SMOKE_CHECK_FAIL</Text>
        <Text style={styles.body}>{state.message}</Text>
      </>
    );
  }
  return (
    <Text style={styles.body}>
      Bản dựng này không bật kiểm tra cơ sở dữ liệu.
    </Text>
  );
}

const styles = StyleSheet.create({
  body: { color: colors.text, fontSize: 16, lineHeight: 24 },
  fail: { color: colors.error, fontSize: 18, fontWeight: "700" },
  pass: { color: colors.primary, fontSize: 18, fontWeight: "700" },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.base,
    padding: spacing.lg,
  },
  title: { color: colors.text, fontSize: 24, fontWeight: "700" },
});
