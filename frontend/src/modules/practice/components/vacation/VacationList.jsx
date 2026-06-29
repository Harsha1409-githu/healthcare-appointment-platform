import { CalendarDays, Trash2 } from "lucide-react";

import {
  TryDocActionCard,
  TryDocButton,
  TryDocCard,
  TryDocEmptyState,
  TryDocLoading,
  TryDocSectionHeader,
} from "@/shared/ui";

import {
  formatVacationDate,
  getVacationDays,
} from "./VacationHelpers";

export default function VacationList({
  loading,
  upcomingVacations,
  onDelete,
}) {
  return (
    <TryDocCard className="mt-3">
      <TryDocSectionHeader
        title="Upcoming Time Off"
        subtitle={`${upcomingVacations.length} active blocks`}
      />

      {loading ? (
        <TryDocLoading
          title="Loading vacations"
          description="Fetching your upcoming time off..."
        />
      ) : upcomingVacations.length === 0 ? (
        <TryDocEmptyState
          icon={CalendarDays}
          title="No upcoming time off"
          description="Your vacations and holidays will appear here."
        />
      ) : (
        <div className="space-y-3">
          {upcomingVacations.map((leave) => (
            <VacationRow
              key={leave.id}
              leave={leave}
              onDelete={() => onDelete(leave.id)}
            />
          ))}
        </div>
      )}
    </TryDocCard>
  );
}

function VacationRow({ leave, onDelete }) {
  return (
    <TryDocActionCard
      title={leave.reason}
      description={`${formatVacationDate(
        leave.startDate
      )} • ${formatVacationDate(
        leave.endDate
      )}`}
      badge={`${getVacationDays(
        leave.startDate,
        leave.endDate
      )} Days`}
      action={
        <TryDocButton
          variant="danger"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </TryDocButton>
      }
    />
  );
}