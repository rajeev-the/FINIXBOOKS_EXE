import express from "express";
import {
  getTrialBalanceData,
  getTrialBalanceFromBeginningToEnd,
} from "../controllers/trialBalance.controller.js";

const router = express.Router();
router.post("/", getTrialBalanceData);
router.post("/from-beginning-to-end", getTrialBalanceFromBeginningToEnd);

export default router;
