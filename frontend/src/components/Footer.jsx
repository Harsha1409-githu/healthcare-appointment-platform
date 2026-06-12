import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-[1450px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center">
                <HeartPulse size={28} />
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  MediCare
                </h2>

                <p className="text-slate-400 text-sm">
                  Healthcare made simple
                </p>
              </div>
            </Link>

            <p className="text-slate-400 mt-6 leading-relaxed max-w-md">
              MediCare connects patients, doctors and hospitals through
              appointment booking, online consultations, AI health guidance,
              prescriptions and secure medical records.
            </p>

            <div className="flex gap-3 mt-6">
  <SocialIcon Icon={FaFacebookF} />
  <SocialIcon Icon={FaInstagram} />
  <SocialIcon Icon={FaTwitter} />
  <SocialIcon Icon={FaLinkedinIn} />
</div>
          </div>

          <FooterColumn
            title="For Patients"
            links={[
              ["Find Doctors", "/doctors"],
              ["Video Consult", "/video-consult"],
              ["Lab Tests", "/patient/lab-tests"],
              ["AI Health Assistant", "/symptom-checker"],
              ["Medical Records", "/patient/medical-records"],
            ]}
          />

          <FooterColumn
            title="For Providers"
            links={[
              ["Doctor Login", "/doctor/login"],
              ["Hospital Login", "/hospital/login"],
              ["Register Hospital", "/hospital/register"],
              ["Admin Login", "/admin/login"],
            ]}
          />

          <div>
            <FooterColumn
              title="Company"
              links={[
                ["About Us", "/"],
                ["Contact", "/"],
                ["Careers", "/"],
                ["Privacy Policy", "/"],
                ["Terms & Conditions", "/"],
              ]}
            />

            <div className="mt-8">
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
                  text="+91 98765 43210"
                />

                <ContactItem
                  icon={MapPin}
                  text="Chennai, India"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 MediCare. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link to="/" className="hover:text-white transition">
              Privacy Policy
            </Link>

            <Link to="/" className="hover:text-white transition">
              Terms
            </Link>

            <Link to="/" className="hover:text-white transition">
              Help Center
            </Link>
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
      <Icon size={18} className="text-cyan-500" />
      <span>{text}</span>
    </div>
  );
}

function SocialIcon({ Icon }) {
  return (
    <button className="w-11 h-11 rounded-2xl bg-slate-900 hover:bg-cyan-600 transition flex items-center justify-center">
      <Icon size={18} />
    </button>
  );
}