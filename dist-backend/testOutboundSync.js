import { buildTallyVoucherXml } from "./src/workers/tallyVoucherXmlBuilder.js";
import { parseTallyResponse } from "./src/workers/outboundSyncWorker.js";

console.log("=== Testing Outbound Sync Worker & XML Builder ===\n");

// 1. Test XML Builder with sample Receipt Voucher
const sampleReceiptVoucher = {
  _id: "6adc5af7871327ef2a7bac48",
  voucherType: "RECEIPT",
  voucherNumber: "RCT/26-27/0001",
  date: "2026-10-24",
  party: {
    ledgerId: "6aa0ec05b706b609315c30b7",
    name: "Customer Acme Corp",
  },
  entries: [
    {
      ledgerId: "6aa0ec04b706b609315c2e7d",
      name: "HDFC Bank A/c",
      debit: 442500, // ₹4,425.00
      credit: 0,
    },
    {
      ledgerId: "6aa0ec05b706b609315c30b7",
      name: "Customer Acme Corp",
      debit: 0,
      credit: 442500, // ₹4,425.00
    },
  ],
  allocations: [
    {
      voucherId: "6adc58b1fb287a9856f6c91a",
      voucherNumber: "INV/26-27/0001",
      amount: 442500,
    },
  ],
  narration: "NEFT Payment received against INV/26-27/0001",
};

const xml = buildTallyVoucherXml(sampleReceiptVoucher, "MITTAL SOFTWARE LABS LIMITED - (from 1-Apr-24)");
console.log("Generated Tally XML Preview:\n", xml.slice(0, 500), "...\n");

// Assertions on XML
if (!xml.includes("<VOUCHER VCHTYPE=\"Receipt\"")) throw new Error("Missing VCHTYPE Receipt");
if (!xml.includes("<DATE>20261024</DATE>")) throw new Error("Invalid Tally date format");
if (!xml.includes("<LEDGERNAME>HDFC Bank A/c</LEDGERNAME>")) throw new Error("Missing bank ledger");
if (!xml.includes("<AMOUNT>-4425.00</AMOUNT>")) throw new Error("Debit amount should be negative in Tally XML");
if (!xml.includes("<AMOUNT>4425.00</AMOUNT>")) throw new Error("Credit amount should be positive in Tally XML");
if (!xml.includes("<BILLTYPE>Agst Ref</BILLTYPE>")) throw new Error("Missing Agst Ref allocation");
if (!xml.includes("<NAME>INV/26-27/0001</NAME>")) throw new Error("Missing bill reference invoice number");
console.log(" XML Generation Passed!\n");

// 2. Test Tally HTTP 200 Trap (Error Case)
const errorXmlResponse = `
<RESPONSE>
  <CREATED>0</CREATED>
  <ALTERED>0</ALTERED>
  <DELETED>0</DELETED>
  <LASTVCHID>0</LASTVCHID>
  <ERRORS>1</ERRORS>
  <LINEERROR>Ledger 'Customer Acme Corp' does not exist in Company database!</LINEERROR>
</RESPONSE>
`;
const parsedError = parseTallyResponse(errorXmlResponse);
console.log("Parsed Error Result:", parsedError);
if (parsedError.success !== false) throw new Error("Failed to detect Tally HTTP 200 error");
if (!parsedError.error.includes("Customer Acme Corp")) throw new Error("Failed to extract line error");
console.log(" Tally Prime HTTP 200 Error Trap Caught Successfully!\n");

// 3. Test Tally Success Response
const successXmlResponse = `
<RESPONSE>
  <CREATED>1</CREATED>
  <ALTERED>0</ALTERED>
  <DELETED>0</DELETED>
  <LASTVCHID>84920</LASTVCHID>
  <ALTERID>992341</ALTERID>
  <ERRORS>0</ERRORS>
</RESPONSE>
`;
const parsedSuccess = parseTallyResponse(successXmlResponse);
console.log("Parsed Success Result:", parsedSuccess);
if (parsedSuccess.success !== true) throw new Error("Failed to detect Tally success");
if (parsedSuccess.tallyAlterId !== "992341") throw new Error("Failed to extract ALTERID");
console.log(" Tally Success Parsing Verified!\n");

console.log(" ALL PHASE 6 WORKER VERIFICATIONS PASSED!");
