import { useEffect, useState } from "react";
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

  const fetchDoctors = () => {
    setLoading(true);

    api
      .get("/doctor")
      .then((res) => {
        const allDoctors = res.data || [];

        const hospitalDoctors = hospitalUser?.id
          ? allDoctors.filter(
              (doctor) =>
                doctor.hospital?.id === hospitalUser.id
            )
          : [];

        setDoctors(hospitalDoctors);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

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

    try {
      await api.post("/doctor", {
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(
          form.consultationFee
        ),
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
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to add doctor"
      );
    }
  };

  const deactivateDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Deactivate this doctor?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/doctor/${id}`);
      fetchDoctors();
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate doctor");
    }
  };

  const reactivateDoctor = async (id) => {
    try {
      await api.patch(`/doctor/${id}/reactivate`);
      fetchDoctors();
    } catch (error) {
      console.error(error);
      alert("Failed to reactivate doctor");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-5">
              <Building2 size={18} className="text-cyan-300" />
              <span className="text-sm font-semibold">
                {hospitalUser?.hospitalName ||
                  "Hospital Portal"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Doctor Management
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              Add doctors, manage credentials, activate or deactivate
              specialists, and keep your hospital team updated.
            </p>
          </div>
        </div>

        {/* Add Doctor Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <UserPlus className="text-white" size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
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

            <Input
              name="password"
              type="password"
              placeholder="Doctor Password"
              value={form.password}
              onChange={handleChange}
              icon={ShieldCheck}
            />

            <button
              type="submit"
              className="lg:col-span-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] transition"
            >
              Add Doctor
            </button>
          </form>
        </div>

        {/* Doctors List */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Hospital Doctors
              </h2>

              <p className="text-slate-500 text-sm">
                {doctors.length} doctors linked to this hospital
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <div className="text-center py-14">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                <Stethoscope
                  className="text-blue-600"
                  size={36}
                />
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                No doctors found
              </h3>

              <p className="text-slate-500 mt-2">
                Add your first doctor using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-40 blur transition duration-500" />

                  <div className="relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg group-hover:-translate-y-1 transition duration-500">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div className="flex gap-4">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            doctor.doctorName
                          )}&background=0f172a&color=fff&bold=true`}
                          alt={doctor.doctorName}
                          className="w-20 h-20 rounded-3xl shadow-lg"
                        />

                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-2xl font-black text-slate-900">
                              {doctor.doctorName}
                            </h3>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                doctor.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {doctor.isActive
                                ? "ACTIVE"
                                : "INACTIVE"}
                            </span>
                          </div>

                          <p className="text-blue-600 font-bold mt-1">
                            {doctor.specialization}
                          </p>

                          <p className="text-slate-500 text-sm mt-1">
                            {doctor.qualification}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge>
                              {doctor.experience} Years
                            </Badge>

                            <Badge>
                              ₹{doctor.consultationFee}
                            </Badge>

                            <Badge>
                              {doctor.mobile}
                            </Badge>

                            <Badge>{doctor.email}</Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        {doctor.isActive ? (
                          <button
                            onClick={() =>
                              deactivateDoctor(doctor.id)
                            }
                            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-bold transition"
                          >
                            <XCircle size={18} />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              reactivateDoctor(doctor.id)
                            }
                            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold transition"
                          >
                            <ShieldCheck size={18} />
                            Reactivate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
      <Icon size={19} className="text-blue-600" />

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

function Badge({ children }) {
  return (
    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
      {children}
    </span>
  );
}