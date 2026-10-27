import axios from "axios";
import getCostCentreXml from "../xmls/costCentre.xml.js";
import convertXmlToJson from "./company.helpers.js";
import saveToDb from "../save/saveToServer.js";
import { getTallyUrl, getTallyTimeout } from "../helpers/tally.helpers.js";

const fetchTallyCompanyCostCentres = async (companyName, company_id, port) => {
  console.log(
    "Fetching cost centres for company:",
    companyName,
    "on port:",
    port,
  );
  try {
    const xmlPayload = getCostCentreXml(companyName);
    const tallyResponse = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: getTallyTimeout(),
      },
    );
    const jsonResult = await convertXmlToJson(tallyResponse.data);
    const rawCostCentres = jsonResult?.envelope?.body?.data?.collection?.costcentre || [];
    const normalizedCostCentres = Array.isArray(rawCostCentres)
      ? rawCostCentres
      : [rawCostCentres];
    console.log(
      "Fetched cost centres:",
      normalizedCostCentres.length || 0,
      "found.",
    );
    await saveToDb({
      data: normalizedCostCentres,
      type: "costcenter",
      company_id,
    });
    return normalizedCostCentres;
  } catch (error) {
    console.error("Error fetching tally company cost centres:", error.message);
    throw error;
  }
};

const fetchCostCentres = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000 } = req.body;
    console.log("Request body:", req.body);
    if (!companyName || !company_id || !port) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const costCentres = await fetchTallyCompanyCostCentres(
      companyName,
      company_id,
      port,
    );
    res.status(200).json({
      success: true,
      message: "Cost centres fetched successfully",
      data: costCentres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { fetchCostCentres, fetchTallyCompanyCostCentres };
