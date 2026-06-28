export default function DiagnosisTemplatesCard({
  diagnosisTemplates,
  selectedDiagnosis,
  onApply,
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-black uppercase text-slate-500">
        Quick Diagnosis Templates
      </p>

      <div className="grid grid-cols-2 gap-2">
        {Object.keys(diagnosisTemplates).map((diagnosis) => (
          <button
            key={diagnosis}
            type="button"
            onClick={() => onApply(diagnosis)}
            className={`rounded-2xl px-3 py-2 text-left text-[11px] font-black active:scale-95 ${
              selectedDiagnosis === diagnosis
                ? "bg-cyan-600 text-white"
                : "bg-slate-50 text-slate-700"
            }`}
          >
            + {diagnosis}
          </button>
        ))}
      </div>
    </div>
  );
}