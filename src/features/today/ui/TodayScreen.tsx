import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";

export function TodayScreen() {
  return (
    <Screen
      introduction="Theo dõi việc chăm sóc cần chú ý trong ngày."
      title="Hôm nay"
    >
      <EmptyState
        description="Khi có cây trồng và lịch chăm sóc, các việc cần chú ý sẽ xuất hiện ở đây."
        title="Chưa có việc cần làm"
      />
    </Screen>
  );
}
