import express from "express";
import {
  fetchStockItem,
  fetchStockGroup,
  fetchStockCategory,
} from "../controllers/stock.controller.js";

const router = express.Router();

router.post("/", fetchStockItem);
router.post("/groups", fetchStockGroup);
router.post("/categories", fetchStockCategory);

export default router;
