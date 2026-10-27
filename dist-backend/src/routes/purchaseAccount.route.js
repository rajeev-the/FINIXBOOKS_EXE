import express from "express";
import { getPurchaseAccountData } from "../controllers/purchaseAccount.controller.js";

const router = express.Router();

router.post("/", getPurchaseAccountData);

export default router;
