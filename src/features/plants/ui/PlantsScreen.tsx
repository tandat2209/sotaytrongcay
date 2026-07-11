import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";

export function PlantsScreen() {
  return (
    <Screen
      introduction="Quản lý cây trồng và xem lịch sử chăm sóc của từng cây."
      title="Cây trồng"
    >
      <EmptyState
        description="Cây bạn thêm sẽ được hiển thị tại đây cùng giai đoạn sinh trưởng."
        title="Chưa có cây trồng"
      />
    </Screen>
  );
}
