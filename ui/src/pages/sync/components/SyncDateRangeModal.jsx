import React from "react";
import { RefreshCw } from "lucide-react";

export const SyncDateRangeModal = ({
  isOpen,
  pendingEndpoint,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onClose,
  onStartSync,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 shadow-xl w-full max-w-sm flex flex-col gap-4 animate-fade-in-up">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-sm">
              {pendingEndpoint === "all" ? "Sync All Data" : "Sync Vouchers"}
            </h3>
            <p className="text-xs text-slate-500">
              Select the required date range for voucher processing.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end mt-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onStartSync}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer active:scale-98"
          >
            Start Sync
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncDateRangeModal;
