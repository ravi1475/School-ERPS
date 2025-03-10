import express from "express";
import {
  signup,
  login,
  logout,
} from "../controllers/auth/schoolAuthController.js";

const router = express.Router();

router.post("/schoolSignup", signup);
router.post("/schoolLogin", login);
router.post("/logout", logout);

export default router;
