import WaitingRoomCard from "../waiting/WaitingRoomCard";
import QueueRow from "./QueueRow";

export default function QueueGroup({
  title,
  tone,
  items,
  empty,
  onCheckIn,
  onReview,
  onViewPrescription,
  onFollowUp,
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "violet"
      ? "bg-violet-50 text-violet-700"
      : tone === "red"
      ? "bg-red-50 text-red-700"
      : tone === "blue"
      ? "bg-blue-50 text-blue-700"
      : tone === "cyan"
      ? "bg-cyan-50 text-cyan-700"
      : "bg-slate-100 text-slate-700";

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-950">{title}</h3>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${toneClass}`}
        >
          {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500">
            {empty}
          </p>
        ) : (
          items.map((appointment) =>
            title === "Waiting Room" || title === "Ready to Consult" ? (
              <WaitingRoomCard
                key={appointment.id}
                appointment={appointment}
                checkInData={null}
                onReview={onReview}
              />
            ) : (
              <QueueRow
                key={appointment.id}
                appointment={appointment}
                onCheckIn={onCheckIn}
                onViewPrescription={onViewPrescription}
                onFollowUp={onFollowUp}
              />
            )
          )
        )}
      </div>
    </section>
  );
}