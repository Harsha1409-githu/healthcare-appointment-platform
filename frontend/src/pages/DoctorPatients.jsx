import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  ChevronRight,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import usePullToRefresh from "../hooks/usePullToRefresh";

const todayIso = () => new Date().toISOString().split("T")[0];

const formatVisitDate = (value) => {
  if (!value) return "-";

  const today = todayIso();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  if (value === today) return "Today";
  if (value === yesterday) return "Yesterday";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const getPatientName = (appointment) =>
  appointment?.familyMember?.fullName ||
  appointment?.patient?.fullName ||
  appointment?.patientName ||
  "Patient";

const getPatientAge = (appointment) =>
  appointment?.familyMember?.age || appointment?.patient?.age || "";

const getPatientGender = (appointment) =>
  appointment?.familyMember?.gender || appointment?.patient?.gender || "";

export default function DoctorPatients() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await fetchPatients(false);
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      if (!doctor?.id) {
        setAppointments([]);
        return;
      }

      const res = await api.get(`/appointment/doctor/${doctor.id}`);
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Doctor patients error:", error);
      toast.error("Unable to load patients");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const patients = useMemo(() => {
    const map = new Map();

    appointments.forEach((appointment) => {
      const key =
        appointment.patient?.id ||
        appointment.patientPhone ||
        appointment.patientName ||
        appointment.familyMember?.fullName ||
        appointment.id;

      const appointmentDate = appointment.slot?.date || appointment.date || "";

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: getPatientName(appointment),
          mobile: appointment.patient?.mobile || appointment.patientPhone || "",
          email: appointment.patient?.email || "",
          image:
            appointment.familyMember?.profileImage ||
            appointment.patient?.profileImage ||
            "",
          age: getPatientAge(appointment),
          gender: getPatientGender(appointment),
          lastAppointment: appointment,
          lastVisitDate: appointmentDate,
          totalVisits: 1,
          completedVisits: appointment.status === "COMPLETED" ? 1 : 0,
          todayVisits: appointmentDate === todayIso() ? 1 : 0,
        });
      } else {
        const old = map.get(key);
        old.totalVisits += 1;
        if (appointment.status === "COMPLETED") old.completedVisits += 1;
        if (appointmentDate === todayIso()) old.todayVisits += 1;

        if (
          appointmentDate &&
          (!old.lastVisitDate || appointmentDate > old.lastVisitDate)
        ) {
          old.lastVisitDate = appointmentDate;
          old.lastAppointment = appointment;
          old.age = getPatientAge(appointment) || old.age;
          old.gender = getPatientGender(appointment) || old.gender;
          old.image =
            appointment.familyMember?.profileImage ||
            appointment.patient?.profileImage ||
            old.image;
        }
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [appointments]);

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase().trim();

    return patients.filter((patient) =>
      `${patient.name} ${patient.mobile} ${patient.email}`
        .toLowerCase()
        .includes(query)
    );
  }, [patients, search]);

  const groupedPatients = useMemo(() => {
    const today = [];
    const returning = [];
    const others = [];

    filteredPatients.forEach((patient) => {
      if (patient.todayVisits > 0) {
        today.push(patient);
      } else if (patient.totalVisits > 1) {
        returning.push(patient);
      } else {
        others.push(patient);
      }
    });

    return { today, returning, others };
  }, [filteredPatients]);

  const todayPatients = patients.filter((patient) => patient.todayVisits > 0).length;
  const returningPatients = patients.filter((patient) => patient.totalVisits > 1).length;

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      {visible && (
        <div
          className="fixed left-0 right-0 top-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-lg">
            <div
              className={`h-4 w-4 rounded-full border-2 border-cyan-600 border-t-transparent ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span className="text-xs font-black text-cyan-700">
              {refreshing ? "Refreshing..." : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-md px-3 pt-3">
        <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <UsersRound size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                Patient Directory
              </p>
              <h1 className="text-xl font-black text-slate-950">Patients</h1>
              <p className="text-xs font-semibold text-slate-500">
                Fast access to patient timelines
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniStat label="Patients" value={patients.length} />
            <MiniStat label="Today" value={todayPatients} />
            <MiniStat label="Returning" value={returningPatients} />
          </div>
        </section>

        <section className="sticky top-0 z-20 mt-3 bg-[#f6f8fb] pb-2 pt-1">
          <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 shadow-sm">
            <Search size={17} className="text-cyan-600" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient"
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />

            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>
        </section>

        {loading ? (
          <LoadingState />
        ) : filteredPatients.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="space-y-3">
            <PatientGroup title="Today" patients={groupedPatients.today} />
            <PatientGroup title="Returning" patients={groupedPatients.returning} />
            <PatientGroup title="All Patients" patients={groupedPatients.others} />
          </section>
        )}
      </div>
    </main>
  );
}

function PatientGroup({ title, patients }) {
  if (!patients.length) return null;

  return (
    <section className="rounded-[1.5rem] border border-slate-100 bg-white p-2.5 shadow-sm">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <h2 className="text-[11px] font-black uppercase tracking-wide text-slate-500">
          {title}
        </h2>

        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">
          {patients.length}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {patients.map((patient) => (
          <PatientRow key={patient.id} patient={patient} />
        ))}
      </div>
    </section>
  );
}

function PatientRow({ patient }) {
  const appointment = patient.lastAppointment;
  const meta = [patient.age ? `${patient.age} yrs` : null, patient.gender]
    .filter(Boolean)
    .join(" • ");

  return (
    <Link
      to={`/doctor/appointment/${appointment.id}/patient-profile`}
      className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl px-2 py-2.5 active:bg-slate-50"
    >
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-cyan-50 text-cyan-600">
        {patient.image ? (
          <img
            src={patient.image}
            alt={patient.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound size={22} />
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-sm font-black text-slate-950">
          {patient.name}
        </h3>

        <p className="truncate text-[11px] font-semibold text-slate-500">
          {meta || "Patient"} • {patient.totalVisits}{" "}
          {patient.totalVisits === 1 ? "visit" : "visits"}
        </p>

        <p className="mt-0.5 flex items-center gap-1 text-[10px] font-black text-cyan-700">
          <CalendarCheck size={11} />
          Last: {formatVisitDate(patient.lastVisitDate)}
        </p>
      </div>

      <ChevronRight size={18} className="text-slate-300" />
    </Link>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-2 py-3 text-center">
      <p className="text-xl font-black leading-none text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <section className="space-y-3">
      {[1, 2, 3].map((group) => (
        <div
          key={group}
          className="rounded-[1.5rem] border border-slate-100 bg-white p-2.5 shadow-sm"
        >
          <div className="mb-2 h-3 w-20 rounded-full bg-slate-100" />

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="grid animate-pulse grid-cols-[44px_1fr_auto] items-center gap-3 px-2 py-2.5"
            >
              <div className="h-11 w-11 rounded-2xl bg-slate-100" />
              <div>
                <div className="h-3 w-36 rounded-full bg-slate-100" />
                <div className="mt-2 h-3 w-24 rounded-full bg-slate-100" />
              </div>
              <div className="h-4 w-4 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
      <UsersRound className="mx-auto text-cyan-600" size={36} />

      <h3 className="mt-3 text-lg font-black text-slate-950">
        No patients found
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Patients will appear after appointments are booked.
      </p>
    </div>
  );
}