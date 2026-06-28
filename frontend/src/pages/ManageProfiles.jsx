import { useEffect, useState } from "react";
import {
  UserRound,
  Plus,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import AddFamilyMemberModal from "../components/AddFamilyMemberModal";
import TryDocLogo from "../components/TryDocLogo";

export default function ManageProfiles() {
  const navigate = useNavigate();

  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(
    JSON.parse(localStorage.getItem("selectedProfile") || "null")
  );
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      if (!patient?.id) return;

      const res = await api.get(`/family-member/patient/${patient.id}`);

      const selfProfile = {
        id: patient.id,
        fullName: patient.fullName || "Me",
        relation: "SELF",
        gender: patient.gender,
        age: patient.age,
        mobile: patient.mobile,
        profileImage: patient.profileImage,
        isSelf: true,
      };

      const allProfiles = [selfProfile, ...(res.data || [])];
      setProfiles(allProfiles);

      const saved = JSON.parse(
        localStorage.getItem("selectedProfile") || "null"
      );

      if (saved?.id) {
        setSelectedProfile(saved);
      } else {
        setSelectedProfile(selfProfile);
        localStorage.setItem("selectedProfile", JSON.stringify(selfProfile));
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const selectProfile = (profile) => {
    setSelectedProfile(profile);
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
  };

  const editProfile = (profile) => {
    if (profile.isSelf) {
      navigate("/patient/profile");
      return;
    }

    navigate(`/patient/edit-family-profile/${profile.id}`);
  };

  const continueToApp = () => {
    if (!selectedProfile?.id) {
      toast.error("Please select a profile");
      return;
    }

    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#f8fbfc] px-5 pt-8 pb-10">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center">
          <TryDocLogo size={42} />
        </div>

        <section className="text-center mt-8">
          <h1 className="text-3xl font-black text-slate-950">
            Who&apos;s booking today?
          </h1>

          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Choose a profile to book appointments, manage prescriptions and
            access health records.
          </p>
        </section>

        {loading ? (
          <section className="grid grid-cols-2 gap-4 mt-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-44 bg-white rounded-[2rem] border border-slate-100 animate-pulse"
              />
            ))}
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-4 mt-8">
            {profiles.map((profile) => {
              const active = selectedProfile?.id === profile.id;

              return (
                <div
                  key={profile.id}
                  className={`relative rounded-[2rem] border p-4 bg-white shadow-sm transition ${
                    active
                      ? "border-cyan-300 ring-4 ring-cyan-100"
                      : "border-slate-100"
                  }`}
                >
                  {active && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={16} />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => selectProfile(profile)}
                    className="w-full text-center active:scale-95 transition"
                  >
                    <div
                      className={`w-24 h-24 mx-auto rounded-[2rem] overflow-hidden flex items-center justify-center border ${
                        active
                          ? "bg-cyan-50 border-cyan-200"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      {profile.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={profile.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserRound
                          className={
                            active ? "text-cyan-600" : "text-slate-400"
                          }
                          size={40}
                        />
                      )}
                    </div>

                    <h3 className="font-black text-slate-950 text-sm mt-3 truncate">
                      {profile.fullName}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {profile.relation || "SELF"}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => editProfile(profile)}
                    className="mt-3 w-full bg-slate-50 border border-slate-100 text-slate-600 py-2 rounded-2xl text-xs font-black"
                  >
                    Edit
                  </button>
                </div>
              );
            })}

            {profiles.length < 4 && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="rounded-[2rem] border-2 border-dashed border-cyan-300 p-4 bg-cyan-50/50 text-center active:scale-95 transition"
              >
                <div className="w-24 h-24 mx-auto rounded-[2rem] bg-white flex items-center justify-center border border-cyan-100">
                  <Plus className="text-cyan-600" size={38} />
                </div>

                <h3 className="font-black text-cyan-700 text-sm mt-3">
                  Add Profile
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Family member
                </p>
              </button>
            )}
          </section>
        )}

        <div className="mt-6 bg-white border border-slate-100 rounded-3xl p-4 flex gap-3 shadow-sm">
          <ShieldCheck size={20} className="text-cyan-600 shrink-0 mt-0.5" />

          <p className="text-xs text-slate-500 leading-relaxed">
            TryDoc keeps every family member&apos;s appointments, prescriptions
            and health records organized separately.
          </p>
        </div>

        <button
          type="button"
          onClick={continueToApp}
          className="w-full mt-5 bg-cyan-600 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
        >
          Continue
          <ChevronRight size={18} />
        </button>

        {showAddModal && (
          <AddFamilyMemberModal
            patientId={patient.id}
            memberCount={profiles.filter((p) => !p.isSelf).length}
            onClose={() => setShowAddModal(false)}
            onSaved={() => {
              setShowAddModal(false);
              loadProfiles();
            }}
          />
        )}
      </div>
    </main>
  );
}