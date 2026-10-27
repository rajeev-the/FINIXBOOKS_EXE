import {
  processOutboundSyncBatch,
  startOutboundSyncWorker,
  stopOutboundSyncWorker,
} from "../workers/outboundSyncWorker.js";

/**
 * Triggers an immediate outbound sync batch from Central ERP to Tally Prime.
 */
export async function triggerOutboundSync(req, res) {
  try {
    const { companyId, companyName, port = 9000 } = req.body;

    if (!companyId || !companyName) {
      return res.status(400).json({
        success: false,
        message: "companyId and companyName are required",
      });
    }

    const result = await processOutboundSyncBatch({
      companyId,
      companyName,
      port: Number(port),
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Outbound sync failed:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to trigger outbound sync",
    });
  }
}

/**
 * Starts continuous background polling for outbound sync.
 */
export async function startOutboundWorkerController(req, res) {
  try {
    const { companyId, companyName, port = 9000, intervalSeconds = 30 } = req.body;

    if (!companyId || !companyName) {
      return res.status(400).json({
        success: false,
        message: "companyId and companyName are required",
      });
    }

    startOutboundSyncWorker({
      companyId,
      companyName,
      port: Number(port),
      intervalMs: Number(intervalSeconds) * 1000,
    });

    return res.status(200).json({
      success: true,
      message: `Outbound sync worker started for ${companyName} (every ${intervalSeconds}s)`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * Stops continuous background polling for outbound sync.
 */
export async function stopOutboundWorkerController(req, res) {
  try {
    stopOutboundSyncWorker();
    return res.status(200).json({
      success: true,
      message: "Outbound sync worker stopped",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
