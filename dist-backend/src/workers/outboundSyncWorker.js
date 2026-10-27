import axios from "axios";
import envConfig from "../config/envConfig.js";
import { getTallyUrl } from "../helpers/tally.helpers.js";
import { buildTallyVoucherXml } from "./tallyVoucherXmlBuilder.js";
import { buildTallyLedgerXml } from "./tallyLedgerXmlBuilder.js";
import { emitSyncLog } from "../socket/socket.js";

/**
 * Parses Tally Prime XML response and detects errors or successes.
 * Crucial protection against the Tally Prime HTTP 200 Trap.
 */
export function parseTallyResponse(xmlStr) {
  if (!xmlStr || typeof xmlStr !== "string") {
    return { success: false, error: "Empty response from Tally Prime" };
  }

  // Check for <ERRORS> tag
  const errorsMatch = xmlStr.match(/<ERRORS>(\d+)<\/ERRORS>/i);
  const errorCount = errorsMatch ? parseInt(errorsMatch[1], 10) : 0;

  // Check for <LINEERROR> or general error descriptions
  const lineErrorMatch = xmlStr.match(/<LINEERROR>([\s\S]*?)<\/LINEERROR>/i);
  const lineError = lineErrorMatch ? lineErrorMatch[1].trim() : null;

  // Check for <CREATED> and <ALTERED>
  const createdMatch = xmlStr.match(/<CREATED>(\d+)<\/CREATED>/i);
  const alteredMatch = xmlStr.match(/<ALTERED>(\d+)<\/ALTERED>/i);
  const createdCount = createdMatch ? parseInt(createdMatch[1], 10) : 0;
  const alteredCount = alteredMatch ? parseInt(alteredMatch[1], 10) : 0;

  // Extract <LASTVCHID> or <ALTERID> or <GUID>
  const lastVchMatch = xmlStr.match(/<LASTVCHID>(\d+)<\/LASTVCHID>/i);
  const alterIdMatch = xmlStr.match(/<ALTERID>(\d+)<\/ALTERID>/i);
  const guidMatch = xmlStr.match(/<GUID>(.*?)<\/GUID>/i);

  if (errorCount > 0 || lineError) {
    return {
      success: false,
      errorCount,
      error: lineError || `Tally reported ${errorCount} error(s) during import`,
      raw: xmlStr,
    };
  }

  if (createdCount > 0 || alteredCount > 0) {
    return {
      success: true,
      createdCount,
      alteredCount,
      tallyAlterId: alterIdMatch ? alterIdMatch[1] : (lastVchMatch ? lastVchMatch[1] : null),
      tallyGuid: guidMatch ? guidMatch[1] : null,
      raw: xmlStr,
    };
  }

  // Fallback: If no explicit errors and no explicit created, check for generic fault
  if (xmlStr.includes("<FAULT>")) {
    return {
      success: false,
      error: "Tally Prime SOAP / XML Fault encountered",
      raw: xmlStr,
    };
  }

  return {
    success: true,
    createdCount: 1,
    alteredCount: 0,
    tallyAlterId: alterIdMatch ? alterIdMatch[1] : null,
    tallyGuid: guidMatch ? guidMatch[1] : null,
    raw: xmlStr,
  };
}

/**
 * Processes a single batch of pending outbound vouchers from Central ERP to Tally Prime.
 *
 * @param {Object} params
 * @param {String} params.companyId - Central ERP Company ID
 * @param {String} params.companyName - Active company name in Tally Prime
 * @param {Number} [params.port=9000] - Tally HTTP Port
 * @returns {Promise<Object>} Execution summary
 */
