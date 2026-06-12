import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Search,
  ShieldCheck,
} from "lucide-react";
import api from "../api/axios";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await api.get("/hospital");
      setHospitals(res.data || []);
    } catch (error) {
      console.error("Hospital fetch error:", error);
      setHospitals([]);
    }
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    `${hospital.hospitalName || ""} ${hospital.city || ""} ${
      hospital.state || ""
    } ${hospital.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-10">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Building2 size={17} />
                Partner Hospitals
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Hospitals Near You
              </h1>

              <p className="text-slate-500 mt-3 text-lg max-w-2xl">
                Browse verified hospitals and healthcare centers connected with
                MediCare.
              </p>
            </div>

            <div className="bg-cyan-50 border border-cyan-100 rounded-2xl px-5 py-4 flex items-center gap-3">
              <ShieldCheck className="text-cyan-600" />
              <span className="font-black text-cyan-700">
                Verified Hospitals
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-8">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <Search className="text-cyan-600" size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospital, city or state..."
              className="w-full bg-transparent outline-none text-slate-800"
            />
          </div>
        </section>

        {filteredHospitals.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center text-slate-500">
            No hospitals found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
              >
                <div className="bg-cyan-50 p-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-600 flex items-center justify-center mb-5">
                    <Building2 className="text-white" size={32} />
                  </div>

                  <h2 className="text-2xl font-black text-slate-950">
                    {hospital.hospitalName}
                  </h2>

                  <p className="text-cyan-700 font-bold mt-1">
                    {hospital.status || "APPROVED"}
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <Info icon={MapPin}>
                    {hospital.city || "-"}, {hospital.state || "-"}
                  </Info>

                  <Info icon={Phone}>
                    {hospital.mobile || "Mobile not added"}
                  </Info>

                  <Info icon={Mail}>
                    {hospital.email || "Email not added"}
                  </Info>

                  <p className="text-slate-500 text-sm leading-relaxed pt-2">
                    {hospital.address || "Address not added"}
                  </p>

                  <button className="w-full mt-5 bg-cyan-600 text-white py-3 rounded-2xl font-black hover:bg-cyan-700">
                    View Doctors
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 text-slate-600">
      <Icon size={18} className="text-cyan-600" />
      <span className="font-semibold">{children}</span>
    </div>
  );
}