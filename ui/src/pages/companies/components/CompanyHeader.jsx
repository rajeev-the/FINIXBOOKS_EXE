import React from "react";
import { Building2, RefreshCw } from "lucide-react";

export const CompanyHeader = ({
  tenants,
  selectedTenant,
  onSelectTenant,
  onRefresh,
  loading,
  liveCount = 0,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 pb-4 border-b border-slate-200/80">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Connected Companies
          </h1>
          {liveCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              {liveCount} {liveCount === 1 ? "Company" : "Companies"} Live in Tally
            </span>
          )}
        </div>
        <p className="text-slate-500 text-xs">
          Manage synchronized Tally company databases & workspaces
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tenant:
          </label>
          <select
            value={selectedTenant}
            onChange={(e) => onSelectTenant(e.target.value)}
            className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer min-w-[160px]"
          >
            <option value="" disabled>
              Select tenant...
            </option>
            {tenants.map((t, idx) => {
              const tenantName =
                t.tenant?.name || t.name || t.tenantName || "Unknown Tenant";
              const tenantId =
                t.tenant?._id || t.tenant?.id || t._id || t.id || idx;
              return (
                <option key={tenantId} value={tenantId}>
                  {tenantName}
                </option>
              );
            })}
          </select>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading || !selectedTenant}
          className="flex items-center gap-1.5 bg-white/80 hover:bg-white text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-all border border-slate-200 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          title="Refresh company data"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-indigo-600 ${
              loading ? "animate-spin" : ""
            }`}
          />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default CompanyHeader;
