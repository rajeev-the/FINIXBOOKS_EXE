import axios from "axios";
import getBillsXml from "../xmls/bills.xml.js";
import convertXmlToJson from "./company.helpers.js";
import saveToDb from "../save/saveToServer.js";
import { getTallyUrl } from "../helpers/tally.helpers.js";

const fetchTallyCompanyBills = async (companyName, company_id, port) => {
  console.log("Fetching bills for company:", companyName, "on port:", port);
  try {
    const xmlPayload = getBillsXml(companyName);
    const tallyResponse = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: 30000,
      },
    );
    const jsonResult = await convertXmlToJson(tallyResponse.data);
    const rawBills = jsonResult?.envelope?.body.data.collection.bill || [];
    if (!rawBills || rawBills.length === 0) {
      console.log("No bills found for company:", companyName);
      return [];
    }
    console.log("Fetched bills:", rawBills.length || 0, "bills found.");
    await saveToDb({ data: rawBills, type: "bills", company_id });
    return rawBills;
  } catch (error) {
    console.error("Error fetching tally company bills:", error.message);
    throw error;
  }
};

const fetchBills = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000 } = req.body;
    console.log("Request body:", req.body);
    if (!companyName || !company_id || !port) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const bills = await fetchTallyCompanyBills(companyName, company_id, port);
    if (!bills || bills.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bills found for the specified company",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bills fetched successfully",
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { fetchBills, fetchTallyCompanyBills };
