import {
  TryDocButton,
  TryDocCard,
  TryDocChip,
  TryDocInput,
  TryDocSectionHeader,
} from "../../../../shared/ui";

import { VACATION_REASONS } from "./VacationData";
import { getVacationDays } from "./VacationHelpers";

export default function VacationForm({
  form,
  setForm,
  saving,
  onSubmit,
}) {
  return (
    <TryDocCard className="mt-3">
      <TryDocSectionHeader
        title="Add Time Off"
        subtitle="Choose dates and reason"
      />

      <div className="grid grid-cols-2 gap-2">
        <TryDocInput
          label="Start"
          type="date"
          value={form.startDate}
          onChange={(e) =>
            setForm({
              ...form,
              startDate: e.target.value,
              endDate:
                form.endDate && e.target.value > form.endDate
                  ? e.target.value
                  : form.endDate,
            })
          }
        />

        <TryDocInput
          label="End"
          type="date"
          value={form.endDate}
          onChange={(e) =>
            setForm({
              ...form,
              endDate: e.target.value,
            })
          }
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {VACATION_REASONS.map((item) => {
          const Icon = item.icon;
          const active = form.reason === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  reason: item.value,
                })
              }
              className={`rounded-2xl border px-2 py-3 text-center active:scale-95 ${
                active
                  ? "border-cyan-600 bg-cyan-600 text-white"
                  : "border-slate-100 bg-slate-50 text-slate-700"
              }`}
            >
              <Icon size={18} className="mx-auto" />

              <p className="mt-1 truncate text-[10px] font-black">
                {item.label}
              </p>
            </button>
          );
        })}
      </div>

      <TryDocButton
        fullWidth
        loading={saving}
        onClick={onSubmit}
        className="mt-3"
      >
        Save Time Off
      </TryDocButton>

      {form.startDate && form.endDate && (
        <div className="mt-2 flex justify-center">
          <TryDocChip selected color="cyan">
            {getVacationDays(form.startDate, form.endDate)} day time off •{" "}
            {form.reason}
          </TryDocChip>
        </div>
      )}
    </TryDocCard>
  );
}