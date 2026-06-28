import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
}) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-30 bg-[#f4f8fb]">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div>
          <h1 className="text-lg font-black text-slate-950">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}