import axios from "axios";
import getTrialBalance from "../jsonReq/trailbalance.js";
import { getFinancialYearPeriods, formatDateToTally } from "./company.helpers.js";
import saveToDb from "../save/saveToServer.js";
import { getTallyUrl } from "../helpers/tally.helpers.js";

const fetchTrialBalance = async (
  companyName,
  company_id,
  from_date,
  to_date,
  port = 9000,
  timeline = "year",
) => {
  try {
    const periods = getFinancialYearPeriods(from_date, to_date);
    let allData = [];

    for (const period of periods) {
      const jsonPayload = getTrialBalance(companyName, period.from, period.to);
      const response = await axios.post(getTallyUrl(port), jsonPayload, {
        headers: {
          "Content-Type": "application/json",
          version: "1",
          tallyrequest: "export",
          type: "data",
          id: "Trial Balance",
        },
        timeout: 60000,
      });

      allData.push({
        period_from: period.from,
        period_to: period.to,
        data: response.data,
      });
    }

    try {
      await saveToDb({
        data: allData,
        company_id,
        type: "trial_balance",
        timeline: "year",
      });
    } catch (dbError) {
      console.error(
        "Failed to save trial balance to DB:",
        dbError.response?.data || dbError.message,
      );
    }

    return {
      success: true,
      data: allData,
      message: "Trial balance fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching trial balance:", error.message);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

const fetchTrialBalanceFromBeginningToEnd = async (
  companyName,
  company_id,
  from_date,
  to_date,
  port = 9000,
) => {
  try {
    const formattedFromDate = formatDateToTally(from_date);
    const formattedToDate = formatDateToTally(to_date);

    const jsonPayload = getTrialBalance(
      companyName,
      formattedFromDate,
      formattedToDate,
    );

    const response = await axios.post(getTallyUrl(port), jsonPayload, {
      headers: {
        "Content-Type": "application/json",
        version: "1",
        tallyrequest: "export",
        type: "data",
        id: "Trial Balance",
      },
      timeout: 60000,
    });

    const allData = [
      {
        period_from: formattedFromDate,
        period_to: formattedToDate,
        data: response.data,
      },
    ];

    try {
      await saveToDb({
        data: allData,
        company_id,
        type: "trial_balance",
        timeline: "all"
      });
    } catch (dbError) {
      console.error(
        "Failed to save trial balance to DB:",
        dbError.response?.data || dbError.message,
      );
    }

    return {
      success: true,
      data: allData,
      message: "Trial balance fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching trial balance from beginning to end:", error.message);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

const getTrialBalanceData = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000, from, to } = req.body;

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
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

    const result = await fetchTrialBalance(
      companyName,
      company_id,
      from,
      to,
      port,
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
    console.error("Trial Balance Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTrialBalanceFromBeginningToEnd = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000, from, to } = req.body;

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
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

    const result = await fetchTrialBalanceFromBeginningToEnd(
      companyName,
      company_id,
      from,
      to,
      port,
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
    console.error("Trial Balance Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  getTrialBalanceData,
  fetchTrialBalance,
  getTrialBalanceFromBeginningToEnd,
  fetchTrialBalanceFromBeginningToEnd,
};
