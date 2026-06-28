import SkeletonCard from "./SkeletonCard";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonCard height="h-24" />

      <div className="grid grid-cols-4 gap-2">
        <SkeletonCard height="h-20" rounded="rounded-2xl" />
        <SkeletonCard height="h-20" rounded="rounded-2xl" />
        <SkeletonCard height="h-20" rounded="rounded-2xl" />
        <SkeletonCard height="h-20" rounded="rounded-2xl" />
      </div>

      <SkeletonCard height="h-36" />

      <SkeletonCard height="h-40" />

      <div className="space-y-2">
        <SkeletonCard height="h-24" rounded="rounded-2xl" />
        <SkeletonCard height="h-24" rounded="rounded-2xl" />
        <SkeletonCard height="h-24" rounded="rounded-2xl" />
      </div>
    </div>
  );
}