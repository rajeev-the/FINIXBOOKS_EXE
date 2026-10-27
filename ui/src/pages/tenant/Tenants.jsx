import { useSelector } from "react-redux";
import { Building, Shield, CalendarDays } from "lucide-react";

const Tenants = () => {
  const stateUser = useSelector((state) => state.auth.user);
  const profile = stateUser?.user || stateUser || {};
  const tenants = profile.tenants || [];

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Minimal Header */}
      <div className="flex items-center justify-between shrink-0 pb-4 border-b border-slate-200/80">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" />
            Organizations & Tenants
          </h1>
          <p className="text-slate-500 text-xs">
            Your mapped organization workspaces and tenant access roles
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
          Total: {tenants.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {tenants.length > 0 ? (
          <div className="flex flex-col gap-2.5 pb-4">
            {tenants.map((t, idx) => {
              const tenantName =
                t.tenant?.name || t.name || t.tenantName || "Unknown Tenant";
              const role = t.role || "Member";

              return (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-md rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100/80 font-bold text-xs shrink-0 uppercase tracking-wider">
                      {tenantName.charAt(0)}
                    </div>
                    <div className="flex flex-col truncate pr-2">
                      <h3 className="font-bold text-slate-900 capitalize text-xs tracking-tight truncate">
                        {tenantName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Active Workspace
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-semibold text-[10px] uppercase tracking-wider">
                      <Shield className="w-3 h-3 text-emerald-600" />
                      <span>{role}</span>
                    </div>
                    {t.createdAt && (
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium hidden sm:flex">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/50 backdrop-blur-md rounded-xl border border-dashed border-slate-300 p-8">
            <Building className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-slate-600 font-semibold text-xs">
              No organizations found.
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Contact your administrator to map organization tenants.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tenants;

