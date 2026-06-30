export default function AppointmentSkeleton() {
  return (
    <section className="space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="h-24 animate-pulse rounded-2xl bg-white" />
      ))}
    </section>
  );
}