import { useState } from "react";
import type {
  UserFertilizer,
  UserFertilizerFields,
} from "@/features/fertilizers";
import type { UserFertilizerUsage } from "../models/suggested-fertilizer-application";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { CompactFertilizerCreator } from "./CompactFertilizerCreator";
import { FertilizerCatalogList } from "./FertilizerCatalogList";

type Props = Readonly<{
  failed: boolean;
  fertilizers: readonly UserFertilizer[];
  loading: boolean;
  onCreate: (fields: UserFertilizerFields) => Promise<void>;
  onDismiss: () => void;
  onRetry: () => void;
  onSelect: (fertilizer: UserFertilizer) => void;
  selectedIds: readonly string[];
  usages: Readonly<Record<string, UserFertilizerUsage>>;
  visible: boolean;
}>;

export function FertilizerSelectionSheet(props: Props) {
  const [creating, setCreating] = useState(false);

  function dismiss() {
    setCreating(false);
    props.onDismiss();
  }

  function select(fertilizer: UserFertilizer) {
    props.onSelect(fertilizer);
    dismiss();
  }

  return (
    <BottomSheet
      onDismiss={dismiss}
      title={t("journal.fertilizing.selectTitle")}
      visible={props.visible}
    >
      {creating ? (
        <CompactFertilizerCreator
          onCancel={() => setCreating(false)}
          onCreate={props.onCreate}
          onCreated={dismiss}
        />
      ) : (
        <FertilizerCatalogList
          failed={props.failed}
          fertilizers={props.fertilizers}
          loading={props.loading}
          onAdd={() => setCreating(true)}
          onRetry={props.onRetry}
          onSelect={select}
          selectedIds={props.selectedIds}
          usages={props.usages}
        />
      )}
    </BottomSheet>
  );
}
