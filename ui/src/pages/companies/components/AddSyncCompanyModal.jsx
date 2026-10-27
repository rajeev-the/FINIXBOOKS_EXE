import React from "react";
import { Building2, RefreshCw, AlertTriangle } from "lucide-react";
import { formatDateForTally } from "../../../utils/dateUtils";

export const AddSyncCompanyModal = ({
  isOpen,
  targetCompany,
  fyOptions,
  selectedFy,
  onSelectFy,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  period,
  setPeriod,
  submittingAdd,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !targetCompany) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 shadow-2xl w-full max-w-sm flex flex-col gap-4 animate-fade-in-up">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-slate-900 font-bold text-sm leading-tight">
              {targetCompany.syncStatus === "sync"
                ? "Re-Sync Company Data"
                : "Add & Sync Company"}
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {targetCompany.displayName || targetCompany.name}
            </p>
          </div>
        </div>

        {/* Books From Year Selector Pills */}
        {fyOptions.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Select Books From Year
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto custom-scrollbar p-1.5 bg-slate-100/70 border border-slate-200/70 rounded-xl">
              {fyOptions.map((yearOpt, i) => {
                const isSelected =
                  selectedFy?.label === yearOpt.label ||
                  fromDate === yearOpt.fromInput;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectFy(yearOpt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    {yearOpt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-1">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              From Date (Books From)
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              onClick={(e) => {
                if (typeof e.target.showPicker === "function") {
                  e.target.showPicker();
                }
              }}
              style={{ colorScheme: "light" }}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors w-full cursor-pointer font-medium"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                To Date (Ending At)
              </label>
              {targetCompany.endingat && (
                <span className="text-[9px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60">
                  Fixed: {formatDateForTally(targetCompany.endingat)}
                </span>
              )}
            </div>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              onClick={(e) => {
                if (typeof e.target.showPicker === "function") {
                  e.target.showPicker();
                }
              }}
              style={{ colorScheme: "light" }}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors w-full cursor-pointer font-medium"
            />
          </div>

          {/* Sync Period Strategy */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Sync Period
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 border border-slate-200/70 rounded-xl">
              {[
                { id: "all", label: "All" },
                { id: "monthly", label: "Monthly" },
                { id: "weekly", label: "Weekly" },
                { id: "daily", label: "Daily" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPeriod(opt.id)}
                  className={`py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                    period === opt.id
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Warning if company is not open in Tally */}
        {!targetCompany.isLive && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Company Not Open in Tally</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Please open this company in Tally Prime before syncing to avoid an empty sync.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 justify-end mt-2">
          <button
            onClick={onClose}
            disabled={submittingAdd}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submittingAdd || !targetCompany.isLive}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
            title={!targetCompany.isLive ? "Please open this company in Tally Prime first" : ""}
          >
            {submittingAdd && (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            )}
            <span>
              {submittingAdd
                ? "Syncing..."
                : targetCompany.syncStatus === "sync"
                ? "Re-Sync Data"
                : "Add & Sync"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSyncCompanyModal;
