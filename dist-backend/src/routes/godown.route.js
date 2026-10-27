import express from "express";
import { fetchGodowns } from "../controllers/godown.controller.js";

const router = express.Router();

router.post("/", fetchGodowns);

export default router;
