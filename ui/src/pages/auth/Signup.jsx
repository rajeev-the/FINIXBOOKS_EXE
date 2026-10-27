import { useState } from "react";
import logoImg from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userEmail: "",
    tenantName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await authService.signup({
        user_email: formData.userEmail,
        tenant_name: formData.tenantName,
      });

      const resData = response.data;
      if (resData?.data) {
        if (resData.data.userId)
          localStorage.setItem("tb_user_id", resData.data.userId);
        if (resData.data.tenantId)
          localStorage.setItem("tb_tenant_id", resData.data.tenantId);
        if (resData.data.companyId)
          localStorage.setItem("tb_company_id", resData.data.companyId);
      }

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Signup failed:", err);
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to complete registration",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F5F7FA] text-slate-900 overflow-hidden font-sans pt-8 [-webkit-app-region:drag] select-none">
      {/* Sticky Top Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shrink-0 [-webkit-app-region:no-drag] z-10">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="FinixBooks"
            className="w-9 h-9 rounded-xl object-contain shadow-xs"
          />
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              Organization Registration
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              Create your tenant workspace profile for FinixBooks
              synchronization
            </p>
          </div>
        </div>
      </div>

      {/* Centered Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar flex items-center justify-center [-webkit-app-region:no-drag]">
        <div className="w-full max-w-xl bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-md rounded-2xl p-6 my-auto">
          {errorMsg && (
            <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}
          <form
            id="signupForm"
            onSubmit={handleSignup}
            className="flex flex-col gap-4"
          >
            <div>
              <h2 className="text-indigo-600 font-bold mb-3 text-xs tracking-wider uppercase border-b border-slate-100 pb-2">
                Primary Workspace Setup
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-0.5">
                    User Email *
                  </label>
                  <input
                    type="email"
                    name="userEmail"
                    required
                    value={formData.userEmail}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-0.5">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="tenantName"
                    required
                    value={formData.tenantName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                    placeholder="enterprise_corp"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Sticky Bottom Footer */}
      <div className="px-8 py-4 border-t border-slate-200/80 bg-white/80 backdrop-blur-md shrink-0 flex items-center justify-between [-webkit-app-region:no-drag] z-10 shadow-xs">
        <p className="text-slate-500 text-xs font-medium">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors ml-1"
          >
            Sign in here
          </Link>
        </p>

        <button
          type="submit"
          form="signupForm"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-semibold py-2 px-6 rounded-lg shadow-xs transition-all text-xs cursor-pointer active:scale-98"
        >
          {isSubmitting ? "Registering..." : "Complete Registration"}
        </button>
      </div>
    </div>
  );
}
