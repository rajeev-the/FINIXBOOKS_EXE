import axios from "axios";
import { EXE_BACKEND_URL } from "./apiClient";

/**
 * Service to interact with Tally Prime and the local bridge endpoints.
 */
export const tallyService = {
  /**
   * Checks whether Tally Prime is active by pinging the Tally URL directly
   * and querying the local bridge endpoints for company metadata.
   *
   * @param {number} [port=9000] Port number for Tally Prime
   * @returns {Promise<object>} Status response
   */
  checkStatus: async (port = 9000) => {
    const tallyUrl = `http://localhost:${port}`;
    let isDirectConnected = false;

    // 1. Direct hit to Tally URL (fastest & reliable directly in frontend)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      await fetch(tallyUrl, {
        method: "GET",
        mode: "no-cors",
        cache: "no-cache",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      isDirectConnected = true;
    } catch {
      isDirectConnected = false;
    }

    // 2. Query backend /api/tally/status (if running updated backend)
    try {
      const response = await axios.get(`${EXE_BACKEND_URL}/api/tally/status`, {
        params: { port },
        timeout: 2500,
      });

      if (
        response.data &&
        response.data.success !== undefined &&
        response.data.connected !== undefined
      ) {
        return response.data;
      }
    } catch {
      // Backend route /api/tally/status may not be available if backend has not restarted
    }

    // 3. Fallback: Query /api/companies/show (supported by running backend instances)
    try {
      const showRes = await axios.post(
        `${EXE_BACKEND_URL}/api/companies/show`,
        { port },
        { timeout: 3000 }
      );

      if (showRes.data && showRes.data.success) {
        const companies = Array.isArray(showRes.data.companies)
          ? showRes.data.companies
          : [];
        const openCompanies = companies
          .map((c) => c?.displayName || c?.name)
          .filter(Boolean);

        return {
          success: true,
          connected: true,
          tallyUrl,
          port,
          openCompaniesCount: openCompanies.length,
          openCompanies,
          message: "Tally Prime is connected",
        };
      }
    } catch {
      // Ignore fallback failure
    }

    // 4. If direct ping to http://localhost:9000 succeeded, return connected
    if (isDirectConnected) {
      return {
        success: true,
        connected: true,
        tallyUrl,
        port,
        openCompaniesCount: 0,
        openCompanies: [],
        message: "Tally Prime is running and connected",
      };
    }

    // 5. If both direct and backend failed, report disconnected
    return {
      success: true,
      connected: false,
      tallyUrl,
      port,
      openCompaniesCount: 0,
      openCompanies: [],
      message: `Cannot connect to Tally at ${tallyUrl}. Please ensure Tally Prime is open.`,
    };
  },

  /**
   * Launches Tally Prime on the local machine via Electron IPC or backend API.
   * @returns {Promise<object>} Result of launch command
   */
  launchTally: async () => {
    // 1. Try via Electron preload API (desktop app environment)
    if (window.electronAPI && typeof window.electronAPI.launchTally === "function") {
      try {
        const res = await window.electronAPI.launchTally();
        return res;
      } catch (e) {
        console.warn("Electron launch error:", e);
      }
    }

    // 2. Try via Backend API
    try {
      const response = await axios.post(
        `${EXE_BACKEND_URL}/api/tally/launch`,
        {},
        { timeout: 4000 }
      );
      return response.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },
};

export default tallyService;
