import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// Create a new student
export const createStudent = async (req, res) => {
  try {
    console.log("Received student data:", req.body);
    
    // Check required fields
    const { firstName, lastName, gender, mobileNumber, admissionNo, className, schoolId } = req.body;
    
    if (!firstName || !lastName || !gender || !mobileNumber || !admissionNo || !className || !schoolId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Check if student with same admission number exists
    const existingStudent = await prisma.student.findUnique({
      where: { admissionNo: req.body.admissionNo }
    });

    if (existingStudent) {
      return res.status(409).json({ 
        success: false, 
        message: "Student with this admission number already exists!" 
      });
    }

    // Create student with only the fields that exist in your schema
    const studentData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName || null,
      dateOfBirth: new Date(req.body.dateOfBirth),
      gender: req.body.gender,
      bloodGroup: req.body.bloodGroup || null,
      nationality: req.body.nationality || null,
      religion: req.body.religion || null,
      category: req.body.category || null,
      aadhaarNumber: req.body.aadhaarNumber || null,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email || null,
      emergencyContact: req.body.emergencyContact || null,
      admissionNo: req.body.admissionNo,
      rollNumber: req.body.rollNumber || null,
      className: req.body.className,
      section: req.body.section || null,
      admissionDate: new Date(req.body.admissionDate || new Date()),
      previousSchool: req.body.previousSchool || null,
      
      // Address fields
      houseNo: req.body.houseNo || null,
      street: req.body.street || null,
      city: req.body.city || '',
      state: req.body.state || '',
      pinCode: req.body.pinCode || null,
      
      // Parent information
      fatherName: req.body.fatherName || '',
      fatherOccupation: req.body.fatherOccupation || null,
      fatherContact: req.body.fatherContact || null,
      fatherEmail: req.body.fatherEmail || null,
      
      motherName: req.body.motherName || '',
      motherOccupation: req.body.motherOccupation || null,
      motherContact: req.body.motherContact || null,
      motherEmail: req.body.motherEmail || null,
      
      // School relation
      schoolId: parseInt(req.body.schoolId, 10),
    };
    
    console.log("Creating student with data:", studentData);
    
    const newStudent = await prisma.student.create({
      data: studentData
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully!",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};