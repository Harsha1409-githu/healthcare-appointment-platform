import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  ChevronRight,
} from "lucide-react";

import api from "../api/axios";

export default function PatientProfileSelect() {
  const navigate = useNavigate();

  const patient = JSON.parse(
    localStorage.getItem("patientUser") || "null"
  );

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const res = await api.get(
        `/family-member/patient/${patient.id}`
      );

      setProfiles(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const selectSelf = () => {
    localStorage.setItem(
      "selectedProfile",
      JSON.stringify({
        id: patient.id,
        fullName: patient.fullName,
        gender: patient.gender,
        age: patient.age,
        relation: "SELF",
        isSelf: true,
      })
    );

    navigate("/home", { replace: true });
  };

  const selectFamily = (member) => {
    localStorage.setItem(
      "selectedProfile",
      JSON.stringify({
        ...member,
        isSelf: false,
      })
    );

    navigate("/home", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-950">
            Who is using TryDoc?
          </h1>

          <p className="text-slate-500 mt-2">
            Choose a profile to continue
          </p>
        </div>

        <div className="space-y-3">
          <ProfileCard
            name={patient.fullName}
            relation="SELF"
            onClick={selectSelf}
          />

          {profiles.map((member) => (
            <ProfileCard
              key={member.id}
              name={member.fullName}
              relation={member.relation}
              onClick={() => selectFamily(member)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function ProfileCard({
  name,
  relation,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex items-center justify-between active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
          <UserRound
            className="text-cyan-600"
            size={24}
          />
        </div>

        <div className="text-left">
          <p className="font-black text-slate-950">
            {name}
          </p>

          <p className="text-sm text-slate-500">
            {relation}
          </p>
        </div>
      </div>

      <ChevronRight
        size={20}
        className="text-slate-400"
      />
    </button>
  );
}