import { useEffect, useMemo, useState } from "react";

export default function WaitingTimer({ appointment }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const minutes = useMemo(() => {
    const date = appointment?.slot?.date;
    const time = appointment?.slot?.startTime;

    if (!date || !time) return 0;

    const start = new Date(`${date}T${time}`);
    const now = new Date();

    return Math.max(0, Math.floor((now - start) / 60000));
  }, [appointment]);

  const tone =
    minutes >= 20
      ? "bg-red-50 text-red-700"
      : minutes >= 10
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${tone}`}>
      Waiting {minutes} min
    </span>
  );
}