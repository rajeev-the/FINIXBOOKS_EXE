import express from "express";
import { fetchLedger } from "../controllers/ledger.controller.js";
const router = express.Router();
router.post("/", fetchLedger);
export default router;