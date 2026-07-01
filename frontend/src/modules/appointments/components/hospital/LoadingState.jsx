import { Loader2 } from "lucide-react";
function LoadingState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <Loader2 className="mx-auto animate-spin text-cyan-600 mb-3" size={34} />

      <h3 className="text-lg font-black text-slate-950">
        Loading appointments
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Please wait while we fetch hospital bookings.
      </p>
    </div>
  );
}

export default LoadingState;