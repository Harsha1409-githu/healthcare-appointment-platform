import { Brain, FileText, HeartPulse, UserRound } from "lucide-react";
import { motion } from "framer-motion";

import StatusBar from "./StatusBar";
import DynamicIsland from "./DynamicIsland";
import SearchBar from "./SearchBar";
import DoctorCard from "./DoctorCard";
import AppointmentCard from "./AppointmentCard";
import TimelineCard from "./TimelineCard";
import BottomNavigation from "./BottomNavigation";
import FloatingNotification from "./FloatingNotification";
import DeviceFrame from "../DeviceFrame";

export default function PatientPhone() {
  return (
   

    <motion.div
  animate={{ y: [0, -12, 0] }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <DeviceFrame>
    <div className="h-full bg-[#f8fbfc] p-4">
          <StatusBar />
         

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-cyan-700">
                TRYDOC
              </p>

              <h3 className="mt-1 text-2xl font-black tracking-tight">
                Good Morning 👋
              </h3>

              <p className="text-sm font-bold text-slate-500">
                Krishna
              </p>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-500/25">
              <UserRound size={22} />
            </div>
          </div>

          <SearchBar />

          <div className="mt-5 flex items-center justify-between">
            <h4 className="font-black text-slate-950">
              Nearby Doctors
            </h4>
            <p className="text-xs font-black text-cyan-700">
              View all
            </p>
          </div>

          <DoctorCard />
          <AppointmentCard />
          <TimelineCard />
          <BottomNavigation />
            </div>
  </DeviceFrame>
</motion.div>

  );
}