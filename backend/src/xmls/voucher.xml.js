const escapeXml = (str = "") => {
    if (!str) return "";
    return String(str)
        .replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

const getDaybookXml1 = (companyName, from, to) => {
    const safeCompany = escapeXml(companyName);
    return `<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>FullDayBookXML</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <SVSHOWINACTIVETRANSACTIONS>No</SVSHOWINACTIVETRANSACTIONS>
                <SVISINCLUDEDELETED>No</SVISINCLUDEDELETED>
                <SVCURRENTCOMPANY>${safeCompany}</SVCURRENTCOMPANY>
                <SVFROMDATE TYPE="Date">${from}</SVFROMDATE>
                <SVTODATE TYPE="Date">${to}</SVTODATE>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="FullDayBookXML">
                        <FORMS>FullDayBookForm</FORMS>
                    </REPORT>
                    <FORM NAME="FullDayBookForm">
                        <TOPPARTS>FullDayBookPart</TOPPARTS>
                    </FORM>
                    <PART NAME="FullDayBookPart">
                        <LINES>DayBookLine</LINES>
                        <REPEAT>DayBookLine : DayBookCollection</REPEAT>
                        <SCROLLED>Vertical</SCROLLED>
                    </PART>
                    <LINE NAME="DayBookLine">
                        <XMLTAG>VOUCHER</XMLTAG>
                        <FIELDS>
                            VCHTYPE, DATE, VOUCHERNUMBER, GUID, MASTERID, ALTERID, ISELIGIBLEFORITC,
                            NARRATION, PARTYGSTIN, REFERENCEDATE, REFERENCE, PARTYLEDGERNAME,
                            STATENAME, PLACEOFSUPPLY, DISPATCHFROMSTATENAME,ISCANCELLED,ISOPTIONAL,
                            BASICDUEDATEOFPYMT
                        </FIELDS>
                        <EXPLODE>LedgerPart : Yes</EXPLODE>
                        <EXPLODE>CategoryPart : Yes</EXPLODE>
                        <EXPLODE>InvPart : Yes</EXPLODE>
                        <EXPLODE>InvInPart : Yes</EXPLODE>
                        <EXPLODE>InvOutPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="VCHTYPE">
                        <SET>$VoucherTypeName</SET>
                        <XMLTAG>VCHTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="DATE">
                        <SET>$Date</SET>
                        <XMLTAG>DATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="VOUCHERNUMBER">
                        <SET>$VoucherNumber</SET>
                        <XMLTAG>VOUCHERNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GUID">
                        <SET>$Guid</SET>
                        <XMLTAG>GUID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MASTERID">
                        <SET>$MasterId</SET>
                        <XMLTAG>MASTERID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ALTERID">
                        <SET>$AlterId</SET>
                        <XMLTAG>ALTERID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISELIGIBLEFORITC">
                        <SET>$IsEligibleForITC</SET>
                        <XMLTAG>ISELIGIBLEFORITC</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PARTYGSTIN">
                        <SET>$PartyGSTIN</SET>
                        <XMLTAG>PARTYGSTIN</XMLTAG>
                    </FIELD>
                    <FIELD NAME="REFERENCEDATE">
                        <SET>$ReferenceDate</SET>
                        <XMLTAG>REFERENCEDATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="REFERENCE">
                        <SET>$Reference</SET>
                        <XMLTAG>REFERENCE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PARTYLEDGERNAME">
                        <SET>$PartyLedgerName</SET>
                        <XMLTAG>PARTYLEDGERNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="STATENAME">
                        <SET>$StateName</SET>
                        <XMLTAG>STATENAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PLACEOFSUPPLY">
                        <SET>$PlaceOfSupply</SET>
                        <XMLTAG>PLACEOFSUPPLY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="DISPATCHFROMSTATENAME">
                        <SET>$DispatchFromStateName</SET>
                        <XMLTAG>DISPATCHFROMSTATENAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISCANCELLED">
                        <SET>$IsCancelled</SET>
                        <XMLTAG>ISCANCELLED</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISOPTIONAL">
                        <SET>$IsOptional</SET>
                        <XMLTAG>ISOPTIONAL</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BASICDUEDATEOFPYMT">
                        <SET>$BasicDueDateOfPymt</SET>
                        <XMLTAG>BASICDUEDATEOFPYMT</XMLTAG>
                    </FIELD>

                    <FIELD NAME="NARRATION">
                        <SET>$Narration</SET>
                        <XMLTAG>NARRATION</XMLTAG>
                    </FIELD>
                    <PART NAME="LedgerPart">
                        <LINES>LedgerLine</LINES>
                        <REPEAT>LedgerLine : LedgerEntries</REPEAT>
                    </PART>
                    <LINE NAME="LedgerLine">
                        <XMLTAG>LEDGERENTRIES.LIST</XMLTAG>
                        <FIELDS>LEDGERNAME, LEDGERAMOUNT, ISDEEMEDPOSITIVE,LEDGERGUID</FIELDS>
                        <EXPLODE>RateDetails : Yes</EXPLODE>
                        <EXPLODE>BillAllocPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="LEDGERNAME">
                        <SET>$LedgerName</SET>
                        <XMLTAG>LEDGERNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="LEDGERAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISDEEMEDPOSITIVE">
                        <SET>$IsDeemedPositive</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
                    <!-- LEDGER RATE DETAILS -->
                    <PART NAME="RateDetails">
                        <LINES>RateDetailsLine</LINES>
                        <REPEAT>RateDetailsLine : RateDetails</REPEAT>
                    </PART>
                    <LINE NAME="RateDetailsLine">
                        <XMLTAG>RATEDETAILS.LIST</XMLTAG>
                        <FIELDS>GSTRATEDUTYHEAD, GSTRATEVALUATIONTYPE, GSTRATE</FIELDS>
                    </LINE>
                    <FIELD NAME="GSTRATEDUTYHEAD">
                        <SET>$GSTRateDutyHead</SET>
                        <XMLTAG>GSTRATEDUTYHEAD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTRATEVALUATIONTYPE">
                        <SET>$GSTRateValuationType</SET>
                        <XMLTAG>GSTRATEVALUATIONTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTRATE">
                        <SET>$GSTRate</SET>
                        <XMLTAG>GSTRATE</XMLTAG>
                    </FIELD>
                    <!-- BILL ALLOCATIONS -->
                    <PART NAME="BillAllocPart">
                        <LINES>BillAllocLine</LINES>
                        <REPEAT>BillAllocLine : BillAllocations</REPEAT>
                    </PART>
                    <LINE NAME="BillAllocLine">
                        <XMLTAG>BILLALLOCATIONS.LIST</XMLTAG>
                        <FIELDS>BILLALLOCNAME, BILLALLOCTYPE, BILLALLOCTDSSPECIALRATE, BILLALLOCAMOUNT, BILLDUE, BILLCREDITPERIOD</FIELDS>
                    </LINE>
                    <FIELD NAME="BILLALLOCNAME">
                        <SET>$Name</SET>
                        <XMLTAG>NAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLALLOCTYPE">
                        <SET>$BillType</SET>
                        <XMLTAG>BILLTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLALLOCTDSSPECIALRATE">
                        <SET>$TDSDeducteeIsSpecialRate</SET>
                        <XMLTAG>TDSDEDUCTEEISSPECIALRATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLALLOCAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLDUE">
                        <SET>$BillDue</SET>
                        <XMLTAG>BILLDUE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLCREDITPERIOD">
                        <SET>$BillCreditPeriod</SET>
                        <XMLTAG>BILLCREDITPERIOD</XMLTAG>
                    </FIELD>
                    <PART NAME="CategoryPart">
                        <LINES>CategoryLine</LINES>
                        <REPEAT>CategoryLine : CategoryEntries</REPEAT>
                    </PART>
                    <LINE NAME="CategoryLine">
                        <XMLTAG>CATEGORYENTRIES.LIST</XMLTAG>
                        <FIELDS>CATEGORY</FIELDS>
                        <EXPLODE>EmployeePart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="CATEGORY">
                        <SET>$Category</SET>
                        <XMLTAG>CATEGORY</XMLTAG>
                    </FIELD>
                    <PART NAME="EmployeePart">
                        <LINES>EmployeeLine</LINES>
                        <REPEAT>EmployeeLine : EmployeeEntries</REPEAT>
                    </PART>
                    <LINE NAME="EmployeeLine">
                        <XMLTAG>EMPLOYEEENTRIES.LIST</XMLTAG>
                        <FIELDS>EMPLOYEENAME, EMPLOYEEAMOUNT</FIELDS>
                        <EXPLODE>PayHeadPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="EMPLOYEENAME">
                        <SET>$EmployeeName</SET>
                        <XMLTAG>EMPLOYEENAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="EMPLOYEEAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <PART NAME="PayHeadPart">
                        <LINES>PayHeadLine</LINES>
                        <REPEAT>PayHeadLine : PayHeadAllocations</REPEAT>
                    </PART>
                    <LINE NAME="PayHeadLine">
                        <XMLTAG>PAYHEADALLOCATIONS.LIST</XMLTAG>
                        <FIELDS>PAYHEADNAME, PAYHEADAMOUNT, PAYHEADISDEEMEDPOSITIVE</FIELDS>
                    </LINE>
                    <FIELD NAME="PAYHEADNAME">
                        <SET>$PayHeadName</SET>
                        <XMLTAG>PAYHEADNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYHEADAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYHEADISDEEMEDPOSITIVE">
                        <SET>$IsDeemedPositive</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
                    <PART NAME="InvPart">
                        <LINES>InvLine</LINES>
                        <REPEAT>InvLine : InventoryEntries</REPEAT>
                    </PART>
                    <LINE NAME="InvLine">
                        <XMLTAG>INVENTORYENTRIES.LIST</XMLTAG>
                        <FIELDS>STOCKITEMNAME, QTY, RATE, AMOUNT</FIELDS>
                        <EXPLODE>InvRatePart : Yes</EXPLODE>
                        <EXPLODE>AccountingPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="STOCKITEMNAME">
                        <SET>$StockItemName</SET>
                        <XMLTAG>STOCKITEMNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="QTY">
                        <SET>$BilledQty</SET>
                        <XMLTAG>QTY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="RATE">
                        <SET>$Rate</SET>
                        <XMLTAG>RATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="AMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <PART NAME="InvRatePart">
                        <LINES>InvRateLine</LINES>
                        <REPEAT>InvRateLine : RateDetails</REPEAT>
                    </PART>
                    <LINE NAME="InvRateLine">
                        <XMLTAG>RATEDETAILS.LIST</XMLTAG>
                        <FIELDS>INVGSTRATEDUTYHEAD, INVGSTRATEVALUATIONTYPE, INVGSTRATE, INVGSTRATEPERUNIT</FIELDS>
                    </LINE>
                    <FIELD NAME="INVGSTRATEDUTYHEAD">
                        <SET>$GSTRateDutyHead</SET>
                        <XMLTAG>GSTRATEDUTYHEAD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="INVGSTRATEVALUATIONTYPE">
                        <SET>$GSTRateValuationType</SET>
                        <XMLTAG>GSTRATEVALUATIONTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="INVGSTRATE">
                        <SET>$GSTRate</SET>
                        <XMLTAG>GSTRATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="INVGSTRATEPERUNIT">
                        <SET>$GSTRatePerUnit</SET>
                        <XMLTAG>GSTRATEPERUNIT</XMLTAG>
                    </FIELD>
                    <PART NAME="AccountingPart">
                        <LINES>AccountingLine</LINES>
                        <REPEAT>AccountingLine : AccountingAllocations</REPEAT>
                    </PART>
                    <LINE NAME="AccountingLine">
                        <XMLTAG>ACCOUNTINGALLOCATIONS.LIST</XMLTAG>
                        <FIELDS>ACCOUNTINGLEDGERNAME, ACCOUNTINGAMOUNT, ACCOUNTINGISDEEMEDPOSITIVE</FIELDS>
                        <EXPLODE>AcctBillAllocPart : Yes</EXPLODE>
                    </LINE>
                    <!-- ACCOUNTING BILL ALLOCATIONS -->
                    <PART NAME="AcctBillAllocPart">
                        <LINES>AcctBillAllocLine</LINES>
                        <REPEAT>AcctBillAllocLine : BillAllocations</REPEAT>
                    </PART>
                    <LINE NAME="AcctBillAllocLine">
                        <XMLTAG>BILLALLOCATIONS.LIST</XMLTAG>
                        <FIELDS>ACCTBILLALLOCNAME, ACCTBILLALLOCTYPE, ACCTBILLALLOCTDSSPECIALRATE, ACCTBILLALLOCAMOUNT, ACCTBILLDUE, ACCTBILLCREDITPERIOD</FIELDS>
                    </LINE>
                    <FIELD NAME="ACCTBILLALLOCNAME">
                        <SET>$Name</SET>
                        <XMLTAG>NAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLALLOCTYPE">
                        <SET>$BillType</SET>
                        <XMLTAG>BILLTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLALLOCTDSSPECIALRATE">
                        <SET>$TDSDeducteeIsSpecialRate</SET>
                        <XMLTAG>TDSDEDUCTEEISSPECIALRATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLALLOCAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLDUE">
                        <SET>$BillDue</SET>
                        <XMLTAG>BILLDUE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLCREDITPERIOD">
                        <SET>$BillCreditPeriod</SET>
                        <XMLTAG>BILLCREDITPERIOD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCOUNTINGLEDGERNAME">
                        <SET>$LedgerName</SET>
                        <XMLTAG>LEDGERNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCOUNTINGAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCOUNTINGISDEEMEDPOSITIVE">
                        <SET>$IsDeemedPositive</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
                    <PART NAME="InvInPart">
                        <LINES>InvInLine</LINES>
                        <REPEAT>InvInLine : InventoryEntriesIn</REPEAT>
                    </PART>
                    <LINE NAME="InvInLine">
                        <XMLTAG>INVENTORYENTRIESIN.LIST</XMLTAG>
                        <FIELDS>STOCKITEMNAME, QTY, RATE, AMOUNT</FIELDS>
                        <EXPLODE>InvRatePart : Yes</EXPLODE>
                        <EXPLODE>AccountingPart : Yes</EXPLODE>
                    </LINE>
                    <PART NAME="InvOutPart">
                        <LINES>InvOutLine</LINES>
                        <REPEAT>InvOutLine : InventoryEntriesOut</REPEAT>
                    </PART>
                    <LINE NAME="InvOutLine">
                        <XMLTAG>INVENTORYENTRIESOUT.LIST</XMLTAG>
                        <FIELDS>STOCKITEMNAME, QTY, RATE, AMOUNT</FIELDS>
                        <EXPLODE>InvRatePart : Yes</EXPLODE>
                        <EXPLODE>AccountingPart : Yes</EXPLODE>
                    </LINE>
                    <COLLECTION NAME="DayBookCollection">
                        <TYPE>Voucher</TYPE>
                        <FETCH>
                            VoucherTypeName, Date, VoucherNumber, MasterId, AlterId, Guid, Narration,
                            IsEligibleForITC, PartyGSTIN, Reference, ReferenceDate, PartyLedgerName,
                            StateName, PlaceOfSupply, DispatchFromStateName,IsCancelled,IsOptional,
                            BasicDueDateOfPymt,

                            LedgerEntries.LedgerName, LedgerEntries.Amount, LedgerEntries.IsDeemedPositive,
                            LedgerEntries.RateDetails.GSTRateDutyHead, LedgerEntries.RateDetails.GSTRateValuationType,
                            LedgerEntries.RateDetails.GSTRate,
                            LedgerEntries.BillAllocations.Name, LedgerEntries.BillAllocations.BillType,
                            LedgerEntries.BillAllocations.TDSDeducteeIsSpecialRate, LedgerEntries.BillAllocations.Amount,
                            LedgerEntries.BillAllocations.BillDue, LedgerEntries.BillAllocations.BillCreditPeriod,

                            CategoryEntries.Category,
                            CategoryEntries.EmployeeEntries.EmployeeName, CategoryEntries.EmployeeEntries.Amount,
                            CategoryEntries.EmployeeEntries.PayHeadAllocations.PayHeadName,
                            CategoryEntries.EmployeeEntries.PayHeadAllocations.Amount,
                            CategoryEntries.EmployeeEntries.PayHeadAllocations.IsDeemedPositive,

                            InventoryEntries.StockItemName, InventoryEntries.BilledQty, InventoryEntries.Rate,
                            InventoryEntries.Amount,
                            InventoryEntries.RateDetails.GSTRateDutyHead, InventoryEntries.RateDetails.GSTRateValuationType,
                            InventoryEntries.RateDetails.GSTRate, InventoryEntries.RateDetails.GSTRatePerUnit,
                            InventoryEntries.AccountingAllocations.LedgerName, InventoryEntries.AccountingAllocations.Amount,
                            InventoryEntries.AccountingAllocations.IsDeemedPositive,
                            InventoryEntries.AccountingAllocations.BillAllocations.Name, InventoryEntries.AccountingAllocations.BillAllocations.BillType,
                            InventoryEntries.AccountingAllocations.BillAllocations.TDSDeducteeIsSpecialRate, InventoryEntries.AccountingAllocations.BillAllocations.Amount,

                            InventoryEntriesIn.StockItemName, InventoryEntriesIn.BilledQty, InventoryEntriesIn.Rate,
                            InventoryEntriesIn.Amount,
                            InventoryEntriesIn.RateDetails.GSTRateDutyHead, InventoryEntriesIn.RateDetails.GSTRateValuationType,
                            InventoryEntriesIn.RateDetails.GSTRate, InventoryEntriesIn.RateDetails.GSTRatePerUnit,
                            InventoryEntriesIn.AccountingAllocations.LedgerName, InventoryEntriesIn.AccountingAllocations.Amount,
                            InventoryEntriesIn.AccountingAllocations.IsDeemedPositive,
                            InventoryEntriesIn.AccountingAllocations.BillAllocations.Name, InventoryEntriesIn.AccountingAllocations.BillAllocations.BillType,
                            InventoryEntriesIn.AccountingAllocations.BillAllocations.TDSDeducteeIsSpecialRate, InventoryEntriesIn.AccountingAllocations.BillAllocations.Amount,

                            InventoryEntriesOut.StockItemName, InventoryEntriesOut.BilledQty, InventoryEntriesOut.Rate,
                            InventoryEntriesOut.Amount,
                            InventoryEntriesOut.RateDetails.GSTRateDutyHead, InventoryEntriesOut.RateDetails.GSTRateValuationType,
                            InventoryEntriesOut.RateDetails.GSTRate, InventoryEntriesOut.RateDetails.GSTRatePerUnit,
                            InventoryEntriesOut.AccountingAllocations.LedgerName, InventoryEntriesOut.AccountingAllocations.Amount,
                            InventoryEntriesOut.AccountingAllocations.IsDeemedPositive,
                            InventoryEntriesOut.AccountingAllocations.BillAllocations.Name, InventoryEntriesOut.AccountingAllocations.BillAllocations.BillType,
                            InventoryEntriesOut.AccountingAllocations.BillAllocations.TDSDeducteeIsSpecialRate, InventoryEntriesOut.AccountingAllocations.BillAllocations.Amount
                        </FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
};
const getDaybookXml = (companyName, from, to) => {
    const safeCompany = escapeXml(companyName);
    return `<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>FullDayBookXML</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <SVSHOWINACTIVETRANSACTIONS>No</SVSHOWINACTIVETRANSACTIONS>
                <SVISINCLUDEDELETED>No</SVISINCLUDEDELETED>
                <SVCURRENTCOMPANY>${safeCompany}</SVCURRENTCOMPANY>
                <SVFROMDATE TYPE="Date">${from}</SVFROMDATE>
                <SVTODATE TYPE="Date">${to}</SVTODATE>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="FullDayBookXML">
                        <FORMS>FullDayBookForm</FORMS>
                    </REPORT>
                    <COLLECTION NAME="DayBookCollection">
                        <TYPE>Voucher</TYPE>
                        <FETCH>
                            VoucherTypeName, Date, VoucherNumber, MasterId, AlterId, Guid, Narration,
                            IsEligibleForITC, PartyGSTIN, Reference, ReferenceDate, PartyLedgerName,
                            StateName, PlaceOfSupply, DispatchFromStateName,IsCancelled, IsOptional,
                            BasicDueDateOfPymt,

                            LedgerEntries.LedgerName, LedgerEntries.Amount, LedgerEntries.IsDeemedPositive,
                            LedgerEntries.RateDetails.GSTRateDutyHead, LedgerEntries.RateDetails.GSTRateValuationType,
                            LedgerEntries.RateDetails.GSTRate,
                            LedgerEntries.BillAllocations.Name, LedgerEntries.BillAllocations.BillType,
                            LedgerEntries.BillAllocations.TDSDeducteeIsSpecialRate, LedgerEntries.BillAllocations.Amount,
                            LedgerEntries.BillAllocations.BillDue, LedgerEntries.BillAllocations.BillCreditPeriod,

                            CategoryEntries.Category,
                            CategoryEntries.EmployeeEntries.EmployeeName, CategoryEntries.EmployeeEntries.Amount,
                            CategoryEntries.EmployeeEntries.PayHeadAllocations.PayHeadName,
                            CategoryEntries.EmployeeEntries.PayHeadAllocations.Amount,
                            CategoryEntries.EmployeeEntries.PayHeadAllocations.IsDeemedPositive,

                            InventoryEntries.StockItemName, InventoryEntries.BilledQty, InventoryEntries.Rate,
                            InventoryEntries.Amount,
                            InventoryEntries.RateDetails.GSTRateDutyHead, InventoryEntries.RateDetails.GSTRateValuationType,
                            InventoryEntries.RateDetails.GSTRate, InventoryEntries.RateDetails.GSTRatePerUnit,
                            InventoryEntries.AccountingAllocations.LedgerName, InventoryEntries.AccountingAllocations.Amount,
                            InventoryEntries.AccountingAllocations.IsDeemedPositive,
                            InventoryEntries.AccountingAllocations.BillAllocations.Name, InventoryEntries.AccountingAllocations.BillAllocations.BillType,
                            InventoryEntries.AccountingAllocations.BillAllocations.TDSDeducteeIsSpecialRate, InventoryEntries.AccountingAllocations.BillAllocations.Amount,
                            InventoryEntries.AccountingAllocations.BillAllocations.BillDue, InventoryEntries.AccountingAllocations.BillCreditPeriod
                        </FETCH>
                    </COLLECTION>
                    <FORM NAME="FullDayBookForm">
                        <TOPPARTS>FullDayBookPart</TOPPARTS>
                    </FORM>
                    <PART NAME="FullDayBookPart">
                        <LINES>DayBookLine</LINES>
                        <REPEAT>DayBookLine : DayBookCollection</REPEAT>
                        <SCROLLED>Vertical</SCROLLED>
                    </PART>
                    <LINE NAME="DayBookLine">
                        <XMLTAG>VOUCHER</XMLTAG>
                        <FIELDS>
                            VCHTYPE, DATE, VOUCHERNUMBER, GUID, MASTERID, ALTERID, ISELIGIBLEFORITC,
                            NARRATION, PARTYGSTIN, REFERENCEDATE, REFERENCE, PARTYLEDGERNAME,
                            STATENAME, PLACEOFSUPPLY, DISPATCHFROMSTATENAME,ISCANCELLED,ISOPTIONAL,
                            BASICDUEDATEOFPYMT
                        </FIELDS>
                        <EXPLODE>LedgerPart : Yes</EXPLODE>
                        <EXPLODE>CategoryPart : Yes</EXPLODE>
                        <EXPLODE>InvPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="VCHTYPE">
                        <SET>$VoucherTypeName</SET>
                        <XMLTAG>VCHTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="DATE">
                        <SET>$Date</SET>
                        <XMLTAG>DATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="VOUCHERNUMBER">
                        <SET>$VoucherNumber</SET>
                        <XMLTAG>VOUCHERNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GUID">
                        <SET>$Guid</SET>
                        <XMLTAG>GUID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MASTERID">
                        <SET>$MasterId</SET>
                        <XMLTAG>MASTERID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ALTERID">
                        <SET>$AlterId</SET>
                        <XMLTAG>ALTERID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISELIGIBLEFORITC">
                        <SET>$IsEligibleForITC</SET>
                        <XMLTAG>ISELIGIBLEFORITC</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PARTYGSTIN">
                        <SET>$PartyGSTIN</SET>
                        <XMLTAG>PARTYGSTIN</XMLTAG>
                    </FIELD>
                    <FIELD NAME="REFERENCEDATE">
                        <SET>$ReferenceDate</SET>
                        <XMLTAG>REFERENCEDATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="REFERENCE">
                        <SET>$Reference</SET>
                        <XMLTAG>REFERENCE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PARTYLEDGERNAME">
                        <SET>$PartyLedgerName</SET>
                        <XMLTAG>PARTYLEDGERNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="STATENAME">
                        <SET>$StateName</SET>
                        <XMLTAG>STATENAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PLACEOFSUPPLY">
                        <SET>$PlaceOfSupply</SET>
                        <XMLTAG>PLACEOFSUPPLY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="DISPATCHFROMSTATENAME">
                        <SET>$DispatchFromStateName</SET>
                        <XMLTAG>DISPATCHFROMSTATENAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISCANCELLED">
                        <SET>$IsCancelled</SET>
                        <XMLTAG>ISCANCELLED</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISOPTIONAL">
                        <TYPE>Logical</TYPE>
                        <SET>$IsOptional</SET>
                        <XMLTAG>ISOPTIONAL</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BASICDUEDATEOFPYMT">
                        <SET>$BasicDueDateOfPymt</SET>
                        <XMLTAG>BASICDUEDATEOFPYMT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="NARRATION">
                        <SET>$Narration</SET>
                        <XMLTAG>NARRATION</XMLTAG>
                    </FIELD>
                    <PART NAME="LedgerPart">
                        <LINES>LedgerLine</LINES>
                        <REPEAT>LedgerLine : LedgerEntries</REPEAT>
                    </PART>
                    <LINE NAME="LedgerLine">
                        <XMLTAG>LEDGERENTRIES.LIST</XMLTAG>
                        <FIELDS>LEDGERNAME, LEDGERAMOUNT, ISDEEMEDPOSITIVE</FIELDS>
                        <EXPLODE>RateDetails : Yes</EXPLODE>
                        <EXPLODE>BillAllocPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="LEDGERNAME">
                        <SET>$LedgerName</SET>
                        <XMLTAG>LEDGERNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="LEDGERGUID">
                        <SET>$$FetchObjectProperty:Ledger:$LedgerName:GUID</SET>
                        <XMLTAG>LEDGER_GUID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="LEDGERAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISDEEMEDPOSITIVE">
                        <SET>$IsDeemedPositive</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
                    <!-- LEDGER RATE DETAILS -->
                    <PART NAME="RateDetails">
                        <LINES>RateDetailsLine</LINES>
                        <REPEAT>RateDetailsLine : RateDetails</REPEAT>
                    </PART>
                    <LINE NAME="RateDetailsLine">
                        <XMLTAG>RATEDETAILS.LIST</XMLTAG>
                        <FIELDS>GSTRATEDUTYHEAD, GSTRATEVALUATIONTYPE, GSTRATE</FIELDS>
                    </LINE>
                    <FIELD NAME="GSTRATEDUTYHEAD">
                        <SET>$GSTRateDutyHead</SET>
                        <XMLTAG>GSTRATEDUTYHEAD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTRATEVALUATIONTYPE">
                        <SET>$GSTRateValuationType</SET>
                        <XMLTAG>GSTRATEVALUATIONTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTRATE">
                        <SET>$GSTRate</SET>
                        <XMLTAG>GSTRATE</XMLTAG>
                    </FIELD>
                    <!-- BILL ALLOCATIONS -->
                    <PART NAME="BillAllocPart">
                        <LINES>BillAllocLine</LINES>
                        <REPEAT>BillAllocLine : BillAllocations</REPEAT>
                    </PART>
                    <LINE NAME="BillAllocLine">
                        <XMLTAG>BILLALLOCATIONS.LIST</XMLTAG>
                        <FIELDS>BILLALLOCNAME, BILLALLOCTYPE, BILLALLOCTDSSPECIALRATE, BILLALLOCAMOUNT, BILLDUE, BILLCREDITPERIOD</FIELDS>
                    </LINE>
                    <FIELD NAME="BILLALLOCNAME">
                        <SET>$Name</SET>
                        <XMLTAG>NAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLALLOCTYPE">
                        <SET>$BillType</SET>
                        <XMLTAG>BILLTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLALLOCTDSSPECIALRATE">
                        <SET>$TDSDeducteeIsSpecialRate</SET>
                        <XMLTAG>TDSDEDUCTEEISSPECIALRATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLALLOCAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLDUE">
                        <SET>$BillDue</SET>
                        <XMLTAG>BILLDUE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLCREDITPERIOD">
                        <SET>$BillCreditPeriod</SET>
                        <XMLTAG>BILLCREDITPERIOD</XMLTAG>
                    </FIELD>
                    <PART NAME="CategoryPart">
                        <LINES>CategoryLine</LINES>
                        <REPEAT>CategoryLine : CategoryEntries</REPEAT>
                    </PART>
                    <LINE NAME="CategoryLine">
                        <XMLTAG>CATEGORYENTRIES.LIST</XMLTAG>
                        <FIELDS>CATEGORY</FIELDS>
                        <EXPLODE>EmployeePart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="CATEGORY">
                        <SET>$Category</SET>
                        <XMLTAG>CATEGORY</XMLTAG>
                    </FIELD>
                    <PART NAME="EmployeePart">
                        <LINES>EmployeeLine</LINES>
                        <REPEAT>EmployeeLine : EmployeeEntries</REPEAT>
                    </PART>
                    <LINE NAME="EmployeeLine">
                        <XMLTAG>EMPLOYEEENTRIES.LIST</XMLTAG>
                        <FIELDS>EMPLOYEENAME, EMPLOYEEAMOUNT</FIELDS>
                        <EXPLODE>PayHeadPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="EMPLOYEENAME">
                        <SET>$EmployeeName</SET>
                        <XMLTAG>EMPLOYEENAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="EMPLOYEEAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <PART NAME="PayHeadPart">
                        <LINES>PayHeadLine</LINES>
                        <REPEAT>PayHeadLine : PayHeadAllocations</REPEAT>
                    </PART>
                    <LINE NAME="PayHeadLine">
                        <XMLTAG>PAYHEADALLOCATIONS.LIST</XMLTAG>
                        <FIELDS>PAYHEADNAME, PAYHEADAMOUNT, PAYHEADISDEEMEDPOSITIVE</FIELDS>
                    </LINE>
                    <FIELD NAME="PAYHEADNAME">
                        <SET>$PayHeadName</SET>
                        <XMLTAG>PAYHEADNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYHEADAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYHEADISDEEMEDPOSITIVE">
                        <SET>$IsDeemedPositive</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
                    <PART NAME="InvPart">
                        <LINES>InvLine</LINES>
                        <REPEAT>InvLine : InventoryEntries</REPEAT>
                    </PART>
                    <LINE NAME="InvLine">
                        <XMLTAG>INVENTORYENTRIES.LIST</XMLTAG>
                        <FIELDS>STOCKITEMNAME, QTY, RATE, AMOUNT</FIELDS>
                        <EXPLODE>InvRatePart : Yes</EXPLODE>
                        <EXPLODE>AccountingPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="STOCKITEMNAME">
                        <SET>$StockItemName</SET>
                        <XMLTAG>STOCKITEMNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="QTY">
                        <SET>$BilledQty</SET>
                        <XMLTAG>QTY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="RATE">
                        <SET>$Rate</SET>
                        <XMLTAG>RATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="AMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <PART NAME="InvRatePart">
                        <LINES>InvRateLine</LINES>
                        <REPEAT>InvRateLine : RateDetails</REPEAT>
                    </PART>
                    <LINE NAME="InvRateLine">
                        <XMLTAG>RATEDETAILS.LIST</XMLTAG>
                        <FIELDS>INVGSTRATEDUTYHEAD, INVGSTRATEVALUATIONTYPE, INVGSTRATE, INVGSTRATEPERUNIT</FIELDS>
                    </LINE>
                    <FIELD NAME="INVGSTRATEDUTYHEAD">
                        <SET>$GSTRateDutyHead</SET>
                        <XMLTAG>GSTRATEDUTYHEAD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="INVGSTRATEVALUATIONTYPE">
                        <SET>$GSTRateValuationType</SET>
                        <XMLTAG>GSTRATEVALUATIONTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="INVGSTRATE">
                        <SET>$GSTRate</SET>
                        <XMLTAG>GSTRATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="INVGSTRATEPERUNIT">
                        <SET>$GSTRatePerUnit</SET>
                        <XMLTAG>GSTRATEPERUNIT</XMLTAG>
                    </FIELD>
                    <PART NAME="AccountingPart">
                        <LINES>AccountingLine</LINES>
                        <REPEAT>AccountingLine : AccountingAllocations</REPEAT>
                    </PART>
                    <LINE NAME="AccountingLine">
                        <XMLTAG>ACCOUNTINGALLOCATIONS.LIST</XMLTAG>
                        <FIELDS>ACCOUNTINGLEDGERNAME, ACCOUNTINGAMOUNT, ACCOUNTINGISDEEMEDPOSITIVE</FIELDS>
                        <EXPLODE>AcctBillAllocPart : Yes</EXPLODE>
                    </LINE>
                    <!-- ACCOUNTING BILL ALLOCATIONS -->
                    <PART NAME="AcctBillAllocPart">
                        <LINES>AcctBillAllocLine</LINES>
                        <REPEAT>AcctBillAllocLine : BillAllocations</REPEAT>
                    </PART>
                    <LINE NAME="AcctBillAllocLine">
                        <XMLTAG>BILLALLOCATIONS.LIST</XMLTAG>
                        <FIELDS>ACCTBILLALLOCNAME, ACCTBILLALLOCTYPE, ACCTBILLALLOCTDSSPECIALRATE, ACCTBILLALLOCAMOUNT, ACCTBILLDUE, ACCTBILLCREDITPERIOD</FIELDS>
                    </LINE>
                    <FIELD NAME="ACCTBILLALLOCNAME">
                        <SET>$Name</SET>
                        <XMLTAG>NAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLALLOCTYPE">
                        <SET>$BillType</SET>
                        <XMLTAG>BILLTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLALLOCTDSSPECIALRATE">
                        <SET>$TDSDeducteeIsSpecialRate</SET>
                        <XMLTAG>TDSDEDUCTEEISSPECIALRATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLALLOCAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLDUE">
                        <SET>$BillDue</SET>
                        <XMLTAG>BILLDUE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCTBILLCREDITPERIOD">
                        <SET>$BillCreditPeriod</SET>
                        <XMLTAG>BILLCREDITPERIOD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCOUNTINGLEDGERNAME">
                        <SET>$LedgerName</SET>
                        <XMLTAG>LEDGERNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCOUNTINGAMOUNT">
                        <TYPE>AMOUNT</TYPE>
                        <SET>$Amount</SET>
                        <XMLTAG>AMOUNT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ACCOUNTINGISDEEMEDPOSITIVE">
                        <SET>$IsDeemedPositive</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
</TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
};
export { getDaybookXml };
export default getDaybookXml;
