
import convertXmlToJson from "../helpers/company.helpers.js";
import saveToDb from "../save/saveToServer.js";
import {
  parseTallyDate,
  convertToIST,
  formatForTally,
} from "../helpers/date.helpers.js";
import voucherType from "../xmls/voucherType.xml.js";
import getDaybookXml from "../xmls/voucher.xml.js";
import mongoose from "mongoose";
import axios from "axios";
import { getTallyUrl } from "../helpers/tally.helpers.js";

 
const fetchVoucherType = async (companyName, company_id, port = 9000) => {
  try {
    const response = await axios.post(
      getTallyUrl(port),
      voucherType(companyName),
      {
        headers: { "Content-Type": "text/xml" },
        timeout: 60000,
      },
    );
    if (!response?.data) {
      return {
        success: false,
        message: "Empty response from Tally",
      };
    }
    const json = await convertXmlToJson(response.data);
    let voucherTypes =
      json?.envelope?.body?.data?.collection?.vouchertype || [];
    voucherTypes = Array.isArray(voucherTypes) ? voucherTypes : [voucherTypes];

    if (voucherTypes.length === 0) {
      return {
        success: true,
        data: [],
        message: "No voucher types found",
      };
    }
    await saveToDb({ data: voucherTypes, type: "voucher_type", company_id });
    return {
      success: true,
      data: voucherTypes,
      message: "Voucher types fetched successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

const getVoucherType = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000 } = req.body;
    if (!company_id || !mongoose.Types.ObjectId.isValid(company_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing company_id",
      });
    }
    if (!companyName || typeof companyName !== "string") {
      return res.status(400).json({
        success: false,
        message: "companyName is required",
      });
    }
    const result = await fetchVoucherType(companyName, company_id, port);
    return res.status(200).json({
      success: true,
      data: result.data || [],
      message: result.message || "Voucher types fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const syncDaybookBlock = async (
  companyName,
  company_id,
  port,
  fromStr,
  toStr,
) => {
  try {
    const response = await axios.post(
      getTallyUrl(port),
      getDaybookXml(companyName, fromStr, toStr),
      { headers: { "Content-Type": "text/xml" }, timeout: 30000 },
    );

    if (!response?.data) {
      return {
        success: false,
        inserted: 0,
        message: "Empty response from Tally",
      };
    }

    const jsonResult = await convertXmlToJson(response.data);
    const rawVouchers = jsonResult?.envelope?.voucher;
    let vouchers = [];
    if (Array.isArray(rawVouchers)) {
      vouchers = rawVouchers;
    } else if (rawVouchers && typeof rawVouchers === "object" && Object.keys(rawVouchers).length > 0) {
      vouchers = [rawVouchers];
    }
    const insertedCount = vouchers.length;
    console.log(
      `Fetched ${insertedCount} vouchers from ${fromStr} to ${toStr}`,
    );
    if (insertedCount > 0) {
      await saveToDb({
        data: vouchers,
        type: "voucher",
        company_id,
        from: fromStr,
        to: toStr,
        
      });
    }
    return {
      success: true,
      inserted: insertedCount,
    };
  } catch (err) {
    console.error(`Sync Error (${fromStr} - ${toStr}):`, err.message);

    return {
      success: false,
      inserted: 0,
      message: err.message,
    };
  }
};

const fetchVoucher = async (
  companyName,
  company_id,
  port = 9000,
  from,
  to,
  period = "all",
) => {
  try {
    const logs = [];
    let totalInserted = 0;
    let cursorDate = parseTallyDate(from);
    const endDate = parseTallyDate(to);

    if (
      !cursorDate ||
      !endDate ||
      isNaN(cursorDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      return {
        success: false,
        message: "Invalid date format for 'from' or 'to'",
      };
    }

    const normalizedPeriod = String(period || "all")
      .toLowerCase()
      .trim();
    while (cursorDate <= endDate) {
      let batchEnd;

      switch (normalizedPeriod) {
        case "daily":
          batchEnd = new Date(cursorDate);
          break;
        case "weekly":
          batchEnd = new Date(cursorDate);
          batchEnd.setDate(batchEnd.getDate() + 6);
          break;
        case "monthly":
          batchEnd = new Date(
            cursorDate.getFullYear(),
            cursorDate.getMonth() + 1,
            0,
          );
          break;
        case "all":
        default:
          batchEnd = new Date(endDate);
          break;
      }

      if (batchEnd > endDate) batchEnd = new Date(endDate);

      const fromStr = formatForTally(cursorDate);
      const toStr = formatForTally(batchEnd);

      const result = await syncDaybookBlock(
        companyName,
        company_id,
        port,
        fromStr,
        toStr,
      );

      const inserted = result?.inserted || 0;
      totalInserted += inserted;

      logs.push({
        from: fromStr,
        to: toStr,
        inserted,
        success: result.success,
      });

      cursorDate = new Date(batchEnd);
      cursorDate.setDate(cursorDate.getDate() + 1);

      if (cursorDate <= endDate) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    return {
      success: true,
      totalInserted,
      batches: logs,
    };
  } catch (error) {
    console.error("fetchVoucher Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};

const getVoucher = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000, from, to, period } = req.body;
    if (!company_id || !mongoose.Types.ObjectId.isValid(company_id) || !period ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing company_id",
      });
    }
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "from and to dates are required",
      });
    }
    if (!companyName || typeof companyName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid companyName is required",
      });
    }
    const result = await fetchVoucher(
      companyName,
      company_id,
      port,
      from,
      to,
      period,
    );
    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Vouchers fetched successfully",
    });
  } catch (error) {
    console.error("Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getVoucherType, getVoucher, fetchVoucher, fetchVoucherType, syncDaybookBlock };
