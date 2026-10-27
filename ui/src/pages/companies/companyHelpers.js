export const mergeDbAndTallyCompanies = (dbData = [], tallyData = []) => {
  const tallyNameMap = new Map();
  const tallyGuidMap = new Map();

  tallyData.forEach((tC) => {
    const cName =
      tC.tally_company_name ||
      tC.name ||
      tC.companyName ||
      "Unknown Company";
    const lowerName = cName.toLowerCase().trim();
    tallyNameMap.set(lowerName, tC);

    const guid = tC.tally_company_guid || tC.guid || tC.tally_guid;
    if (guid) {
      tallyGuidMap.set(String(guid).toLowerCase().trim(), tC);
    }
  });

  const merged = [];
  const processedNames = new Set();

  dbData.forEach((dbC) => {
    const cName =
      dbC.tally_company_name ||
      dbC.companyName ||
      dbC.name ||
      "Unknown Company";
    const lowerName = cName.toLowerCase().trim();
    processedNames.add(lowerName);

    const dbGuid = dbC.tally_company_guid || dbC.guid || dbC.tally_guid;
    const matchedByGuid = dbGuid
      ? tallyGuidMap.get(String(dbGuid).toLowerCase().trim())
      : null;
    const matchedByName = tallyNameMap.get(lowerName);
    const matchedTally = matchedByName || matchedByGuid || null;
    const isLive = Boolean(matchedTally);

    merged.push({
      ...(matchedTally || {}),
      ...dbC,
      displayName: cName,
      syncStatus: "sync",
      isLive, // Indicates company is currently open/loaded in Tally
      booksfrom: matchedTally?.booksfrom || dbC.booksfrom,
      startingfrom: matchedTally?.startingfrom || dbC.startingfrom,
      endingat: matchedTally?.endingat || dbC.endingat,
    });
  });

  tallyData.forEach((tC) => {
    const cName =
      tC.tally_company_name ||
      tC.name ||
      tC.companyName ||
      "Unknown Company";
    const lowerName = cName.toLowerCase().trim();
    if (!processedNames.has(lowerName)) {
      merged.push({
        ...tC,
        displayName: cName,
        syncStatus: "new to add",
        isLive: true, // Company from Tally is currently open in Tally
      });
      processedNames.add(lowerName);
    }
  });

  return merged;
};

export const createCompanyPayload = (targetCompany, selectedTenant) => {
  const cName =
    targetCompany.displayName ||
    targetCompany.tally_company_name ||
    targetCompany.name ||
    targetCompany.companyName ||
    "Unknown Company";

  const cleanSlug = cName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const companyEmail =
    targetCompany.email ||
    `${cleanSlug}_${Date.now().toString(36)}@tallybridge.local`;

  return {
    tenant_id: selectedTenant,
    name: cName,
    tally_company_name: cName,
    tally_company_guid:
      targetCompany.tally_company_guid ||
      targetCompany.guid ||
      targetCompany.tally_guid ||
      "",
    email: companyEmail,
    base_currency: targetCompany.base_currency || "INR",
    address: targetCompany.address || "N/A",
    city: targetCompany.city || "N/A",
    state: targetCompany.state || "N/A",
    country: targetCompany.country || "India",
    statistics: Array.isArray(targetCompany.statistics)
      ? targetCompany.statistics
      : [],
  };
};
