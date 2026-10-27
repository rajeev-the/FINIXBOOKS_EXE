import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RefreshCw } from "lucide-react";
import { syncService } from "../../services/syncService";
import { setModuleLoading, setModuleStatus } from "../../store/slices/syncSlice";
import SyncTable from "./components/SyncTable";
import SyncDateRangeModal from "./components/SyncDateRangeModal";

export default function Sync() {
  const dispatch = useDispatch();
  const { loadingMap, statusMap } = useSelector((state) => state.sync);

  const [showModal, setShowModal] = useState(false);
  const [pendingEndpoint, setPendingEndpoint] = useState(null);
  const [fromDate, setFromDate] = useState(
    () => `${new Date().getFullYear()}-04-01`,
  );
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  });

  const requestSync = (endpoint) => {
    if (endpoint === "all" || endpoint === "vouchers") {
      setPendingEndpoint(endpoint);
      setShowModal(true);
    } else {
      handleSync(endpoint, endpoint);
    }
  };

  const handleSync = async (endpoint, key) => {
    dispatch(setModuleLoading({ moduleKey: key, isLoading: true }));
    dispatch(setModuleStatus({ moduleKey: key, status: null }));

    try {
      let queryParams = "";
      if (endpoint === "all" || endpoint === "vouchers") {
        queryParams = `fromDate=${fromDate}&toDate=${toDate}`;
      }
      const res = await syncService.syncModule(endpoint, queryParams);
      if (res.data?.success || res.status === 200) {
        dispatch(setModuleStatus({ moduleKey: key, status: "success" }));
      } else {
        dispatch(setModuleStatus({ moduleKey: key, status: "error" }));
      }
    } catch (error) {
      console.error(`Sync error for ${key}:`, error);
      dispatch(setModuleStatus({ moduleKey: key, status: "error" }));
    } finally {
      dispatch(setModuleLoading({ moduleKey: key, isLoading: false }));
    }
  };

  const isAllLoading = !!loadingMap["all"];

  return (
    <div className="w-full h-full text-slate-900 flex flex-col bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl overflow-hidden shadow-xs relative">
      {/* Top Application Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white/70 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
              Synchronization Pipeline
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Synchronize Tally ERP/Prime accounting data with cloud backend
            </p>
          </div>
        </div>

        <button
          onClick={() => requestSync("all")}
          disabled={isAllLoading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isAllLoading ? "animate-spin" : ""}`}
          />
          {isAllLoading ? "Syncing Pipeline..." : "Sync All Data"}
        </button>
      </div>

      <SyncTable
        loadingMap={loadingMap}
        statusMap={statusMap}
        onRequestSync={requestSync}
        isAnySyncing={isAllLoading}
      />

      <SyncDateRangeModal
        isOpen={showModal}
        pendingEndpoint={pendingEndpoint}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onClose={() => setShowModal(false)}
        onStartSync={() => {
          setShowModal(false);
          handleSync(pendingEndpoint, pendingEndpoint);
        }}
      />
    </div>
  );
}
