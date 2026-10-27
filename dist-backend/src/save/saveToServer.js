import axios from "axios";
import envConfig from "../config/envConfig.js";
import { emitSyncEvent, emitSyncLog } from "../socket/socket.js";

const CHUNK_SIZE = 1500; // Optimal batch size for MongoDB bulkWrite to prevent MaxTimeMSExpired

const mapTypeToEntityKey = (type) => {
    switch (type) {
        case "ledger":
            return "ledgers";
        case "voucher":
            return "vouchers";
        case "voucher_type":
            return "voucherTypes";
        case "stock":
            return "stockItems";
        case "stockgroup":
            return "stockGroups";
        case "stockcategory":
            return "stockCategories";
        case "godown":
            return "godowns";
        case "unit":
            return "units";
        case "costcentre":
            return "costCentres";
        case "group":
            return "groups";
        case "company":
            return "companies";
        case "bills":
            return "bills";
        case "receivable":
            return "receivable";
        case "payable":
            return "payable";
        case "salesRegister":
            return "salesRegister";
        case "purchaseRegister":
            return "purchaseRegister";
        case "salesAccount":
            return "salesAccount";
        case "purchaseAccount":
            return "purchaseAccount";
        case "trialBalance":
        case "trialBalanceBeginningToEnd":
            return "trialBalance";
        default:
            return type;
    }
};

const formatTypeLabel = (type) => {
    if (!type) return "records";
    switch (type) {
        case "ledger":
            return "ledgers";
        case "voucher":
            return "vouchers";
        case "voucher_type":
            return "voucher types";
        case "stock":
            return "stock items";
        case "stockgroup":
            return "stock groups";
        case "costcentre":
            return "cost centres";
        case "salesAccount":
            return "sales accounts";
        case "purchaseAccount":
            return "purchase accounts";
        case "trialBalance":
            return "trial balance";
        default:
            return type;
    }
};

const saveToDb = async ({ data, company_id, type, from, to, timeline }) => {
    try {
        if (!data || !type) {
            throw new Error("Data and type are required");
        }
        const baseUrl = envConfig.TALLY_BRIDGE_BACKEND_URL;
        if (!baseUrl) {
            throw new Error("TALLY_BRIDGE_BACKEND_URL is not defined");
        }

        const dataArray = Array.isArray(data) ? data : [data];
        const totalRecords = dataArray.length;
        const entityKey = mapTypeToEntityKey(type);
        const typeLabel = formatTypeLabel(type);

        // If dataset is small, send directly
        if (totalRecords <= CHUNK_SIZE) {
            console.log(`[saveToDb] Saving ${totalRecords} ${type} records to server database...`);
            emitSyncLog(`Saving ${totalRecords.toLocaleString()} ${typeLabel} to database...`, {
                companyId: company_id,
                step: entityKey,
                status: "in_progress",
                count: totalRecords,
                phase: "saving",
            });

            const response = await axios.post(
                `${baseUrl}/api/v1/tally/sync/save-to-db`,
                { data: data, company_id, from, to, timeline },
                {
                    headers: { type },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 180000,
                }
            );
            console.log(`[saveToDb] Successfully saved ${totalRecords} ${type} records to server.`);
            return response.data;
        }

        // For large datasets (e.g. 30,000+ ledgers), save in batches to prevent MongoDB MaxTimeMSExpired error
        const totalBatches = Math.ceil(totalRecords / CHUNK_SIZE);
        console.log(
            `[saveToDb] Large payload detected (${totalRecords} ${type} records). Saving in ${totalBatches} batches of ${CHUNK_SIZE} to avoid MongoDB timeout...`
        );

        let lastResponse = null;
        for (let i = 0; i < totalRecords; i += CHUNK_SIZE) {
            const batch = dataArray.slice(i, i + CHUNK_SIZE);
            const batchNum = Math.floor(i / CHUNK_SIZE) + 1;
            const savedSoFar = Math.min(i + batch.length, totalRecords);
            const logMsg = `Saving ${type} batch ${batchNum}/${totalBatches} (${batch.length} items)...`;
            console.log(`[saveToDb] ${logMsg}`);

            // Emit real-time progress update to Socket.IO clients / UI
            emitSyncEvent(
                "sync:save-batch",
                {
                    type,
                    step: entityKey,
                    batch: batchNum,
                    totalBatches,
                    batchSize: batch.length,
                    totalRecords,
                    savedCount: savedSoFar,
                    percent: Math.round((batchNum / totalBatches) * 100),
                },
                company_id
            );

            emitSyncLog(logMsg, {
                companyId: company_id,
                step: entityKey,
                status: "in_progress",
                batch: batchNum,
                totalBatches,
                count: totalRecords,
                savedCount: savedSoFar,
                phase: "saving",
            });

            const response = await axios.post(
                `${baseUrl}/api/v1/tally/sync/save-to-db`,
                { data: batch, company_id, from, to, timeline },
                {
                    headers: { type },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 180000,
                }
            );
            lastResponse = response?.data;
        }

        console.log(`[saveToDb] Successfully saved all ${totalRecords} ${type} records across ${totalBatches} batches.`);

        emitSyncEvent(
            "sync:save-complete",
            {
                type,
                step: entityKey,
                totalRecords,
                totalBatches,
            },
            company_id
        );

        emitSyncLog(`Successfully saved all ${totalRecords.toLocaleString()} ${typeLabel} across ${totalBatches} batches.`, {
            companyId: company_id,
            step: entityKey,
            status: "success",
            count: totalRecords,
            phase: "saved",
        });

        return lastResponse;
    } catch (error) {
        console.error("Error saving to database:", error.message);
        const entityKey = mapTypeToEntityKey(type);
        emitSyncEvent(
            "sync:save-error",
            {
                type,
                step: entityKey,
                error: error.message,
            },
            company_id
        );
        emitSyncLog(`Error saving ${type} to database: ${error.message}`, {
            companyId: company_id,
            step: entityKey,
            status: "error",
            error: error.message,
        });
        throw error;
    }
};

export { saveToDb };
export default saveToDb;