/**
 * Escapes XML special characters for safe inclusion in Tally XML.
 */
export function escapeXml(str = "") {
  if (!str) return "";
  return String(str)
    .replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Converts "YYYY-MM-DD" to Tally's "YYYYMMDD" format.
 */
export function toTallyDate(dateStr) {
  if (!dateStr) {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  }
  return dateStr.replace(/-/g, "");
}

/**
 * Maps unified voucherType to standard Tally Voucher Type Name.
 */
export function getTallyVoucherTypeName(voucherType) {
  switch (voucherType) {
    case "SALES":
      return "Sales";
    case "PURCHASE":
      return "Purchase";
    case "RECEIPT":
      return "Receipt";
    case "PAYMENT":
      return "Payment";
    case "JOURNAL":
      return "Journal";
    case "CONTRA":
      return "Contra";
    case "CREDIT_NOTE":
      return "Credit Note";
    case "DEBIT_NOTE":
      return "Debit Note";
    default:
      return "Sales";
  }
}

/**
 * Builds standard Tally XML envelope for voucher import.
 *
 * @param {Object} voucher - Populated UnifiedVoucher document
 * @param {String} companyName - Active company name in Tally Prime
 * @returns {String} Tally XML Import Envelope
 */
export function buildTallyVoucherXml(voucher, companyName) {
  const safeCompany = escapeXml(companyName);
  const tallyDate = toTallyDate(voucher.date);
  const vchTypeName = getTallyVoucherTypeName(voucher.voucherType);
  const safeVchNumber = escapeXml(voucher.voucherNumber);
  const safePartyName = escapeXml(voucher.party?.name || "Cash");
  const safeNarration = escapeXml(voucher.narration || "");

  let ledgerEntriesXml = "";

  // In Tally XML convention:
  // - Debit amount is negative (e.g. -100.00), ISDEEMEDPOSITIVE = Yes
  // - Credit amount is positive (e.g. 100.00), ISDEEMEDPOSITIVE = No
  for (const entry of voucher.entries || []) {
    const isDebit = (entry.debit || 0) > 0;
    const amountPaise = isDebit ? entry.debit : entry.credit;
    const rupees = (amountPaise / 100).toFixed(2);
    const signedRupees = isDebit ? `-${rupees}` : rupees;
    const deemedPositive = isDebit ? "Yes" : "No";

    let billAllocationsXml = "";
    // If this entry is for the party ledger and allocations exist
    const isParty = entry.ledgerId && voucher.party?.ledgerId &&
      String(entry.ledgerId) === String(voucher.party.ledgerId);

    if (isParty && voucher.allocations && voucher.allocations.length > 0) {
      for (const alloc of voucher.allocations) {
        const allocRupees = (alloc.amount / 100).toFixed(2);
        const signedAllocRupees = isDebit ? `-${allocRupees}` : allocRupees;
        billAllocationsXml += `
          <BILLALLOCATIONS.LIST>
            <NAME>${escapeXml(alloc.voucherNumber)}</NAME>
            <BILLTYPE>Agst Ref</BILLTYPE>
            <AMOUNT>${signedAllocRupees}</AMOUNT>
          </BILLALLOCATIONS.LIST>`;
      }
    }

    ledgerEntriesXml += `
      <ALLLEDGERENTRIES.LIST>
        <LEDGERNAME>${escapeXml(entry.name)}</LEDGERNAME>
        <ISDEEMEDPOSITIVE>${deemedPositive}</ISDEEMEDPOSITIVE>
        <AMOUNT>${signedRupees}</AMOUNT>${billAllocationsXml}
      </ALLLEDGERENTRIES.LIST>`;
  }

  return `<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${safeCompany}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="${vchTypeName}" ACTION="Create">
            <DATE>${tallyDate}</DATE>
            <VOUCHERTYPENAME>${vchTypeName}</VOUCHERTYPENAME>
            <VOUCHERNUMBER>${safeVchNumber}</VOUCHERNUMBER>
            <PARTYLEDGERNAME>${safePartyName}</PARTYLEDGERNAME>
            <PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>
            <NARRATION>${safeNarration}</NARRATION>
            ${ledgerEntriesXml}
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
}
