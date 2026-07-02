export default function RecommendationCard({ children }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      {children}
    </article>
  );
}
