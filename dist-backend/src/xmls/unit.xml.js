import { escapeXml } from "../helpers/xml.helpers.js";

const getUnitXml = (companyName) => {
  return `<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Collection</TYPE>
        <ID>TBUnits</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <SVCURRENTCOMPANY>${escapeXml(companyName)}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <COLLECTION NAME="TBUnits" ISMODIFY="No">
                        <TYPE>Unit</TYPE>
                        <NATIVEMETHOD>Name</NATIVEMETHOD>
                        <NATIVEMETHOD>OriginalName</NATIVEMETHOD>
                        <NATIVEMETHOD>GUID</NATIVEMETHOD>
                        <NATIVEMETHOD>AlterId</NATIVEMETHOD>
                        <NATIVEMETHOD>MasterId</NATIVEMETHOD>
                        <NATIVEMETHOD>IsSimpleUnit</NATIVEMETHOD>
                        <NATIVEMETHOD>Conversion</NATIVEMETHOD>
                        <NATIVEMETHOD>DecimalPlaces</NATIVEMETHOD>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
};

export default getUnitXml;
