import { stockItemXml } from "../xmls/stockItems.xml.js";
import getStockGroupXml from "../xmls/stockGroup.xml.js";
import getStockCategoryXml from "../xmls/stockCategory.xml.js";
import convertXmlToJson from "./company.helpers.js";
import saveToDb from "../save/saveToServer.js";
import { parseTallyDate, convertToIST } from "../helpers/date.helpers.js";
import axios from "axios";
import { getTallyUrl, getTallyTimeout } from "../helpers/tally.helpers.js";

const fetchTallyCompanyStockItems = async (companyName, company_id, port) => {
  try {
    const xmlPayload = stockItemXml(companyName);
    const tallyResponse = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: getTallyTimeout(),
      },
    );
    const jsonResult = await convertXmlToJson(tallyResponse.data);
    const rawStockItems =
      jsonResult?.envelope?.body?.data?.collection?.stockitem || [];
    await saveToDb({ data: rawStockItems, type: "stock", company_id });
    return rawStockItems;
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

const fetchStockItem = async (req, res) => {
  try {
    const { companyName, port = 9000, company_id } = req.body;
    if (!companyName || !port) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const stockItems = await fetchTallyCompanyStockItems(
      companyName,
      company_id,
      port,
    );
    res.status(200).json({
      success: true,
      message: "Stock items fetched successfully",
      data: stockItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchTallyCompanyStockGroups = async (companyName, company_id, port) => {
  console.log(
    "Fetching stock groups for company:",
    companyName,
    "on port:",
    port,
  );
  try {
    const xmlPayload = getStockGroupXml(companyName);
    const tallyResponse = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: getTallyTimeout(),
      },
    );
    const jsonResult = await convertXmlToJson(tallyResponse.data);
    const rawStockGroups =
      jsonResult?.envelope?.body?.data?.collection?.stockgroup || [];
    console.log("Fetched stock groups:", rawStockGroups.length || 0, "found.");
    await saveToDb({ data: rawStockGroups, type: "stockgroup", company_id });
    return rawStockGroups;
  } catch (error) {
    console.error("Error fetching tally company stock groups:", error.message);
    throw error;
  }
};

const fetchStockGroup = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000 } = req.body;
    if (!companyName || !company_id || !port) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const stockGroups = await fetchTallyCompanyStockGroups(
      companyName,
      company_id,
      port,
    );
    res.status(200).json({
      success: true,
      message: "Stock groups fetched successfully",
      data: stockGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchTallyCompanyStockCategories = async (
  companyName,
  company_id,
  port,
) => {
  console.log(
    "Fetching stock categories for company:",
    companyName,
    "on port:",
    port,
  );
  try {
    const xmlPayload = getStockCategoryXml(companyName);
    const tallyResponse = await axios.post(
      getTallyUrl(port),
      xmlPayload,
      {
        headers: { "Content-Type": "text/xml" },
        timeout: getTallyTimeout(),
      },
    );
    const jsonResult = await convertXmlToJson(tallyResponse.data);
    console.log(jsonResult?.envelope?.body?.data?.collection);
    const rawStockCategories =
      jsonResult?.envelope?.body?.data?.collection?.stockcategory || [];
    console.log(
      "Fetched stock categories:",
      rawStockCategories.length || 0,
      "found.",
    );
    // await saveToDb({
    //   data: rawStockCategories,
    //   type: "stockcategory",
    //   company_id,
    // });
    return rawStockCategories;
  } catch (error) {
    console.error(
      "Error fetching tally company stock categories:",
      error.message,
    );
    throw error;
  }
};

const fetchStockCategory = async (req, res) => {
  try {
    const { companyName, company_id, port = 9000 } = req.body;
    if (!companyName || !company_id || !port) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const stockCategories = await fetchTallyCompanyStockCategories(
      companyName,
      company_id,
      port,
    );
    res.status(200).json({
      success: true,
      message: "Stock categories fetched successfully",
      data: stockCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  fetchStockItem,
  fetchTallyCompanyStockItems,
  fetchStockGroup,
  fetchTallyCompanyStockGroups,
  fetchStockCategory,
  fetchTallyCompanyStockCategories,
};
