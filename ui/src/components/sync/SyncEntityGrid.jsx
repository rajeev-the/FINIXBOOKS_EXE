import React from "react";
import { RefreshCw } from "lucide-react";
import { ENTITIES_CONFIG } from "../../utils/constants";

export const SyncEntityGrid = ({ stats }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        Live Quantities & Master Data
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ENTITIES_CONFIG.map(({ key, label, icon: Icon, color }) => {
          const item = stats[key] || { count: 0, status: "pending" };
          const isSynced = item.status === "success" || item.count > 0;
          const isItemSyncing = item.status === "syncing";
          const isError = item.status === "error";

          return (
            <div
              key={key}
              className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                isItemSyncing
                  ? "bg-indigo-50/60 border-indigo-200 shadow-xs"
                  : isSynced
                  ? "bg-white border-slate-200/90 shadow-2xs"
                  : isError
                  ? "bg-rose-50/50 border-rose-200"
                  : "bg-slate-50/60 border-slate-200/60 opacity-65"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${color}`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-semibold text-slate-700 truncate leading-tight">
                    {label}
                  </p>
                  <p className="text-[9px] text-slate-400 capitalize">
                    {isItemSyncing
                      ? key === "vouchers"
                        ? `Batch ${stats.vouchers?.currentBatch || 1}`
                        : key === "ledgers"
                        ? stats.ledgers?.phase === "saving" && stats.ledgers?.totalBatches > 1
                          ? `Saving ${stats.ledgers?.currentBatch || 1}/${stats.ledgers?.totalBatches}`
                          : stats.ledgers?.totalBatches > 1
                          ? `Batch ${stats.ledgers?.currentBatch || 1}/${stats.ledgers?.totalBatches}`
                          : stats.ledgers?.count > 0
                          ? `${stats.ledgers.count.toLocaleString()} fetched`
                          : "Syncing..."
                        : item.phase === "saving" && item.totalBatches > 1
                        ? `Saving ${item.currentBatch}/${item.totalBatches}`
                        : "Syncing..."
                      : isSynced
                      ? "Fetched"
                      : isError
                      ? "Failed"
                      : "Waiting"}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right flex items-center gap-1 justify-end">
                {isItemSyncing && (
                  <RefreshCw className="w-2.5 h-2.5 text-indigo-600 animate-spin" />
                )}
                {isError ? (
                  <span className="text-[10px] font-bold text-rose-600">
                    Err
                  </span>
                ) : (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md border ${
                      isItemSyncing
                        ? "bg-indigo-100/70 text-indigo-800 border-indigo-200"
                        : "bg-slate-100 text-slate-900 border-slate-200/60"
                    }`}
                  >
                    {item.count?.toLocaleString() || 0}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SyncEntityGrid;
