import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, schoolId } = req.body;

    const existingUser = await prisma.teacher.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.teacher.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        schoolId,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(req.body);
    console.log("Hi");

    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
