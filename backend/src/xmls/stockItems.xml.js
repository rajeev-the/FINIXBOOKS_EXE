import { escapeXml } from "../helpers/xml.helpers.js";

const stockItemXml = (companyName) => {
    return `<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Collection</TYPE>
        <ID>StockItemCollection</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <SVCURRENTCOMPANY>${escapeXml(companyName)}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <COLLECTION NAME="StockItemCollection" ISMODIFY="No">
                        <TYPE>StockItem</TYPE>
                        <FETCH>Name, Guid, Parent, Category, BaseUnits, OpeningBalance, OpeningValue, OpeningRate, GSTApplicable, GSTTypeofSupply</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`.trim();
};

export { stockItemXml };
export default stockItemXml;
