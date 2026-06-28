import {
  Building2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import Button from "../components/ui/Button";
import HospitalDashboardMockup from "../components/showcase/hospital/HospitalDashboardMockup";

const items = [
  "Doctor management",
  "Hospital approvals",
  "Appointments",
  "Analytics dashboard",
  "Revenue monitoring",
  "Operational insights",
];

export default function HospitalExperience() {
  return (
    <section className="bg-[#f8fbfc] py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2">
            <Building2
              size={16}
              className="text-cyan-600"
            />

            <span className="text-xs font-black text-cyan-700">
              FOR HOSPITALS
            </span>
          </div>

          <h2 className="mt-6 text-6xl font-black leading-[0.95] tracking-tight">
            Modern hospital
            <span className="block text-cyan-600">
              operations.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Manage doctors, appointments, operations,
            departments, analytics and revenue from a
            single intelligent dashboard.
          </p>

          <div className="mt-10 space-y-4">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  size={20}
                  className="text-cyan-600"
                />

                <span className="font-semibold text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button href="#waitlist">
              Join Hospital Network
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <HospitalDashboardMockup />
      </div>
    </section>
  );
}