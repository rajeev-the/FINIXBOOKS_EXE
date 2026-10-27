import { createContext, useContext, useState, useEffect, useCallback } from "react";
import tallyService from "../services/tallyService";

const ConnectionContext = createContext(null);

export const ConnectionProvider = ({ children }) => {
  const [isInternetOnline, setIsInternetOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  const [tallyStatus, setTallyStatus] = useState({
    isConnected: false,
    isChecking: false,
    tallyUrl: "http://localhost:9000",
    port: 9000,
    openCompaniesCount: 0,
    openCompanies: [],
    message: "Initializing Tally connection check...",
    lastChecked: null,
  });

  const [isBridgeOnline, setIsBridgeOnline] = useState(true);

  // Monitor internet connection events
  useEffect(() => {
    const handleOnline = () => setIsInternetOnline(true);
    const handleOffline = () => setIsInternetOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check Tally connection
  const checkTallyConnection = useCallback(async (port = 9000) => {
    setTallyStatus((prev) => ({ ...prev, isChecking: true }));

    try {
      const data = await tallyService.checkStatus(port);
      setIsBridgeOnline(data.success !== false || !data.message?.includes("Bridge"));

      setTallyStatus({
        isConnected: Boolean(data.connected),
        isChecking: false,
        tallyUrl: data.tallyUrl || `http://localhost:${port}`,
        port: data.port || port,
        openCompaniesCount: data.openCompaniesCount || 0,
        openCompanies: data.openCompanies || [],
        message: data.message || (data.connected ? "Tally is connected" : "Tally is disconnected"),
        lastChecked: new Date(),
      });

      return data;
    } catch (error) {
      setTallyStatus((prev) => ({
        ...prev,
        isConnected: false,
        isChecking: false,
        message: "Failed to query Tally status",
        lastChecked: new Date(),
      }));
      return { connected: false };
    }
  }, []);

  // Initial check, recurring poll every 4 seconds, and on window focus
  useEffect(() => {
    checkTallyConnection();

    const interval = setInterval(() => {
      checkTallyConnection();
    }, 4000);

    const onFocus = () => {
      checkTallyConnection();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [checkTallyConnection]);

  const value = {
    isInternetOnline,
    tallyStatus,
    isBridgeOnline,
    checkTallyConnection,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};

export default ConnectionContext;
