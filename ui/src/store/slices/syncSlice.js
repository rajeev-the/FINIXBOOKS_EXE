import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingMap: {},
  statusMap: {},
};

export const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    setModuleLoading: (state, action) => {
      const { moduleKey, isLoading } = action.payload;
      state.loadingMap[moduleKey] = isLoading;
    },
    setModuleStatus: (state, action) => {
      const { moduleKey, status } = action.payload;
      state.statusMap[moduleKey] = status;
    },
    resetSyncState: (state) => {
      state.loadingMap = {};
      state.statusMap = {};
    },
  },
});

export const { setModuleLoading, setModuleStatus, resetSyncState } =
  syncSlice.actions;

export default syncSlice.reducer;
