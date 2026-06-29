import { AlertTriangle } from "lucide-react";

import TryDocBottomSheet from "./TryDocBottomSheet";
import TryDocButton from "../buttons/TryDocButton";

export default function TryDocConfirmDialog({
  open,
  title = "Are you sure?",
  description = "Please confirm this action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <TryDocBottomSheet
      open={open}
      title={title}
      subtitle={description}
      onClose={onCancel}
      footer={
        <div className="grid grid-cols-2 gap-2">
          <TryDocButton
            variant="secondary"
            fullWidth
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </TryDocButton>

          <TryDocButton
            variant={variant}
            fullWidth
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </TryDocButton>
        </div>
      }
    >
      <div className="rounded-2xl bg-red-50 p-4 text-center">
        <AlertTriangle className="mx-auto text-red-600" size={34} />

        <p className="mt-2 text-sm font-bold text-red-700">
          This action may affect existing records.
        </p>
      </div>
    </TryDocBottomSheet>
  );
}