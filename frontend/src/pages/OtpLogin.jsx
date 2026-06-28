import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  HeartPulse,
  Loader2,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import api from "../api/axios";

export default function OtpLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const mobile = location.state?.mobile || localStorage.getItem("devOtpMobile") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!mobile) {
      navigate("/welcome", { replace: true });
      return;
    }

    inputRefs.current[0]?.focus();
  }, [mobile, navigate]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6).split("");
      const nextOtp = ["", "", "", "", "", ""];

      digits.forEach((digit, i) => {
        nextOtp[i] = digit;
      });

      setOtp(nextOtp);

      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = cleanValue;
    setOtp(updatedOtp);

    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (e) => {
  e.preventDefault();

  const finalOtp = otp.join("");

  if (finalOtp !== "123456") {
    alert("Invalid OTP. Use 123456 for testing.");
    return;
  }

  try {
    setLoading(true);

   

    const res = await api.post("/auth/patient/verify-otp", {
      mobile,
      otp: finalOtp,
    }); 

    localStorage.setItem("patientToken", res.data.access_token);
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("patientUser", JSON.stringify(res.data.user));
    localStorage.setItem("user", JSON.stringify(res.data.user));

    

    localStorage.removeItem("selectedProfile");

window.dispatchEvent(new Event("patientProfileUpdated"));

window.location.replace("/patient/select-profile");
  } catch (error) {
  const errorData = error?.response?.data;
  const errorMessage =
    errorData?.message ||
    error?.message ||
    "OTP verification failed";

  console.log("OTP STATUS", error?.response?.status);
  console.log("OTP DATA", JSON.stringify(errorData));
  console.log("OTP MESSAGE", errorMessage);

  alert(
    typeof errorMessage === "string"
      ? errorMessage
      : JSON.stringify(errorMessage)
  );
} finally {
  setLoading(false);
}
};

  const resendOtp = async () => {
    try {
      setResending(true);

      localStorage.setItem("devOtp", "123456");
      localStorage.setItem("devOtpMobile", mobile);

      alert("OTP resent. Use 123456 for testing.");

      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
      inputRefs.current[0]?.focus();
    } finally {
      setResending(false);
    }
  };

  return (
  <main className="min-h-screen bg-[#f8fbfc] flex flex-col px-5 pt-10 pb-6">
    <section className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-[1.8rem] bg-cyan-600 flex items-center justify-center shadow-sm">
          <span className="text-white text-2xl font-black tracking-tight">
            TD
          </span>
        </div>

        <h1 className="text-4xl font-black text-slate-950 mt-6">
          TryDoc
        </h1>

        <p className="text-lg font-black text-cyan-700 mt-2">
          Smart Healthcare for Everyone
        </p>

        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Enter the 6-digit OTP sent to
          <br />
          <span className="font-black text-slate-800">+91 {mobile}</span>
        </p>
      </div>

      <form onSubmit={verifyOtp} className="mt-10">
        <div className="grid grid-cols-6 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              inputMode="numeric"
              maxLength={6}
              className="h-14 rounded-2xl border border-slate-200 bg-white text-center text-xl font-black text-slate-950 outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-cyan-600 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-2 disabled:bg-slate-400 active:scale-95 transition shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify & Continue
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={resendOtp}
        disabled={timer > 0 || resending}
        className="mt-5 w-full text-cyan-700 font-black text-sm disabled:text-slate-400 flex items-center justify-center gap-2"
      >
        <RefreshCcw size={15} />
        {resending
          ? "Sending..."
          : timer > 0
          ? `Resend OTP in ${timer}s`
          : "Resend OTP"}
      </button>

      <div className="mt-8 bg-white border border-slate-100 rounded-3xl p-4 text-center shadow-sm">
        <ShieldCheck size={18} className="inline mr-1 text-cyan-600" />
        <span className="text-xs text-slate-500 font-bold">
          Secure OTP login powered by TryDoc
        </span>
      </div>

      <p className="text-center text-xs text-slate-400 mt-4">
        Testing OTP: <span className="font-black">123456</span>
      </p>
    </section>
  </main>
);
}