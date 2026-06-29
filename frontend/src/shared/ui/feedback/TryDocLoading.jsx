import { Loader2 } from "lucide-react";

export default function TryDocLoading({
  title = "Loading",
  description = "Please wait a moment.",
}) {
  return (
    <div className="rounded-[1.6rem] bg-slate-50 p-6 text-center">
      <Loader2 className="mx-auto animate-spin text-cyan-600" size={34} />

      <h3 className="mt-3 text-base font-black text-slate-950">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}