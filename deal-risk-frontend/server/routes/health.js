import express from "express";
import { sendSuccess } from "../utils/responseHelper";

const router = express.Router();

router.get("/health", (req, res) => {
  sendSuccess(res, { status: "ok", timestamp: new Date().toISOString() });
});

export default router;  