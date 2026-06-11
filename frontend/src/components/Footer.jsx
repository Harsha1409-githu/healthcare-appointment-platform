import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <HeartPulse size={30} />
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  MediCare
                </h2>

                <p className="text-slate-400">
                  Smart Healthcare Platform
                </p>
              </div>
            </div>

            <p className="text-slate-400 mt-6 leading-relaxed max-w-md">
              Connecting patients, doctors and hospitals through
              modern healthcare technology, AI assistance and
              seamless consultations.
            </p>

            <div className="flex gap-3 mt-6">
              <Social icon={Globe} />
<Social icon={Globe} />
<Social icon={Globe} />
<Social icon={Globe} />
            </div>
          </div>

          <FooterColumn
            title="Platform"
            links={[
              ["Find Doctors", "/doctors"],
              ["Hospitals", "/hospitals"],
              ["AI Assistant", "/symptom-checker"],
              ["Appointments", "/doctors"],
            ]}
          />

          <FooterColumn
            title="Resources"
            links={[
              ["Medical Records", "/patient/dashboard"],
              ["Video Consultation", "/doctors"],
              ["Prescriptions", "/patient/dashboard"],
              ["Reviews", "/doctors"],
            ]}
          />

          <div>
            <h3 className="font-black text-lg mb-5">
              Contact
            </h3>

            <div className="space-y-4">
              <ContactItem
                icon={Mail}
                text="support@medicare.com"
              />

              <ContactItem
                icon={Phone}
                text="+91 9876543210"
              />

              <ContactItem
                icon={MapPin}
                text="Chennai, India"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 MediCare. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms & Conditions</Link>
            <Link to="/">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-black text-lg mb-5">
        {title}
      </h3>

      <div className="space-y-3">
        {links.map(([label, path]) => (
          <Link
            key={label}
            to={path}
            className="block text-slate-400 hover:text-white transition"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <Icon size={18} />
      <span>{text}</span>
    </div>
  );
}

function Social({ icon: Icon }) {
  return (
    <button className="w-11 h-11 rounded-2xl bg-slate-900 hover:bg-blue-600 transition flex items-center justify-center">
      <Icon size={20} />
    </button>
  );
}