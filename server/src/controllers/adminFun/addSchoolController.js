import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const addSchool = async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      contact,
      email,
      principal,
      established,
      password,
    } = req.body;

    const existingSchool = await prisma.school.findUnique({
      where: { code },
    });

    if (existingSchool) {
      return res
        .status(409)
        .json({ success: false, message: "School already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSchool = await prisma.school.create({
      data: {
        fullName: name,
        code,
        address,
        contact: Number(contact),
        email,
        principal,
        established: Number(established),
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "School added successfully!",
      school: newSchool,
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all schools
export const getAllSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany();
    res.status(200).json({ success: true, schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get school by ID
export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await prisma.school.findUnique({
      where: { id: Number(id) },
    });

    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    res.status(200).json({ success: true, school });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update school
export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      address,
      contact,
      email,
      principal,
      established,
      password,
    } = req.body;

    const existingSchool = await prisma.school.findUnique({
      where: { id: Number(id) },
    });
    if (!existingSchool) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    let hashedPassword = existingSchool.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedSchool = await prisma.school.update({
      where: { id: Number(id) },
      data: {
        fullName: name,
        code,
        address,
        contact: Number(contact),
        email,
        principal,
        established: Number(established),
        password: hashedPassword,
      },
    });

    res
      .status(200)
      .json({
        success: true,
        message: "School updated successfully!",
        school: updatedSchool,
      });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete school
export const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSchool = await prisma.school.findUnique({
      where: { id: Number(id) },
    });
    if (!existingSchool) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    await prisma.school.delete({ where: { id: Number(id) } });

    res
      .status(200)
      .json({ success: true, message: "School deleted successfully!" });
  } catch (error) {
    console.error("Error deleting school:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
