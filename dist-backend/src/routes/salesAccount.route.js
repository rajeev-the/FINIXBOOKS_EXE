import express from "express";
import { getSalesAccountData } from "../controllers/salesAccount.controller.js";

const router = express.Router();

router.post("/", getSalesAccountData);

export default router;
