import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";

export function JournalScreen() {
  return (
    <Screen
      introduction="Xem lại các hoạt động chăm sóc trên tất cả cây trồng."
      title="Nhật ký"
    >
      <EmptyState
        description="Hoạt động tưới nước, bón phân và phun thuốc đã lưu sẽ xuất hiện ở đây."
        title="Chưa có hoạt động"
      />
    </Screen>
  );
}
