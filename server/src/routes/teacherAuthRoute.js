import express from "express";
import {
  signup,
  login,
  logout,
} from "../controllers/auth/teacherAuthController.js";

const router = express.Router();

router.post("/teacherSignup", signup);
router.post("/teacherLogin", login);
router.post("/logout", logout);

export default router;
