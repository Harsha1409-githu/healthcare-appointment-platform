import { CalendarDays } from "lucide-react";

import {
  TryDocCard,
  TryDocMetricCard,
  TryDocSectionHeader,
} from "@/shared/ui";

import { getVacationDays } from "./VacationHelpers";

export default function VacationSummaryCard({
  upcomingVacations,
  leaves,
}) {
  const totalDays = upcomingVacations.reduce(
    (sum, item) =>
      sum + getVacationDays(item.startDate, item.endDate),
    0
  );

  return (
    <TryDocCard>
      <TryDocSectionHeader
        title="Time Off Planner"
        subtitle="Blocks patient bookings during time off"
        action={
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <CalendarDays size={24} />
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-2">
        <TryDocMetricCard title="Upcoming" value={upcomingVacations.length} />
        <TryDocMetricCard title="Days" value={totalDays} />
        <TryDocMetricCard title="Total" value={leaves.length} />
      </div>
    </TryDocCard>
  );
}