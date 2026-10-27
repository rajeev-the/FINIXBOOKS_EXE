import axios from "axios";
import { getLedger, getLedger2 } from "../xmls/ledger.xml.js";
import { convertXmlToJson, formatDateToTally } from "./company.helpers.js";
import saveToDb from "../save/saveToServer.js";
import { getTallyUrl } from "../helpers/tally.helpers.js";
import envConfig from "../config/envConfig.js";

const TALLY_TIMEOUT = envConfig?.TALLY_TIMEOUT || Number(process.env.TALLY_TIMEOUT) || 180000;

// ---------- helpers ----------

/**
 * Safely parse date inputs (string, Date, YYYYMMDD, etc.)
 */
const parseDate = (d) => {
  if (!d) return null;
  if (d instanceof Date) return isNaN(d.getTime()) ? null : d;
  let parsed = new Date(d);
  if (isNaN(parsed.getTime())) {
    const clean = String(d).replace(/[^0-9]/g, "");
    if (clean.length === 8) {
      const y = parseInt(clean.substring(0, 4), 10);
      const m = parseInt(clean.substring(4, 6), 10) - 1;
      const day = parseInt(clean.substring(6, 8), 10);
      parsed = new Date(y, m, day);
    }
  }
  return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Split an overall [fromDate, toDate] range into Apr–Mar financial-year chunks.
 * Returns an array of { from: Date, to: Date }, in chronological order.
 */
const splitIntoFinancialYears = (fromDate, toDate) => {
  const start = parseDate(fromDate) || new Date();
  const end = parseDate(toDate) || new Date();

  if (start > end) {
    return [{ from: new Date(start), to: new Date(end) }];
  }

  const ranges = [];
  let chunkStart = new Date(start);

  while (chunkStart <= end) {
    // financial year end for this chunk: 31-Mar of the appropriate year
    const fyEndYear =
      chunkStart.getMonth() + 1 >= 4 // month is 0-indexed; April = 3
        ? chunkStart.getFullYear() + 1
        : chunkStart.getFullYear();

    let chunkEnd = new Date(fyEndYear, 2, 31); // March = month index 2

    if (chunkEnd > end) {
      chunkEnd = new Date(end);
    }

    ranges.push({ from: new Date(chunkStart), to: new Date(chunkEnd) });

    // move to next day after chunkEnd
    chunkStart = new Date(chunkEnd);
    chunkStart.setDate(chunkStart.getDate() + 1);
  }

  return ranges.length > 0 ? ranges : [{ from: start, to: end }];
};

/**
 * Merge balance-only data (from getLedger2) into the base ledgers (from getLedger).
 * Matches by guid (fallback to name if guid missing).
 */
const mergeBalanceDetails = (baseLedgers, balanceLedgers, from_date, to_date) => {
  const balanceMap = new Map();

  const safeBalanceLedgers = Array.isArray(balanceLedgers)
    ? balanceLedgers
    : balanceLedgers
      ? [balanceLedgers]
      : [];

  for (const bl of safeBalanceLedgers) {
    const key = bl.guid || bl.name;
    if (!key) continue;
    balanceMap.set(key, {
      from_date,
      to_date,
      opening_balance: Number(bl.opening_balance ?? bl.openingbalance ?? 0),
      closing_balance: Number(bl.closing_balance ?? bl.closingbalance ?? 0),
      is_deemed_positive: bl.is_deemed_positive ?? bl.isdeemedpositive ?? false,
    });
  }

  const safeBaseLedgers = Array.isArray(baseLedgers)
    ? baseLedgers
    : baseLedgers
      ? [baseLedgers]
      : [];

  for (const ledger of safeBaseLedgers) {
    const key = ledger.guid || ledger.name;
    const balanceEntry = balanceMap.get(key);

    if (!ledger.balance_details) ledger.balance_details = [];

    if (balanceEntry) {
      ledger.balance_details.push(balanceEntry);
    }
  }

  return safeBaseLedgers;
};

// ---------- main fetch ----------

const fetchTallyCompanyLedgers = async (
  companyName,
  company_id,
  port = 9000,
  fromDate,
  toDate,
  onBatchProgress = null,
) => {
  let actualPort = port;
  let actualFromDate = fromDate;
  let actualToDate = toDate;

  // Handle potential parameter order mismatch (companyName, company_id, fromDate, toDate, port)
  if (
    typeof port === "string" &&
    isNaN(Number(port)) &&
    (port.includes("-") || port.length === 8)
  ) {
    actualFromDate = port;
    actualToDate = fromDate;
    actualPort = toDate || 9000;
  }

  console.log(
    "Fetching ledgers for company:",
    companyName,
    "on port:",
    actualPort,
    "range:",
    actualFromDate,
    "to",
    actualToDate,
  );

  try {
    const yearRanges = splitIntoFinancialYears(actualFromDate, actualToDate);

    if (yearRanges.length === 0) {
      throw new Error("Invalid date range provided");
    }

    let mergedLedgers = null;

    for (let i = 0; i < yearRanges.length; i++) {
      const { from, to } = yearRanges[i];
      const fromStr = formatDateToTally(from);
      const toStr = formatDateToTally(to);

      if (i === 0) {
        // First chunk: full ledger master fetch
        const xmlPayload = getLedger(companyName, fromStr, toStr);
        const tallyResponse = await axios.post(getTallyUrl(actualPort), xmlPayload, {
          headers: { "Content-Type": "text/xml" },
          timeout: TALLY_TIMEOUT,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        const jsonResult = await convertXmlToJson(tallyResponse.data);
        const rawLedgers = jsonResult?.envelope?.master || [];

        // seed balance_details with the first year's range too
        mergedLedgers = mergeBalanceDetails(rawLedgers, rawLedgers, fromStr, toStr);

        console.log(
          `Fetched base ledgers for FY ${fromStr}-${toStr}:`,
          mergedLedgers.length,
        );

        if (typeof onBatchProgress === "function") {
          onBatchProgress({
            batch: 1,
            totalBatches: yearRanges.length,
            from: fromStr,
            to: toStr,
            count: mergedLedgers.length,
            status: "syncing",
          });
        }
      } else {
        // Subsequent chunks: balance-only fetch
        const xmlPayload2 = getLedger2(companyName, fromStr, toStr);
        const tallyResponse2 = await axios.post(
          getTallyUrl(actualPort),
          xmlPayload2,
          {
            headers: { "Content-Type": "text/xml" },
            timeout: TALLY_TIMEOUT,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          },
        );
        const jsonResult2 = await convertXmlToJson(tallyResponse2.data);
        const balanceLedgers = jsonResult2?.envelope?.master || [];

        mergedLedgers = mergeBalanceDetails(
          mergedLedgers,
          balanceLedgers,
          fromStr,
          toStr,
        );

        console.log(
          `Merged balance data for FY ${fromStr}-${toStr}:`,
          Array.isArray(balanceLedgers) ? balanceLedgers.length : 1,
        );

        if (typeof onBatchProgress === "function") {
          onBatchProgress({
            batch: i + 1,
            totalBatches: yearRanges.length,
            from: fromStr,
            to: toStr,
            count: mergedLedgers.length,
            status: "syncing",
          });
        }
      }
    }

    await saveToDb({
      data: mergedLedgers,
      type: "ledger",
      company_id,
      from: actualFromDate,
      to: actualToDate,
    });
    return mergedLedgers;
  } catch (error) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      console.error(
        `Error fetching tally company ledgers: Request timed out after ${TALLY_TIMEOUT}ms. Verify Tally Prime is active on the Gateway screen and not blocked by a modal dialog.`,
      );
    } else {
      console.error("Error fetching tally company ledgers:", error.message);
    }
    throw error;
  }
};

const fetchLedger = async (req, res) => {
  try {
    const {
      companyName,
      company_id,
      port = 9000,
      fromDate,
      toDate,
      from,
      to,
      from_date,
      to_date,
    } = req.body;

    const startDate = from || fromDate || from_date;
    const endDate = to || toDate || to_date;

    console.log("Request body:", req.body);

    if (!companyName || !company_id || !port || !startDate || !endDate) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    const ledgers = await fetchTallyCompanyLedgers(
      companyName,
      company_id,
      port,
      startDate,
      endDate,
    );

    res.status(200).json({
      success: true,
      message: "Ledgers fetched successfully",
      data: ledgers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export { fetchLedger, fetchTallyCompanyLedgers };
