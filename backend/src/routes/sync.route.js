import express from "express";
import { syncAllData } from "../controllers/syncAllData.controller.js";
import { syncRealtimeAll } from "../controllers/syncRealtime.controller.js";
import {
  triggerOutboundSync,
  startOutboundWorkerController,
  stopOutboundWorkerController,
} from "../controllers/syncOutbound.controller.js";

const router = express.Router();

// Existing synchronous batch sync route (untouched)
router.post("/all", syncAllData);

// Real-time sync route with Socket.IO live progress streaming
router.post("/realtime/all", syncRealtimeAll);

// Outbound ERP -> Tally sync routes
router.post("/outbound/trigger", triggerOutboundSync);
router.post("/outbound/start", startOutboundWorkerController);
router.post("/outbound/stop", stopOutboundWorkerController);

export default router;
