import { Pressable, StyleSheet } from "react-native";
import type { UserFertilizer } from "../models/user-fertilizer";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";
import {
  UserFertilizerForm,
  type UserFertilizerFields,
  useUserFertilizerForm,
} from "./UserFertilizerForm";

export type { UserFertilizerFields } from "./UserFertilizerForm";

type Props = Readonly<{
  fertilizer?: UserFertilizer;
  onBack: () => void;
  onDelete?: () => Promise<void>;
  onSave: (fields: UserFertilizerFields) => Promise<void>;
}>;

export function UserFertilizerEditorScreen({
  fertilizer,
  onBack,
  onDelete,
  onSave,
}: Props) {
  const form = useUserFertilizerForm(onSave, fertilizer);

  return (
    <Screen
      footer={
        <PrimaryButton
          label={t("fertilizers.editor.save")}
          loading={form.saving}
          onPress={() => void form.submit()}
        />
      }
      title=""
    >
      <TopBar
        onBack={onBack}
        title={
          fertilizer
            ? t("fertilizers.editor.editTitle")
            : t("fertilizers.editor.addTitle")
        }
      />
      <UserFertilizerForm form={form} />
      {onDelete ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => void onDelete()}
          style={styles.delete}
        >
          <Typography color="error" variant="bodyLarge">
            {t("fertilizers.editor.delete")}
          </Typography>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  delete: { alignItems: "center", minHeight: 48, padding: spacing.md },
});
