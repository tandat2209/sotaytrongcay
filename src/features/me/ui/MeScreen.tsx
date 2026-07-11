import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";

export function MeScreen() {
  return (
    <Screen
      introduction="Quản lý tùy chọn ứng dụng và dữ liệu của bạn."
      title="Tôi"
    >
      <EmptyState
        description="Các tùy chọn thông báo, sao lưu và xuất dữ liệu sẽ được thêm khi sẵn sàng."
        title="Chưa có tùy chọn"
      />
    </Screen>
  );
}
