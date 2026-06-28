import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  CalendarCheck,
  FileText,
  HelpCircle,
  Settings,
  Star,
  ShieldCheck,
  LogOut,
  ChevronRight,
  HeartPulse,
  Stethoscope,
  Building2,
  FlaskConical,
  Pill,
  Phone,
  Plus,
  BadgeCheck,
  Brain,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";
import AddFamilyMemberModal from "../components/AddFamilyMemberModal";

export default function Account() {
  const navigate = useNavigate();

  const getPatient = () =>
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const [patient, setPatient] = useState(getPatient);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(
    JSON.parse(localStorage.getItem("selectedProfile") || "null")
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("patientToken") || patient);

  useEffect(() => {
    refreshPatient();
    loadProfiles();

    window.addEventListener("patientProfileUpdated", refreshPatient);
    window.addEventListener("storage", refreshPatient);

    return () => {
      window.removeEventListener("patientProfileUpdated", refreshPatient);
      window.removeEventListener("storage", refreshPatient);
    };
  }, []);

  const refreshPatient = () => {
    setPatient(getPatient());
  };

  const loadProfiles = async () => {
    try {
      const currentPatient = getPatient();
      if (!currentPatient?.id) return;

      const res = await api.get(`/family-member/patient/${currentPatient.id}`);

      const selfProfile = {
        id: currentPatient.id,
        fullName: currentPatient.fullName || "Me",
        relation: "SELF",
        gender: currentPatient.gender,
        age: currentPatient.age,
        mobile: currentPatient.mobile,
        profileImage: currentPatient.profileImage,
        isSelf: true,
      };

      const allProfiles = [selfProfile, ...(res.data || [])];
      setProfiles(allProfiles);

      const saved = JSON.parse(localStorage.getItem("selectedProfile") || "null");

      if (saved?.id) {
        setSelectedProfile(saved);
      } else {
        setSelectedProfile(selfProfile);
        localStorage.setItem("selectedProfile", JSON.stringify(selfProfile));
      }
    } catch (error) {
      console.error("Profile load error:", error);
      toast.error("Unable to load profiles");
    }
  };

  const switchProfile = (profile) => {
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
    setSelectedProfile(profile);
    toast.success(`Switched to ${profile.fullName}`);
    window.dispatchEvent(new Event("patientProfileUpdated"));
  };

  const logout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProfile");
    navigate("/welcome", { replace: true });
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
        <div className="max-w-md mx-auto">
          <GuestHeader />

          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
            <MenuItem icon={Star} title="Rate TryDoc App" to="/rate-app" />
            <MenuItem icon={ShieldCheck} title="Privacy & Safety" to="/privacy" />
          </section>

          <HelpSupportSection />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <div className="max-w-md mx-auto">
        <ProfileCard patient={patient} />

        <ProfilesSection
          profiles={profiles}
          selectedProfile={selectedProfile}
          onSelect={switchProfile}
          onAdd={() => setShowAddModal(true)}
          canAdd={profiles.length < 4}
        />

        <section className="grid grid-cols-2 gap-3 mt-3">
          <QuickCard
            to="/patient/appointments"
            icon={CalendarCheck}
            title="Appointments"
            subtitle="Bookings"
          />

          <QuickCard
            to="/patient/medical-records"
            icon={FileText}
            title="Medical Records"
            subtitle="Reports"
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle title="Health & Care" />

          <MenuItem
            icon={HeartPulse}
            title="Emergency Profile"
            subtitle="Blood group, allergies and emergency contact"
            to="/patient/emergency-profile"
          />

          <MenuItem
            icon={FileText}
            title="Prescriptions"
            subtitle="View doctor prescriptions"
            to="/patient/prescriptions"
          />

          <MenuItem
            icon={Pill}
            title="Medicine Reminders"
            subtitle="Track medicine schedules"
            to="/patient/medicine-reminders"
          />

          <MenuItem
            icon={FlaskConical}
            title="Lab Tests"
            subtitle="Book and view lab tests"
            to="/patient/lab-tests"
          />

          <MenuItem
            icon={Brain}
            title="AI Health Insights"
            subtitle="View your health score"
            to="/patient/ai-health-insights"
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle title="Settings" />

          <MenuItem
            icon={Settings}
            title="App Settings"
            subtitle="Preferences and app options"
            to="/settings"
          />

          <MenuItem
            icon={ShieldCheck}
            title="Privacy & Safety"
            subtitle="Security and data policy"
            to="/privacy"
          />

          <MenuItem
            icon={Star}
            title="Rate TryDoc App"
            subtitle="Share your feedback"
            to="/rate-app"
          />
        </section>

        <HelpSupportSection />

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle title="Professional Access" />

          <PartnerCard
            icon={Stethoscope}
            title="Are you a doctor?"
            desc="Login to manage appointments and prescriptions"
            to="/doctor/login"
            action="Doctor Login"
          />

          <PartnerCard
            icon={Building2}
            title="Are you a hospital?"
            desc="Login or register your hospital"
            to="/hospital/login"
            action="Hospital Access"
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 py-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <LogOut className="text-red-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="font-black text-red-600 text-sm">Logout</h3>
              <p className="text-xs text-slate-500">Sign out from TryDoc</p>
            </div>

            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </section>

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

function ProfileCard({ patient }) {
  return (
    <section className="bg-slate-950 rounded-[2rem] shadow-sm p-4 text-white">
      <div className="flex items-center gap-3">
        <img
          src={
            patient?.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              patient?.fullName || "Patient"
            )}&background=0891b2&color=fff&bold=true`
          }
          alt="Profile"
          className="w-16 h-16 rounded-3xl object-cover border border-white/10"
        />

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black truncate">
            {patient?.fullName || "Patient"}
          </h1>

          <p className="text-sm text-slate-300 truncate">
            {patient?.email || patient?.mobile || "TryDoc Member"}
          </p>

          <div className="flex gap-2 mt-2">
            <span className="bg-cyan-500/20 text-cyan-200 px-2 py-1 rounded-full text-[10px] font-black">
              Verified Patient
            </span>

            <span className="bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded-full text-[10px] font-black">
              Active
            </span>
          </div>
        </div>

        <Link
          to="/patient/profile"
          className="bg-white text-slate-950 px-3 py-2 rounded-2xl font-black text-xs"
        >
          Edit
        </Link>
      </div>
    </section>
  );
}

function ProfilesSection({ profiles, selectedProfile, onSelect, onAdd, canAdd }) {
  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Profiles</h2>
          <p className="text-xs text-slate-500">
            Current: {selectedProfile?.fullName || "Profile"}
          </p>
        </div>

        <Link
          to="/patient/manage-profiles"
          className="text-cyan-600 font-black text-sm"
        >
          Manage
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        {profiles.map((profile) => {
          const active = selectedProfile?.id === profile.id;

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile)}
              className="shrink-0 w-20 text-center"
            >
              <div
                className={`relative w-16 h-16 mx-auto rounded-2xl overflow-hidden flex items-center justify-center border-2 ${
                  active
                    ? "border-cyan-600 bg-cyan-50"
                    : "border-slate-200 bg-slate-50"
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
                    className={active ? "text-cyan-600" : "text-slate-400"}
                    size={28}
                  />
                )}

                {active && (
                  <span className="absolute right-1 bottom-1 bg-cyan-600 rounded-full border-2 border-white w-5 h-5 flex items-center justify-center">
                    <BadgeCheck size={11} className="text-white" />
                  </span>
                )}
              </div>

              <p className="text-[11px] font-black text-slate-800 mt-2 truncate">
                {profile.fullName}
              </p>
            </button>
          );
        })}

        {canAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="shrink-0 w-20 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 flex items-center justify-center">
              <Plus className="text-cyan-600" size={26} />
            </div>

            <p className="text-[11px] font-black text-cyan-700 mt-2">Add</p>
          </button>
        )}
      </div>
    </section>
  );
}

