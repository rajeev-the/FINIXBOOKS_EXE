import axios from "axios";
import getUnitXml from "../xmls/unit.xml.js";
import convertXmlToJson from "./company.helpers.js";
import saveToDb from "../save/saveToServer.js";
import { getTallyUrl, getTallyTimeout } from "../helpers/tally.helpers.js";

const fetchTallyCompanyUnits = async (companyName, company_id, port) => {
  console.log("Fetching units for company:", companyName, "on port:", port);
  try {
    const xmlPayload = getUnitXml(companyName);
    const tallyResponse = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: getTallyTimeout(),
      },
    );
    const jsonResult = await convertXmlToJson(tallyResponse.data);
    const rawUnits = jsonResult?.envelope?.body?.data?.collection?.unit || [];
    const normalizedUnits = Array.isArray(rawUnits) ? rawUnits : [rawUnits];
    // console.log("Fetched units:", normalizedUnits.length || 0, "units found.");
    await saveToDb({ data: normalizedUnits, type: "unit", company_id });
    return normalizedUnits;
  } catch (error) {
    console.error("Error fetching tally company units:", error.message);
    throw error;
  }
};

const fetchUnits = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000 } = req.body;
    console.log("Request body:", req.body);
    if (!companyName || !company_id || !port) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const units = await fetchTallyCompanyUnits(companyName, company_id, port);
    res.status(200).json({
      success: true,
      message: "Units fetched successfully",
      data: units,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { fetchUnits, fetchTallyCompanyUnits };
