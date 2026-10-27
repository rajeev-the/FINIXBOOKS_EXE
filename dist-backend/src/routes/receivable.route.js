import express from "express";
import { getReceivableData } from "../controllers/receivable.controller.js";

const receivableRouter = express.Router();

receivableRouter.post("/", getReceivableData);

export default receivableRouter;
