import React from "react";
import { ShieldCheck, RefreshCw, Bell, CheckCircle2, Info } from "lucide-react";

export const StepPreviewCard = ({ currentStep, activeStepObj }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Visual Representation Graphic */}
      {currentStep === 1 && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
              </span>
              Initialization Queue
            </span>
            <span className="text-xs bg-indigo-800/60 border border-indigo-700/60 text-indigo-200 px-2.5 py-0.5 rounded-full font-mono">
              ~ 1 Min ETA
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span>Company Binding:</span>
              <span className="font-semibold text-white">Active</span>
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span>Tally License Status:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Valid License
              </span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-2 overflow-hidden border border-indigo-700/50">
              <div className="bg-indigo-400 h-full w-1/3 animate-pulse rounded-full" />
            </div>
            <p className="text-[11px] text-indigo-300/80 pt-1">
              Verifying license key & preparing payload handshake...
            </p>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              Sync Batch Processing
            </span>
            <span className="text-xs bg-amber-900/60 border border-amber-700/60 text-amber-200 px-2.5 py-0.5 rounded-full font-bold">
              15 - 45 Mins
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs text-amber-200/90 font-medium">
              <span>Ledgers & Groups</span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
            <div className="flex justify-between text-xs text-amber-200/90 font-medium">
              <span>Vouchers & Invoices</span>
              <span className="text-amber-300 font-bold">
                Processing (~35%)
              </span>
            </div>
            <div className="w-full bg-amber-950 rounded-full h-2 overflow-hidden border border-amber-800/50">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full w-2/5 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm flex flex-col justify-between border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              Desktop Notification Preview
            </span>
            <span className="text-[10px] text-slate-400">Just Now</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-lg p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Sync Completed Successfully!
              </h4>
              <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                Company data is updated and ready in your web dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Insights List */}
      <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-5 flex flex-col justify-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          Key Takeaways
        </h4>
        <ul className="space-y-2">
          {activeStepObj.details.map((detail, idx) => (
            <li
              key={idx}
              className="text-xs text-slate-700 font-medium flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StepPreviewCard;
