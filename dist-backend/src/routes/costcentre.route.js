import express from "express";
import { fetchCostCentres } from "../controllers/costcentre.controller.js";

const router = express.Router();

router.post("/", fetchCostCentres);

export default router;
