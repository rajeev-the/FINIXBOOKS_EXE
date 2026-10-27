import axios from "axios";
import apiClient, { EXE_BACKEND_URL } from "./apiClient";

export const companyService = {
  getTenantCompanies: (tenantId) =>
    apiClient.get(`/api/v1/company/tenant/${tenantId}`),

  getTallyExeCompanies: (tenantId, port = 9000) =>
    axios.post(`${EXE_BACKEND_URL}/api/companies/show`, {
      port,
      company_id: tenantId,
    }),

  createCompany: (companyData) =>
    apiClient.post("/api/v1/company", companyData),

  startRealtimeSync: (payload) =>
    axios.post(`${EXE_BACKEND_URL}/api/sync/realtime/all`, {
      port: 9000,
      ...payload,
    }),
};

export default companyService;
