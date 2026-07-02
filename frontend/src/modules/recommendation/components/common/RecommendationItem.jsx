import { IndianRupee } from "lucide-react";

export default function RecommendationItem({ item }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-slate-900">
          {item.name}
        </p>
        <p className="text-xs text-slate-500">
          {item.category || "Recommended"}
        </p>
      </div>

      <span className="flex items-center text-sm font-black text-slate-950">
        <IndianRupee size={12} />
        {Number(item.estimatedPrice || 0)}
      </span>
    </div>
  );
}
