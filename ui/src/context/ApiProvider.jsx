import React from "react";
import apiClient from "../services/apiClient";
import { ApiContext } from "./ApiContext";

export const ApiProvider = ({ children }) => {
  return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>;
};
