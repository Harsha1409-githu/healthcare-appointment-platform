import { KeyRound, LockKeyhole, ShieldCheck, UserCheck } from "lucide-react";

const items = [
  "Secure authentication",
  "Role-based access",
  "Protected health records",
  "Privacy-first workflows",
];

export default function SecuritySection() {
  const icons = [KeyRound, UserCheck, LockKeyhole, ShieldCheck];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="bg-[#f8fbfc] rounded-[2.5rem] border border-slate-100 p-7 md:p-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-black text-cyan-700">SECURITY</p>
              <h2 className="text-4xl md:text-5xl font-black mt-3">
                Built with trust at the center.
              </h2>
              <p className="text-slate-600 mt-5 leading-relaxed">
                Healthcare data deserves careful handling. TryDoc is designed
                with secure access patterns, role-based experiences and a
                privacy-first approach.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item, index) => {
                const Icon = icons[index];

                return (
                  <div
                    key={item}
                    className="bg-white rounded-[2rem] border border-slate-100 p-5 shadow-sm"
                  >
                    <Icon className="text-cyan-600" size={26} />
                    <p className="font-black mt-4">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-8">
            Note: Compliance claims should be added only after proper legal,
            security and regulatory review.
          </p>
        </div>
      </div>
    </section>
  );
}