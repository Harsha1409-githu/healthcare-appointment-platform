import { useEffect, useState } from "react";
import {
  IndianRupee,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

export default function DoctorEarnings() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEarnings = async () => {
    try {
      const res = await api.get(`/appointment/doctor/${doctor.id}/earnings`);
      setData(res.data);
    } catch (error) {
      console.error("Doctor earnings error:", error);
      alert("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctor?.id) loadEarnings();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center">
        <Loader2 className="text-cyan-600 animate-spin" size={36} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader title="Earnings" subtitle="Revenue and consultation insights" />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-cyan-600 rounded-3xl p-5 text-white shadow-sm">
          <p className="text-cyan-100 font-bold text-sm">This Month</p>

          <div className="flex items-center mt-2">
            <IndianRupee size={28} />
            <h1 className="text-4xl font-black">{data?.monthRevenue || 0}</h1>
          </div>

          <p className="text-sm text-cyan-100 mt-2">
            From {data?.completedConsultations || 0} completed consultations
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 mt-3">
          <EarningCard
            icon={IndianRupee}
            label="Today"
            value={`₹${data?.todayRevenue || 0}`}
          />
          <EarningCard
            icon={TrendingUp}
            label="Total"
            value={`₹${data?.totalRevenue || 0}`}
          />
          <EarningCard
            icon={CheckCircle2}
            label="Completed"
            value={data?.completedConsultations || 0}
          />
          <EarningCard
            icon={CalendarCheck}
            label="Booked"
            value={data?.booked || 0}
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Daily Revenue
          </h2>

          {!data?.dailyRevenue?.length ? (
            <div className="bg-slate-50 rounded-2xl p-5 text-center text-sm text-slate-500 font-semibold">
              No completed consultations this month
            </div>
          ) : (
            <div className="space-y-3">
              {data.dailyRevenue.map((item) => (
                <div key={item.date}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-black text-slate-700">
                      {item.date}
                    </span>
                    <span className="font-black text-cyan-700">
                      ₹{item.revenue}
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-600 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (item.revenue / Math.max(data.monthRevenue || 1, 1)) *
                            100 *
                            4
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Summary
          </h2>

          <SummaryRow label="Consultation Fee" value={`₹${data?.consultationFee || 0}`} />
          <SummaryRow label="Booked Appointments" value={data?.booked || 0} />
          <SummaryRow label="Cancelled Appointments" value={data?.cancelled || 0} />
          <SummaryRow label="Completed Consultations" value={data?.completedConsultations || 0} />
        </section>
      </div>
    </main>
  );
}

function EarningCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <p className="text-xl font-black text-slate-950 mt-3">{value}</p>
      <p className="text-xs text-slate-500 font-bold mt-1">{label}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
      <p className="text-sm text-slate-500 font-bold">{label}</p>
      <p className="text-sm text-slate-950 font-black">{value}</p>
    </div>
  );
}