function GuestHeader() {
  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-center">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-50 flex items-center justify-center mb-4">
        <UserRound className="text-cyan-600" size={38} />
      </div>

      <h1 className="text-2xl font-black text-slate-950">Your Account</h1>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        Login to view appointments, records, health insights and support.
      </p>

      <Link
        to="/welcome"
        className="mt-5 w-full bg-cyan-600 text-white py-3.5 rounded-2xl font-black flex items-center justify-center active:scale-95 transition"
      >
        Login / Signup
      </Link>
    </section>
  );
}

function HelpSupportSection() {
  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
      <SectionTitle title="Help & Support" />

      <MenuItem
        icon={HelpCircle}
        title="Help Center"
        subtitle="FAQs and contact support"
        to="/support"
      />

      <MenuItem
        icon={Phone}
        title="Contact Support"
        subtitle="Get help with your account"
        to="/support"
      />
    </section>
  );
}

function SectionTitle({ title }) {
  return <h2 className="text-lg font-black text-slate-950 mb-2">{title}</h2>;
}

function QuickCard({ to, icon: Icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 active:scale-95 transition"
    >
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center mb-3">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <h3 className="font-black text-slate-900 text-sm">{title}</h3>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </Link>
  );
}

function MenuItem({ icon: Icon, title, subtitle, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0 active:scale-[0.99] transition"
    >
      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
        <Icon className="text-cyan-600" size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-black text-slate-900 text-sm truncate">{title}</h3>

        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>

      <ChevronRight size={18} className="text-slate-400 shrink-0" />
    </Link>
  );
}

function PartnerCard({ icon: Icon, title, desc, to, action }) {
  return (
    <Link
      to={to}
      className="mt-3 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3 active:scale-[0.98] transition"
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100">
        <Icon className="text-cyan-600" size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-black text-slate-950 text-sm">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>

      <span className="text-cyan-600 font-black text-xs shrink-0">
        {action}
      </span>
    </Link>
  );
}