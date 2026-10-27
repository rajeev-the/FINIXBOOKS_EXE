import React from "react";
import { Building2, CheckCircle2, XCircle } from "lucide-react";

export const SyncProgressHeader = ({
  status,
  companyName,
  fromDate,
  toDate,
  period,
}) => {
  return (
    <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-slate-900 font-bold text-sm leading-tight">
              Real-time Data Sync
            </h3>
            {status === "syncing" && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Live Syncing
              </span>
            )}
            {status === "completed" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Completed
              </span>
            )}
            {status === "error" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <XCircle className="w-3 h-3 text-rose-600" />
                Failed
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span className="font-semibold text-slate-700 truncate max-w-[240px]">
              {companyName}
            </span>
            {fromDate && toDate && (
              <span className="text-slate-400 text-[11px]">
                ({fromDate} → {toDate})
              </span>
            )}
            {period && (
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.2 rounded uppercase">
                {period}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SyncProgressHeader;
