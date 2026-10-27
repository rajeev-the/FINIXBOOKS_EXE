import express from "express";
import { getPurchaseRegisterData } from "../controllers/purchaseRegister.controller.js";
const router = express.Router();
router.post("/", getPurchaseRegisterData);
export default router;
