import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTenantId: "",
  companies: [],
  isLoading: false,
  error: null,
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSelectedTenantId: (state, action) => {
      state.selectedTenantId = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setCompanyLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCompanyError: (state, action) => {
      state.error = action.payload;
    },
    updateCompanySyncStatus: (state, action) => {
      const { companyId, companyName, syncStatus } = action.payload;
      state.companies = state.companies.map((c) => {
        const matches =
          (c._id && c._id === companyId) ||
          (c.displayName && c.displayName === companyName) ||
          (c.name && c.name === companyName);
        if (matches) {
          return { ...c, _id: companyId, syncStatus: syncStatus || "sync" };
        }
        return c;
      });
    },
  },
});

export const {
  setSelectedTenantId,
  setCompanies,
  setCompanyLoading,
  setCompanyError,
  updateCompanySyncStatus,
} = companySlice.actions;

export default companySlice.reducer;
