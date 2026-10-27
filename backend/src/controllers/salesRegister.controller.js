import axios from "axios";
import getSalesRegister from "../xmls/salesRegister.xml.js";
import mongoose from "mongoose";
import saveToDb from "../save/saveToServer.js";
import { getTallyUrl } from "../helpers/tally.helpers.js";

const MONTH_MAP = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const assignYears = (periods, fromDate) => {
  const parsed = new Date(fromDate);
  let year = parsed.getFullYear();

  if (parsed.getMonth() + 1 <= 3) {
    year = year - 1;
  }

  let prevMonthNum = 0;

  return periods.map((entry) => {
    const monthNum = MONTH_MAP[entry.period.toLowerCase()] || 0;

    if (monthNum <= prevMonthNum && prevMonthNum !== 0) {
      year += 1;
    }

    prevMonthNum = monthNum;

    return {
      ...entry,
      month: monthNum,
      year,
    };
  });
};

const parseSalesRegisterXml = (xml, fromDate) => {
  const results = [];
  const tagValue = (block, tag) => {
    const match = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    const val = match?.[1]?.trim();
    return val ? parseFloat(val) : 0;
  };

  const periodBlocks = xml.split(/<DSPPERIOD>/i).slice(1);

  for (const block of periodBlocks) {
    const periodMatch = block.match(/^([^<]+)<\/DSPPERIOD>/i);
    const period = periodMatch?.[1]?.trim() || "";

    const debitAmount = tagValue(block, "DSPDRAMTA");
    const creditAmount = tagValue(block, "DSPCRAMTA");
    const closingAmount = tagValue(block, "DSPCLAMTA");

    results.push({
      period,
      debitAmount,
      creditAmount,
      closingAmount,
    });
  }

  return assignYears(results, fromDate);
};

const fetchSalesRegister = async (
  companyName,
  company_id,
  port = 9000,
  from,
  to,
) => {
  try {
    const xmlPayload = getSalesRegister(companyName, from, to);
    const response = await axios.post(getTallyUrl(port), xmlPayload, {
      headers: { "Content-Type": "text/xml" },
      timeout: 60000,
    });

    if (!response?.data) {
      return {
        success: false,
        message: "Empty response from Tally",
      };
    }

    const salesList = parseSalesRegisterXml(response.data, from);

    if (salesList.length === 0) {
      return {
        success: true,
        data: [],
        message: "No sales register data found",
      };
    }

    try {
      await saveToDb({
        data: salesList,
        company_id,
        type: "sales_register",
        from,
        to,
      });
    } catch (dbError) {
      console.error("Failed to save sales register to DB:", dbError.message);
    }

    return {
      success: true,
      data: salesList,
      message: "Sales register fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching sales register:", error.message);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

const getSalesRegisterData = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000, from, to } = req.body;

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
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "from and to dates are required",
      });
    }

    const result = await fetchSalesRegister(
      companyName,
      company_id,
      port,
      from,
      to,
    );

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error("Sales Register Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getSalesRegisterData, fetchSalesRegister };
