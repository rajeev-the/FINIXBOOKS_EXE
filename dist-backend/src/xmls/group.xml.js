const escapeXml = (str = "") => {
    if (!str) return "";
    return String(str)
        .replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

const groupMasterXml = (companyName) => {
    const safeCompany = escapeXml(companyName);
    return `<ENVELOPE>
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
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
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
                    <LINE NAME="CustomMasterLine">
                        <XMLTAG>MASTER</XMLTAG>
                        <FIELDS>
                            NAME, GUID, PARENT, ALTERID, 
                            ISDEEMEDPOSITIVE, ISSUBLEDGER, 
                            AFFECTSGROSSPROFIT, AFFECTSSTOCK, 
                            ISBILLWISEON, ISCOSTCENTRESON
                        </FIELDS>
                        <EXPLODE>LanguageListPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="NAME"> <SET>$Name</SET> <XMLTAG>NAME</XMLTAG> </FIELD>
                    <FIELD NAME="GUID"> <SET>$Guid</SET> <XMLTAG>GUID</XMLTAG> </FIELD>
                    <FIELD NAME="PARENT"> <SET>$Parent</SET> <XMLTAG>PARENT</XMLTAG> </FIELD>
                    <FIELD NAME="ALTERID"> <SET>$AlterId</SET> <XMLTAG>ALTERID</XMLTAG> </FIELD>
                    <FIELD NAME="ISDEEMEDPOSITIVE"> <SET>$IsDeemedPositive</SET> <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG> </FIELD>
                    <FIELD NAME="ISSUBLEDGER"> <SET>$IsSubLedger</SET> <XMLTAG>ISSUBLEDGER</XMLTAG> </FIELD>
                    <FIELD NAME="AFFECTSGROSSPROFIT"> <SET>$AffectsGrossProfit</SET> <XMLTAG>AFFECTSGROSSPROFIT</XMLTAG> </FIELD>
                    <FIELD NAME="AFFECTSSTOCK"> <SET>$AffectsStock</SET> <XMLTAG>AFFECTSSTOCK</XMLTAG> </FIELD>
                    <FIELD NAME="ISBILLWISEON"> <SET>$IsBillWiseOn</SET> <XMLTAG>ISBILLWISEON</XMLTAG> </FIELD>
                    <FIELD NAME="ISCOSTCENTRESON"> <SET>$IsCostCentresOn</SET> <XMLTAG>ISCOSTCENTRESON</XMLTAG> </FIELD>
                    <PART NAME="LanguageListPart">
                        <TOPLINES>LanguageListLine</TOPLINES>
                        <REPEAT>LanguageListLine : LanguageName</REPEAT>
                    </PART>
                    <LINE NAME="LanguageListLine">
                        <XMLTAG>LANGUAGENAME.LIST</XMLTAG>
                        <!-- FIX: Added a Field here to prevent TDL Error -->
                        <FIELDS>LANGUAGE_ID</FIELDS> 
                        <EXPLODE>NameListPart : Yes</EXPLODE>
                    </LINE>
                    <FIELD NAME="LANGUAGE_ID"> <SET>$LanguageID</SET> <XMLTAG>LANGUAGEID</XMLTAG> </FIELD>
                    <PART NAME="NameListPart">
                        <TOPLINES>NameListLine</TOPLINES>
                        <REPEAT>NameListLine : Name</REPEAT>
                    </PART>
                    <LINE NAME="NameListLine">
                        <XMLTAG>NAME.LIST</XMLTAG>
                        <FIELDS>ALIAS_NAME</FIELDS>
                    </LINE>
                    <FIELD NAME="ALIAS_NAME"> <SET>$Name</SET> <XMLTAG>NAME</XMLTAG> </FIELD>
                    <COLLECTION NAME="CustomMasterCollection">
                        <TYPE>Group</TYPE> 
                        <FETCH>Name, Guid, Parent, AlterId, IsDeemedPositive, IsSubLedger, AffectsGrossProfit, AffectsStock, IsBillWiseOn, IsCostCentresOn, LanguageName.*</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
};

export { groupMasterXml };
export default groupMasterXml;