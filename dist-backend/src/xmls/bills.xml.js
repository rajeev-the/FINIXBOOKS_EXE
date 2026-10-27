import { escapeXml } from "../helpers/xml.helpers.js";

const getBillsXml = (companyName) => {
    return `<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Collection</TYPE>
        <ID>TBOutstandingBills</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <SVCURRENTCOMPANY>${escapeXml(companyName)}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <COLLECTION NAME="TBOutstandingBills" ISMODIFY="No">
                        <TYPE>Bills</TYPE>
                        <NATIVEMETHOD>BillDate</NATIVEMETHOD>
                        <NATIVEMETHOD>Name</NATIVEMETHOD>
                        <NATIVEMETHOD>Parent</NATIVEMETHOD>
                        <NATIVEMETHOD>BillCreditPeriod</NATIVEMETHOD>
                        <NATIVEMETHOD>OpeningBalance</NATIVEMETHOD>
                        <NATIVEMETHOD>ClosingBalance</NATIVEMETHOD>
                        <NATIVEMETHOD>IsAdvance</NATIVEMETHOD>
                        <NATIVEMETHOD>BillId</NATIVEMETHOD>
                        <NATIVEMETHOD>ClearedOn</NATIVEMETHOD>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`.trim();
}

export { getBillsXml };
export default getBillsXml;