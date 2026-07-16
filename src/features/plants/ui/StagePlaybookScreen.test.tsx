import { fireEvent, render } from "@testing-library/react-native";
import {
  getCarePlansForStage,
  listInformationalGuidesForStage,
  getNextStagePlaybook,
  getStagePlaybook,
  type CareGuide,
  type StagePlaybook,
} from "@/features/knowledge/preview-knowledge";
import { StagePlaybookScreen } from "./StagePlaybookScreen";

const STAGE_ID = "grape.stage.trunk-development";
const playbook = getStagePlaybook(STAGE_ID) as StagePlaybook;
const informationalGuides: readonly CareGuide[] = [];
const carePlans = getCarePlansForStage(STAGE_ID);
const nextStage = getNextStagePlaybook(STAGE_ID) as StagePlaybook;

describe("StagePlaybookScreen", () => {
  it("renders the screen title and stage title in hero", () => {
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={informationalGuides}
        carePlans={[]}
        nextStage={null}
        onBack={jest.fn()}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("Hướng dẫn chi tiết")).toBeTruthy();
    expect(screen.getByText("Phát triển thân")).toBeTruthy();
    // Does NOT show any plant-specific data
    expect(screen.queryByText("CÂY TRỒNG CỦA TÔI")).toBeNull();
    expect(screen.queryByText("Nho sân thượng")).toBeNull();
  });

  it("renders the playbook objective and review badge", () => {
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={informationalGuides}
        carePlans={[]}
        nextStage={null}
        onBack={jest.fn()}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("MỤC TIÊU GIAI ĐOẠN")).toBeTruthy();
    expect(screen.getByText(/Tạo ra một thân chính khỏe mạnh/)).toBeTruthy();
    expect(screen.getByText("NỘI DUNG CHỜ DUYỆT")).toBeTruthy();
  });

  it("renders informational guides when present", () => {
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={listInformationalGuidesForStage(STAGE_ID)}
        carePlans={[]}
        nextStage={null}
        onBack={jest.fn()}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("Hướng dẫn tham khảo")).toBeTruthy();
    expect(screen.getByText("Định hướng thân chính")).toBeTruthy();
  });

  it("omits informational guide section when absent", () => {
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={informationalGuides}
        carePlans={[]}
        nextStage={null}
        onBack={jest.fn()}
        playbook={playbook}
      />,
    );

    expect(screen.queryByText("Hướng dẫn tham khảo")).toBeNull();
  });

  it("renders care plans when present", () => {
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={informationalGuides}
        carePlans={carePlans}
        nextStage={null}
        onBack={jest.fn()}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("Lưu ý chăm sóc")).toBeTruthy();
    expect(screen.getByText("Kiểm tra đất trước khi tưới")).toBeTruthy();
  });

  it("renders exit criteria in the Tiêu chí hoàn thành section", () => {
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={informationalGuides}
        carePlans={[]}
        nextStage={null}
        onBack={jest.fn()}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("TIÊU CHÍ HOÀN THÀNH GIAI ĐOẠN")).toBeTruthy();
    expect(screen.getByText("Thân chính chạm dây kẽm mặt giàn")).toBeTruthy();
  });

  it("renders the Sắp tới card and calls onOpenNextStage when tapped", () => {
    const onOpenNextStage = jest.fn();
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={informationalGuides}
        carePlans={[]}
        nextStage={nextStage}
        onBack={jest.fn()}
        onOpenNextStage={onOpenNextStage}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("SẮP TỚI")).toBeTruthy();
    expect(screen.getByText(/Giai đoạn: Leo giàn/)).toBeTruthy();
    fireEvent.press(
      screen.getByRole("button", { name: /Xem giai đoạn tiếp theo/ }),
    );
    expect(onOpenNextStage).toHaveBeenCalledTimes(1);
  });

  it("omits the Sắp tới card when nextStage is null", () => {
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={informationalGuides}
        carePlans={[]}
        nextStage={null}
        onBack={jest.fn()}
        playbook={playbook}
      />,
    );

    expect(screen.queryByText("SẮP TỚI")).toBeNull();
  });

  it("calls onBack when the back button is pressed", () => {
    const onBack = jest.fn();
    const screen = render(
      <StagePlaybookScreen
        informationalGuides={informationalGuides}
        carePlans={[]}
        nextStage={null}
        onBack={onBack}
        playbook={playbook}
      />,
    );

    fireEvent.press(
      screen.getByRole("button", { name: "Quay lại chi tiết cây" }),
    );
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
