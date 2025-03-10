import express from "express";
import { addAdmin, getAllUsers } from "../controllers/adminFun/adminHandleController.js";
import {authMiddleware} from './../middlewares/authMiddleware.js'

const router = express.Router();

router.post("/admin/users/add",authMiddleware, addAdmin);
router.get("/admin/users",authMiddleware, getAllUsers);

export default router;
