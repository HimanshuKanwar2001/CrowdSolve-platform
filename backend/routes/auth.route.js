import express from "express";
import dotenv from "dotenv";
import {
  signup,
  login,
  getUserProfile,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

dotenv.config();

router.get("/", authMiddleware, getUserProfile);
router.post("/signup", signup);
router.post("/login", login);

export default router;
