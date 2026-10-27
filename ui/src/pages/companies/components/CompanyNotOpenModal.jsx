import React, { useState } from "react";
import { AlertTriangle, RefreshCw, X, ExternalLink, CheckCircle, Layers } from "lucide-react";
import tallyService from "../../../services/tallyService";
import { useConnection } from "../../../context/ConnectionContext";

export const CompanyNotOpenModal = ({
  isOpen,
  company,
  onClose,
  onRefresh,
  loading,
}) => {
  const { tallyStatus } = useConnection();
  const isTallyConnected = tallyStatus?.isConnected;

  const [isLaunching, setIsLaunching] = useState(false);
  const [launchMessage, setLaunchMessage] = useState(null);

  if (!isOpen || !company) return null;

  const compName =
    company.displayName ||
    company.name ||
    company.companyName ||
    "Selected Company";

  const handleLaunchTally = async () => {
    setIsLaunching(true);
    setLaunchMessage(null);

    try {
      const res = await tallyService.launchTally();
      const isAlready = res?.alreadyRunning || isTallyConnected;
      setLaunchMessage({
        isAlreadyRunning: isAlready,
        text: isAlready
          ? `Switched to your active Tally Prime window!`
          : `Tally Prime is launching!`,
      });

      // Trigger a silent check in 2 seconds
      setTimeout(() => {
        if (onRefresh) onRefresh();
      }, 2000);
    } catch (err) {
      console.error("Failed to launch Tally:", err);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl border border-amber-200 rounded-2xl p-6 shadow-2xl w-full max-w-md flex flex-col gap-4 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-sm leading-snug">
                Company Not Open in Tally
              </h3>
              <p className="text-xs text-amber-700 font-semibold truncate mt-0.5">
                {compName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Description */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold mb-1">
            Cannot sync data for <span className="underline font-bold">{compName}</span>.
          </p>
          <p className="text-amber-800 text-[11px]">
            Tally Prime only exports vouchers and ledgers for companies that are currently loaded and active in the Gateway of Tally.
          </p>
        </div>

        {/* Launch / Focus status notification */}
        {launchMessage && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>{launchMessage.text}</strong> Press <kbd className="font-mono bg-white px-1 border border-emerald-300 rounded text-[10px]">Alt + F3</kbd> to load <strong>{compName}</strong>, then return here.
            </span>
          </div>
        )}

        {/* Step-by-step guidance */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col gap-2 text-xs text-slate-700">
          <span className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
            How to resolve:
          </span>
          <ol className="flex flex-col gap-1.5 text-[11px] list-decimal list-inside pl-0.5 text-slate-600">
            {isTallyConnected ? (
              <li>Switch to your open <strong>Tally Prime</strong> window (or click below).</li>
            ) : (
              <li>Click <strong>Open Tally Prime</strong> below to launch Tally.</li>
            )}
            <li>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono">Alt + F3</kbd> or click <strong>Select Company</strong>.</li>
            <li>Select and open <strong>{compName}</strong>.</li>
            <li>This app will automatically detect it and mark it <strong>Live</strong>!</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 mt-1 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (onRefresh) await onRefresh();
              }}
              disabled={loading}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200/90 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLaunchTally}
              disabled={isLaunching}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isTallyConnected ? (
                <Layers className={`w-3.5 h-3.5 ${isLaunching ? "animate-pulse" : ""}`} />
              ) : (
                <ExternalLink className={`w-3.5 h-3.5 ${isLaunching ? "animate-pulse" : ""}`} />
              )}
              <span>
                {isLaunching
                  ? (isTallyConnected ? "Switching..." : "Opening Tally...")
                  : (isTallyConnected ? "Switch to Tally Prime" : "Open Tally Prime")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyNotOpenModal;
