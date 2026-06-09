import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  IndianRupee,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.get("/doctor").then((res) => {
      setDoctors(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-8">
          Doctors
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden hover:-translate-y-1 transition"
            >
              <div className="p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      doc.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        doc.doctorName
                      )}&background=0f172a&color=fff&bold=true`
                    }
                    alt={doc.doctorName}
                    className="w-20 h-20 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
                  />

                  <div>
                    <h3 className="text-2xl font-black">
                      {doc.doctorName}
                    </h3>

                    <p className="text-cyan-200 font-semibold">
                      {doc.specialization || "Specialist"}
                    </p>

                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black">
                      <BadgeCheck size={14} />
                      {doc.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Stethoscope size={18} className="text-blue-600" />
                  <span>{doc.qualification || "Qualification not added"}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <IndianRupee size={18} className="text-emerald-600" />
                  <span className="font-bold text-slate-900">
                    ₹{doc.consultationFee}
                  </span>
                </div>

                <Link to={`/doctor/${doc.id}`}>
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
                    View Profile
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}