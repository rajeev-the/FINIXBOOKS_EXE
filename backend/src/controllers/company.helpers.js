import { parseStringPromise } from "xml2js";
function toCamelCase(key) {
  return key
    .replace(".LIST", "")
    .toLowerCase()
    .split(/[_\.]+/)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
}
function cleanTallyJSON(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanTallyJSON);
  }
  if (obj !== null && typeof obj === "object") {
    if (Object.keys(obj).length === 0) {
      return "";
    }
    if ("_" in obj && Object.keys(obj).length <= 2) {
      return obj["_"] || "";
    }
    const newObj = {};
    for (const key in obj) {
      if (key === "TYPE") continue;
      const cleanKey = toCamelCase(key);
      const value = cleanTallyJSON(obj[key]);
      if (
        value &&
        typeof value === "object" &&
        Object.keys(value).length === 0
      ) {
        newObj[cleanKey] = "";
      } else {
        newObj[cleanKey] = value;
      }
    }

    return newObj;
  }

  return obj ?? "";
}

async function xmlToJson(xmlData) {
  try {
    return await parseStringPromise(xmlData, {
      explicitArray: false,
      mergeAttrs: true,
      trim: true,
      strict: false,
    });
  } catch (err) {
    console.error("XML Parsing Error:", err);
    return null;
  }
}
async function convertXmlToJson(xmlString) {
  if (!xmlString || typeof xmlString !== "string") {
    throw new Error("XML string is required");
  }

  const rawJson = await xmlToJson(xmlString);
  return cleanTallyJSON(rawJson);
}
function getFinancialYearPeriods(fromStr, toStr) {
  let startDate = new Date(fromStr);
  let endDate = new Date(toStr);

  if (isNaN(startDate)) {
    const fromClean = String(fromStr).replace(/-/g, "");
    if (fromClean.length === 8) {
      startDate = new Date(
        fromClean.substring(0, 4),
        parseInt(fromClean.substring(4, 6)) - 1,
        fromClean.substring(6, 8),
      );
    }
  }

  if (isNaN(endDate)) {
    const toClean = String(toStr).replace(/-/g, "");
    if (toClean.length === 8) {
      endDate = new Date(
        toClean.substring(0, 4),
        parseInt(toClean.substring(4, 6)) - 1,
        toClean.substring(6, 8),
      );
    }
  }

  if (isNaN(startDate) || isNaN(endDate)) {
    return [{ from: fromStr, to: toStr }];
  }

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1; // 1-12
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;

  // Financial Year starts April 1st.
  // If month is Jan(1), Feb(2), or Mar(3), the FY started the previous calendar year.
  let currentStartYear = startMonth <= 3 ? startYear - 1 : startYear;
  let currentEndYear = endMonth <= 3 ? endYear - 1 : endYear;

  const periods = [];
  for (let y = currentStartYear; y <= currentEndYear; y++) {
    periods.push({
      from: `01-Apr-${y}`,
      to: `31-Mar-${y + 1}`,
    });
  }
  return periods;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDateToTally(dateStr) {
  if (!dateStr) return dateStr;

  const str = String(dateStr).trim();

  // If already in DD-MMM-YYYY format (e.g. 01-Apr-2024 or 1-Apr-2024)
  if (/^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(str)) {
    const parts = str.split("-");
    return `${parts[0].padStart(2, "0")}-${parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase()}-${parts[2]}`;
  }

  let d = new Date(str);
  if (isNaN(d.getTime())) {
    const clean = str.replace(/[^0-9]/g, "");
    if (clean.length === 8) {
      // YYYYMMDD
      const year = parseInt(clean.substring(0, 4), 10);
      const month = parseInt(clean.substring(4, 6), 10) - 1;
      const day = parseInt(clean.substring(6, 8), 10);
      d = new Date(year, month, day);
    }
  } else {
    // If str was in YYYYMMDD without dashes and parsed weirdly or was standard date
    const clean = str.replace(/[^0-9]/g, "");
    if (clean.length === 8 && !str.includes("-") && !str.includes("/")) {
      const year = parseInt(clean.substring(0, 4), 10);
      const month = parseInt(clean.substring(4, 6), 10) - 1;
      const day = parseInt(clean.substring(6, 8), 10);
      d = new Date(year, month, day);
    }
  }

  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return dateStr;
}

function escapeXml(str = "") {
  if (!str) return "";
  return String(str)
    .replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export { convertXmlToJson, getFinancialYearPeriods, formatDateToTally, escapeXml };
export default convertXmlToJson;
