import axios from "axios";
import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { getTallyUrl } from "../helpers/tally.helpers.js";
import getCompanyXml from "../xmls/company.xml.js";
import { convertXmlToJson } from "./company.helpers.js";

const COMMON_TALLY_PATHS = [
  "C:\\Program Files\\TallyPrime\\tally.exe",
  "C:\\Program Files (x86)\\TallyPrime\\tally.exe",
  "C:\\TallyPrime\\tally.exe",
  "C:\\Tally\\tally.exe",
  "C:\\Tally.ERP9\\tally.exe",
  "D:\\TallyPrime\\tally.exe",
  "D:\\Program Files\\TallyPrime\\tally.exe",
];

const isTallyRunning = () => {
  try {
    const output = execSync('tasklist /FI "IMAGENAME eq tally.exe" /NH', {
      encoding: "utf8",
      windowsHide: true,
      timeout: 1500,
    });
    return output.toLowerCase().includes("tally.exe");
  } catch {
    return false;
  }
};

const activateTallyWindow = () => {
  try {
    const scriptPath = path.join(process.cwd(), "backend", "src", "helpers", "activateTally.ps1");
    const child = spawn("powershell.exe", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-WindowStyle",
      "Hidden",
      "-File",
      scriptPath,
    ], {
      windowsHide: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  } catch (err) {
    console.warn("Could not activate Tally window:", err);
  }
};

/**
 * Launches Tally Prime desktop application on Windows (or switches to it if already running)
 */
export const launchTallyPrime = async (req, res) => {
  try {
    if (isTallyRunning()) {
      activateTallyWindow();
      return res.status(200).json({
        success: true,
        alreadyRunning: true,
        message: "Tally Prime is already running. Switched to existing window.",
      });
    }

    const customPath = req.body?.tallyPath || process.env.TALLY_EXE_PATH;
    let targetPath = null;

    if (customPath && fs.existsSync(customPath)) {
      targetPath = customPath;
    } else {
      for (const p of COMMON_TALLY_PATHS) {
        if (fs.existsSync(p)) {
          targetPath = p;
          break;
        }
      }
    }

    if (targetPath) {
      const child = spawn("cmd.exe", ["/c", "start", '""', targetPath], {
        detached: true,
        stdio: "ignore",
      });
      child.unref();
      return res.status(200).json({
        success: true,
        alreadyRunning: false,
        path: targetPath,
        message: `Tally Prime launched from ${targetPath}`,
      });
    } else {
      spawn("cmd.exe", ["/c", "start", '""', "tally.exe"], {
        detached: true,
        stdio: "ignore",
      }).unref();
      return res.status(200).json({
        success: true,
        alreadyRunning: false,
        path: "tally.exe",
        message: "Tally Prime launch command executed",
      });
    }
  } catch (err) {
    console.error("Failed to launch Tally Prime:", err.message);
    return res.status(500).json({
      success: false,
      message: `Failed to launch Tally Prime: ${err.message}`,
    });
  }
};

/**
 * Checks whether Tally Prime is active and responding to XML requests.
 * Extracts currently open companies if available.
 */
export const getTallyStatus = async (req, res) => {
  const port = req.query.port || req.body?.port || 9000;
  const tallyUrl = getTallyUrl(port);

  try {
    const response = await axios.post(tallyUrl, getCompanyXml(), {
      headers: { "Content-Type": "text/xml" },
      timeout: 3000,
    });

    let openCompanies = [];
    try {
      const jsonResult = await convertXmlToJson(response.data);
      const rawCollection =
        jsonResult?.envelope?.body?.data?.collection?.company || [];
      const companiesArray = Array.isArray(rawCollection)
        ? rawCollection
        : [rawCollection];

      openCompanies = companiesArray
        .map((c) => {
          if (!c?.guid && !c?.name) return null;
          return Array.isArray(c?.name) ? c.name[0] : c?.name;
        })
        .filter(Boolean);
    } catch {
      // Non-critical XML parsing error; connection to Tally succeeded
    }

    return res.status(200).json({
      success: true,
      connected: true,
      tallyUrl,
      port: Number(port),
      openCompaniesCount: openCompanies.length,
      openCompanies,
      message: "Tally is connected and responding.",
    });
  } catch (err) {
    const isConnRefused =
      err.code === "ECONNREFUSED" || err.message?.includes("ECONNREFUSED");
    const isTimeout =
      err.code === "ECONNABORTED" || err.message?.includes("timeout");

    let message = `Tally is unreachable at ${tallyUrl}`;
    if (isConnRefused) {
      message = `Tally is not open or not listening on port ${port}. Please open Tally Prime with ODBC/XML enabled.`;
    } else if (isTimeout) {
      message = `Connection to Tally timed out at ${tallyUrl}.`;
    }

    // Return 200 with connected: false to prevent unhandled 500 logs on routine health polling
    return res.status(200).json({
      success: true,
      connected: false,
      tallyUrl,
      port: Number(port),
      openCompaniesCount: 0,
      openCompanies: [],
      error: err.code || err.message,
      message,
    });
  }
};
