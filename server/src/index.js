import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import adminRoute from "./routes/adminAuthRoute.js";
import adminHandleRoute from "./routes/adminHandleRoute.js";
import schoolRoute from "./routes/schoolAuthRoute.js";
import teacherRoute from "./routes/teacherAuthRoute.js";
import schoolHandleRoute from "./routes/schoolHandleRoute.js";
import studentRoute from "./routes/studentRoute.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();
app.use(
  cors({
    origin: "http://localhost:5173", // Your front-end URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Test route directly in index.js
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Test route works!" });
});

// Add this middleware before your routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api", adminRoute);
app.use("/api", schoolRoute);
app.use("/api", teacherRoute);
app.use("/api", schoolHandleRoute);
app.use("/api", adminHandleRoute);
app.use("/api", studentRoute); 


async function checkDatabaseConnection() {
  try {
    console.log(process.env.DATABASE_URL)
    await prisma.$connect();
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

checkDatabaseConnection();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
