#!/usr/bin/env bash

set -euo pipefail

APK_PATH="${1:-}"
ADB="${ADB:-adb}"
PACKAGE="vn.sotaytrongcay.app"
DEEPLINK="sotaytrongcay://database-smoke"
RESULT_PATH="/sdcard/database-smoke-window.xml"

if [[ -z "$APK_PATH" || ! -f "$APK_PATH" ]]; then
  echo "Usage: pnpm android:db-smoke -- /absolute/path/to/database-smoke.apk"
  exit 2
fi

if ! command -v "$ADB" >/dev/null 2>&1; then
  echo "adb is required and was not found."
  exit 2
fi

if [[ "$("$ADB" get-state 2>/dev/null || true)" != "device" ]]; then
  echo "Connect exactly one ready Android device or emulator before running."
  exit 2
fi

echo "WARNING: this removes $PACKAGE and all of its local data from the connected device."
read -r -p "Type WIPE to continue: " confirmation
if [[ "$confirmation" != "WIPE" ]]; then
  echo "Cancelled."
  exit 2
fi

installed_path="$("$ADB" shell pm path "$PACKAGE" 2>/dev/null || true)"
if [[ "$installed_path" == package:* ]]; then
  "$ADB" uninstall "$PACKAGE" >/dev/null
fi
"$ADB" install "$APK_PATH" >/dev/null
"$ADB" shell rm -f "$RESULT_PATH"
"$ADB" shell am start -W \
  -a android.intent.action.VIEW \
  -d "$DEEPLINK" \
  -p "$PACKAGE" >/dev/null

for _attempt in {1..30}; do
  "$ADB" shell uiautomator dump "$RESULT_PATH" >/dev/null 2>&1 || true
  screen="$("$ADB" exec-out cat "$RESULT_PATH" 2>/dev/null || true)"
  if [[ "$screen" == *"DATABASE_SMOKE_CHECK_PASS"* ]]; then
    echo "PASS: Android fresh-install SQLite V1, WAL, foreign keys, CRUD, and cascade delete."
    exit 0
  fi
  if [[ "$screen" == *"DATABASE_SMOKE_CHECK_FAIL"* ]]; then
    echo "FAIL: the on-device database smoke check reported an error."
    echo "$screen"
    exit 1
  fi
  sleep 1
done

echo "FAIL: timed out waiting for the on-device database smoke result."
exit 1
