import {
  MapPin,
  Stethoscope,
  IndianRupee,
  Filter,
} from "lucide-react";

export default function Filters({
  filters,
  setFilters,
}) {
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
          <Filter className="text-white" size={20} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Find Your Doctor
          </h2>

          <p className="text-sm text-slate-500">
            Filter doctors by city, specialty and fee
          </p>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl">
        <div className="grid md:grid-cols-3 gap-5">
          {/* City */}
          <div className="group">
            <label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
              <MapPin
                size={16}
                className="text-blue-600"
              />
              City
            </label>

            <select
              value={filters.city || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  city: e.target.value,
                })
              }
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">
                All Cities
              </option>

              <option value="Chennai">
                Chennai
              </option>

              <option value="Mumbai">
                Mumbai
              </option>

              <option value="Bangalore">
                Bangalore
              </option>

              <option value="Hyderabad">
                Hyderabad
              </option>

              <option value="Delhi">
                Delhi
              </option>
            </select>
          </div>

          {/* Specialization */}
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
              <Stethoscope
                size={16}
                className="text-emerald-600"
              />
              Specialization
            </label>

            <select
              value={
                filters.specialization || ""
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  specialization:
                    e.target.value,
                })
              }
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            >
              <option value="">
                All Specializations
              </option>

              <option value="Cardiology">
                Cardiology
              </option>

              <option value="Dermatology">
                Dermatology
              </option>

              <option value="Neurology">
                Neurology
              </option>

              <option value="Orthopedics">
                Orthopedics
              </option>

              <option value="Pediatrics">
                Pediatrics
              </option>

              <option value="ENT">
                ENT
              </option>
            </select>
          </div>

          {/* Fee Filter */}
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
              <IndianRupee
                size={16}
                className="text-purple-600"
              />
              Consultation Fee
            </label>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={filters.fee || 2000}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    fee: e.target.value,
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-slate-500">
                  ₹200
                </span>

                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md animate-pulse">
                  ₹
                  {filters.fee || 2000}
                </span>

                <span className="text-sm text-slate-500">
                  ₹2000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-3 mt-6">
          {filters.city && (
            <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
              📍 {filters.city}
            </div>
          )}

          {filters.specialization && (
            <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium">
              🩺 {filters.specialization}
            </div>
          )}

          {filters.fee && (
            <div className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium">
              💰 Up to ₹{filters.fee}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}