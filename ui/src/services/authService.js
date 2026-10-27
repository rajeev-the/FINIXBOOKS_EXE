import apiClient from "./apiClient";

export const authService = {
  requestOtp: (email) => apiClient.post("/api/v1/auth/request-otp", { email }),

  verifyOtp: (email, otp) =>
    apiClient.post("/api/v1/auth/verify-otp", { email, otp }),

  getProfile: () => apiClient.get("/api/v1/auth/me"),

  signup: (payload) => apiClient.post("/api/v1/user/signup", payload),
};

export default authService;
