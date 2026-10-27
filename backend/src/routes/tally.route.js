import express from "express";
import { getTallyStatus, launchTallyPrime } from "../controllers/tally.controller.js";

const router = express.Router();

router.get("/status", getTallyStatus);
router.post("/status", getTallyStatus);
router.post("/launch", launchTallyPrime);

export default router;
