import axios from "axios";
import getGodownXml from "../xmls/godown.xml.js";
import convertXmlToJson from "./company.helpers.js";
import saveToDb from "../save/saveToServer.js";
import { getTallyUrl, getTallyTimeout } from "../helpers/tally.helpers.js";

const fetchTallyCompanyGodowns = async (companyName, company_id, port) => {
  console.log("Fetching godowns for company:", companyName, "on port:", port);
  try {
    const xmlPayload = getGodownXml(companyName);
    const tallyResponse = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: getTallyTimeout(),
      },
    );
    const jsonResult = await convertXmlToJson(tallyResponse.data);
    const rawGodowns = jsonResult?.envelope?.body?.data?.collection?.godown || [];
    const normalizedGodowns = Array.isArray(rawGodowns) ? rawGodowns : [rawGodowns];
    await saveToDb({ data: normalizedGodowns, type: "godown", company_id });
    return normalizedGodowns;
  } catch (error) {
    console.error("Error fetching tally company godowns:", error.message);
    throw error;
  }
};

const fetchGodowns = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000 } = req.body;
    console.log("Request body:", req.body);
    if (!companyName || !company_id || !port) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const godowns = await fetchTallyCompanyGodowns(
      companyName,
      company_id,
      port,
    );
    res.status(200).json({
      success: true,
      message: "Godowns fetched successfully",
      data: godowns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { fetchGodowns, fetchTallyCompanyGodowns };
