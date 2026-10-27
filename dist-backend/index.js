import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import envConfig from "./src/config/envConfig.js";
import { startServer } from "./src/server.js";
// import routes
import companyRoutes from "./src/routes/company.route.js";
import groupRoutes from "./src/routes/group.route.js";
import ledgerRoutes from "./src/routes/ledger.route.js";
import voucherRoutes from "./src/routes/voucher.routes.js";
import stockRoutes from "./src/routes/stock.route.js";
import billRoutes from "./src/routes/bills.route.js";
import godownRoutes from "./src/routes/godown.route.js";
import unitRoutes from "./src/routes/unit.route.js";
import costcentreRoutes from "./src/routes/costcentre.route.js";
import syncRoutes from "./src/routes/sync.route.js";
import salesRegisterRoutes from "./src/routes/salesRegister.route.js";
import purchaseRegisterRoutes from "./src/routes/purchaseRegister.route.js";
import salesAccountRoutes from "./src/routes/salesAccount.route.js";
import purchaseAccountRoutes from "./src/routes/purchaseAccount.route.js";
import trialBalanceRoutes from "./src/routes/trialBalance.route.js";
import payableRoutes from "./src/routes/payable.route.js";
import receivableRoutes from "./src/routes/receivable.route.js";
import tallyRoutes from "./src/routes/tally.route.js";

// ---- Initialize Express app ----
const app = express();
const PORT = envConfig.PORT || 3001;

// ---- Middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);
// ---- Routes ----

app.use("/api/tally", tallyRoutes);
app.use("/api/voucher", voucherRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/ledgers", ledgerRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/godowns", godownRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/costcentres", costcentreRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/sales-register", salesRegisterRoutes);
app.use("/api/purchase-register", purchaseRegisterRoutes);
app.use("/api/sales-account", salesAccountRoutes);
app.use("/api/purchase-account", purchaseAccountRoutes);
app.use("/api/trial-balance", trialBalanceRoutes);
app.use("/api/payable", payableRoutes);
app.use("/api/receivable", receivableRoutes);
// ---- Health check (useful for uptime monitors / load balancers) ----
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---- Centralized error handler ----
// Must be defined AFTER all routes, and must have 4 args for Express to recognize it
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ---- Server startup ----
startServer(app, PORT);

