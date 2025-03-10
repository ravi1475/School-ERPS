import express from "express";
import { createStudent } from "../controllers/studentFun/studentController.js";

const router = express.Router();

// Simple GET test route
router.get("/students-test", (req, res) => {
  res.status(200).json({ message: "Student route works!" });
});

// Simple POST test route that doesn't touch the database
router.post("/students-test", (req, res) => {
  console.log("Received test data:", req.body);
  res.status(200).json({ 
    message: "Student test POST route works!", 
    receivedData: req.body 
  });
});

// Add logging middleware to debug route matching
router.use('/students', (req, res, next) => {
  console.log('Student route hit:', req.method, req.path);
  next();
});

// Student routes
router.post("/students", createStudent);

export default router;