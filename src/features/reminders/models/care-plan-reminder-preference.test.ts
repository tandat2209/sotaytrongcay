import {
  CarePlanReminderPreferenceSchema,
  deriveDueReminder,
  deriveNotificationPair,
  getEffectiveIntervalDays,
} from "./care-plan-reminder-preference";

const preference = CarePlanReminderPreferenceSchema.parse({
  id: "11111111-1111-4111-8111-111111111111",
  mutationId: "22222222-2222-4222-8222-222222222222",
  plantId: "33333333-3333-4333-8333-333333333333",
  carePlanId: "care-plan.grape.trunk-development.watering.general",
  carePlanVersion: "1.0.0",
  activityType: "watering",
  recommendedIntervalDays: 3,
  customIntervalDays: null,
  notificationTime: "08:15",
  notificationEnabled: true,
  pausedAt: null,
  isApplicable: true,
  mainNotificationId: null,
  followUpNotificationId: null,
  createdAt: "2026-07-14T00:00:00.000Z",
  updatedAt: "2026-07-14T00:00:00.000Z",
});

describe("Care Plan reminder preferences", () => {
  it("uses the Care Plan interval until the user customizes it", () => {
    expect(getEffectiveIntervalDays(preference)).toBe(3);
    expect(
      getEffectiveIntervalDays({ ...preference, customIntervalDays: 5 }),
    ).toBe(5);
  });

  it("derives due and overdue state from matching saved care", () => {
    expect(
      deriveDueReminder({
        evaluatedAt: new Date(2026, 6, 17, 7),
        latestActivityAt: "2026-07-14T10:00:00.000Z",
        onMissingHistory: "suggest",
        preference,
      }),
    ).toMatchObject({ dueOn: "2026-07-17", status: "due" });

    expect(
      deriveDueReminder({
        evaluatedAt: new Date(2026, 6, 18, 7),
        latestActivityAt: "2026-07-14T10:00:00.000Z",
        onMissingHistory: "suggest",
        preference,
      }),
    ).toMatchObject({ dueOn: "2026-07-17", status: "overdue" });
  });

  it("uses reviewed missing-history behavior without inventing a care date", () => {
    expect(
      deriveDueReminder({
        evaluatedAt: new Date(2026, 6, 17, 7),
        latestActivityAt: null,
        onMissingHistory: "suggest",
        preference,
      }),
    ).toMatchObject({ dueOn: "2026-07-17", status: "due" });
    expect(
      deriveDueReminder({
        evaluatedAt: new Date(2026, 6, 17, 7),
        latestActivityAt: null,
        onMissingHistory: "withhold",
        preference,
      }),
    ).toBeNull();
  });

  it("hides paused and inapplicable reminders without disabling active in-app reminders", () => {
    const input = {
      evaluatedAt: new Date(2026, 6, 17, 7),
      latestActivityAt: null,
      onMissingHistory: "suggest" as const,
    };

    expect(
      deriveDueReminder({
        ...input,
        preference: { ...preference, notificationEnabled: false },
      }),
    ).not.toBeNull();
    expect(
      deriveDueReminder({
        ...input,
        preference: { ...preference, pausedAt: "2026-07-16T00:00:00.000Z" },
      }),
    ).toBeNull();
    expect(
      deriveDueReminder({
        ...input,
        preference: { ...preference, isApplicable: false },
      }),
    ).toBeNull();
  });

  it("derives one main and one next-day follow-up notification", () => {
    const pair = deriveNotificationPair("2026-07-17", "08:15");

    expect(pair.main).toEqual(new Date(2026, 6, 17, 8, 15));
    expect(pair.followUp).toEqual(new Date(2026, 6, 18, 8, 15));
  });

  it("rejects invalid frequencies and notification times", () => {
    expect(() =>
      CarePlanReminderPreferenceSchema.parse({
        ...preference,
        recommendedIntervalDays: 0,
      }),
    ).toThrow();
    expect(() =>
      CarePlanReminderPreferenceSchema.parse({
        ...preference,
        notificationTime: "25:00",
      }),
    ).toThrow();
  });
});
