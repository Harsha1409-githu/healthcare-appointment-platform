import { Bot, HeartPulse, Home, Search, UserRound } from "lucide-react";

const tabs = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Search" },
  { icon: Bot, label: "AI" },
  { icon: HeartPulse, label: "Health" },
  { icon: UserRound, label: "Profile" },
];

export default function BottomNavigation() {
  return (
    <div className="mt-4 grid grid-cols-5 rounded-3xl border border-slate-100 bg-white p-2 shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <div
            key={tab.label}
            className={`flex flex-col items-center gap-1 rounded-2xl py-2 ${
              tab.active
                ? "bg-cyan-50 text-cyan-700"
                : "text-slate-400"
            }`}
          >
            <Icon size={17} />
            <span className="text-[10px] font-black">{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}