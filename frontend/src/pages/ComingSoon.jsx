import { Mail, ShieldCheck, Stethoscope, Video, FileText } from "lucide-react";

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-[#f8fbfc] px-5 py-8 flex items-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-[2rem] bg-cyan-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-3xl font-black">TD</span>
          </div>

          <h1 className="text-5xl font-black text-slate-950 mt-6">
            TryDoc
          </h1>

          <p className="text-xl font-black text-cyan-700 mt-2">
            Smart Healthcare for Everyone
          </p>

          <p className="text-sm text-slate-500 mt-5 leading-relaxed">
            Book doctor appointments, consult online, manage prescriptions,
            health records, follow-ups and family healthcare in one smart
            platform.
          </p>
        </div>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 mt-8">
          <h2 className="font-black text-slate-950 text-lg">
            Coming Soon
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            TryDoc is currently in development and will launch soon.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <Feature icon={Stethoscope} title="Doctor Booking" />
            <Feature icon={Video} title="Video Consult" />
            <Feature icon={FileText} title="Prescriptions" />
            <Feature icon={ShieldCheck} title="Health Records" />
          </div>
        </section>

        <section className="bg-cyan-600 text-white rounded-[2rem] p-5 mt-5">
          <h3 className="font-black text-lg">Stay Updated</h3>

          <p className="text-sm text-cyan-100 mt-1">
            For launch updates and partnerships, contact us.
          </p>

          <a
            href="mailto:support@trydoc.co"
            className="mt-4 bg-white text-cyan-700 py-3 rounded-2xl font-black flex items-center justify-center gap-2"
          >
            <Mail size={17} />
            support@trydoc.co
          </a>
        </section>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 TryDoc.co • Book • Consult • Heal
        </p>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, title }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
      <Icon className="text-cyan-600 mx-auto" size={22} />
      <p className="text-xs font-black text-slate-800 mt-2">
        {title}
      </p>
    </div>
  );
}