import { useEffect, useMemo, useState } from "react";
import {
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
  Filter,
  Loader2,
  Eye,
  EyeOff,
  UsersRound,
  Activity,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalDoctors() {
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
        ? allDoctors.filter(
            (doctor) => doctor.hospital?.id === hospitalUser.id
          )
        : [];

      setDoctors(hospitalDoctors);
    } catch (error) {
      console.error("Fetch doctors error:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = `${doctor.doctorName || ""} ${
      doctor.specialization || ""
    } ${doctor.email || ""} ${doctor.mobile || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && doctor.isActive) ||
      (statusFilter === "INACTIVE" && !doctor.isActive);

    return matchesSearch && matchesStatus;
  });

  const stats = useMemo(
    () => ({
      total: doctors.length,
      active: doctors.filter((doctor) => doctor.isActive).length,
      inactive: doctors.filter((doctor) => !doctor.isActive).length,
    }),
    [doctors]
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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

      await api.post("/doctor", {
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
        hospitalId: hospitalUser.id,
      });

      alert("Doctor added successfully");

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

      fetchDoctors();
    } catch (error) {
      console.error("Add doctor error:", error);
      alert(error.response?.data?.message || "Failed to add doctor");
    } finally {
      setSaving(false);
    }
  };

  const deactivateDoctor = async (id) => {
    const confirmDelete = window.confirm("Deactivate this doctor?");

    if (!confirmDelete) return;

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
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Building2 size={17} />
                {hospitalUser?.hospitalName || "Hospital Portal"}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Doctor Management
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Add doctors, manage credentials, activate or deactivate
                specialists, and keep your hospital team updated.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniStat icon={UsersRound} title="Total" value={stats.total} />
              <MiniStat icon={ShieldCheck} title="Active" value={stats.active} />
              <MiniStat icon={XCircle} title="Inactive" value={stats.inactive} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <UserPlus className="text-cyan-600" size={25} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Add New Doctor
              </h2>

              <p className="text-slate-500 text-sm">
                Doctor login credentials will be created automatically.
              </p>
            </div>
          </div>

          <form
            onSubmit={addDoctor}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
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

            <Input
              name="experience"
              type="number"
              placeholder="Experience"
              value={form.experience}
              onChange={handleChange}
              icon={ShieldCheck}
            />

            <Input
              name="qualification"
              placeholder="Qualification"
              value={form.qualification}
              onChange={handleChange}
              icon={GraduationCap}
            />

            <Input
              name="consultationFee"
              type="number"
              placeholder="Consultation Fee"
              value={form.consultationFee}
              onChange={handleChange}
              icon={IndianRupee}
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
              className="bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2 disabled:bg-slate-400"
            >
              {saving ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus size={19} />
                  Add Doctor
                </>
              )}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Hospital Doctors
              </h2>

              <p className="text-slate-500 text-sm">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:w-80">
                <Search size={18} className="text-cyan-600" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search doctors..."
                  className="w-full bg-transparent outline-none text-slate-800"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <Filter size={18} className="text-cyan-600" />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent outline-none font-bold text-slate-700"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="bg-slate-50 rounded-2xl p-10 text-center text-slate-500">
              <Loader2 className="mx-auto animate-spin text-cyan-600 mb-3" />
              Loading doctors...
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-14 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center mx-auto mb-5">
                <Stethoscope className="text-cyan-600" size={36} />
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                No doctors found
              </h3>

              <p className="text-slate-500 mt-2">
                Add a doctor or adjust your search/filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredDoctors.map((doctor) => (
                <DoctorRow
                  key={doctor.id}
                  doctor={doctor}
                  deactivateDoctor={deactivateDoctor}
                  reactivateDoctor={reactivateDoctor}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function DoctorRow({ doctor, deactivateDoctor, reactivateDoctor }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 opacity-0 group-hover:opacity-30 blur transition duration-500" />

      <div className="relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div className="flex gap-4 min-w-0">
            <img
              src={
                doctor.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  doctor.doctorName || "Doctor"
                )}&background=0891b2&color=fff&bold=true`
              }
              alt={doctor.doctorName}
              className="w-20 h-20 rounded-3xl shadow-sm object-cover border border-slate-100 shrink-0"
            />

            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl font-black text-slate-950">
                  {doctor.doctorName}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    doctor.isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {doctor.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <p className="text-cyan-600 font-black mt-1">
                {doctor.specialization || "Specialist"}
              </p>

              <p className="text-slate-500 text-sm mt-1">
                {doctor.qualification || "Qualification not added"}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge>{doctor.experience || 0} Years</Badge>
                <Badge>₹{doctor.consultationFee || 0}</Badge>
                <Badge>{doctor.mobile || "Mobile not added"}</Badge>
                <Badge>{doctor.email || "Email not added"}</Badge>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {doctor.isActive ? (
              <button
                onClick={() => deactivateDoctor(doctor.id)}
                className="w-full xl:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-black transition"
              >
                <XCircle size={18} />
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => reactivateDoctor(doctor.id)}
                className="w-full xl:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-black transition"
              >
                <ShieldCheck size={18} />
                Reactivate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500 transition">
      <Icon size={19} className="text-cyan-600 shrink-0" />

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
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
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500 transition">
      <ShieldCheck size={19} className="text-cyan-600 shrink-0" />

      <input
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder="Doctor Password"
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-slate-400 hover:text-cyan-600"
      >
        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
      {children}
    </span>
  );
}

function MiniStat({ icon: Icon, title, value }) {
  return (
    <div className="min-w-[100px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">{value}</p>
      <p className="text-xs text-slate-500 font-bold">{title}</p>
    </div>
  );
}