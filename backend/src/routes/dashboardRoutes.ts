import { Router } from "express";

import {
    getAnalytics,
    getNotifications,
} from "../controllers/dashboardController";

const router = Router();

router.get(
  "/analytics",
  getAnalytics
);

router.get(
  "/notifications",
  getNotifications
);

export default router;