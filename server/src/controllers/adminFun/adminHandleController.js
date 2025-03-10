import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const addAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, role, username } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(200).json({ success: true, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert role to uppercase
    const upperCaseRole = role.toUpperCase();

    // Set username to email if not provided
    const finalUsername = username || email; // Use email if username is not provided

    // Create new user
    const newUser = await prisma.admin.create({
      data: {
        fullName: name,
        email,
        password: hashedPassword,
        phone,
        role: upperCaseRole,
        username: finalUsername, // Use the final username
      },
    });

    res.status(201).json({ message: "User added successfully!", user: newUser });
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async(req,res)=>{
  const {page , limit} = req.query;
  console.log(req.user);
    // Check if user already exists
    // const existingUser = await prisma.admin.findUnique({
    //   where: { email },
    // });
  res.status(200).json({success:true,data:req.query});
}