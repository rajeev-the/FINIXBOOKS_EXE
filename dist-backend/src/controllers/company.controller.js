import axios from "axios";
import getCompanyXml from "../xmls/company.xml.js";
import getStatisticsXml from "../xmls/statistics.xml.js";
import { convertXmlToJson } from "./company.helpers.js";
import mongoose from "mongoose";
import { saveToDb } from "../save/saveToServer.js";
import { getTallyUrl, getTallyTimeout } from "../helpers/tally.helpers.js";

const getTallyCompaniesList = async (port = 9000) => {
  const tallyUrl = getTallyUrl(port);
  const response = await axios.post(tallyUrl, getCompanyXml(), {
    headers: { "Content-Type": "text/xml" },
    timeout: getTallyTimeout(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  const jsonResult = await convertXmlToJson(response.data);
  const companiesRaw1 =
    jsonResult?.envelope?.body?.data?.collection?.company || [];
  const companiesRaw = Array.isArray(companiesRaw1)
    ? companiesRaw1
    : [companiesRaw1];
  const filteredCompanies = companiesRaw
    .map((c) => {
      if (!c?.guid) return;
      return {
        ...c,
        name: Array.isArray(c?.name) ? c.name[0] : c?.name,
      };
    })
    .filter((c) => c !== undefined);

  return filteredCompanies;
};

const fetchTallyCompanies = async (req, res) => {
  const { port = 9000, company_id } = req.body || {};
  const tallyUrl = getTallyUrl(port);
  try {
    if (!port) {
      return res.status(404).json({
        success: false,
        message: "Port not found.",
      });
    }
    if (!company_id || !mongoose.Types.ObjectId.isValid(company_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing company_id.",
      });
    }
    const filteredCompanies = await getTallyCompaniesList(port);
    await saveToDb({ data: filteredCompanies, type: "company", company_id });
    return res.status(200).json({
      success: true,
      companies: filteredCompanies,
    });
  } catch (err) {
    const isConnRefused =
      err.code === "ECONNREFUSED" || err.message?.includes("ECONNREFUSED");
    const isTimeout =
      err.code === "ECONNABORTED" || err.message?.includes("timeout");
    if (isConnRefused) {
      console.warn(`[Tally] Not reachable at ${tallyUrl}`);
      return res.status(200).json({
        success: false,
        connected: false,
        companies: [],
        message: "Tally Prime is not running or unreachable.",
      });
    }
    if (isTimeout) {
      console.warn(`[Tally] Company request timed out (Tally may be busy processing data).`);
      return res.status(200).json({
        success: false,
        connected: true,
        companies: [],
        message: "Tally is currently busy processing data. Please wait a moment.",
      });
    }
    console.error("Error fetching companies:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchTallyCompaniesForTallyExeNoDataSave = async (req, res) => {
  const { port = 9000 } = req.body || {};
  const tallyUrl = getTallyUrl(port);
  try {
    if (!port) {
      return res.status(404).json({
        success: false,
        message: "Port not found.",
      });
    }
    const filteredCompanies = await getTallyCompaniesList(port);
    const companiesWithStats = await Promise.all(
      filteredCompanies.map(async (company) => {
        try {
          const statResponse = await axios.post(
            tallyUrl,
            getStatisticsXml(company.name),
            {
              headers: { "Content-Type": "text/xml" },
              timeout: getTallyTimeout(),
            },
          );
          const statJson = await convertXmlToJson(statResponse.data);
          let statNames = statJson?.envelope?.statname || [];
          let statValues = statJson?.envelope?.statvalue || [];

          statNames = Array.isArray(statNames) ? statNames : [statNames];
          statValues = Array.isArray(statValues) ? statValues : [statValues];

          const formattedStatistics = statNames.reduce((acc, name, index) => {
            if (!name) return acc;

            const valueObj = statValues[index] || {};
            acc.push({
              name: typeof name === "object" ? name["_"] || "" : name,
              direct: valueObj.statdirect || "0",
              cancelled: valueObj.statcancelled || "",
            });
            return acc;
          }, []);

          return {
            ...company,
            statistics: formattedStatistics,
          };
        } catch (statErr) {
          console.error(
            `Error fetching stats for ${company.name}:`,
            statErr.message,
          );
          return {
            ...company,
            statistics: [],
          };
        }
      }),
    );

    return res.status(200).json({
      success: true,
      companies: companiesWithStats,
    });
  } catch (err) {
    const isConnRefused =
      err.code === "ECONNREFUSED" || err.message?.includes("ECONNREFUSED");
    const isTimeout =
      err.code === "ECONNABORTED" || err.message?.includes("timeout");
    if (isConnRefused) {
      console.warn(`[Tally] Not reachable at ${tallyUrl}`);
      return res.status(200).json({
        success: false,
        connected: false,
        companies: [],
        message: "Tally Prime is not running or unreachable.",
      });
    }
    if (isTimeout) {
      console.warn(`[Tally] Company stats request timed out (Tally may be busy processing data).`);
      return res.status(200).json({
        success: false,
        connected: true,
        companies: [],
        message: "Tally is currently busy processing data. Please wait a moment.",
      });
    }
    console.error("Error fetching companies:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { fetchTallyCompanies, fetchTallyCompaniesForTallyExeNoDataSave, getTallyCompaniesList };