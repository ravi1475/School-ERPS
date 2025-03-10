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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", adminRoute);
app.use("/api", schoolRoute);
app.use("/api", teacherRoute);
app.use("/api", schoolHandleRoute);
app.use("/api", adminHandleRoute);

// Check Prisma Database Connection
async function checkDatabaseConnection() {
  try {
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
