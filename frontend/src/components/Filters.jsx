import {
  MapPin,
  Stethoscope,
  IndianRupee,
  Filter,
  X,
  ShieldCheck,
  Video,
  Clock,
  SlidersHorizontal,
} from "lucide-react";

export default function Filters({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const clearFilter = (key) => {
    const updated = { ...filters };
    delete updated[key];
    setFilters(updated);
  };

  const clearAll = () => {
    setFilters({});
  };

  const hasActiveFilters =
    filters.city || filters.specialization || filters.fee;

  return (
    <div className="mb-8">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-sm">
              <SlidersHorizontal className="text-white" size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Find Your Doctor
              </h2>

              <p className="text-sm text-slate-500">
                Filter by location, specialty and consultation fee
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-50 text-red-600 font-black hover:bg-red-100 transition"
            >
              <X size={17} />
              Clear Filters
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-5">
            <SelectBox
              icon={MapPin}
              label="City"
              value={filters.city || ""}
              onChange={(value) => updateFilter("city", value)}
              options={[
                ["", "All Cities"],
                ["Chennai", "Chennai"],
                ["Mumbai", "Mumbai"],
                ["Bangalore", "Bangalore"],
                ["Hyderabad", "Hyderabad"],
                ["Delhi", "Delhi"],
              ]}
            />

            <SelectBox
              icon={Stethoscope}
              label="Specialization"
              value={filters.specialization || ""}
              onChange={(value) => updateFilter("specialization", value)}
              options={[
                ["", "All Specializations"],
                ["Cardiology", "Cardiology"],
                ["Dermatology", "Dermatology"],
                ["Neurology", "Neurology"],
                ["Orthopedics", "Orthopedics"],
                ["Pediatrics", "Pediatrics"],
                ["ENT", "ENT"],
                ["General Physician", "General Physician"],
                ["Ophthalmology", "Ophthalmology"],
              ]}
            />

            <div>
              <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
                <IndianRupee size={16} className="text-cyan-600" />
                Consultation Fee
              </label>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-cyan-500">
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={filters.fee || 2000}
                  onChange={(e) => updateFilter("fee", e.target.value)}
                  className="w-full accent-cyan-600 cursor-pointer"
                />

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-slate-500 font-bold">
                    ₹200
                  </span>

                  <span className="px-4 py-2 rounded-full bg-cyan-600 text-white font-black shadow-sm">
                    Up to ₹{filters.fee || 2000}
                  </span>

                  <span className="text-sm text-slate-500 font-bold">
                    ₹2000
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <FeatureBadge icon={ShieldCheck} text="Verified Doctors" />
            <FeatureBadge icon={Video} text="Video Consultation" />
            <FeatureBadge icon={Clock} text="Available Today" />
          </div>

          {hasActiveFilters && (
            <div className="mt-6 flex flex-wrap gap-3">
              <p className="w-full text-sm font-black text-slate-500">
                Active Filters
              </p>

              {filters.city && (
                <FilterChip
                  label={`📍 ${filters.city}`}
                  onClear={() => clearFilter("city")}
                />
              )}

              {filters.specialization && (
                <FilterChip
                  label={`🩺 ${filters.specialization}`}
                  onClear={() => clearFilter("specialization")}
                />
              )}

              {filters.fee && (
                <FilterChip
                  label={`💰 Up to ₹${filters.fee}`}
                  onClear={() => clearFilter("fee")}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectBox({ icon: Icon, label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
        <Icon size={16} className="text-cyan-600" />
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition font-semibold text-slate-700"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionLabel} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function FeatureBadge({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-cyan-50 border border-cyan-100 px-4 py-3">
      <Icon className="text-cyan-600" size={19} />
      <span className="text-sm font-black text-cyan-700">
        {text}
      </span>
    </div>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 text-white font-black text-sm">
      <span>{label}</span>

      <button
        type="button"
        onClick={onClear}
        className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
      >
        <X size={13} />
      </button>
    </div>
  );
}