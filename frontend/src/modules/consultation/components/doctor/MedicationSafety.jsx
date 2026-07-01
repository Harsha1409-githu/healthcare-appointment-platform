import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function MedicationSafety({ alerts = [] }) {
  if (!alerts.length) {
    return (
      <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-emerald-700">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          <p className="text-xs font-black">No safety alerts found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {alerts.map((alert, index) => {
        const styleMap = {
  high: "border-red-100 bg-red-50 text-red-700",
  danger: "border-red-100 bg-red-50 text-red-700",
  medium: "border-amber-100 bg-amber-50 text-amber-700",
  low: "border-blue-100 bg-blue-50 text-blue-700",
};

const style =
  styleMap[alert.severity] ||
  "border-slate-100 bg-slate-50 text-slate-700";

        return (
          <div key={index} className={`rounded-2xl border p-3 ${style}`}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />

              <div>
                <p className="text-xs font-black">{alert.title}</p>
                <p className="mt-1 text-xs font-semibold">{alert.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}