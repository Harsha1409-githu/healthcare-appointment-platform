import BottomSheet from "../common/BottomSheet";
import Info from "../common/Info";

const getPatientName = (appointment) =>
  appointment?.familyMember?.fullName ||
  appointment?.patient?.fullName ||
  appointment?.patientName ||
  "Patient";

export default function CheckInSheet({ appointment, data, onClose }) {
  return (
    <BottomSheet
      title={`${getPatientName(appointment)} Check-In`}
      subtitle="Vitals and symptoms"
      onClose={onClose}
    >
      {!data ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-semibold text-slate-500">
          No check-in available yet. For video bookings, this acts as the
          waiting-room status until the patient submits check-in.
        </p>
      ) : (
        <div className="space-y-3">
          <Info label="Temperature" value={data.temperature} />
          <Info label="Blood Pressure" value={data.bloodPressure} />
          <Info label="Weight" value={data.weight} />

          <div>
            <p className="text-xs font-black text-slate-500">Symptoms</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {data?.symptoms
                ?.split(",")
                ?.filter(Boolean)
                ?.map((symptom) => (
                  <span
                    key={symptom}
                    className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700"
                  >
                    {symptom.trim()}
                  </span>
                ))}
            </div>
          </div>

          <Info label="Notes" value={data.notes} />
        </div>
      )}
    </BottomSheet>
  );
}