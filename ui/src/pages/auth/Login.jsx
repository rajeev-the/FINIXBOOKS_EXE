import { useState } from "react";
import { ArrowRight, ShieldCheck, Mail } from "lucide-react";
import logoImg from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // 'email' or 'otp'
  const [isSending, setIsSending] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSending(true);

    try {
      await authService.requestOtp(email);
      setStep("otp");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error sending OTP");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsSending(true);

    try {
      const verifyRes = await authService.verifyOtp(email, otp);
      const verifyData = verifyRes.data;

      if (verifyData.success) {
        const { accessToken, refreshToken } = verifyData.data;

        localStorage.setItem("tb_access_token", accessToken);
        localStorage.setItem("tb_refresh_token", refreshToken);

        // Fetch user data
        const meRes = await authService.getProfile();

        // Dispatch Redux Login Success with the user profile
        dispatch(loginSuccess(meRes.data.data || meRes.data));
        navigate("/companies", { replace: true });
      } else {
        throw new Error(verifyData.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#F5F7FA] text-slate-900 overflow-hidden font-sans items-center justify-center relative select-none [-webkit-app-region:drag]">
      {/* Background subtle radial ambient highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_40%,rgba(99,102,241,0.06)_0%,transparent_100%)] pointer-events-none" />

      {/* Floating Glass Auth Card */}
      <div className="w-[380px] bg-white/85 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl p-8 animate-fade-in-up [-webkit-app-region:no-drag] z-10 relative">
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <img
            src={logoImg}
            alt="FinixBooks"
            className="w-12 h-12 rounded-xl object-contain mb-3 shadow-xs"
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            FinixBooks
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {step === "email"
              ? "Sign in with your email address"
              : "Enter the security verification code"}
          </p>
        </div>

        {step === "email" ? (
          <form
            onSubmit={handleRequestOtp}
            className="flex flex-col gap-4 animate-fade-in-up"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-0.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400 font-medium"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-semibold flex items-center justify-center gap-2 py-2.5 rounded-lg shadow-xs transition-all text-xs cursor-pointer active:scale-98 mt-1"
            >
              {isSending ? "Sending Code..." : "Request Access Code"}
              {!isSending && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            className="flex flex-col gap-4 animate-fade-in-up"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-0.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Verification OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-indigo-600 hover:text-indigo-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  Change Email
                </button>
              </div>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-indigo-600" />
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all tracking-widest font-mono text-base font-bold"
                  placeholder="000000"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 ml-0.5">
                Code sent to{" "}
                <span className="text-slate-800 font-semibold">{email}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg shadow-xs transition-all text-xs cursor-pointer active:scale-98 mt-1"
            >
              {isSending ? "Verifying..." : "Verify & Sign In"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-slate-500 text-xs">
          Don't have an organization?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
