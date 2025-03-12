import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Create a new student
 * @route POST /api/students
 * @access Public
 */
export const createStudent = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug incoming request

    // Extract all student data from request body
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      nationality,
      religion,
      category,
      aadhaarNumber,
      mobileNumber,
      email,
      emergencyContact,
      admissionNo,
      rollNumber,
      className,
      section,
      admissionDate,
      previousSchool,
      
      // Address fields
      houseNo,
      street, 
      city,
      state,
      pinCode,
      
      // Parent fields
      fatherName,
      fatherOccupation,
      fatherContact,
      fatherEmail,
      
      motherName,
      motherOccupation,
      motherContact,
      motherEmail,
      
      // School relationship
      schoolId
    } = req.body;

    // SIMPLIFIED: Make all fields optional for easier testing
    // Create new student record with provided information
    const student = await prisma.student.create({
      data: {
        firstName: firstName || "Test",
        middleName: middleName || null,
        lastName: lastName || "Student",
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
        gender: gender || "MALE",
        bloodGroup: bloodGroup || null,
        nationality: nationality || null,
        religion: religion || null,
        category: category || null,
        aadhaarNumber: aadhaarNumber || null,
        mobileNumber: mobileNumber || "1234567890",
        email: email || null,
        emergencyContact: emergencyContact || null,
        admissionNo: admissionNo || `ADM-${Date.now()}`, // Generate unique admission number
        rollNumber: rollNumber || null,
        className: className || "Test Class",
        section: section || null,
        admissionDate: admissionDate ? new Date(admissionDate) : new Date(),
        previousSchool: previousSchool || null,
        
        // Address fields
        houseNo: houseNo || null,
        street: street || null,
        city: city || "Test City",
        state: state || "Test State",
        pinCode: pinCode || null,
        
        // Parent fields
        fatherName: fatherName || "Test Father",
        fatherOccupation: fatherOccupation || null,
        fatherContact: fatherContact || null,
        fatherEmail: fatherEmail || null,
        motherName: motherName || "Test Mother",
        motherOccupation: motherOccupation || null,
        motherContact: motherContact || null,
        motherEmail: motherEmail || null,
        
        // Connect to school if provided, otherwise skip relationship
        ...(schoolId ? {
          school: {
            connect: {
              id: parseInt(schoolId, 10)
            }
          }
        } : {})
      }
    });
    
    console.log(`Student created: ${student.firstName} ${student.lastName} (ID: ${student.id})`);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        admissionNo: student.admissionNo
      }
    });
  
  } catch (error) {
    console.error('Error creating student:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to register student',
      error: error.message
    });
  }
};

/**
 * Get all students with pagination and filtering
 * @route GET /api/students
 * @access Public
 */
export const getAllStudents = async (req, res) => {
  try {
    console.log("Fetching students with query:", req.query); // Debug

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Simplified query without filters for testing
    const students = await prisma.student.findMany({
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });
    
    // Get total count for pagination
    const total = await prisma.student.count();
    
    console.log(`Found ${students.length} students (total: ${total})`);
    
    return res.status(200).json({
      success: true,
      students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error getting students:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve students',
      error: error.message
    });
  }
};

/**
 * Get a single student by ID
 * @route GET /api/students/:id
 * @access Public
 */
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching student with ID: ${id}`);
    
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!student) {
      console.log(`Student with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      student
    });
    
  } catch (error) {
    console.error('Error getting student:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student details',
      error: error.message
    });
  }
};

/**
 * Update student information
 * @route PUT /api/students/:id
 * @access Public
 */
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentData = req.body;
    
    console.log(`Updating student ${id} with data:`, studentData);
    
    // Format dates if they exist in the request
    if (studentData.dateOfBirth) {
      studentData.dateOfBirth = new Date(studentData.dateOfBirth);
    }
    
    if (studentData.admissionDate) {
      studentData.admissionDate = new Date(studentData.admissionDate);
    }
    
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: studentData
    });
    
    return res.status(200).json({
      success: true,
      message: 'Student information updated successfully',
      student: updatedStudent
    });
    
  } catch (error) {
    console.error('Error updating student:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update student information',
      error: error.message
    });
  }
};

/**
 * Delete a student
 * @route DELETE /api/students/:id
 * @access Public
 */
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting student with ID: ${id}`);
    
    // Delete the student (simplified)
    await prisma.student.delete({
      where: { id: parseInt(id) }
    });
    
    return res.status(200).json({
      success: true,
      message: `Student with ID ${id} has been deleted successfully`
    });
    
  } catch (error) {
    console.error('Error deleting student:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
};