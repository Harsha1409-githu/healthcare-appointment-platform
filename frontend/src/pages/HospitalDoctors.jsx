import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Stethoscope,
  UserPlus,
  BadgeCheck,
  IndianRupee,
  Phone,
  Mail,
  GraduationCap,
  ShieldCheck,
  XCircle,
  Building2,
  Search,
  Loader2,
  Eye,
  EyeOff,
  UsersRound,
  Copy,
  X,
  Plus,
  CalendarDays,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalDoctors() {
  const navigate = useNavigate();

  const hospitalUser = JSON.parse(
    localStorage.getItem("hospitalUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showPassword, setShowPassword] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [createdDoctor, setCreatedDoctor] = useState(null);

  const [form, setForm] = useState({
    doctorName: "",
    specialization: "",
    experience: "",
    qualification: "",
    consultationFee: "",
    mobile: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await api.get("/doctor");
      const allDoctors = res.data || [];

      const hospitalDoctors = hospitalUser?.id
        ? allDoctors.filter((doctor) => doctor.hospital?.id === hospitalUser.id)
        : [];

      setDoctors(hospitalDoctors);
    } catch (error) {
      console.error("Fetch doctors error:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => ({
      total: doctors.length,
      active: doctors.filter((doctor) => doctor.isActive).length,
      inactive: doctors.filter((doctor) => !doctor.isActive).length,
    }),
    [doctors]
  );

  const filteredDoctors = doctors.filter((doctor) => {
    const text = `${doctor.doctorName || ""} ${doctor.specialization || ""} ${
      doctor.email || ""
    } ${doctor.mobile || ""}`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && doctor.isActive) ||
      (statusFilter === "INACTIVE" && !doctor.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      doctorName: "",
      specialization: "",
      experience: "",
      qualification: "",
      consultationFee: "",
      mobile: "",
      email: "",
      password: "",
    });
  };

  const addDoctor = async (e) => {
    e.preventDefault();

    if (!hospitalUser?.id) {
      alert("Hospital login required");
      return;
    }

    if (Number(form.experience) < 0 || Number(form.consultationFee) < 0) {
      alert("Experience and fee must be valid numbers");
      return;
    }

    try {
      setSaving(true);

      const res = await api.post("/doctor", {
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
        hospitalId: hospitalUser.id,
      });

      setCreatedDoctor({
        ...res.data,
        email: form.email,
        password: form.password,
      });

      resetForm();
      setShowAddSheet(false);
      fetchDoctors();
    } catch (error) {
      console.error("Add doctor error:", error);
      alert(error.response?.data?.message || "Failed to add doctor");
    } finally {
      setSaving(false);
    }
  };

  const deactivateDoctor = async (id) => {
    if (!window.confirm("Deactivate this doctor?")) return;

    try {
      await api.delete(`/doctor/${id}`);
      fetchDoctors();
    } catch (error) {
      console.error("Deactivate doctor error:", error);
      alert("Failed to deactivate doctor");
    }
  };

  const reactivateDoctor = async (id) => {
    try {
      await api.patch(`/doctor/${id}/reactivate`);
      fetchDoctors();
    } catch (error) {
      console.error("Reactivate doctor error:", error);
      alert("Failed to reactivate doctor");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-28">
      <div className="max-w-md mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-cyan-700 font-black text-sm mb-3"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
              <Building2 className="text-cyan-600" size={28} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-cyan-700 font-black">
                HOSPITAL DOCTORS
              </p>

              <h1 className="text-xl font-black text-slate-950 truncate">
                {hospitalUser?.hospitalName || "Doctor Management"}
              </h1>

              <p className="text-sm text-slate-500 truncate">
                Manage doctors, credentials and slots
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat icon={UsersRound} title="Total" value={stats.total} />
            <MiniStat icon={ShieldCheck} title="Active" value={stats.active} />
            <MiniStat icon={XCircle} title="Inactive" value={stats.inactive} />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search size={18} className="text-cyan-600 shrink-0" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors, speciality, email"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <FilterChip
              label="All"
              active={statusFilter === "ALL"}
              onClick={() => setStatusFilter("ALL")}
            />

            <FilterChip
              label="Active"
              active={statusFilter === "ACTIVE"}
              onClick={() => setStatusFilter("ACTIVE")}
            />

            <FilterChip
              label="Inactive"
              active={statusFilter === "INACTIVE"}
              onClick={() => setStatusFilter("INACTIVE")}
            />
          </div>
        </section>

        <section className="mt-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Doctors
              </h2>

              <p className="text-xs text-slate-500">
                {filteredDoctors.length} of {doctors.length} doctors
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDoctors}
              className="text-cyan-600 text-xs font-black"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
              <Loader2 className="mx-auto animate-spin text-cyan-600 mb-3" />
              <p className="text-sm text-slate-500 font-bold">
                Loading doctors...
              </p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <EmptyDoctors />
          ) : (
            <div className="space-y-3">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  navigate={navigate}
                  deactivateDoctor={deactivateDoctor}
                  reactivateDoctor={reactivateDoctor}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <button
        type="button"
        onClick={() => setShowAddSheet(true)}
        className="fixed right-5 bottom-24 z-40 w-16 h-16 rounded-full bg-cyan-600 text-white shadow-2xl flex items-center justify-center active:scale-95 transition"
      >
        <Plus size={30} />
      </button>

      {showAddSheet && (
        <AddDoctorSheet
          form={form}
          handleChange={handleChange}
          addDoctor={addDoctor}
          saving={saving}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onClose={() => setShowAddSheet(false)}
        />
      )}

      {createdDoctor && (
        <CredentialsModal
          doctor={createdDoctor}
          onClose={() => setCreatedDoctor(null)}
        />
      )}
    </main>
  );
}

function DoctorCard({ doctor, navigate, deactivateDoctor, reactivateDoctor }) {
  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-3">
      <div className="flex gap-3">
        <img
          src={
            doctor.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              doctor.doctorName || "Doctor"
            )}&background=0891b2&color=fff&bold=true`
          }
          alt={doctor.doctorName}
          className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-950 truncate">
                {doctor.doctorName || "Doctor"}
              </h3>

              <p className="text-xs text-cyan-700 font-black truncate">
                {doctor.specialization || "Specialist"}
              </p>
            </div>

            <span
              className={`px-2 py-1 rounded-full text-[10px] font-black shrink-0 ${
                doctor.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {doctor.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1 truncate">
            {doctor.qualification || "Qualification not added"}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <Badge>{doctor.experience || 0} Years</Badge>
            <Badge>₹{doctor.consultationFee || 0}</Badge>
            <Badge>{doctor.mobile || "No mobile"}</Badge>
            <Badge>{doctor.email || "No email"}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              type="button"
              onClick={() => navigate(`/doctor/${doctor.id}`)}
              className="bg-slate-950 text-white py-2 rounded-xl text-xs font-black"
            >
              Profile
            </button>

            <button
              type="button"
              onClick={() => navigate(`/hospital/doctor/${doctor.id}/slots`)}
              className="bg-cyan-600 text-white py-2 rounded-xl text-xs font-black"
            >
              Slots
            </button>

            {doctor.isActive ? (
              <button
                type="button"
                onClick={() => deactivateDoctor(doctor.id)}
                className="bg-red-600 text-white py-2 rounded-xl text-xs font-black"
              >
                Disable
              </button>
            ) : (
              <button
                type="button"
                onClick={() => reactivateDoctor(doctor.id)}
                className="bg-emerald-600 text-white py-2 rounded-xl text-xs font-black"
              >
                Enable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddDoctorSheet({
  form,
  handleChange,
  addDoctor,
  saving,
  showPassword,
  setShowPassword,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-[2rem] max-h-[88vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 rounded-t-[2rem] z-10">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Add Doctor
              </h2>

              <p className="text-sm text-slate-500">
                Create doctor login credentials
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={addDoctor} className="p-4 space-y-3 pb-8">
          <Input
            name="doctorName"
            placeholder="Doctor Name"
            value={form.doctorName}
            onChange={handleChange}
            icon={Stethoscope}
          />

          <Input
            name="specialization"
            placeholder="Specialization"
            value={form.specialization}
            onChange={handleChange}
            icon={BadgeCheck}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              name="experience"
              type="number"
              placeholder="Experience"
              value={form.experience}
              onChange={handleChange}
              icon={ShieldCheck}
            />

            <Input
              name="consultationFee"
              type="number"
              placeholder="Fee"
              value={form.consultationFee}
              onChange={handleChange}
              icon={IndianRupee}
            />
          </div>

          <Input
            name="qualification"
            placeholder="Qualification"
            value={form.qualification}
            onChange={handleChange}
            icon={GraduationCap}
          />

          <Input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            icon={Phone}
          />

          <Input
            name="email"
            type="email"
            placeholder="Doctor Email"
            value={form.email}
            onChange={handleChange}
            icon={Mail}
          />

          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:bg-slate-400 active:scale-95 transition"
          >
            {saving ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={19} />
                Create Doctor
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function CredentialsModal({ doctor, onClose }) {
  const text = `Doctor Login Credentials\n\nName: ${
    doctor.doctorName || "Doctor"
  }\nEmail: ${doctor.email}\nPassword: ${doctor.password}`;

  const copyCredentials = async () => {
    await navigator.clipboard.writeText(text);
    alert("Credentials copied");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Doctor Created
            </h2>

            <p className="text-sm text-slate-500">
              Save these login details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-4">
            <p className="text-xs font-black text-cyan-700">
              DOCTOR LOGIN
            </p>

            <h3 className="text-lg font-black text-slate-950 mt-2">
              {doctor.doctorName || "Doctor"}
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              Email: <b>{doctor.email}</b>
            </p>

            <p className="text-sm text-slate-600 mt-1">
              Password: <b>{doctor.password}</b>
            </p>
          </div>

          <button
            type="button"
            onClick={copyCredentials}
            className="mt-4 w-full bg-cyan-600 text-white py-3.5 rounded-2xl font-black flex items-center justify-center gap-2"
          >
            <Copy size={18} />
            Copy Credentials
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 rounded-2xl text-xs font-black transition ${
        active ? "bg-cyan-600 text-white" : "bg-slate-50 text-slate-600"
      }`}
    >
      {label}
    </button>
  );
}

function Input({ icon: Icon, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
      <Icon size={18} className="text-cyan-600 shrink-0" />

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
        required
      />
    </div>
  );
}

function PasswordInput({
  name,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
      <ShieldCheck size={18} className="text-cyan-600 shrink-0" />

      <input
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder="Doctor Password"
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-slate-400"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold truncate">
      {children}
    </span>
  );
}

function MiniStat({ icon: Icon, title, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 text-center">
      <Icon className="text-cyan-600 mx-auto" size={19} />

      <p className="text-lg font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {title}
      </p>
    </div>
  );
}

function EmptyDoctors() {
  return (
    <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <Stethoscope className="text-cyan-600 mx-auto" size={34} />

      <h3 className="text-lg font-black text-slate-950 mt-3">
        No doctors found
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Add a doctor or adjust your search.
      </p>
    </div>
  );
}