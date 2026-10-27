import axios from "axios";
import groupMasterXml from "../xmls/group.xml.js";
import { convertXmlToJson } from "./company.helpers.js";
import { saveToDb } from "../save/saveToServer.js";
import { getTallyUrl, getTallyTimeout } from "../helpers/tally.helpers.js";

const fetchTallyCompanyGroups = async (companyName, company_id, port) => {
  console.log("Fetching groups for company:", companyName, "on port:", port);
  try {
    const xmlPayload = groupMasterXml(companyName);
    const tallyResponse = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: getTallyTimeout(),
      },
    );
    const jsonResult = await convertXmlToJson(tallyResponse.data);
    const rawGroups = jsonResult?.envelope?.master || [];
    // console.log("Fetched groups:", rawGroups);
    await saveToDb({ data: rawGroups, type: "group", company_id });
    return rawGroups;
  } catch (error) {
    console.error("Error fetching tally company groups:", error.message);
    throw error;
  }
};
const fetchTallyGroups = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000 } = req.body;
    console.log("Request body:", req.body);
    if (!companyName || !company_id || !port) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const groups = await fetchTallyCompanyGroups(companyName, company_id, port);
    res.status(200).json({
      success: true,
      message: "Groups fetched successfully",
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export { fetchTallyCompanyGroups, fetchTallyGroups };
