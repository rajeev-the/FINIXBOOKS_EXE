import express from "express";
import { getSalesRegisterData } from "../controllers/salesRegister.controller.js";
const router = express.Router();
router.post("/", getSalesRegisterData);
export default router;
