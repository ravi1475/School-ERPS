import express from "express";
import { addSchool } from "../controllers/adminFun/addSchoolController.js";

const router = express.Router();

router.post("/addSchool", addSchool);

export default router;
