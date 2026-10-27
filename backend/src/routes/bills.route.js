import express from "express";
import { fetchBills } from "../controllers/bills.controller.js";
const router = express.Router();
router.post("/", fetchBills);
export default router;
