import {
  TryDocBottomSheet,
  TryDocButton,
  TryDocInput,
  TryDocSelect,
} from "@/shared/ui";

const PAUSE_REASONS = [
  { label: "Lunch", value: "Lunch" },
  { label: "Meeting", value: "Meeting" },
  { label: "Emergency", value: "Emergency" },
  { label: "Personal", value: "Personal" },
];

export default function PauseCustomSheet({
  open,
  loading,
  pauseUntil,
  setPauseUntil,
  reason,
  setReason,
  onClose,
  onConfirm,
}) {
  return (
    <TryDocBottomSheet
      open={open}
      title="Pause Bookings"
      subtitle="Patients cannot book slots before this time."
      onClose={onClose}
      footer={
        <TryDocButton
          fullWidth
          variant="dark"
          loading={loading}
          disabled={!pauseUntil}
          onClick={onConfirm}
        >
          Pause Bookings
        </TryDocButton>
      }
    >
      <div className="space-y-3">
        <TryDocInput
          label="Pause Until"
          type="time"
          value={pauseUntil}
          onChange={(e) => setPauseUntil(e.target.value)}
          required
        />

        <TryDocSelect
          label="Reason Optional"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={PAUSE_REASONS}
        />
      </div>
    </TryDocBottomSheet>
  );
}