import axios from "axios";
import getPurchaseAccount from "../xmls/purchaseAccount.xml.js";
import saveToDb from "../save/saveToServer.js";
import { getFinancialYearPeriods } from "./company.helpers.js";
import { getTallyUrl } from "../helpers/tally.helpers.js";

const parsePurchaseAccountXml = (xml) => {
  const results = [];
  const tagValue = (block, tag) => {
    const match = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, "i"));
    const val = match?.[1]?.trim();
    return val ? parseFloat(val) : 0;
  };

  const blocks = xml.split(/<DSPACCNAME>/i).slice(1);

  for (const block of blocks) {
    const nameMatch = block.match(/<DSPDISPNAME>([^<]*)<\/DSPDISPNAME>/i);
    const accountName = nameMatch?.[1]?.trim();
    const finalAccountName = accountName
      ? accountName.replace(/&amp;/g, "&")
      : "";

    const closingDebitAmount = tagValue(block, "DSPCLDRAMTA");
    const closingCreditAmount = tagValue(block, "DSPCLCRAMTA");

    if (finalAccountName) {
      results.push({
        accountName: finalAccountName,
        closingDebitAmount,
        closingCreditAmount,
      });
    }
  }

  return results;
};

const fetchPurchaseAccount = async (
  companyName,
  company_id,
  from_date,
  to_date,
  port = 9000,
) => {
  try {
    const periods = getFinancialYearPeriods(from_date, to_date);
    let allData = [];

    for (const period of periods) {
      const xmlPayload = getPurchaseAccount(
        companyName,
        period.from,
        period.to,
      );
      const response = await axios.post(
        getTallyUrl(port),
        xmlPayload,
        {
          headers: { "Content-Type": "text/xml" },
          timeout: 60000,
        },
      );
      const parsedData = parsePurchaseAccountXml(response.data);

      try {
         allData = allData.concat(
        parsedData.map((d) => ({
          ...d,
          period_from: period.from,
          period_to: period.to,
        })),
      );
        await saveToDb({
          data: allData,
          company_id,
          type: "purchase_account",
          from: period.from,
          to: period.to,
        });
      } catch (dbError) {
        console.error(
          "Failed to save purchase account to DB:",
          dbError.message,
        );
      }

     
    }

    return {
      success: true,
      data: allData,
      message: "Purchase account fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching purchase account:", error.message);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

const getPurchaseAccountData = async (req, res) => {
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

    const result = await fetchPurchaseAccount(
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
    console.error("Purchase Account Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getPurchaseAccountData, fetchPurchaseAccount };
