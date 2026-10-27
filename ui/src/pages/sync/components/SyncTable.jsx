import React from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { SYNC_MODULES } from "../../../utils/constants";

export const SyncTable = ({
  loadingMap,
  statusMap,
  onRequestSync,
  isAnySyncing,
}) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-transparent">
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-slate-50/80 text-slate-500 sticky top-0 z-10 border-b border-slate-200/80 backdrop-blur-xs">
          <tr>
            <th className="px-5 py-2.5 font-semibold text-[10px] uppercase tracking-wider w-12 text-center">
              Module
            </th>
            <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
              Target Entity
            </th>
            <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider hidden md:table-cell">
              Synchronization Scope
            </th>
            <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider w-36 text-center">
              Current Status
            </th>
            <th className="px-5 py-2.5 font-semibold text-[10px] uppercase tracking-wider w-28 text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {SYNC_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isLoading = loadingMap[mod.endpoint];
            const status = statusMap[mod.endpoint];

            return (
              <tr
                key={mod.endpoint}
                className="bg-transparent hover:bg-slate-50/60 transition-colors group"
              >
                <td className="px-5 py-3 align-middle text-center">
                  <div className="flex justify-center">
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                </td>
                <td className="px-4 py-3 align-middle font-bold text-slate-800 text-xs">
                  {mod.name}
                </td>
                <td className="px-4 py-3 align-middle hidden md:table-cell">
                  {mod.endpoint === "vouchers" ? (
                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Date Range Required
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium">
                      Full Entity Table Sync
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 align-middle text-center">
                  <div className="flex items-center justify-center">
                    {status === "success" && (
                      <span className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />{" "}
                        Synced
                      </span>
                    )}
                    {status === "error" && (
                      <span className="flex items-center gap-1.5 text-red-700 text-[10px] font-bold uppercase tracking-wider bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                        <AlertCircle className="w-3 h-3 text-red-600" /> Failed
                      </span>
                    )}
                    {!status && !isLoading && (
                      <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        Idle
                      </span>
                    )}
                    {isLoading && (
                      <span className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />{" "}
                        Syncing
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 align-middle text-right">
                  <button
                    onClick={() => onRequestSync(mod.endpoint)}
                    disabled={isLoading || isAnySyncing}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-slate-200/80 cursor-pointer"
                  >
                    Sync
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SyncTable;
