import express from "express";
import { getPayableData } from "../controllers/payable.controller.js";

const payableRouter = express.Router();

payableRouter.post("/", getPayableData);

export default payableRouter;
