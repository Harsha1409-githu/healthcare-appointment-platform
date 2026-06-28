import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "AI", href: "#ai" },
    { label: "Security", href: "#security" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
            TD
          </div>

          <div>
            <p className="text-xl font-black leading-none tracking-tight text-slate-950">
              TryDoc
            </p>
            <p className="mt-1 text-[11px] font-bold text-cyan-700">
              Smart Healthcare for Everyone
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-bold text-slate-600 transition hover:text-cyan-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#waitlist"
          className="hidden rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-cyan-600 lg:inline-flex"
        >
          Get Early Access
        </a>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-white/80 text-slate-950 shadow-sm backdrop-blur-xl lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mx-5 mb-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl lg:hidden">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-2xl bg-cyan-600 px-4 py-3 text-center text-sm font-black text-white"
          >
            Get Early Access
          </a>
        </div>
      )}
    </header>
  );
}