import { escapeXml } from "./tallyVoucherXmlBuilder.js";

/**
 * Builds standard Tally XML envelope for Ledger master import (Party, Bank, General).
 *
 * @param {Object} ledger - Populated Ledger document
 * @param {String} companyName - Active company name in Tally Prime
 * @returns {String} Tally XML Import Envelope
 */
export function buildTallyLedgerXml(ledger, companyName) {
  const safeCompany = escapeXml(companyName);
  const safeName = escapeXml(ledger.name || "");
  const safeParent = escapeXml(ledger.parent || "Sundry Debtors");
  const isBillWise = ledger.is_bill_wise_on ? "Yes" : "No";

  // Opening balance in Tally convention
  const opBalNum = Number(ledger.opening_balance) || 0;
  const safeOpeningBal = opBalNum !== 0 ? opBalNum.toFixed(2) : "0";

  const mailingDetails = ledger.led_mailing_details || {};
  const gstDetails = ledger.led_gst_reg_details || {};
  const paymentDetails = ledger.payment_details || {};

  const safeGstin = escapeXml(ledger.party_gstin || gstDetails.gstin || "");
  const safeRegType = escapeXml(
    ledger.gst_registration_type ||
      gstDetails.gst_registration_type ||
      (safeGstin ? "Regular" : "Unregistered")
  );
  const safeState = escapeXml(mailingDetails.state || ledger.state || "");
  const safeCountry = escapeXml(mailingDetails.country || "India");
  const safeAddress = escapeXml(mailingDetails.address || "");
  const safePincode = escapeXml(mailingDetails.pincode || "");
  const safeEmail = escapeXml(ledger.email || "");
  const safeMobile = escapeXml(ledger.ledger_mobile || "");

  let mailingXml = "";
  if (safeAddress || safeState || safePincode) {
    mailingXml = `
            <LEDMAILINGDETAILS.LIST>
              <MAILINGNAME>${safeName}</MAILINGNAME>
              <ADDRESS.LIST>
                <ADDRESS>${safeAddress}</ADDRESS>
              </ADDRESS.LIST>
              <STATE>${safeState}</STATE>
              <COUNTRY>${safeCountry}</COUNTRY>
              <PINCODE>${safePincode}</PINCODE>
            </LEDMAILINGDETAILS.LIST>`;
  }

  let gstXml = "";
  if (safeGstin) {
    gstXml = `
            <PARTYGSTIN>${safeGstin}</PARTYGSTIN>
            <GSTREGISTRATIONTYPE>${safeRegType}</GSTREGISTRATIONTYPE>
            <PLACEOFSUPPLY>${safeState}</PLACEOFSUPPLY>`;
  }

  let bankXml = "";
  if (paymentDetails.account_number || paymentDetails.ifs_code || paymentDetails.bank_name) {
    bankXml = `
            <PAYMENTDETAILS.LIST>
              <BANKNAME>${escapeXml(paymentDetails.bank_name || "")}</BANKNAME>
              <ACCOUNTNUMBER>${escapeXml(paymentDetails.account_number || "")}</ACCOUNTNUMBER>
              <IFSCODE>${escapeXml(paymentDetails.ifs_code || "")}</IFSCODE>
            </PAYMENTDETAILS.LIST>`;
  }

  return `<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>All Masters</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${safeCompany}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <LEDGER NAME="${safeName}" ACTION="Create">
            <NAME.LIST>
              <NAME>${safeName}</NAME>
            </NAME.LIST>
            <PARENT>${safeParent}</PARENT>
            <ISBILLWISEON>${isBillWise}</ISBILLWISEON>
            <OPENINGBALANCE>${safeOpeningBal}</OPENINGBALANCE>
            ${gstXml}
            ${mailingXml}
            ${bankXml}
            <LEDGERMOBILE>${safeMobile}</LEDGERMOBILE>
            <EMAIL>${safeEmail}</EMAIL>
          </LEDGER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
}
