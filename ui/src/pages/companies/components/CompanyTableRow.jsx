import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export const CompanyTableRow = ({ company, onOpenAddModal }) => {
  const compName =
    company.displayName ||
    company.name ||
    company.companyName ||
    "Unknown Company";
  const isSynced = company.syncStatus === "sync";
  const isLive = Boolean(company.isLive);

  return (
    <tr className="bg-transparent hover:bg-slate-50/60 transition-colors group">
      <td className="px-4 py-3.5 align-middle text-center">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] mx-auto border relative ${
            isLive
              ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20"
              : isSynced
              ? "bg-slate-50 text-slate-700 border-slate-200"
              : "bg-amber-50 text-amber-700 border-amber-200/60"
          }`}
        >
          {compName.charAt(0).toUpperCase()}
          {isLive && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs whitespace-normal leading-snug">
              {compName}
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-300/60">
                LIVE
              </span>
            )}
          </div>
          {company.name && company.name !== compName && (
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
              {company.name}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle text-center">
        {isLive ? (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2.5 py-1 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live in Tally
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            Not Open
          </span>
        )}
      </td>
      <td className="px-4 py-3.5 align-middle text-center">
        {isSynced ? (
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Synced
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Not Synced
          </span>
        )}
      </td>
      <td className="px-4 py-3.5 align-middle text-right pr-6">
        {isSynced ? (
          <button
            onClick={() => onOpenAddModal(company)}
            className={`text-xs font-semibold px-3 py-1 rounded-lg uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs whitespace-nowrap border ${
              isLive
                ? "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200/80"
                : "text-amber-700 bg-amber-50/80 hover:bg-amber-100 border-amber-200"
            }`}
            title={
              isLive
                ? "Click to re-sync company data"
                : "Company is closed in Tally. Click to see instructions."
            }
          >
            {isLive ? (
              <RefreshCw className="w-3 h-3 text-indigo-600" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-amber-600" />
            )}
            Re-Sync
          </button>
        ) : (
          <button
            onClick={() => onOpenAddModal(company)}
            className={`text-xs font-semibold px-3 py-1 rounded-lg uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs whitespace-nowrap ${
              isLive
                ? "text-white bg-indigo-600 hover:bg-indigo-500"
                : "text-amber-900 bg-amber-200/80 hover:bg-amber-300 border border-amber-300"
            }`}
            title={
              isLive
                ? "Click to add & sync this company"
                : "Company is closed in Tally. Click to see instructions."
            }
          >
            {isLive ? (
              <RefreshCw className="w-3 h-3 text-white" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-amber-700" />
            )}
            Add & Sync
          </button>
        )}
      </td>
    </tr>
  );
};

export default CompanyTableRow;
