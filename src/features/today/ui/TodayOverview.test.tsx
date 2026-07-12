import { fireEvent, render } from "@testing-library/react-native";
import { TodayOverview, WeatherCard } from "./TodayOverview";

const plant = { id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1", name: "Nho sân thượng", speciesId: "plant.grape", stageId: "grape.stage.trunk-development", plantedAt: null, createdAt: "2026-07-11T08:00:00.000Z" };
const callbacks = { onAddPlant: jest.fn(), onOpenActivity: jest.fn(), onOpenPlant: jest.fn() };

const observation = { freshnessLabel: "Cập nhật 10 phút trước", locationLabel: "Quận 7", observedAt: "2026-07-12T08:00:00.000Z", source: "Nhà cung cấp thời tiết", summary: "Có mây", metrics: { humidityPercent: 72, rainChancePercent: 30, temperatureCelsius: 29 } };

describe("TodayOverview", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows the first-plant empty state with a working add action", () => {
    const screen = render(<TodayOverview {...callbacks} projection={{ plants: [], recentActivities: [], weather: { status: "unavailable", reason: "not-configured" } }} />);
    fireEvent.press(screen.getByRole("button", { name: "Thêm cây" }));
    expect(callbacks.onAddPlant).toHaveBeenCalledTimes(1);
  });

  it("shows date, greeting, plant navigation, and no recent activity", () => {
    const screen = render(<TodayOverview {...callbacks} date={new Date("2026-07-12T08:00:00")} projection={{ plants: [plant], recentActivities: [], weather: { status: "unavailable", reason: "not-configured" } }} />);
    expect(screen.getByText("Chào buổi sáng")).toBeTruthy();
    expect(screen.getByText(/12 tháng 7/)).toBeTruthy();
    expect(screen.getByText("Chưa có hoạt động chăm sóc nào được lưu.")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Mở cây Nho sân thượng" }));
    expect(callbacks.onOpenPlant).toHaveBeenCalledWith(plant.id);
  });

  it("opens recent activity with a deleted-plant fallback label", () => {
    const activity = { id: "b775a7ec-fb44-4660-88ed-0f3b1933e7f1", mutationId: "c775a7ec-fb44-4660-88ed-0f3b1933e7f1", plantId: "d775a7ec-fb44-4660-88ed-0f3b1933e7f1", plantName: "Cây trồng", type: "watering" as const, occurredAt: "2026-07-12T10:00:00.000Z", origin: "manual" as const, amount: null, notes: null, createdAt: "2026-07-12T10:00:00.000Z" };
    const screen = render(<TodayOverview {...callbacks} projection={{ plants: [plant], recentActivities: [activity], weather: { status: "unavailable", reason: "not-configured" } }} />);
    fireEvent.press(screen.getByRole("button", { name: "Mở Tưới nước của Cây trồng" }));
    expect(callbacks.onOpenActivity).toHaveBeenCalledWith(activity.id);
  });

  it("shows a truthful production unavailable state without care controls", () => {
    const screen = render(<TodayOverview {...callbacks} projection={{ plants: [plant], recentActivities: [], weather: { status: "unavailable", reason: "not-configured" } }} />);
    expect(screen.getByText("Thời tiết hiện chưa khả dụng")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /tưới/i })).toBeNull();
  });
});

describe.each([
  ["loading", { status: "loading" as const }, "Đang tải dữ liệu thời tiết…"],
  ["available", { status: "available" as const, ...observation }, "Nhà cung cấp thời tiết · Cập nhật 10 phút trước"],
  ["stale", { status: "stale" as const, ...observation, freshnessLabel: "Dữ liệu cũ" }, "Nhà cung cấp thời tiết · Dữ liệu cũ"],
  ["offline", { status: "offline" as const }, "Bạn đang ngoại tuyến. Chưa có dữ liệu thời tiết đã lưu."],
  ["unavailable", { status: "unavailable" as const, reason: "permission-denied" as const }, "Chưa được phép dùng vị trí để tải thời tiết."],
  ["error", { status: "error" as const }, "Chưa thể tải dữ liệu thời tiết. Các phần khác vẫn dùng được."],
])("WeatherCard %s state", (_name, weather, expected) => {
  it(`shows ${expected}`, () => {
    expect(render(<WeatherCard weather={weather} />).getByText(expected)).toBeTruthy();
  });
});
