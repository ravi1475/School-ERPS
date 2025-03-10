import express from "express";
import {
  signup,
  login,
  logout,
} from "../controllers/auth/adminAuthController.js";

const router = express.Router();

router.post("/adminSignup", signup);
router.post("/adminLogin", login);
router.post("/logut", logout);

export default router;
