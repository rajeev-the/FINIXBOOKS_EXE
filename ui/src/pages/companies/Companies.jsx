import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { companyService } from "../../services/companyService";
import {
  setSelectedTenantId,
  setCompanies,
  setCompanyLoading,
  setCompanyError,
  updateCompanySyncStatus,
} from "../../store/slices/companySlice";
import {
  parseTallyDateStr,
  formatDateToInputStr,
  formatDateForTally,
  getBooksFromYears,
} from "../../utils/dateUtils";
import {
  mergeDbAndTallyCompanies,
  createCompanyPayload,
} from "./companyHelpers";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import tallyService from "../../services/tallyService";
import { useConnection } from "../../context/ConnectionContext";
import CompanyHeader from "./components/CompanyHeader";
import CompanyTable from "./components/CompanyTable";
import AddSyncCompanyModal from "./components/AddSyncCompanyModal";
import CompanyNotOpenModal from "./components/CompanyNotOpenModal";
import SyncProgressModal from "../../components/sync/SyncProgressModal";

export default function Companies() {
  const dispatch = useDispatch();
  const stateUser = useSelector((state) => state.auth.user);
  const profile = stateUser?.user || stateUser || {};
  const tenants = useMemo(() => profile.tenants || [], [profile.tenants]);

  const {
    selectedTenantId: selectedTenant,
    companies,
    isLoading: loading,
    error,
  } = useSelector((state) => state.company);

  const { tallyStatus, checkTallyConnection } = useConnection();

  // Modal State for adding/syncing company
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetCompany, setTargetCompany] = useState(null);
  const [fyOptions, setFyOptions] = useState([]);
  const [selectedFy, setSelectedFy] = useState(null);
  const [fromDate, setFromDate] = useState(
    () => `${new Date().getFullYear()}-04-01`,
  );
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  });
  const [period, setPeriod] = useState("all");
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showNotOpenModal, setShowNotOpenModal] = useState(false);
  const [notOpenCompany, setNotOpenCompany] = useState(null);
  const [isLaunchingTally, setIsLaunchingTally] = useState(false);

  const handleLaunchTally = async () => {
    setIsLaunchingTally(true);
    try {
      await tallyService.launchTally();
      // Poll connection after a short delay
      setTimeout(() => {
        checkTallyConnection(tallyStatus.port);
        fetchCompaniesData();
      }, 3000);
    } catch (err) {
      console.error("Failed to launch Tally:", err);
    } finally {
      setIsLaunchingTally(false);
    }
  };
  const [syncModalData, setSyncModalData] = useState({
    companyName: "",
    companyId: "",
    fromDate: "",
    toDate: "",
    period: "all",
  });

  useEffect(() => {
    if (tenants.length > 0 && !selectedTenant) {
      const t = tenants[0];
      const tenantId = t.tenant?._id || t.tenant?.id || t._id || t.id || 0;
      dispatch(setSelectedTenantId(tenantId));
    }
  }, [tenants, selectedTenant, dispatch]);

  const extractArrayData = (res) => {
    const raw = res?.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data?.data)) return raw.data.data;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.companies)) return raw.companies;
    return [];
  };

  const fetchCompaniesData = useCallback((silent = false) => {
    if (!selectedTenant) return;

    if (!silent) {
      dispatch(setCompanyLoading(true));
      dispatch(setCompanyError(null));
    }

    const dbPromise = companyService.getTenantCompanies(selectedTenant);
    const tallyPromise = companyService.getTallyExeCompanies(selectedTenant);

    Promise.allSettled([dbPromise, tallyPromise])
      .then(([dbRes, tallyRes]) => {
        if (dbRes.status === "rejected" && tallyRes.status === "rejected") {
          if (!silent) {
            dispatch(
              setCompanyError("Failed to fetch companies. Please try again."),
            );
            dispatch(setCompanies([]));
          }
          return;
        }

        const dbData =
          dbRes.status === "fulfilled" ? extractArrayData(dbRes.value) : [];
        const tallyData =
          tallyRes.status === "fulfilled"
            ? extractArrayData(tallyRes.value)
            : [];

        const merged = mergeDbAndTallyCompanies(dbData, tallyData);
        dispatch(setCompanies(merged));
      })
      .catch((err) => {
        if (!silent) {
          console.error("Error processing companies:", err);
          dispatch(
            setCompanyError("Failed to fetch companies. Please try again."),
          );
        }
      })
      .finally(() => {
        if (!silent) {
          dispatch(setCompanyLoading(false));
        }
      });
  }, [selectedTenant, dispatch]);

  useEffect(() => {
    fetchCompaniesData(false);
  }, [fetchCompaniesData]);

  // Auto-refresh companies when Tally becomes connected
  useEffect(() => {
    if (tallyStatus.isConnected && selectedTenant) {
      fetchCompaniesData(true);
    }
  }, [tallyStatus.isConnected, selectedTenant, fetchCompaniesData]);

  // Auto-refresh when user returns to window from Tally Prime
  useEffect(() => {
    const handleFocus = () => {
      fetchCompaniesData(true);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchCompaniesData]);

  // Periodic silent auto-refresh every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCompaniesData(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [fetchCompaniesData]);

  const handleOpenAddModal = (company) => {
    // If company is not open/live in Tally Prime, warn user and prevent empty sync
    if (!company.isLive) {
      setNotOpenCompany(company);
      setShowNotOpenModal(true);
      return;
    }

    setTargetCompany(company);
    const yearOpts = getBooksFromYears(
      company.booksfrom,
      company.startingfrom,
      company.endingat,
    );
    setFyOptions(yearOpts);

    const endingDateObj = parseTallyDateStr(company.endingat);
    if (endingDateObj) {
      setToDate(formatDateToInputStr(endingDateObj));
    } else {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setToDate(d.toISOString().split("T")[0]);
    }

    if (yearOpts.length > 0) {
      setSelectedFy(yearOpts[0]);
      setFromDate(yearOpts[0].fromInput);
    } else {
      setSelectedFy(null);
      setFromDate(`${new Date().getFullYear()}-04-01`);
    }

    setShowAddModal(true);
  };

  const handleConfirmAddCompany = async () => {
    if (!targetCompany || !selectedTenant) return;

    if (!targetCompany.isLive) {
      setShowAddModal(false);
      setNotOpenCompany(targetCompany);
      setShowNotOpenModal(true);
      return;
    }

    setSubmittingAdd(true);

    try {
      const cName =
        targetCompany.displayName ||
        targetCompany.tally_company_name ||
        targetCompany.name ||
        "Unknown Company";

      let companyId = targetCompany._id;

      if (!companyId || targetCompany.syncStatus !== "sync") {
        const payload = createCompanyPayload(targetCompany, selectedTenant);
        const createRes = await companyService.createCompany(payload);
        const created =
          createRes.data?.data?.company ||
          createRes.data?.data ||
          createRes.data;

        companyId = created?._id || created?.id || created?.company?._id;
        if (!companyId) {
          throw new Error("Failed to obtain created company ID from server.");
        }
      }

      const formattedFrom = formatDateForTally(fromDate);
      const formattedTo = formatDateForTally(toDate);

      setShowAddModal(false);
      setSyncModalData({
        companyName: cName,
        companyId,
        fromDate: formattedFrom,
        toDate: formattedTo,
        period,
      });
      setShowSyncModal(true);

      await companyService.startRealtimeSync({
        company_id: companyId,
        companyName: cName,
        from: formattedFrom,
        to: formattedTo,
        period,
      });

      dispatch(
        updateCompanySyncStatus({
          companyId,
          companyName: cName,
          syncStatus: "sync",
        }),
      );
    } catch (err) {
      console.error("Error syncing company:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to sync company. Please check the real-time sync console.",
      );
    } finally {
      setSubmittingAdd(false);
    }
  };

  const liveCount = useMemo(
    () => companies.filter((c) => c.isLive).length,
    [companies]
  );

  return (
    <div className="flex flex-col gap-5 h-full">
      <CompanyHeader
        tenants={tenants}
        selectedTenant={selectedTenant}
        onSelectTenant={(id) => dispatch(setSelectedTenantId(id))}
        onRefresh={fetchCompaniesData}
        loading={loading}
        liveCount={liveCount}
      />

      {!tallyStatus.isConnected && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 shadow-xs animate-fade-in-up">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
              <span className="font-bold text-amber-900">Tally Prime is not connected:</span>
              <span className="text-amber-700">
                Ensure Tally Prime is running with ODBC/XML enabled on port {tallyStatus.port || 9000} to load and sync companies.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              onClick={handleLaunchTally}
              disabled={isLaunchingTally}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <ExternalLink className={`w-3.5 h-3.5 ${isLaunchingTally ? "animate-pulse" : ""}`} />
              <span>{isLaunchingTally ? "Opening Tally..." : "Open Tally Prime"}</span>
            </button>
            <button
              onClick={() => {
                checkTallyConnection(tallyStatus.port);
                fetchCompaniesData();
              }}
              disabled={tallyStatus.isChecking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${tallyStatus.isChecking ? "animate-spin" : ""}`} />
              <span>Check Tally</span>
            </button>
          </div>
        </div>
      )}

      <CompanyTable
        companies={companies}
        loading={loading}
        error={error}
        selectedTenant={selectedTenant}
        onRetry={fetchCompaniesData}
        onOpenAddModal={handleOpenAddModal}
      />

      <AddSyncCompanyModal
        isOpen={showAddModal}
        targetCompany={targetCompany}
        fyOptions={fyOptions}
        selectedFy={selectedFy}
        onSelectFy={(opt) => {
          setSelectedFy(opt);
          setFromDate(opt.fromInput);
        }}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        period={period}
        setPeriod={setPeriod}
        submittingAdd={submittingAdd}
        onConfirm={handleConfirmAddCompany}
        onClose={() => {
          setShowAddModal(false);
          setTargetCompany(null);
        }}
      />

      <SyncProgressModal
        isOpen={showSyncModal}
        onClose={() => {
          setShowSyncModal(false);
          setTargetCompany(null);
          fetchCompaniesData();
        }}
        companyName={syncModalData.companyName}
        companyId={syncModalData.companyId}
        fromDate={syncModalData.fromDate}
        toDate={syncModalData.toDate}
        period={syncModalData.period}
        socketUrl={
          import.meta.env.VITE_EXE_BACKEND_URL || "http://localhost:3001"
        }
      />

      <CompanyNotOpenModal
        isOpen={showNotOpenModal}
        company={notOpenCompany}
        onClose={() => {
          setShowNotOpenModal(false);
          setNotOpenCompany(null);
        }}
        onRefresh={fetchCompaniesData}
        loading={loading}
      />
    </div>
  );
}
