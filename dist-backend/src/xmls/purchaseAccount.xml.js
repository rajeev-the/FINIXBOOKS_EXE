import { escapeXml } from "../helpers/xml.helpers.js";

const getPurchaseAccount = (companyName, from_date, to_date) => {
  return `<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>Trial Balance</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>XML</SVEXPORTFORMAT>
                <SVCURRENTCOMPANY>${escapeXml(companyName)}</SVCURRENTCOMPANY>
                <SVFROMDATE>${from_date}</SVFROMDATE>
                <SVTODATE>${to_date}</SVTODATE>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="TrialBalance" ISMODIFY="Yes">
                        <ADD>SET: Groupname :"Purchase Accounts"</ADD>
                    </REPORT>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`.trim();
};
export default getPurchaseAccount;
