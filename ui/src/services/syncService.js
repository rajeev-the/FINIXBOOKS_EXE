import apiClient from "./apiClient";

export const syncService = {
  syncModule: (endpoint, queryParams = "") => {
    const url = `/api/v1/sync/${endpoint}${queryParams ? `?${queryParams}` : ""}`;
    return apiClient.get(url);
  },
};

export default syncService;
