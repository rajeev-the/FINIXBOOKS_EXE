import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { INITIAL_SYNC_STATS } from "../../utils/constants";
import SyncProgressHeader from "./SyncProgressHeader";
import SyncProgressBar from "./SyncProgressBar";
import SyncEntityGrid from "./SyncEntityGrid";

export const SyncProgressModal = ({
  isOpen,
  onClose,
  companyName,
  companyId,
  fromDate,
  toDate,
  period = "all",
  socketUrl = "http://localhost:3001",
}) => {
  const [status, setStatus] = useState("syncing"); // 'syncing' | 'completed' | 'error'
  const [currentTask, setCurrentTask] = useState("Initializing sync...");
  const [progressPercent, setProgressPercent] = useState(5);
  const [stats, setStats] = useState(INITIAL_SYNC_STATS);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state on open
    setStatus("syncing");
    setProgressPercent(10);
    setCurrentTask("Connecting to sync service...");
    setStats(INITIAL_SYNC_STATS);

    const socket = io(socketUrl, {
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socket.on("connect", () => {
      if (companyId) {
        socket.emit("join:company", companyId);
      }
    });

    socket.on("sync:start", (data) => {
      setCurrentTask(`Sync started for ${data.companyName || companyName}`);
      setProgressPercent(15);
    });

    socket.on("sync:log", (data) => {
      if (data.step && data.message) {
        setCurrentTask(data.message);
      }
    });

    socket.on("sync:progress", (data) => {
      const { step, count, status: stepStatus } = data;
      setStats((prev) => ({
        ...prev,
        [step]: {
          ...prev[step],
          count:
            stepStatus === "syncing" && (count === 0 || count === undefined)
              ? prev[step]?.count ?? 0
              : count ?? prev[step]?.count ?? 0,
          status: stepStatus || "success",
        },
      }));
    });

    socket.on("sync:ledger-batch", (data) => {
      const { batch, totalBatches, from, to, count } = data;
      const totalCount = count || 0;
      setCurrentTask(
        totalBatches > 1
          ? `Fetching Ledgers: ${totalCount.toLocaleString()} total fetched so far (Batch ${batch}/${totalBatches})`
          : `Fetching Ledgers: ${totalCount.toLocaleString()} ledgers found`
      );

      setStats((prev) => ({
        ...prev,
        ledgers: {
          count: totalCount,
          status: "syncing",
          currentBatch: batch,
          totalBatches,
          phase: "fetching",
          batchDates: from && to ? `${from} - ${to}` : "",
        },
      }));
    });

    socket.on("sync:save-batch", (data) => {
      const { type, step, batch, totalBatches, batchSize, totalRecords, savedCount } = data;
      const entityKey = step || (type === "ledger" ? "ledgers" : type === "voucher" ? "vouchers" : type);
      const displayType = type.charAt(0).toUpperCase() + type.slice(1);

      setCurrentTask(
        totalBatches > 1
          ? `Saving ${displayType} to database: Batch ${batch}/${totalBatches} (${batchSize?.toLocaleString() || batchSize} items)...`
          : `Saving ${displayType} to database...`
      );

      // Smooth progress update for large master saves (like ledgers 15% - 25%)
      if (type === "ledger" || entityKey === "ledgers") {
        const batchProgress = Math.round(15 + ((batch / totalBatches) * 10));
        setProgressPercent((prev) => Math.max(prev, batchProgress));
      }

      setStats((prev) => ({
        ...prev,
        [entityKey]: {
          ...prev[entityKey],
          count: totalRecords || prev[entityKey]?.count || 0,
          status: "syncing",
          currentBatch: batch,
          totalBatches,
          phase: "saving",
          savedCount: savedCount || 0,
        },
      }));
    });

    socket.on("sync:save-complete", (data) => {
      const { type, step, totalRecords, totalBatches } = data;
      const entityKey = step || (type === "ledger" ? "ledgers" : type === "voucher" ? "vouchers" : type);
      const displayType = type.charAt(0).toUpperCase() + type.slice(1);

      setCurrentTask(
        `Successfully saved ${totalRecords?.toLocaleString() || totalRecords} ${displayType} across ${totalBatches} batches.`
      );

      setStats((prev) => ({
        ...prev,
        [entityKey]: {
          ...prev[entityKey],
          count: totalRecords || prev[entityKey]?.count || 0,
          status: "success",
          phase: "saved",
        },
      }));
    });

    socket.on("sync:voucher-batch", (data) => {
      const { batch, totalBatches, from, to, totalVouchersInserted, percent } =
        data;
      const totalCount = totalVouchersInserted || 0;
      setCurrentTask(
        `Fetching Vouchers: ${totalCount.toLocaleString()} total fetched so far (Batch ${batch}/${totalBatches})`,
      );

      const overallPercent = Math.min(
        95,
        Math.round(20 + (percent || 0) * 0.75),
      );
      setProgressPercent(overallPercent);

      setStats((prev) => ({
        ...prev,
        vouchers: {
          count: totalCount,
          status: "syncing",
          currentBatch: batch,
          totalBatches,
          batchDates: `${from} - ${to}`,
        },
      }));
    });

    socket.on("sync:complete", (data) => {
      setStatus("completed");
      setProgressPercent(100);
      setCurrentTask("All company data successfully synced!");

      setStats((prev) => ({
        ...prev,
        vouchers: {
          ...prev.vouchers,
          status: "success",
          count: data.totalVouchersInserted ?? prev.vouchers.count,
        },
      }));
    });

    socket.on("sync:error", (data) => {
      setStatus("error");
      setCurrentTask(
        `Error: ${data.message || "Failed during synchronization"}`,
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [isOpen, companyId, companyName, socketUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[85vh] overflow-hidden">
        <SyncProgressHeader
          status={status}
          companyName={companyName}
          fromDate={fromDate}
          toDate={toDate}
          period={period}
        />

        <div className="p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          <SyncProgressBar
            status={status}
            currentTask={currentTask}
            progressPercent={progressPercent}
            voucherStats={stats.vouchers}
            ledgerStats={stats.ledgers}
          />
          <SyncEntityGrid stats={stats} />
        </div>

        <div className="px-5 py-3 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {status === "syncing" &&
              "Please wait while data is streaming from Tally..."}
            {status === "completed" && (
              <span className="text-emerald-600 font-semibold">
                Sync completed successfully!
              </span>
            )}
            {status === "error" && (
              <span className="text-rose-600 font-semibold">
                An error occurred during sync.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={status === "syncing"}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${status === "syncing"
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : status === "completed"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
          >
            {status === "syncing" ? "Syncing..." : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncProgressModal;
