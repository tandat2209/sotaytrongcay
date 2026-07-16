import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  UserFertilizerForm,
  useUserFertilizerForm,
  type UserFertilizer,
  type UserFertilizerFields,
} from "@/features/fertilizers";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  fertilizers: readonly UserFertilizer[];
  failed: boolean;
  loading: boolean;
  onCreate: (fields: CreateFertilizerFields) => Promise<void>;
  onDismiss: () => void;
  onRetry: () => void;
  onSelect: (fertilizer: UserFertilizer) => void;
  startInCreateMode: boolean;
  visible: boolean;
}>;

export type CreateFertilizerFields = UserFertilizerFields;

export function FertilizerPickerSheet({
  fertilizers,
  failed,
  loading,
  onCreate,
  onDismiss,
  onRetry,
  onSelect,
  startInCreateMode,
  visible,
}: Props) {
  const [adding, setAdding] = useState(startInCreateMode);
  const form = useUserFertilizerForm(onCreate);

  async function create() {
    if (await form.submit()) {
      form.reset();
      setAdding(false);
    }
  }
  return (
    <BottomSheet
      footer={
        adding ? (
          <PrimaryButton
            label={t("fertilizers.editor.save")}
            loading={form.saving}
            onPress={() => void create()}
          />
        ) : (
          <PrimaryButton
            label={t("fertilizers.management.add")}
            onPress={() => setAdding(true)}
          />
        )
      }
      onDismiss={onDismiss}
      title={t("journal.fertilizing.selectTitle")}
      visible={visible}
    >
      {adding ? (
        <UserFertilizerForm form={form} />
      ) : loading ? (
        <Typography color="textSecondary" variant="bodyLarge">
          {t("common.state.loadingDeviceData")}
        </Typography>
      ) : failed ? (
        <View style={styles.form}>
          <Typography
            accessibilityRole="alert"
            color="error"
            variant="bodyLarge"
          >
            {t("fertilizers.error.load")}
          </Typography>
          <PrimaryButton label={t("common.actions.retry")} onPress={onRetry} />
        </View>
      ) : fertilizers.length === 0 ? (
        <Typography color="textSecondary" variant="bodyLarge">
          {t("fertilizers.management.empty")}
        </Typography>
      ) : (
        <View style={styles.list}>
          {fertilizers.map((fertilizer) => (
            <Pressable
              accessibilityRole="button"
              key={fertilizer.id}
              onPress={() => onSelect(fertilizer)}
            >
              <SurfaceCard style={styles.item}>
                <Typography variant="bodyLarge">{fertilizer.name}</Typography>
              </SurfaceCard>
            </Pressable>
          ))}
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  item: { gap: spacing.xs, minHeight: 56 },
  list: { gap: spacing.sm },
});
