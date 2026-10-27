import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import companyReducer from "./slices/companySlice";
import syncReducer from "./slices/syncSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    sync: syncReducer,
  },
});

export default store;
