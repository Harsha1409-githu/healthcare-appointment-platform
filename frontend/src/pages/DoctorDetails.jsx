import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Stethoscope,
  GraduationCap,
  BriefcaseMedical,
  IndianRupee,
  MapPin,
  Building2,
  BadgeCheck,
  Star,
  CalendarCheck,
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Video,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [loading, setLoading] = useState(true);

  const [openSection, setOpenSection] = useState("about");

  useEffect(() => {
    Promise.all([
      api.get(`/doctor/${id}`),
      api.get(`/slot/doctor/${id}/available`),
    ])
      .then(([doctorRes, slotRes]) => {
        setDoctor(doctorRes.data);

        const availableSlots = slotRes.data || [];
        setSlots(availableSlots);

        if (availableSlots.length > 0) {
          setSelectedSlotId(availableSlots[0].id);
        }
      })
      .catch((err) => {
        console.error("Doctor details error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const selectedSlot = useMemo(
    () =>
      slots.find((slot) => String(slot.id) === String(selectedSlotId)) ||
      slots[0],
    [slots, selectedSlotId]
  );

  const doctorImage =
    doctor?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doctor?.doctorName || "Doctor"
    )}&background=0891b2&color=fff&bold=true`;

  const bookNow = () => {
    if (!doctor?.id || !selectedSlot?.id) {
      alert("No slot available for booking");
      return;
    }

    navigate(`/book/${doctor.id}/${selectedSlot.id}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Loader2 className="mx-auto text-cyan-600 animate-spin mb-4" size={38} />

          <p className="text-slate-500 font-bold">
            Loading doctor details...
          </p>
        </div>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Stethoscope className="text-red-500 mx-auto mb-3" size={36} />

          <p className="text-red-500 font-black text-xl">
            Doctor not found
          </p>

          <button
            onClick={() => navigate("/doctors")}
            className="mt-4 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black"
          >
            View Doctors
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-36">
      <PageHeader
        title="Doctor Profile"
        subtitle="Consultation details"
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex gap-3">
            <div className="relative shrink-0">
              <img
                src={doctorImage}
                alt={doctor.doctorName || "Doctor"}
                className="w-24 h-24 rounded-3xl object-cover border border-slate-100 shadow-sm"
              />

              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                <BadgeCheck size={14} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-100">
                <ShieldCheck size={12} />
                Verified Doctor
              </div>

              <h1 className="text-xl font-black text-slate-950 truncate mt-2">
                {doctor.doctorName}
              </h1>

              <p className="text-sm text-cyan-700 font-black truncate">
                {doctor.specialization || "Specialist"}
              </p>

              <p className="text-xs text-slate-500 mt-1 truncate">
                {doctor.qualification || "Qualification not available"}
              </p>

              <div className="flex items-center gap-2 text-emerald-600 font-black text-xs mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Available Today
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniBadge icon={Star} title="4.8" subtitle="Rating" />
            <MiniBadge
              icon={BriefcaseMedical}
              title={`${doctor.experience || 0}+`}
              subtitle="Years"
            />
            <MiniBadge icon={Video} title="Video" subtitle="Consult" />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Clinic Details
          </h2>

          <InfoLine
            icon={Building2}
            text={doctor.hospital?.hospitalName || "Hospital Not Available"}
          />

          <InfoLine
            icon={MapPin}
            text={doctor.city || doctor.hospital?.city || "Location Available"}
          />

          <InfoLine
            icon={CalendarCheck}
            text="Instant appointment booking available"
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Available Slots
              </h2>

              <p className="text-xs text-slate-500">
                Choose your preferred time
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 font-black text-xs">
              {slots.length} Slots
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 text-center">
              <CalendarCheck className="mx-auto text-slate-300 mb-3" size={36} />

              <h3 className="text-lg font-black text-slate-950">
                No slots available
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Please check later or choose another doctor.
              </p>
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {slots.map((slot) => {
                const active = String(selectedSlotId) === String(slot.id);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`shrink-0 min-w-[132px] rounded-2xl border p-3 text-left active:scale-95 transition ${
                      active
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                        : "bg-slate-50 text-slate-800 border-slate-100"
                    }`}
                  >
                    <p
                      className={`text-xs font-black ${
                        active ? "text-cyan-50" : "text-cyan-700"
                      }`}
                    >
                      {slot.date}
                    </p>

                    <p className="text-sm font-black mt-1">
                      {slot.startTime}
                    </p>

                    <p
                      className={`text-xs mt-0.5 ${
                        active ? "text-cyan-50" : "text-slate-500"
                      }`}
                    >
                      to {slot.endTime}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">
                Consultation Fee
              </p>

              <div className="flex items-center text-2xl font-black text-slate-950 mt-1">
                <IndianRupee size={20} />
                {doctor.consultationFee || 0}
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <IndianRupee className="text-cyan-600" size={26} />
            </div>
          </div>

          {selectedSlot && (
            <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
              <p className="text-xs font-black text-emerald-700">
                Selected Slot
              </p>

              <p className="text-sm font-black text-slate-950 mt-1">
                {selectedSlot.date} • {selectedSlot.startTime} -{" "}
                {selectedSlot.endTime}
              </p>
            </div>
          )}
        </section>

        <Accordion
          title="About Doctor"
          open={openSection === "about"}
          onClick={() =>
            setOpenSection(openSection === "about" ? "" : "about")
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={Stethoscope}
              label="Speciality"
              value={doctor.specialization}
            />

            <InfoCard
              icon={BriefcaseMedical}
              label="Experience"
              value={`${doctor.experience || 0} Years`}
            />

            <InfoCard
              icon={GraduationCap}
              label="Qualification"
              value={doctor.qualification}
            />

            <InfoCard
              icon={AwardIcon}
              label="Verified"
              value="Yes"
            />
          </div>
        </Accordion>

        <Accordion
          title="Contact Information"
          open={openSection === "contact"}
          onClick={() =>
            setOpenSection(openSection === "contact" ? "" : "contact")
          }
        >
          <InfoLine icon={Phone} text={doctor.mobile || "Mobile not available"} />
          <InfoLine icon={Mail} text={doctor.email || "Email not available"} />
        </Accordion>

        <Accordion
          title="Hospital"
          open={openSection === "hospital"}
          onClick={() =>
            setOpenSection(openSection === "hospital" ? "" : "hospital")
          }
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center overflow-hidden border border-cyan-100">
              {doctor.hospital?.profileImage ? (
                <img
                  src={doctor.hospital.profileImage}
                  alt={doctor.hospital?.hospitalName || "Hospital"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={26} className="text-cyan-600" />
              )}
            </div>

            <div>
              <p className="font-black text-slate-950">
                {doctor.hospital?.hospitalName || "Hospital"}
              </p>

              <p className="text-sm text-slate-500">
                Healthcare Partner
              </p>
            </div>
          </div>
        </Accordion>

        <Link
          to="/doctors"
          className="mt-3 flex items-center justify-center gap-2 bg-white border border-slate-100 rounded-3xl py-4 font-black text-cyan-700 shadow-sm"
        >
          View Other Doctors
          <ArrowRight size={17} />
        </Link>
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3">
          <button
            type="button"
            disabled={!selectedSlot}
            onClick={bookNow}
            className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black disabled:bg-slate-300 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {selectedSlot ? (
              <>
                Book Appointment • ₹{doctor.consultationFee || 0}
                <ArrowRight size={18} />
              </>
            ) : (
              "No Slots Available"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

function MiniBadge({ icon: Icon, title, subtitle }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 text-center">
      <Icon className="text-cyan-600 mx-auto" size={18} />

      <p className="text-sm font-black text-slate-950 mt-1">
        {title}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {subtitle}
      </p>
    </div>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-3 min-w-0 mt-2 first:mt-0">
      <Icon size={18} className="text-cyan-600 shrink-0" />

      <span className="truncate text-sm font-bold">
        {text || "-"}
      </span>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
      <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon size={19} className="text-cyan-600" />
      </div>

      <p className="text-[10px] font-black uppercase text-slate-400">
        {label}
      </p>

      <p className="font-black text-slate-950 text-sm mt-1 truncate">
        {value || "-"}
      </p>
    </div>
  );
}

function Accordion({ title, open, onClick, children }) {
  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between gap-3"
      >
        <h2 className="text-lg font-black text-slate-950">
          {title}
        </h2>

        {open ? (
          <ChevronUp className="text-slate-400" size={21} />
        ) : (
          <ChevronDown className="text-slate-400" size={21} />
        )}
      </button>

      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}

function AwardIcon(props) {
  return <BadgeCheck {...props} />;
}