export async function processOutboundSyncBatch({ companyId, companyName, port = 9000 }) {
  const backendBaseUrl = (envConfig.TALLY_BRIDGE_BACKEND_URL || "http://localhost:3000").replace(/\/+$/, "");
  const tallyUrl = getTallyUrl(port);

  emitSyncLog(`[OutboundSync] Checking pending outbound queue for company: ${companyName}...`);

  let pendingBatch = [];
  try {
    const pendingRes = await axios.get(
      `${backendBaseUrl}/api/v1/erp/sync/outbound/pending`,
      {
        params: { companyId, limit: 10 },
        headers: { "x-company-id": companyId },
        timeout: 15000,
      }
    );

    pendingBatch = pendingRes.data?.data || [];
  } catch (err) {
    const errMsg = `[OutboundSync] Failed to fetch pending queue: ${err.message}`;
    console.error(errMsg);
    emitSyncLog(errMsg);
    return { success: false, error: errMsg };
  }

  if (pendingBatch.length === 0) {
    emitSyncLog("[OutboundSync] No pending vouchers in queue.");
    return { success: true, processed: 0, synced: 0, failed: 0 };
  }

  emitSyncLog(`[OutboundSync] Found ${pendingBatch.length} pending voucher(s) to sync to Tally.`);

  let syncedCount = 0;
  let failedCount = 0;

  for (const item of pendingBatch) {
    const queueId = item._id;
    const isLedger = item.entityType === "LEDGER" || Boolean(item.ledgerId);
    const voucher = item.voucherId;
    const ledger = item.ledgerId;

    if (!voucher && !ledger) {
      // Document was deleted or invalid
      await axios.post(`${backendBaseUrl}/api/v1/erp/sync/outbound/fail`, {
        queueId,
        error: "Document reference missing or deleted",
      });
      failedCount++;
      continue;
    }

    const entityDesc = isLedger
      ? `Ledger ${ledger?.name || "Master"}`
      : `${voucher?.voucherType || "Voucher"} ${voucher?.voucherNumber || ""}`;

    try {
      // 1. Build Tally XML Envelope
      const tallyXml = isLedger
        ? buildTallyLedgerXml(ledger, companyName)
        : buildTallyVoucherXml(voucher, companyName);

      // 2. Send HTTP POST to Tally Prime
      const tallyResponse = await axios.post(tallyUrl, tallyXml, {
        headers: { "Content-Type": "text/xml" },
        timeout: 45000,
      });

      // 3. Parse XML response for the HTTP 200 Trap
      const parsed = parseTallyResponse(tallyResponse.data);

      if (parsed.success) {
        // Acknowledge success to central ERP
        await axios.post(`${backendBaseUrl}/api/v1/erp/sync/outbound/ack`, {
          queueId,
          tallyAlterId: parsed.tallyAlterId,
          tallyGuid: parsed.tallyGuid,
          responseDetails: {
            createdCount: parsed.createdCount,
            alteredCount: parsed.alteredCount,
          },
        });

        emitSyncLog(`[OutboundSync] Successfully synced ${entityDesc} to Tally Prime!`);
        syncedCount++;
      } else {
        // Report failure and schedule retry
        await axios.post(`${backendBaseUrl}/api/v1/erp/sync/outbound/fail`, {
          queueId,
          error: parsed.error,
          rawResponse: parsed.raw?.slice(0, 500),
        });

        emitSyncLog(`[OutboundSync] Error syncing ${entityDesc}: ${parsed.error}`);
        failedCount++;
      }
    } catch (sendErr) {
      const errMsg = sendErr.response?.data || sendErr.message;
      emitSyncLog(`[OutboundSync] Network/Tally error on ${entityDesc}: ${errMsg}`);

      await axios.post(`${backendBaseUrl}/api/v1/erp/sync/outbound/fail`, {
        queueId,
        error: `Tally Prime connection failed: ${sendErr.message}`,
      });
      failedCount++;
    }
  }

  return {
    success: true,
    processed: pendingBatch.length,
    synced: syncedCount,
    failed: failedCount,
  };
}

let syncWorkerInterval = null;

/**
 * Starts continuous background polling for outbound sync.
 */
export function startOutboundSyncWorker({ companyId, companyName, port = 9000, intervalMs = 30000 }) {
  if (syncWorkerInterval) {
    clearInterval(syncWorkerInterval);
  }

  console.log(`[OutboundSyncWorker] Starting sync loop every ${intervalMs / 1000}s for ${companyName}`);

  // Run initial pass immediately
  processOutboundSyncBatch({ companyId, companyName, port }).catch(console.error);

  syncWorkerInterval = setInterval(() => {
    processOutboundSyncBatch({ companyId, companyName, port }).catch(console.error);
  }, intervalMs);
}

/**
 * Stops background polling worker.
 */
export function stopOutboundSyncWorker() {
  if (syncWorkerInterval) {
    clearInterval(syncWorkerInterval);
    syncWorkerInterval = null;
    console.log("[OutboundSyncWorker] Stopped.");
  }
}
