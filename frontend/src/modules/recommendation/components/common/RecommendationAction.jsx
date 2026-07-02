import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecommendationAction({ to = "#", label = "View" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-black text-white active:scale-95"
    >
      {label}
      <ChevronRight size={16} />
    </Link>
  );
}
