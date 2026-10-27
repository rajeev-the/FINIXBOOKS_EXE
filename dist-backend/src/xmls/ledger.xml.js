const escapeXml = (str = "") => {
    if (!str) return "";
    return String(str)
        .replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

const getLedger = (companyName,from_date,to_date) => {
    const safeCompany = escapeXml(companyName);
    return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>CustomMasterReport</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <SVCURRENTCOMPANY>${safeCompany}</SVCURRENTCOMPANY>
                <SVFROMDATE TYPE="Date">${from_date}</SVFROMDATE>
                <SVTODATE TYPE="Date">${to_date}</SVTODATE>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <!-- REPORT -->
                    <REPORT NAME="CustomMasterReport">
                        <FORMS>CustomMasterForm</FORMS>
                    </REPORT>
                    <FORM NAME="CustomMasterForm">
                        <PARTS>CustomMasterPart</PARTS>
                    </FORM>
                    <PART NAME="CustomMasterPart">
                        <TOPLINES>CustomMasterLine</TOPLINES>
                        <REPEAT>CustomMasterLine : CustomMasterCollection</REPEAT>
                        <SCROLLED>Vertical</SCROLLED>
                    </PART>
                    <!-- MAIN LINE -->
                    <LINE NAME="CustomMasterLine">
                        <XMLTAG>MASTER</XMLTAG>
                        <FIELDS>
                    NAME, GUID, PARTYGSTIN, GSTDUTYHEAD, PARENT, ALTERID, MASTERID, PRIORSTATENAME, INCOMETAXNUMBER, GSTREGISTRATIONTYPE,
                    ISDEEMEDPOSITIVE, ISSUBLEDGER, ISREVENUE, GSTAPPLICABLE, GSTAPPROPRIATETO, APPROPRIATEFOR, EXCISEALLOCTYPE, GSTTYPEOFSUPPLY, GSTNATUREOFSUPPLY,
                    AFFECTSGROSSPROFIT, AFFECTSSTOCK, OPENINGBALANCE, CLOSINGBALANCE,
                    ISBILLWISEON, ISCOSTCENTRESON,
                    CURRENCYNAME, EMAIL, WEBSITE, NARRATION, BILLCREDITPERIOD, COUNTRYOFRESIDENCE, DESCRIPTION,
                    LEDGERPHONE, LEDGERCONTACT, LEDGERMOBILE, LEDGERCOUNTRYISDCODE, CREDITLIMIT
                        </FIELDS>
                        <EXPLODE>GstDetailsPart : Yes</EXPLODE>
                        <EXPLODE>PaymentDetailsPart : Yes</EXPLODE>
                        <EXPLODE>LedMultiAddressListPart : Yes</EXPLODE>
                        <EXPLODE>LedGstRegDetailsPart : Yes</EXPLODE>
                        <EXPLODE>LedMailingDetailsPart : Yes</EXPLODE>
                        <EXPLODE>ContactDetailsPart : Yes</EXPLODE>
                        <EXPLODE>HsnDetailsPart : Yes</EXPLODE>
                    </LINE>
                    <!-- MASTER FIELDS -->
                    <FIELD NAME="NAME">
                        <SET>$Name</SET>
                        <XMLTAG>NAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GUID">
                        <SET>$Guid</SET>
                        <XMLTAG>GUID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PARTYGSTIN">
                        <SET>$PartyGstin</SET>
                        <XMLTAG>PARTYGSTIN</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTDUTYHEAD">
                        <SET>$GSTDutyHead</SET>
                        <XMLTAG>GSTDUTYHEAD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PARENT">
                        <SET>$Parent</SET>
                        <XMLTAG>PARENT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ALTERID">
                        <SET>$AlterId</SET>
                        <XMLTAG>ALTERID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MASTERID">
                        <SET>$MasterId</SET>
                        <XMLTAG>MASTERID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PRIORSTATENAME">
                        <SET>$PriorStateName</SET>
                        <XMLTAG>PRIORSTATENAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="INCOMETAXNUMBER">
                        <SET>$IncomeTaxNumber</SET>
                        <XMLTAG>INCOMETAXNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTREGISTRATIONTYPE">
                        <SET>$GSTRegistrationType</SET>
                        <XMLTAG>GSTREGISTRATIONTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTAPPLICABLE">
                        <SET>$GSTApplicable</SET>
                        <XMLTAG>GSTAPPLICABLE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTAPPROPRIATETO">
                        <SET>$GSTAppropriateTo</SET>
                        <XMLTAG>GSTAPPROPRIATETO</XMLTAG>
                    </FIELD>
                    <FIELD NAME="APPROPRIATEFOR">
                        <SET>$AppropriateFor</SET>
                        <XMLTAG>APPROPRIATEFOR</XMLTAG>
                    </FIELD>
                    <FIELD NAME="EXCISEALLOCTYPE">
                        <SET>$ExciseAllocType</SET>
                        <XMLTAG>EXCISEALLOCTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTTYPEOFSUPPLY">
                        <SET>$GSTTypeofSupply</SET>
                        <XMLTAG>GSTTYPEOFSUPPLY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTNATUREOFSUPPLY">
                        <SET>$GSTNatureofSupply</SET>
                        <XMLTAG>GSTNATUREOFSUPPLY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="OPENINGBALANCE">
                        <TYPE>Amount</TYPE>
                        <SET>$OpeningBalance</SET>
                        <XMLTAG>OPENINGBALANCE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="CLOSINGBALANCE">
                        <TYPE>Amount</TYPE>
                        <SET>$ClosingBalance</SET>
                        <XMLTAG>CLOSINGBALANCE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISDEEMEDPOSITIVE">
                        <SET>$IsDeemedPositive</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISSUBLEDGER">
                        <SET>$IsSubLedger</SET>
                        <XMLTAG>ISSUBLEDGER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="AFFECTSGROSSPROFIT">
                        <SET>$AffectsGrossProfit</SET>
                        <XMLTAG>AFFECTSGROSSPROFIT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="AFFECTSSTOCK">
                        <SET>$AffectsStock</SET>
                        <XMLTAG>AFFECTSSTOCK</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISREVENUE">
                        <SET>$IsRevenue</SET>
                        <XMLTAG>ISREVENUE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISBILLWISEON">
                        <SET>$IsBillWiseOn</SET>
                        <XMLTAG>ISBILLWISEON</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISCOSTCENTRESON">
                        <SET>$IsCostCentresOn</SET>
                        <XMLTAG>ISCOSTCENTRESON</XMLTAG>
                    </FIELD>
                    <FIELD NAME="CURRENCYNAME">
                        <SET>$CurrencyName</SET>
                        <XMLTAG>CURRENCYNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="EMAIL">
                        <SET>$Email</SET>
                        <XMLTAG>EMAIL</XMLTAG>
                    </FIELD>
                    <FIELD NAME="WEBSITE">
                        <SET>$Website</SET>
                        <XMLTAG>WEBSITE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="NARRATION">
                        <SET>$Narration</SET>
                        <XMLTAG>NARRATION</XMLTAG>
                    </FIELD>
                    <FIELD NAME="BILLCREDITPERIOD">
                        <SET>$BillCreditPeriod</SET>
                        <XMLTAG>BILLCREDITPERIOD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="COUNTRYOFRESIDENCE">
                        <SET>$CountryOfResidence</SET>
                        <XMLTAG>COUNTRYOFRESIDENCE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="DESCRIPTION">
                        <SET>$Description</SET>
                        <XMLTAG>DESCRIPTION</XMLTAG>
                    </FIELD>
                    <FIELD NAME="LEDGERPHONE">
                        <SET>$LedgerPhone</SET>
                        <XMLTAG>LEDGERPHONE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="LEDGERCONTACT">
                        <SET>$LedgerContact</SET>
                        <XMLTAG>LEDGERCONTACT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="LEDGERMOBILE">
                        <SET>$LedgerMobile</SET>
                        <XMLTAG>LEDGERMOBILE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="LEDGERCOUNTRYISDCODE">
                        <SET>$LedgerCountryISDCode</SET>
                        <XMLTAG>LEDGERCOUNTRYISDCODE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="CREDITLIMIT">
                        <TYPE>Amount</TYPE>
                        <SET>$CreditLimit</SET>
                        <XMLTAG>CREDITLIMIT</XMLTAG>
                    </FIELD>

                    <!-- GST DETAILS PART -->
                    <PART NAME="GstDetailsPart">
                        <TOPLINES>GstDetailsLine</TOPLINES>
                        <REPEAT>GstDetailsLine : GstDetails</REPEAT>
                    </PART>
                    <LINE NAME="GstDetailsLine">
                        <XMLTAG>GSTDETAILS.LIST</XMLTAG>
                        <FIELDS>
                            TAXABILITY
                        </FIELDS>
                        <EXPLODE>StateWiseDetailsPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="TAXABILITY">
                        <SET>$Taxability</SET>
                        <XMLTAG>TAXABILITY</XMLTAG>
                    </FIELD>
                    <PART NAME="StateWiseDetailsPart">
                        <TOPLINES>StateWiseDetailsLine</TOPLINES>
                        <REPEAT>StateWiseDetailsLine : StateWiseDetails</REPEAT>
                    </PART>
                    <LINE NAME="StateWiseDetailsLine">
                        <XMLTAG>STATEWISEDETAILS.LIST</XMLTAG>
                        <FIELDS>
                            STATENAME
                        </FIELDS>
                        <EXPLODE>RateDetailsPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="STATENAME">
                        <SET>$Statename</SET>
                        <XMLTAG>STATENAME</XMLTAG>
                    </FIELD>
                    <PART NAME="RateDetailsPart">
                        <TOPLINES>RateDetailsLine</TOPLINES>
                        <REPEAT>RateDetailsLine : RateDetails</REPEAT>
                    </PART>
                    <LINE NAME="RateDetailsLine">
                        <XMLTAG>RATEDETAILS.LIST</XMLTAG>
                        <FIELDS>
                            GSTRATEDUTYHEAD, GSTRATEVALUATIONTYPE, GSTRATE
                        </FIELDS>
                    </LINE>
                    <FIELD NAME="GSTRATEDUTYHEAD">
                        <SET>$GSTRatedutyHead</SET>
                        <XMLTAG>GSTRATEDUTYHEAD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTRATEVALUATIONTYPE">
                        <SET>$GSTRatevaluationType</SET>
                        <XMLTAG>GSTRATEVALUATIONTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTRATE">
                        <SET>$GSTRate</SET>
                        <XMLTAG>GSTRATE</XMLTAG>
                    </FIELD>

                    <!-- PAYMENT DETAILS PART -->
                    <PART NAME="PaymentDetailsPart">
                        <TOPLINES>PaymentDetailsLine</TOPLINES>
                        <REPEAT>PaymentDetailsLine : PaymentDetails</REPEAT>
                    </PART>
                    <LINE NAME="PaymentDetailsLine">
                        <XMLTAG>PAYMENTDETAILS.LIST</XMLTAG>
                        <FIELDS>
                            PAYMENT_IFSCODE, PAYMENT_BANKNAME, PAYMENT_ACCOUNTNUMBER,
                            PAYMENT_PAYMENTFAVOURING, PAYMENT_TRANSACTIONNAME,
                            PAYMENT_SETASDEFAULT, PAYMENT_DEFAULTTRANSACTIONTYPE
                        </FIELDS>
                        <EXPLODE>BeneficiaryCodeDetailsPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="PAYMENT_IFSCODE">
                        <SET>$IFSCode</SET>
                        <XMLTAG>IFSCODE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYMENT_BANKNAME">
                        <SET>$BankName</SET>
                        <XMLTAG>BANKNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYMENT_ACCOUNTNUMBER">
                        <SET>$AccountNumber</SET>
                        <XMLTAG>ACCOUNTNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYMENT_PAYMENTFAVOURING">
                        <SET>$PaymentFavouring</SET>
                        <XMLTAG>PAYMENTFAVOURING</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYMENT_TRANSACTIONNAME">
                        <SET>$TransactionName</SET>
                        <XMLTAG>TRANSACTIONNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYMENT_SETASDEFAULT">
                        <SET>$SetAsDefault</SET>
                        <XMLTAG>SETASDEFAULT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PAYMENT_DEFAULTTRANSACTIONTYPE">
                        <SET>$DefaultTransactionType</SET>
                        <XMLTAG>DEFAULTTRANSACTIONTYPE</XMLTAG>
                    </FIELD>
                    <!-- BENEFICIARY CODE DETAILS PART -->
                    <PART NAME="BeneficiaryCodeDetailsPart">
                        <TOPLINES>BeneficiaryCodeDetailsLine</TOPLINES>
                        <REPEAT>BeneficiaryCodeDetailsLine : BeneficiaryCodeDetails</REPEAT>
                    </PART>
                    <LINE NAME="BeneficiaryCodeDetailsLine">
                        <XMLTAG>BENEFICIARYCODEDETAILS.LIST</XMLTAG>
                        <FIELDS>BENEFICIARYCODE</FIELDS>
                    </LINE>
                    <FIELD NAME="BENEFICIARYCODE">
                        <SET>$BeneficiaryCode</SET>
                        <XMLTAG>BENEFICIARYCODE</XMLTAG>
                    </FIELD>

                    <!-- LEDGER MULTI ADDRESS PART -->
                    <PART NAME="LedMultiAddressListPart">
                        <TOPLINES>LedMultiAddressListLine</TOPLINES>
                        <REPEAT>LedMultiAddressListLine : LedMultiAddressList</REPEAT>
                    </PART>
                    <LINE NAME="LedMultiAddressListLine">
                        <XMLTAG>LEDMULTIADDRESSLIST.LIST</XMLTAG>
                        <FIELDS>
                            MULTI_PRIORSTATENAME, MULTI_PHONENUMBER, MULTI_COUNTRYISDCODE,
                            MULTI_INCOMETAXNUMBER, MULTI_COUNTRYNAME, MULTI_GSTREGISTRATIONTYPE,
                            MULTI_ADDRESSNAME, MULTI_PARTYGSTIN, MULTI_CONTACTPERSON,
                            MULTI_STATE, MULTI_PLACEOFSUPPLY, MULTI_ISOTHTERRITORYASSESSEE,
                            MULTI_ISEXCISEMERCHANTEXPORTER, MULTI_ISPARTYEXEMPTED, MULTI_ISSEZPARTY
                        </FIELDS>
                        <EXPLODE>MultiAddressPart : Yes</EXPLODE>
                        <EXPLODE>ExciseJurisdictionDetailsPart : Yes</EXPLODE>
                        <EXPLODE>LedGstAddressPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="MULTI_PRIORSTATENAME">
                        <SET>$PriorStateName</SET>
                        <XMLTAG>PRIORSTATENAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_PHONENUMBER">
                        <SET>$PhoneNumber</SET>
                        <XMLTAG>PHONENUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_COUNTRYISDCODE">
                        <SET>$CountryISDCode</SET>
                        <XMLTAG>COUNTRYISDCODE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_INCOMETAXNUMBER">
                        <SET>$IncomeTaxNumber</SET>
                        <XMLTAG>INCOMETAXNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_COUNTRYNAME">
                        <SET>$CountryName</SET>
                        <XMLTAG>COUNTRYNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_GSTREGISTRATIONTYPE">
                        <SET>$GSTRegistrationType</SET>
                        <XMLTAG>GSTREGISTRATIONTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_ADDRESSNAME">
                        <SET>$AddressName</SET>
                        <XMLTAG>ADDRESSNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_PARTYGSTIN">
                        <SET>$PartyGSTIN</SET>
                        <XMLTAG>PARTYGSTIN</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_CONTACTPERSON">
                        <SET>$ContactPerson</SET>
                        <XMLTAG>CONTACTPERSON</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_STATE">
                        <SET>$State</SET>
                        <XMLTAG>STATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_PLACEOFSUPPLY">
                        <SET>$PlaceOfSupply</SET>
                        <XMLTAG>PLACEOFSUPPLY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_ISOTHTERRITORYASSESSEE">
                        <SET>$IsOthTerritoryAssessee</SET>
                        <XMLTAG>ISOTHTERRITORYASSESSEE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_ISEXCISEMERCHANTEXPORTER">
                        <SET>$IsExciseMerchantExporter</SET>
                        <XMLTAG>ISEXCISEMERCHANTEXPORTER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_ISPARTYEXEMPTED">
                        <SET>$IsPartyExempted</SET>
                        <XMLTAG>ISPARTYEXEMPTED</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MULTI_ISSEZPARTY">
                        <SET>$IsSEZParty</SET>
                        <XMLTAG>ISSEZPARTY</XMLTAG>
                    </FIELD>
                    <!-- MULTI ADDRESS LINES PART -->
                    <PART NAME="MultiAddressPart">
                        <TOPLINES>MultiAddressLine</TOPLINES>
                        <REPEAT>MultiAddressLine : Address</REPEAT>
                    </PART>
                    <LINE NAME="MultiAddressLine">
                        <XMLTAG>ADDRESS.LIST</XMLTAG>
                        <FIELDS>MULTI_ADDRESS</FIELDS>
                    </LINE>
                    <FIELD NAME="MULTI_ADDRESS">
                        <SET>$Address</SET>
                        <XMLTAG>ADDRESS</XMLTAG>
                    </FIELD>
                    <!-- EXCISE JURISDICTION DETAILS PART -->
                    <PART NAME="ExciseJurisdictionDetailsPart">
                        <TOPLINES>ExciseJurisdictionDetailsLine</TOPLINES>
                        <REPEAT>ExciseJurisdictionDetailsLine : ExciseJurisdictionDetails</REPEAT>
                    </PART>
                    <LINE NAME="ExciseJurisdictionDetailsLine">
                        <XMLTAG>EXCISEJURISDICTIONDETAILS.LIST</XMLTAG>
                        <FIELDS>EXCISE_RANGE</FIELDS>
                    </LINE>
                    <FIELD NAME="EXCISE_RANGE">
                        <SET>$ExciseRange</SET>
                        <XMLTAG>EXCISERANGE</XMLTAG>
                    </FIELD>
                    <!-- LED GST ADDRESS PART -->
                    <PART NAME="LedGstAddressPart">
                        <TOPLINES>LedGstAddressLine</TOPLINES>
                        <REPEAT>LedGstAddressLine : LedGSTAddress</REPEAT>
                    </PART>
                    <LINE NAME="LedGstAddressLine">
                        <XMLTAG>LEDGSTADDRESS.LIST</XMLTAG>
                        <FIELDS>MULTI_LEDGSTADDRESS</FIELDS>
                    </LINE>
                    <FIELD NAME="MULTI_LEDGSTADDRESS">
                        <SET>$LedGSTAddress</SET>
                        <XMLTAG>LEDGSTADDRESS</XMLTAG>
                    </FIELD>

                    <!-- LEDGER GST REGISTRATION DETAILS PART -->
                    <PART NAME="LedGstRegDetailsPart">
                        <TOPLINES>LedGstRegDetailsLine</TOPLINES>
                        <REPEAT>LedGstRegDetailsLine : LedGSTRegDetails</REPEAT>
                    </PART>
                    <LINE NAME="LedGstRegDetailsLine">
                        <XMLTAG>LEDGSTREGDETAILS.LIST</XMLTAG>
                        <FIELDS>
                            GSTREG_APPLICABLEFROM, GSTREG_GSTREGISTRATIONTYPE,
                            GSTREG_PLACEOFSUPPLY, GSTREG_GSTIN,
                            GSTREG_ISOTHTERRITORYASSESSEE, GSTREG_CONSIDERPURCHASEFOREXPORT,
                            GSTREG_ISTRANSPORTER, GSTREG_ISCOMMONPARTY
                        </FIELDS>
                    </LINE>
                    <FIELD NAME="GSTREG_APPLICABLEFROM">
                        <SET>$ApplicableFrom</SET>
                        <XMLTAG>APPLICABLEFROM</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTREG_GSTREGISTRATIONTYPE">
                        <SET>$GSTRegistrationType</SET>
                        <XMLTAG>GSTREGISTRATIONTYPE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTREG_PLACEOFSUPPLY">
                        <SET>$PlaceOfSupply</SET>
                        <XMLTAG>PLACEOFSUPPLY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTREG_GSTIN">
                        <SET>$GSTIN</SET>
                        <XMLTAG>GSTIN</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTREG_ISOTHTERRITORYASSESSEE">
                        <SET>$IsOthTerritoryAssessee</SET>
                        <XMLTAG>ISOTHTERRITORYASSESSEE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTREG_CONSIDERPURCHASEFOREXPORT">
                        <SET>$ConsiderPurchaseForExport</SET>
                        <XMLTAG>CONSIDERPURCHASEFOREXPORT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTREG_ISTRANSPORTER">
                        <SET>$IsTransporter</SET>
                        <XMLTAG>ISTRANSPORTER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GSTREG_ISCOMMONPARTY">
                        <SET>$IsCommonParty</SET>
                        <XMLTAG>ISCOMMONPARTY</XMLTAG>
                    </FIELD>

                    <!-- LEDGER MAILING DETAILS PART -->
                    <PART NAME="LedMailingDetailsPart">
                        <TOPLINES>LedMailingDetailsLine</TOPLINES>
                        <REPEAT>LedMailingDetailsLine : LedMailingDetails</REPEAT>
                    </PART>
                    <LINE NAME="LedMailingDetailsLine">
                        <XMLTAG>LEDMAILINGDETAILS.LIST</XMLTAG>
                        <FIELDS>
                            MAILING_APPLICABLEFROM, MAILING_PINCODE,
                            MAILING_NAME, MAILING_STATE, MAILING_COUNTRY
                        </FIELDS>
                        <EXPLODE>MailingAddressPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="MAILING_APPLICABLEFROM">
                        <SET>$ApplicableFrom</SET>
                        <XMLTAG>APPLICABLEFROM</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MAILING_PINCODE">
                        <SET>$PINCode</SET>
                        <XMLTAG>PINCODE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MAILING_NAME">
                        <SET>$MailingName</SET>
                        <XMLTAG>MAILINGNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MAILING_STATE">
                        <SET>$State</SET>
                        <XMLTAG>STATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="MAILING_COUNTRY">
                        <SET>$Country</SET>
                        <XMLTAG>COUNTRY</XMLTAG>
                    </FIELD>
                    <!-- MAILING ADDRESS PART -->
                    <PART NAME="MailingAddressPart">
                        <TOPLINES>MailingAddressLine</TOPLINES>
                        <REPEAT>MailingAddressLine : Address</REPEAT>
                    </PART>
                    <LINE NAME="MailingAddressLine">
                        <XMLTAG>ADDRESS.LIST</XMLTAG>
                        <FIELDS>MAILING_ADDRESS</FIELDS>
                    </LINE>
                    <FIELD NAME="MAILING_ADDRESS">
                        <SET>$Address</SET>
                        <XMLTAG>ADDRESS</XMLTAG>
                    </FIELD>

                    <!-- CONTACT DETAILS PART -->
                    <PART NAME="ContactDetailsPart">
                        <TOPLINES>ContactDetailsLine</TOPLINES>
                        <REPEAT>ContactDetailsLine : ContactDetails</REPEAT>
                    </PART>
                    <LINE NAME="ContactDetailsLine">
                        <XMLTAG>CONTACTDETAILS.LIST</XMLTAG>
                        <FIELDS>
                            CONTACT_NAME, CONTACT_PHONENUMBER,
                            CONTACT_COUNTRYISDCODE, CONTACT_ISDEFAULTWHATSAPPNUM
                        </FIELDS>
                    </LINE>
                    <FIELD NAME="CONTACT_NAME">
                        <SET>$Name</SET>
                        <XMLTAG>NAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="CONTACT_PHONENUMBER">
                        <SET>$PhoneNumber</SET>
                        <XMLTAG>PHONENUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="CONTACT_COUNTRYISDCODE">
                        <SET>$CountryISDCode</SET>
                        <XMLTAG>COUNTRYISDCODE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="CONTACT_ISDEFAULTWHATSAPPNUM">
                        <SET>$IsDefaultWhatsappNum</SET>
                        <XMLTAG>ISDEFAULTWHATSAPPNUM</XMLTAG>
                    </FIELD>

                    <!-- HSN DETAILS PART -->
                    <PART NAME="HsnDetailsPart">
                        <TOPLINES>HsnDetailsLine</TOPLINES>
                        <REPEAT>HsnDetailsLine : HSNDetails</REPEAT>
                    </PART>
                    <LINE NAME="HsnDetailsLine">
                        <XMLTAG>HSNDETAILS.LIST</XMLTAG>
                        <FIELDS>
                            HSN_APPLICABLEFROM, HSN_SRCOFHSNDETAILS,
                            HSN_CODE, HSN_DESCRIPTION
                        </FIELDS>
                    </LINE>
                    <FIELD NAME="HSN_APPLICABLEFROM">
                        <SET>$ApplicableFrom</SET>
                        <XMLTAG>APPLICABLEFROM</XMLTAG>
                    </FIELD>
                    <FIELD NAME="HSN_SRCOFHSNDETAILS">
                        <SET>$SrcOfHSNDetails</SET>
                        <XMLTAG>SRCOFHSNDETAILS</XMLTAG>
                    </FIELD>
                    <FIELD NAME="HSN_CODE">
                        <SET>$HSNCode</SET>
                        <XMLTAG>HSNCODE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="HSN_DESCRIPTION">
                        <SET>$HSNDescription</SET>
                        <XMLTAG>HSNDESCRIPTION</XMLTAG>
                    </FIELD>

                    <!-- COLLECTION -->
                    <COLLECTION NAME="CustomMasterCollection">
                        <TYPE>Ledger</TYPE>
                        <FETCH>
                  Name, Guid, PartyGstin, GSTDutyHead, Parent, AlterId, MasterId, PriorStateName, IncomeTaxNumber, GSTRegistrationType,
                  IsDeemedPositive, IsSubLedger, GSTApplicable, GSTAppropriateTo, AppropriateFor, ExciseAllocType, GSTTypeofSupply, GSTNatureofSupply, OpeningBalance, ClosingBalance,
                  AffectsGrossProfit, AffectsStock, IsRevenue, IsBillWiseOn, IsCostCentresOn,
                  CurrencyName, Email, Website, Narration, BillCreditPeriod, CountryOfResidence, Description,
                  LedgerPhone, LedgerContact, LedgerMobile, LedgerCountryISDCode, CreditLimit,
                  GstDetails.*,
                  GstDetails.StateWiseDetails.Statename,
                  GstDetails.StateWiseDetails.RateDetails.*,
                  PaymentDetails.*,
                  PaymentDetails.BeneficiaryCodeDetails.*,
                  LedMultiAddressList.*,
                  LedMultiAddressList.Address.*,
                  LedMultiAddressList.ExciseJurisdictionDetails.*,
                  LedMultiAddressList.LedGSTAddress.*,
                  LedGSTRegDetails.*,
                  LedMailingDetails.*,
                  LedMailingDetails.Address.*,
                  ContactDetails.*,
                  HSNDetails.*
                        </FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`.trim();
};
const getLedger2 = (companyName,from_date,to_date) => {
    const safeCompany = escapeXml(companyName);
    return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>CustomMasterReport</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <SVCURRENTCOMPANY>${safeCompany}</SVCURRENTCOMPANY>
                <SVFROMDATE TYPE="Date">${from_date}</SVFROMDATE>
                <SVTODATE TYPE="Date">${to_date}</SVTODATE>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <!-- REPORT -->
                    <REPORT NAME="CustomMasterReport">
                        <FORMS>CustomMasterForm</FORMS>
                    </REPORT>
                    <FORM NAME="CustomMasterForm">
                        <PARTS>CustomMasterPart</PARTS>
                    </FORM>
                    <PART NAME="CustomMasterPart">
                        <TOPLINES>CustomMasterLine</TOPLINES>
                        <REPEAT>CustomMasterLine : CustomMasterCollection</REPEAT>
                        <SCROLLED>Vertical</SCROLLED>
                    </PART>
                    <!-- MAIN LINE -->
                    <LINE NAME="CustomMasterLine">
                        <XMLTAG>MASTER</XMLTAG>
                        <FIELDS>
                    NAME, GUID, PARENT, ISDEEMEDPOSITIVE, OPENINGBALANCE, CLOSINGBALANCE
                        </FIELDS>
                    </LINE>
                    <!-- MASTER FIELDS -->
                    <FIELD NAME="NAME">
                        <SET>$Name</SET>
                        <XMLTAG>NAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="GUID">
                        <SET>$Guid</SET>
                        <XMLTAG>GUID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="PARENT">
                        <SET>$Parent</SET>
                        <XMLTAG>PARENT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="ISDEEMEDPOSITIVE">
                        <SET>$IsDeemedPositive</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="OPENINGBALANCE">
                        <TYPE>Amount</TYPE>
                        <SET>$OpeningBalance</SET>
                        <XMLTAG>OPENINGBALANCE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="CLOSINGBALANCE">
                        <TYPE>Amount</TYPE>
                        <SET>$ClosingBalance</SET>
                        <XMLTAG>CLOSINGBALANCE</XMLTAG>
                    </FIELD>

                    <!-- COLLECTION -->
                    <COLLECTION NAME="CustomMasterCollection">
                        <TYPE>Ledger</TYPE>
                        <FETCH>
                  Name, Guid, Parent, IsDeemedPositive, OpeningBalance, ClosingBalance
                        </FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`.trim();
};
export {getLedger,getLedger2};