import React from "react";
import { RefreshCw, CheckCircle2, AlertCircle, Receipt, FileText } from "lucide-react";

export const SyncProgressBar = ({
  status,
  currentTask,
  progressPercent,
  voucherStats,
  ledgerStats,
}) => {
  const isVouchersActive = voucherStats && voucherStats.totalBatches > 0;
  const isLedgersActive =
    !isVouchersActive &&
    ledgerStats &&
    (ledgerStats.status === "syncing" || ledgerStats.currentBatch > 0) &&
    ledgerStats.count > 0;

  return (
    <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 flex flex-col gap-2 shadow-2xs">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-700 flex items-center gap-1.5 truncate">
          {status === "syncing" && (
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin shrink-0" />
          )}
          {status === "completed" && (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          )}
          {status === "error" && (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          )}
          <span className="truncate">{currentTask}</span>
        </span>
        <span className="text-indigo-600 font-bold text-xs ml-2 shrink-0">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            status === "error"
              ? "bg-rose-500"
              : status === "completed"
              ? "bg-emerald-500"
              : "bg-indigo-600 bg-gradient-to-r from-indigo-500 to-violet-600"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {isVouchersActive && (
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 mt-0.5">
          <span className="text-slate-700 font-medium flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Total Vouchers:{" "}
            <strong className="text-emerald-700 font-bold text-xs">
              {voucherStats.count?.toLocaleString() || 0}
            </strong>
          </span>
          <span className="text-slate-500 text-[10px]">
            Batch{" "}
            <strong className="text-slate-700">
              {voucherStats.currentBatch} / {voucherStats.totalBatches}
            </strong>
            {voucherStats.batchDates && (
              <span className="text-slate-400 ml-1">
                ({voucherStats.batchDates})
              </span>
            )}
          </span>
        </div>
      )}

      {isLedgersActive && (
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 mt-0.5">
          <span className="text-slate-700 font-medium flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            Total Ledgers:{" "}
            <strong className="text-blue-700 font-bold text-xs">
              {ledgerStats.count?.toLocaleString() || 0}
            </strong>
          </span>
          <span className="text-slate-500 text-[10px]">
            {ledgerStats.phase === "saving" && ledgerStats.totalBatches > 1 ? (
              <>
                Saving to DB:{" "}
                <strong className="text-indigo-600 font-bold">
                  Batch {ledgerStats.currentBatch} / {ledgerStats.totalBatches}
                </strong>
                {ledgerStats.savedCount ? (
                  <span className="text-slate-400 ml-1">
                    ({ledgerStats.savedCount.toLocaleString()} / {ledgerStats.count?.toLocaleString() || 0})
                  </span>
                ) : null}
              </>
            ) : ledgerStats.phase === "saved" && ledgerStats.totalBatches > 1 ? (
              <strong className="text-emerald-700 font-semibold">
                ({ledgerStats.totalBatches} batches)
              </strong>
            ) : ledgerStats.totalBatches > 1 ? (
              <>
                Batch{" "}
                <strong className="text-slate-700">
                  {ledgerStats.currentBatch} / {ledgerStats.totalBatches}
                </strong>
                {ledgerStats.batchDates && (
                  <span className="text-slate-400 ml-1">
                    ({ledgerStats.batchDates})
                  </span>
                )}
              </>
            ) : (
              <strong className="text-blue-700 font-semibold">Live fetched</strong>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default SyncProgressBar;
