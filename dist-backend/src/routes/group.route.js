import express from "express";
const router = express.Router();
import { fetchTallyGroups } from "../controllers/group.controller.js";

router.post("/", fetchTallyGroups);

export default router;
