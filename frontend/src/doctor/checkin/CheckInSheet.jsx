import BottomSheet from "../common/BottomSheet";
import Info from "../common/Info";

const getPatientName = (appointment) =>
  appointment?.familyMember?.fullName ||
  appointment?.patient?.fullName ||
  appointment?.patientName ||
  "Patient";

export default function CheckInSheet({
  appointment,
  data,
  onClose,
  onStartConsultation,
}) {
  if (!appointment) return null;

  return (
    <BottomSheet
      title="Patient Check-In"
      subtitle={getPatientName(appointment)}
      onClose={onClose}
    >
      {!data ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700">
            Patient hasn't completed check-in yet.
          </p>

          <p className="mt-2 text-xs text-amber-600">
            The consultation can still be started if required.
          </p>

          <button
            onClick={() => onStartConsultation?.(appointment)}
            className="mt-4 w-full rounded-2xl bg-cyan-600 py-3 font-black text-white"
          >
            Start Consultation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <Info
            label="Chief Complaint"
            value={data.chiefComplaint || "-"}
          />

          <Info
            label="Symptoms"
            value={data.symptoms || "-"}
          />

          <Info
            label="Duration"
            value={data.duration || "-"}
          />

          <Info
            label="Temperature"
            value={data.temperature || "-"}
          />

          <Info
            label="Blood Pressure"
            value={data.bloodPressure || "-"}
          />

          <Info
            label="Pulse"
            value={data.pulse || "-"}
          />

          <Info
            label="Weight"
            value={data.weight || "-"}
          />

          <Info
            label="Height"
            value={data.height || "-"}
          />

          <Info
            label="Allergies"
            value={data.allergies || "-"}
          />

          <Info
            label="Current Medicines"
            value={data.currentMedicines || "-"}
          />

          <Info
            label="Additional Notes"
            value={data.notes || "-"}
          />

          <button
            onClick={() => onStartConsultation?.(appointment)}
            className="mt-2 w-full rounded-2xl bg-cyan-600 py-3 font-black text-white"
          >
            Continue Consultation
          </button>
        </div>
      )}
    </BottomSheet>
  );
}