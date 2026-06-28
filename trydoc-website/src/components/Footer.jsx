export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
                TD
              </div>

              <div>
                <p className="text-xl font-black text-slate-950">TryDoc</p>
                <p className="text-xs font-bold text-cyan-700">
                  Smart Healthcare for Everyone
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              TryDoc connects patients, doctors and hospitals through one smart
              healthcare platform.
            </p>

            <p className="mt-5 text-sm font-bold text-slate-400">
              Made with ❤️ in India
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={["Patients", "Doctors", "Hospitals", "AI Health"]}
          />

          <FooterColumn
            title="Company"
            links={["About", "Contact", "Careers", "Press"]}
          />

          <FooterColumn
            title="Legal"
            links={["Privacy", "Terms", "Security"]}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-bold text-slate-400">
            © 2026 TryDoc. All rights reserved.
          </p>

          <a
            href="mailto:support@trydoc.co"
            className="text-sm font-black text-cyan-700"
          >
            support@trydoc.co
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-black text-slate-950">{title}</h4>

      <div className="mt-4 space-y-3">
        {links.map((item) => (
          <a
            key={item}
            href="#"
            className="block text-sm font-bold text-slate-500 hover:text-cyan-600"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}