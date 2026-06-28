import {
  Brain,
  Building2,
  CalendarCheck,
  FileText,
  HeartPulse,
  Search,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";

import Section from "../components/ui/Section";

const groups = [
  {
    title: "Care",
    icon: Stethoscope,
    items: [
      { icon: CalendarCheck, title: "Appointments" },
      { icon: Video, title: "Video Consults" },
      { icon: FileText, title: "Prescriptions" },
    ],
  },
  {
    title: "Intelligence",
    icon: Brain,
    items: [
      { icon: Brain, title: "AI Assistant" },
      { icon: Search, title: "Smart Search" },
      { icon: HeartPulse, title: "Health Timeline" },
    ],
  },
  {
    title: "Platform",
    icon: Building2,
    items: [
      { icon: Users, title: "Family Profiles" },
      { icon: Stethoscope, title: "Doctor Tools" },
      { icon: Building2, title: "Hospital Dashboard" },
    ],
  },
];

export default function Features() {
  return (
    <Section
      id="features"
      eyebrow="FEATURES"
      title="Everything healthcare needs, organized beautifully."
      muted
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {groups.map((group) => {
          const GroupIcon = group.icon;

          return (
            <div
              key={group.title}
              className="rounded-[2rem] border border-slate-100 bg-[#f8fbfc] p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-600">
                  <GroupIcon size={24} />
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  {group.title}
                </h3>
              </div>

              <div className="mt-6 space-y-3">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4"
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
                        <Icon size={19} />
                      </div>

                      <p className="text-sm font-black text-slate-700">
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}