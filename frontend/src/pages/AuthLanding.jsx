import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Loader2,
} from "lucide-react";

export default function AuthLanding() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [sending, setSending] = useState(false);

  const patientToken = localStorage.getItem("patientToken");

  if (patientToken) {
  navigate("/home", { replace: true });
  return null;
}

  const sendOtp = async (e) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      alert("Please enter a valid 10 digit mobile number");
      return;
    }

    try {
      setSending(true);

      localStorage.setItem("devOtp", "123456");
      localStorage.setItem("devOtpMobile", mobile);

      alert("OTP sent successfully. Use 123456 for testing.");

      navigate("/otp-login", {
        state: {
          mobile,
        },
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#293895] flex flex-col">
      <section className="flex-1 px-6 pt-16 text-white">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-300" />

            <h1 className="text-4xl font-black tracking-tight">
              TryDoc
            </h1>

            <span className="w-2.5 h-2.5 rounded-full bg-cyan-300" />
          </div>

          <div className="mt-14 flex justify-center">
            <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
              <HeartPulse size={96} className="text-white" />
            </div>
          </div>

          <h2 className="text-xl font-black mt-12 leading-snug">
            Connect with trusted doctors anytime
          </h2>

          <p className="text-sm text-blue-100 mt-3 leading-relaxed">
            Book appointments, video consults and manage your health.
          </p>

          <div className="flex justify-center gap-2 mt-8">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-white/30" />
            <span className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-t-[2rem] px-5 pt-6 pb-7">
        <div className="max-w-md mx-auto">
          <p className="font-black text-slate-900">
            Enter mobile number to continue
          </p>

          <form onSubmit={sendOtp} className="mt-4">
            <div className="flex items-center border border-slate-300 rounded-2xl overflow-hidden bg-white">
              <div className="px-4 py-4 border-r border-slate-200 text-slate-800 font-bold">
                +91
              </div>

              <input
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                inputMode="numeric"
                placeholder="Mobile number"
                className="w-full px-4 py-4 outline-none text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-4 w-full bg-cyan-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:bg-slate-400 active:scale-95 transition"
            >
              {sending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={13} className="text-cyan-600" />
              Secure OTP login
            </span>

            <button
              type="button"
              onClick={() => navigate("/account")}
              className="inline-flex items-center gap-1 underline"
            >
              <HelpCircle size={13} />
              Need help?
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-3">
            Testing OTP: <span className="font-black">123456</span>
          </p>
        </div>
      </section>
    </main>
  );
}