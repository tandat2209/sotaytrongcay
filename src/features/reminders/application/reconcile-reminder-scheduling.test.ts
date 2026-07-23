import { findLatestCareActivity, listCareActivities } from "@/features/journal";
import { listCarePlans, type CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import {
  getNotificationState,
  listPlantScheduleSnapshots,
  listStageScheduleSnapshots,
  saveNotificationState,
} from "../data/schedule-snapshot-repository";
import {
  cancelReminderNotificationPair,
  scheduleReminderNotificationPair,
} from "../notifications/reminder-notification";
import { reconcilePlantCarePlanReminders } from "./reconcile-reminders";

jest.mock("@/features/journal", () => ({
  findLatestCareActivity: jest.fn(),
  listCareActivities: jest.fn(),
}));
jest.mock("@/features/knowledge", () => ({
  listCarePlans: jest.fn(),
}));
jest.mock("@/features/plants", () => ({
  listPlants: jest.fn(),
}));
jest.mock("../data/schedule-snapshot-repository", () => ({
  getNotificationState: jest.fn(),
  listNotificationStates: jest.fn(),
  listPlantScheduleSnapshots: jest.fn(),
  listStageScheduleSnapshots: jest.fn(),
  saveNotificationState: jest.fn(),
  savePlantScheduleSnapshot: jest.fn(),
}));
jest.mock("../notifications/reminder-notification", () => ({
  cancelReminderNotificationPair: jest.fn(),
  scheduleReminderNotificationPair: jest.fn(),
}));

const plant: Plant = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.bud-break",
  growingMethod: "container",
  location: null,
  plantedAt: null,
  stageStartedAt: null,
  createdAt: "2026-07-14T00:00:00.000Z",
};

const plan: CarePlan = {
  id: "grape.recommendation.bud-break.watering",
  title: "Tưới nước",
  goal: "Giữ ẩm đều.",
  bodyMarkdown: "",
  priority: 1,
  activityType: "watering",
  eligibility: { kind: "elapsed_days_since_activity", suggestAfterDays: 7 },
  onMissingHistory: "suggest",
  frequency: {
    ground: { display: "Mỗi 7 ngày", intervalDays: 7 },
    container: { display: "Mỗi 7 ngày", intervalDays: 7 },
  },
  version: "1.0.0",
};

describe("reconcilePlantCarePlanReminders notification scheduling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2026-07-23T09:00:00.000Z"));
    jest.mocked(listCareActivities).mockResolvedValue([]);
    jest.mocked(findLatestCareActivity).mockReturnValue({
      id: "22222222-2222-4222-8222-222222222222",
      mutationId: "33333333-3333-4333-8333-333333333333",
      plantId: plant.id,
      type: "watering",
      origin: "manual",
      occurredAt: "2026-07-23T07:00:00.000Z",
      intensity: "moderate",
      estimatedAmountLiters: null,
      notes: null,
      createdAt: "2026-07-23T07:00:00.000Z",
    });
    jest.mocked(listCarePlans).mockReturnValue([plan]);
    jest.mocked(listPlantScheduleSnapshots).mockResolvedValue([
      {
        id: "44444444-4444-4444-8444-444444444444",
        mutationId: "55555555-5555-4555-8555-555555555555",
        plantId: plant.id,
        carePlanId: plan.id,
        intervalDays: 7,
        notificationEnabled: true,
        notificationTime: "08:00",
        isActive: true,
        createdAt: "2026-07-14T00:00:00.000Z",
        updatedAt: "2026-07-14T00:00:00.000Z",
      },
    ]);
    jest.mocked(listStageScheduleSnapshots).mockResolvedValue([]);
    jest.mocked(getNotificationState).mockResolvedValue(null);
    jest.mocked(cancelReminderNotificationPair).mockResolvedValue();
    jest.mocked(scheduleReminderNotificationPair).mockResolvedValue({
      mainNotificationId: "main",
      followUpNotificationId: "follow-up",
    });
    jest.mocked(saveNotificationState).mockResolvedValue();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("registers an enabled reminder before its due date", async () => {
    await reconcilePlantCarePlanReminders(plant);

    expect(scheduleReminderNotificationPair).toHaveBeenCalledWith(
      expect.objectContaining({
        dueOn: "2026-07-30",
        notificationEnabled: true,
        notificationTime: "08:00",
      }),
    );
  });
});
