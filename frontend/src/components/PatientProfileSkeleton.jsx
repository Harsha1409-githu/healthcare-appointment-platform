export default function PatientProfileSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1,2,3,4,5].map((item) => (
        <div
          key={item}
          className="bg-white rounded-3xl h-32 border border-slate-100"
        />
      ))}
    </div>
  );
}