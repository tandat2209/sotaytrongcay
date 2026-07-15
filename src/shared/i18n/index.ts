import { vi } from "./vi";

export const appLocale = "vi-VN";
export const datePickerLocale = appLocale;

type MessageKey = keyof typeof vi;
type ParameterName<Key extends MessageKey> = (typeof vi)[Key][1][number];
type StaticMessageKey = {
  [Key in MessageKey]: ParameterName<Key> extends never ? Key : never;
}[MessageKey];
type ParameterizedMessageKey = Exclude<MessageKey, StaticMessageKey>;
type MessageParameters<Key extends ParameterizedMessageKey> = Readonly<{
  [Name in ParameterName<Key>]: string | number;
}>;

export function t<Key extends StaticMessageKey>(key: Key): string;
export function t<Key extends ParameterizedMessageKey>(
  key: Key,
  parameters: MessageParameters<Key>,
): string;
export function t(
  key: MessageKey,
  parameters: Readonly<Record<string, string | number>> = {},
): string {
  const template = vi[key][0];
  return template.replaceAll(/\{([a-zA-Z]+)\}/g, (_, name: string) => {
    const value = parameters[name];
    if (value === undefined)
      throw new Error(`Missing translation parameter: ${name}`);
    return String(value);
  });
}

export function formatDate(value: Date): string {
  return new Intl.DateTimeFormat(appLocale).format(value);
}

export function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat(appLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatTime(value: Date): string {
  return new Intl.DateTimeFormat(appLocale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function formatTodayDate(value: Date): string {
  return new Intl.DateTimeFormat(appLocale, {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(appLocale).format(value);
}
