import express from "express";
import { claimCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/claim", claimCoupon);

export default router;
