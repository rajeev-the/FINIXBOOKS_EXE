import { fetchTallyCompanyLedgers } from "./ledger.controller.js";
import { fetchTallyCompanyGroups } from "./group.controller.js";
import { fetchVoucher, fetchVoucherType } from "./voucher.controller.js";
import {
  fetchTallyCompanyStockItems,
  fetchTallyCompanyStockGroups,
  fetchTallyCompanyStockCategories,
} from "./stock.controller.js";
import { fetchTallyCompanyGodowns } from "./godown.controller.js";
import { fetchTallyCompanyUnits } from "./unit.controller.js";
import { fetchTallyCompanyCostCentres } from "./costcentre.controller.js";
const syncAllData = async (req, res) => {
  try {
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
    const groupsResult=await fetchTallyCompanyGroups(companyName, company_id, port);
    const ledgersResult = await fetchTallyCompanyLedgers(companyName, company_id, port, from, to);
    const voucherTypeResult = await fetchVoucherType(
      companyName,
      company_id,
      port,
    );
    const [
      vouchersResult,
      stockItemsResult,
      stockGroupsResult,
      stockCategoriesResult,
      godownsResult,
      unitsResult,
      costCentresResult,
    ] = await Promise.allSettled([
      fetchVoucher(companyName, company_id, port, from, to, period),
      fetchTallyCompanyStockItems(companyName, company_id, port),
      fetchTallyCompanyStockGroups(companyName, company_id, port),
      fetchTallyCompanyStockCategories(companyName, company_id, port),
      fetchTallyCompanyGodowns(companyName, company_id, port),
      fetchTallyCompanyUnits(companyName, company_id, port),
      fetchTallyCompanyCostCentres(companyName, company_id, port),
    ]);

    const formatResult = (result, label) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        console.error(`Error in ${label}:`, result.reason);
        return {
          error: true,
          message: result.reason?.message || `Failed to fetch ${label}`,
        };
      }
    };

    const responseData = {
      voucherType: voucherTypeResult,
      ledgers: ledgersResult,
      groups: groupsResult,
      vouchers: formatResult(vouchersResult, "vouchers"),
      stockItems: formatResult(stockItemsResult, "stockItems"),
      stockGroups: formatResult(stockGroupsResult, "stockGroups"),
      stockCategories: formatResult(stockCategoriesResult, "stockCategories"),
      godowns: formatResult(godownsResult, "godowns"),
      units: formatResult(unitsResult, "units"),
      costCentres: formatResult(costCentresResult, "costCentres"),
    };

    return res.status(200).json({
      success: true,
      message: "All data fetched and synced successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("syncAllData Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export { syncAllData };
