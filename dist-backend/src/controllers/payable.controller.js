import axios from "axios";
import getPayable from "../xmls/payable.xml.js";
import saveToDb from "../save/saveToServer.js";

import { getTallyUrl } from "../helpers/tally.helpers.js";

const parsePayableXml = (xml) => {
  const results = [];
  const tagValue = (block, tag) => {
    const match = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, "i"));
    return match ? match[1]?.trim() : "";
  };

  const numValue = (block, tag) => {
    const val = tagValue(block, tag);
    return val ? parseFloat(val) : 0;
  };

  const blocks = xml.split(/<BILLFIXED>/i).slice(1);

  for (const block of blocks) {
    const billDate = tagValue(block, "BILLDATE");
    const billRef = tagValue(block, "BILLREF");

    let partyName = tagValue(block, "BILLPARTY");
    partyName = partyName ? partyName.replace(/&amp;/g, "&") : "";

    const closingAmount = numValue(block, "BILLCL");
    const billDue = tagValue(block, "BILLDUE");
    const overdueDays = numValue(block, "BILLOVERDUE");

    if (partyName) {
      results.push({
        billDate,
        billRef,
        partyName,
        closingAmount,
        billDue,
        overdueDays,
      });
    }
  }

  return results;
};

const fetchPayable = async (
  companyName,
  company_id,
  port = 9000,
) => {
  try {
    const xmlPayload = getPayable(companyName);

    const response = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: 60000,
      },
    );

    const parsedData = parsePayableXml(response.data);
    if (parsedData.length > 0) {
      try {
        await saveToDb({
          data: parsedData,
          company_id,
          type: "payable",
        });
      } catch (dbError) {
        console.error("Failed to save payable to DB:", dbError.message);
      }
    }

    return {
      success: true,
      data: parsedData,
      message: "Payable fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching payable:", error.message);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

const getPayableData = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000} = req.body;

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



    const result = await fetchPayable(companyName, company_id, port);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error("Payable Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getPayableData, fetchPayable };
