import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: localStorage.getItem("tb_auth") === "true",
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      localStorage.setItem("tb_auth", "true");
      if (action.payload) {
        state.user = action.payload;
      }
    },
    updateUser: (state, action) => {
      if (action.payload) {
        state.user = action.payload;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("tb_auth");
      localStorage.removeItem("tb_access_token");
      localStorage.removeItem("tb_refresh_token");
    },
  },
});

export const { loginSuccess, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
