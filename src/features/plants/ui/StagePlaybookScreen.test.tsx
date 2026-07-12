import { fireEvent, render } from "@testing-library/react-native";
import {
  getCareGuideForStage,
  getCareRecommendationsForStage,
  getNextStagePlaybook,
  getStagePlaybook,
  type CareGuide,
  type CareRecommendation,
  type StagePlaybook,
} from "@/features/knowledge/preview-knowledge";
import { StagePlaybookScreen } from "./StagePlaybookScreen";

const plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  location: null,
  plantedAt: null,
  createdAt: "2026-07-11T08:00:00.000Z",
};

const playbook = getStagePlaybook(plant.stageId) as StagePlaybook;
const careGuide = getCareGuideForStage(plant.stageId) as CareGuide;
const careRecommendations = getCareRecommendationsForStage(plant.stageId);
const nextStage = getNextStagePlaybook(plant.stageId) as StagePlaybook;

describe("StagePlaybookScreen", () => {
  it("renders the screen title, plant name, and stage badge", () => {
    const screen = render(
      <StagePlaybookScreen
        careGuide={careGuide}
        careRecommendations={careRecommendations}
        nextStage={nextStage}
        onBack={jest.fn()}
        plant={plant}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("Hướng dẫn chi tiết")).toBeTruthy();
    expect(screen.getByText("Nho sân thượng")).toBeTruthy();
    expect(screen.getByText(/Giai đoạn: Phát triển thân/)).toBeTruthy();
  });

  it("renders the playbook objective and review badge", () => {
    const screen = render(
      <StagePlaybookScreen
        careGuide={null}
        careRecommendations={[]}
        nextStage={null}
        onBack={jest.fn()}
        plant={plant}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("MỤC TIÊU GIAI ĐOẠN")).toBeTruthy();
    expect(screen.getByText(/Tạo ra một thân chính khỏe mạnh/)).toBeTruthy();
    expect(screen.getByText("NỘI DUNG CHỜ DUYỆT")).toBeTruthy();
  });

  it("renders care guide in the Thao tác quan trọng section when present", () => {
    const screen = render(
      <StagePlaybookScreen
        careGuide={careGuide}
        careRecommendations={[]}
        nextStage={null}
        onBack={jest.fn()}
        plant={plant}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("Thao tác quan trọng")).toBeTruthy();
    expect(screen.getByText("Nên làm")).toBeTruthy();
    expect(screen.getByText("Định hướng thân chính")).toBeTruthy();
  });

  it("omits Thao tác quan trọng section when careGuide is null", () => {
    const screen = render(
      <StagePlaybookScreen
        careGuide={null}
        careRecommendations={[]}
        nextStage={null}
        onBack={jest.fn()}
        plant={plant}
        playbook={playbook}
      />,
    );

    expect(screen.queryByText("Thao tác quan trọng")).toBeNull();
  });

  it("renders care recommendations when present", () => {
    const screen = render(
      <StagePlaybookScreen
        careGuide={null}
        careRecommendations={careRecommendations}
        nextStage={null}
        onBack={jest.fn()}
        plant={plant}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("Lưu ý chăm sóc")).toBeTruthy();
    expect(screen.getByText("Kiểm tra đất trước khi tưới")).toBeTruthy();
  });

  it("renders recommended knowledge topics", () => {
    const screen = render(
      <StagePlaybookScreen
        careGuide={null}
        careRecommendations={[]}
        nextStage={null}
        onBack={jest.fn()}
        plant={plant}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("Nên tìm hiểu")).toBeTruthy();
    expect(screen.getByText("Cách cột dây không làm nghẹt thân")).toBeTruthy();
  });

  it("renders exit criteria in the Tiêu chí hoàn thành section", () => {
    const screen = render(
      <StagePlaybookScreen
        careGuide={null}
        careRecommendations={[]}
        nextStage={null}
        onBack={jest.fn()}
        plant={plant}
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
        careGuide={null}
        careRecommendations={[]}
        nextStage={nextStage}
        onBack={jest.fn()}
        onOpenNextStage={onOpenNextStage}
        plant={plant}
        playbook={playbook}
      />,
    );

    expect(screen.getByText("SẮP TỚI")).toBeTruthy();
    expect(screen.getByText(/Giai đoạn: Leo giàn/)).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: /Xem giai đoạn tiếp theo/ }));
    expect(onOpenNextStage).toHaveBeenCalledTimes(1);
  });

  it("omits the Sắp tới card when nextStage is null", () => {
    const screen = render(
      <StagePlaybookScreen
        careGuide={null}
        careRecommendations={[]}
        nextStage={null}
        onBack={jest.fn()}
        plant={plant}
        playbook={playbook}
      />,
    );

    expect(screen.queryByText("SẮP TỚI")).toBeNull();
  });

  it("calls onBack when the back button is pressed", () => {
    const onBack = jest.fn();
    const screen = render(
      <StagePlaybookScreen
        careGuide={null}
        careRecommendations={[]}
        nextStage={null}
        onBack={onBack}
        plant={plant}
        playbook={playbook}
      />,
    );

    fireEvent.press(screen.getByRole("button", { name: "Quay lại chi tiết cây" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
