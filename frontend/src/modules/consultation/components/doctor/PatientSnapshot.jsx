
import {
  AlertTriangle,
  ChevronDown,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function PatientSnapshot({ patient, appointment, open, onToggle }) {
  

  const patientMeta = [
    patient?.gender,
    patient?.age ? `${patient.age}Y` : null,
    patient?.bloodGroup,
  ]
    .filter(Boolean)
    .join(" • ");

  const allergies = patient?.allergies || patient?.allergy || "";
  const chronicDiseases =
    patient?.chronicDiseases || patient?.medicalHistory || "";
  const currentMedicines =
    patient?.currentMedicines || patient?.medications || "";

  return (
    <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 text-left"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
          <UserRound size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-black text-slate-950">
            {patient?.fullName || "Patient"}
          </h2>

          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
            {patientMeta || "Patient details"}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <ClinicalChip
              danger={Boolean(allergies)}
              label={allergies ? `Allergy: ${allergies}` : "No Allergies"}
            />

            <ClinicalChip
              warning={Boolean(chronicDiseases)}
              label={chronicDiseases ? chronicDiseases : "No Chronic Disease"}
            />
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`mt-1 shrink-0 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Info icon={Phone} label="Mobile" value={patient?.mobile} />
            <Info icon={MapPin} label="City" value={patient?.city} />
            <Info
              icon={HeartPulse}
              label="Blood Group"
              value={patient?.bloodGroup}
            />
            <Info
              icon={ShieldCheck}
              label="Appointment"
              value={`${appointment?.slot?.date || "-"} • ${
                appointment?.slot?.startTime || "-"
              }`}
            />
          </div>

          <AlertBlock
            title="Allergies"
            value={allergies || "No known allergies"}
            danger={Boolean(allergies)}
          />

          <AlertBlock
            title="Current Medicines"
            value={currentMedicines || "No current medicines recorded"}
            warning={Boolean(currentMedicines)}
          />

          <AlertBlock
            title="Chronic Diseases"
            value={chronicDiseases || "No chronic disease recorded"}
            warning={Boolean(chronicDiseases)}
          />

          {patient?.email && (
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase text-slate-500">
                Email
              </p>
              <p className="mt-1 truncate text-sm font-bold text-slate-900">
                {patient.email}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ClinicalChip({ label, danger, warning }) {
  const style = danger
    ? "bg-red-50 text-red-700"
    : warning
    ? "bg-amber-50 text-amber-700"
    : "bg-emerald-50 text-emerald-700";

  const Icon = danger || warning ? AlertTriangle : ShieldCheck;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${style}`}
    >
      <Icon size={12} className="shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <Icon size={15} className="text-cyan-600" />

      <p className="mt-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function AlertBlock({ title, value, danger, warning }) {
  const style = danger
    ? "border-red-100 bg-red-50 text-red-700"
    : warning
    ? "border-amber-100 bg-amber-50 text-amber-700"
    : "border-emerald-100 bg-emerald-50 text-emerald-700";

  return (
    <div className={`rounded-2xl border p-3 ${style}`}>
      <p className="text-[10px] font-black uppercase">{title}</p>
      <p className="mt-1 whitespace-pre-line text-sm font-bold">{value}</p>
    </div>
  );
}