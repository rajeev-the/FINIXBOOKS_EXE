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
export { convertXmlToJson };
export default convertXmlToJson;
