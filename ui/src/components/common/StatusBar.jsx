import React from "react";
import { Wifi, WifiOff, RefreshCw, Server, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useConnection } from "../../context/ConnectionContext";
import tallyService from "../../services/tallyService";

export const StatusBar = () => {
  const { isInternetOnline, tallyStatus, isBridgeOnline, checkTallyConnection } =
    useConnection();

  const handleRefresh = (e) => {
    e.preventDefault();
    if (!tallyStatus.isChecking) {
      checkTallyConnection(tallyStatus.port);
    }
  };

  const formattedTime = tallyStatus.lastChecked
    ? new Date(tallyStatus.lastChecked).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  return (
    <footer className="w-full h-8 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 flex items-center justify-between text-[11px] font-medium text-slate-600 select-none shrink-0 z-30 shadow-[0_-1px_3px_rgba(0,0,0,0.02)] [-webkit-app-region:no-drag]">
      {/* Left Section: Tally & Bridge Status */}
      <div className="flex items-center gap-3">
        {/* Tally Connection Indicator */}
        <div className="flex items-center gap-1.5">
          {tallyStatus.isConnected ? (
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Tally Connected</span>
              <span className="text-[10px] text-emerald-600/80 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.2 rounded">
                :{tallyStatus.port}
              </span>
              {tallyStatus.openCompaniesCount > 0 && (
                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded truncate max-w-[140px]" title={tallyStatus.openCompanies.join(", ")}>
                  {tallyStatus.openCompanies[0]}
                  {tallyStatus.openCompaniesCount > 1 ? ` (+${tallyStatus.openCompaniesCount - 1})` : ""}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-600" title={tallyStatus.message}>
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="font-semibold">Tally Disconnected</span>
              <button
                onClick={async () => {
                  try {
                    await tallyService.launchTally();
                    setTimeout(() => checkTallyConnection(tallyStatus.port), 2500);
                  } catch (err) {
                    console.error("Launch error", err);
                  }
                }}
                className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors"
                title="Launch Tally Prime application"
              >
                Launch Tally Prime
              </button>
            </div>
          )}

          {/* Quick Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={tallyStatus.isChecking}
            title="Check Tally connection now"
            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer ml-0.5"
          >
            <RefreshCw
              className={`w-3 h-3 ${tallyStatus.isChecking ? "animate-spin text-indigo-600" : ""}`}
            />
          </button>
        </div>

        <span className="w-px h-3 bg-slate-200 hidden sm:inline-block" />

        {/* Local Bridge Status */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500">
          <Server className="w-3 h-3 text-slate-400" />
          <span>Bridge:</span>
          <span className={isBridgeOnline ? "text-slate-700 font-medium" : "text-rose-500 font-medium"}>
            {isBridgeOnline ? "3001 Online" : "3001 Offline"}
          </span>
        </div>
      </div>

      {/* Right Section: Internet Connection & Last Synced */}
      <div className="flex items-center gap-3">
        {/* Internet Status */}
        <div className="flex items-center gap-1.5">
          {isInternetOnline ? (
            <div className="flex items-center gap-1 text-emerald-700">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-semibold">Internet: Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-600">
              <WifiOff className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[11px] font-semibold">Internet: Offline</span>
            </div>
          )}
        </div>

        {formattedTime && (
          <>
            <span className="w-px h-3 bg-slate-200 hidden md:inline-block" />
            <span className="text-[10px] text-slate-400 hidden md:inline-block">
              Checked: {formattedTime}
            </span>
          </>
        )}
      </div>
    </footer>
  );
};

export default StatusBar;
