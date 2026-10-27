import express from "express";
import { fetchUnits } from "../controllers/unit.controller.js";

const router = express.Router();

router.post("/", fetchUnits);

export default router;
