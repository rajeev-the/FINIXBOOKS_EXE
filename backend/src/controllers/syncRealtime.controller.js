import { fetchTallyCompanyLedgers } from "./ledger.controller.js";
import { fetchTallyCompanyGroups } from "./group.controller.js";
import { fetchVoucherType, syncDaybookBlock } from "./voucher.controller.js";
import {
  fetchTallyCompanyStockItems,
  fetchTallyCompanyStockGroups,
  fetchTallyCompanyStockCategories,
} from "./stock.controller.js";
import { fetchTallyCompanyGodowns } from "./godown.controller.js";
import { fetchTallyCompanyUnits } from "./unit.controller.js";
import { fetchTallyCompanyCostCentres } from "./costcentre.controller.js";
import { emitSyncEvent, emitSyncLog } from "../socket/socket.js";
import { parseTallyDate, formatForTally } from "../helpers/date.helpers.js";
import { getTallyCompaniesList } from "./company.controller.js";

/**
 * Controller to execute full Tally sync while streaming real-time logs and progress via Socket.IO
 */
const syncRealtimeAll = async (req, res) => {
  const { companyName, company_id, port = 9000, from, to, period = "all" } = req.body;

  if (!company_id) {
    return res.status(400).json({
      success: false,
      message: "company_id is required",
    });
  }

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: "from and to are required",
    });
  }

  if (!companyName || typeof companyName !== "string") {
    return res.status(400).json({
      success: false,
      message: "Valid companyName is required",
    });
  }

  // 0. Verify that the requested company is actually open in Tally Prime
  try {
    const openCompanies = await getTallyCompaniesList(port);
    const isOpen = openCompanies.some(
      (c) =>
        c.name?.toLowerCase().trim() === companyName.toLowerCase().trim() ||
        c.guid === req.body?.tally_company_guid
    );

    if (!isOpen) {
      const errorMsg = `Company "${companyName}" is not open in Tally Prime. Please open "${companyName}" in Tally before syncing.`;
      console.warn(`[Sync Cancelled] ${errorMsg}`);
      emitSyncEvent(
        "sync:error",
        {
          companyName,
          company_id,
          error: errorMsg,
          message: errorMsg,
        },
        company_id
      );
      return res.status(400).json({
        success: false,
        message: errorMsg,
      });
    }
  } catch (tallyErr) {
    const errorMsg = `Unable to communicate with Tally Prime on port ${port}. Please make sure Tally Prime is open.`;
    console.error(`[Sync Cancelled] ${errorMsg}:`, tallyErr.message);
    emitSyncEvent(
      "sync:error",
      {
        companyName,
        company_id,
        error: errorMsg,
        message: errorMsg,
      },
      company_id
    );
    return res.status(400).json({
      success: false,
      message: errorMsg,
    });
  }

  const syncStats = {
    companyName,
    company_id,
    from,
    to,
    period,
    port,
    startTime: new Date().toISOString(),
    results: {},
    errors: [],
  };

  try {
    // 1. Emit Start Event
    emitSyncEvent(
      "sync:start",
      {
        companyName,
        company_id,
        from,
        to,
        period,
        port,
        message: `Sync started for company: ${companyName}`,
      },
      company_id
    );

    emitSyncLog(`Starting sync for company: ${companyName} (${from} to ${to}, period: ${period})`, {
      companyId: company_id,
      step: "init",
      status: "started",
    });

    // Helper to safely execute and log each master sync task
    const runMasterTask = async (taskName, label, fetchFn) => {
      try {
        emitSyncLog(`Fetching ${label} for company: ${companyName}`, {
          companyId: company_id,
          step: taskName,
          status: "in_progress",
        });

        emitSyncEvent(
          "sync:progress",
          {
            step: taskName,
            label,
            status: "syncing",
            count: 0,
          },
          company_id
        );

        const data = await fetchFn();
        const count = Array.isArray(data)
          ? data.length
          : Array.isArray(data?.data)
          ? data.data.length
          : data?.count !== undefined
          ? data.count
          : data
          ? 1
          : 0;

        syncStats.results[taskName] = {
          success: true,
          count,
        };

        emitSyncLog(`Fetched ${label}: ${count} found.`, {
          companyId: company_id,
          step: taskName,
          status: "success",
          count,
        });

        emitSyncEvent(
          "sync:progress",
          {
            step: taskName,
            label,
            status: "success",
            count,
          },
          company_id
        );

        return data;
      } catch (err) {
        console.error(`Error fetching ${label}:`, err.message);
        syncStats.errors.push({ step: taskName, error: err.message });
        syncStats.results[taskName] = { success: false, error: err.message };

        emitSyncLog(`Error fetching ${label}: ${err.message}`, {
          companyId: company_id,
          step: taskName,
          status: "error",
          error: err.message,
        });

        emitSyncEvent(
          "sync:progress",
          {
            step: taskName,
            label,
            status: "error",
            error: err.message,
          },
          company_id
        );

        return null;
      }
    };

    // 2. Fetch Voucher Types First
    await runMasterTask("voucherTypes", "voucher types", () =>
      fetchVoucherType(companyName, company_id, port)
    );

    // 3. Fetch Master Entities Sequentially (Tally Prime is single-threaded)
    const masterTasks = [
      { key: "groups", label: "groups", fn: () => fetchTallyCompanyGroups(companyName, company_id, port) },
      { key: "stockGroups", label: "stock groups", fn: () => fetchTallyCompanyStockGroups(companyName, company_id, port) },
      { key: "stockCategories", label: "stock categories", fn: () => fetchTallyCompanyStockCategories(companyName, company_id, port) },
      { key: "godowns", label: "godowns", fn: () => fetchTallyCompanyGodowns(companyName, company_id, port) },
      { key: "units", label: "units", fn: () => fetchTallyCompanyUnits(companyName, company_id, port) },
      { key: "costCentres", label: "cost centres", fn: () => fetchTallyCompanyCostCentres(companyName, company_id, port) },
      { key: "stockItems", label: "stock items", fn: () => fetchTallyCompanyStockItems(companyName, company_id, port) },
      {
        key: "ledgers",
        label: "ledgers",
        fn: () =>
          fetchTallyCompanyLedgers(
            companyName,
            company_id,
            port,
            from,
            to,
            ({ batch, totalBatches, from: bFrom, to: bTo, count }) => {
              emitSyncEvent(
                "sync:ledger-batch",
                {
                  companyName,
                  company_id,
                  batch,
                  totalBatches,
                  from: bFrom,
                  to: bTo,
                  count,
                },
                company_id
              );
              emitSyncLog(
                `Fetched ledgers: ${count} found (Batch ${batch}/${totalBatches})`,
                {
                  companyId: company_id,
                  step: "ledgers",
                  status: "in_progress",
                  count,
                }
              );
            }
          ),
      },
    ];

    for (const task of masterTasks) {
      await runMasterTask(task.key, task.label, task.fn);
    }

    // 4. Voucher Sync in Batches according to selected period
    emitSyncLog(`Starting voucher sync (period: ${period})...`, {
      companyId: company_id,
      step: "vouchers",
      status: "in_progress",
    });

    const voucherBatches = [];
    let totalVouchersInserted = 0;
    const cursorDate = parseTallyDate(from);
    const endDate = parseTallyDate(to);

    if (
      !cursorDate ||
      !endDate ||
      isNaN(cursorDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      throw new Error("Invalid date format for 'from' or 'to'");
    }

    const normalizedPeriod = String(period || "all").toLowerCase().trim();
    const batchDateRanges = [];
    let tempDate = new Date(cursorDate);

    while (tempDate <= endDate) {
      let bEnd;
      switch (normalizedPeriod) {
        case "daily":
          bEnd = new Date(tempDate);
          break;
        case "weekly":
          bEnd = new Date(tempDate);
          bEnd.setDate(bEnd.getDate() + 6);
          break;
        case "monthly":
          bEnd = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0);
          break;
        case "all":
        default:
          bEnd = new Date(endDate);
          break;
      }

      if (bEnd > endDate) bEnd = new Date(endDate);

      batchDateRanges.push({
        fromStr: formatForTally(tempDate),
        toStr: formatForTally(bEnd),
      });

      tempDate = new Date(bEnd);
      tempDate.setDate(tempDate.getDate() + 1);
    }

    const totalBatches = batchDateRanges.length;

    for (let i = 0; i < totalBatches; i++) {
      const { fromStr, toStr } = batchDateRanges[i];
      const batchNum = i + 1;

      const result = await syncDaybookBlock(
        companyName,
        company_id,
        port,
        fromStr,
        toStr
      );

      const inserted = typeof result?.inserted === "number" ? result.inserted : 0;
      totalVouchersInserted += inserted;

      const batchInfo = {
        batch: batchNum,
        totalBatches,
        from: fromStr,
        to: toStr,
        inserted,
        success: result.success,
        percent: Math.round((batchNum / totalBatches) * 100),
      };

      voucherBatches.push(batchInfo);

      const msg = `Fetched ${inserted} vouchers from ${fromStr} to ${toStr} (${batchNum}/${totalBatches})`;
      emitSyncLog(msg, {
        companyId: company_id,
        step: "vouchers",
        status: result.success ? "success" : "error",
        batchInfo,
      });

      emitSyncEvent(
        "sync:voucher-batch",
        {
          ...batchInfo,
          totalVouchersInserted,
        },
        company_id
      );

      // Brief throttle between batches
      if (i < totalBatches - 1) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    syncStats.results.vouchers = {
      success: true,
      totalInserted: totalVouchersInserted,
      totalBatches,
      batches: voucherBatches,
    };

    syncStats.endTime = new Date().toISOString();

    // 5. Emit Complete Event
    emitSyncEvent(
      "sync:complete",
      {
        companyName,
        company_id,
        totalVouchersInserted,
        summary: syncStats.results,
        errors: syncStats.errors,
      },
      company_id
    );

    emitSyncLog(`Sync completed successfully for ${companyName}`, {
      companyId: company_id,
      step: "done",
      status: "completed",
      totalVouchersInserted,
    });

    return res.status(200).json({
      success: true,
      message: "Real-time sync completed successfully",
      data: syncStats,
    });
  } catch (error) {
    console.error("syncRealtimeAll Fatal Error:", error);

    emitSyncEvent(
      "sync:error",
      {
        companyName,
        company_id,
        message: error.message || "Internal server error",
      },
      company_id
    );

    emitSyncLog(`Fatal sync error: ${error.message}`, {
      companyId: company_id,
      step: "error",
      status: "fatal_error",
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export { syncRealtimeAll };
export default syncRealtimeAll;
