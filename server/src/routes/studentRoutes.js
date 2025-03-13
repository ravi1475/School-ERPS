import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const prisma = new PrismaClient();

// Get directory name (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'students');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use admission number + field name + timestamp + original extension
    const admissionNo = req.body.admissionNo || 'unknown';
    const fieldName = file.fieldname.replace(/documents\./, '');
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    
    cb(null, `${admissionNo}-${fieldName}-${timestamp}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (/^image\/(jpeg|png|jpg|gif)$/.test(file.mimetype) || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  }
});

// Array of document fields to handle uploads
const documentFields = [
  { name: 'documents.studentImage', maxCount: 1 },
  { name: 'documents.fatherImage', maxCount: 1 },
  { name: 'documents.motherImage', maxCount: 1 },
  { name: 'documents.guardianImage', maxCount: 1 },
  { name: 'documents.signature', maxCount: 1 },
  { name: 'documents.fatherAadhar', maxCount: 1 },
  { name: 'documents.motherAadhar', maxCount: 1 },
  { name: 'documents.birthCertificate', maxCount: 1 },
  { name: 'documents.migrationCertificate', maxCount: 1 },
  { name: 'documents.aadhaarCard', maxCount: 1 }
];

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        parentInfo: true,
        sessionInfo: true,
        transportInfo: true,
        documents: true,
        educationInfo: true,
        otherInfo: true
      }
    });
    
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// Create a new student with all related information
router.post('/', upload.fields(documentFields), async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    
    // Format date fields
    const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    const admissionDate = data.admissionDate ? new Date(data.admissionDate) : new Date();
    const lastTcDate = data['lastEducation.tcDate'] ? new Date(data['lastEducation.tcDate']) : null;
    
    // Create document paths object
    const documentPaths = {};
    if (files) {
      Object.keys(files).forEach(fieldName => {
        const file = files[fieldName][0];
        const normalizedFieldName = fieldName.replace('documents.', '') + 'Path';
        // Store relative path
        documentPaths[normalizedFieldName] = `/uploads/students/${file.filename}`;
      });
    }
    
    // Create student with all related information using a transaction
    const student = await prisma.$transaction(async (tx) => {
      // 1. Create the main student record
      const newStudent = await tx.student.create({
        data: {
          branchName: data.branchName || null,
          firstName: data.firstName,
          middleName: data.middleName || null,
          lastName: data.lastName,
          admissionNo: data.admissionNo,
          studentId: data.studentId || null,
          dateOfBirth: dateOfBirth,
          gender: data.gender,
          bloodGroup: data.bloodGroup || null,
          nationality: data.nationality || null,
          religion: data.religion || null,
          category: data.category || null,
          caste: data.caste || null,
          aadhaarNumber: data.aadhaarNumber || null,
          mobileNumber: data.mobileNumber,
          email: data.email || null,
          emergencyContact: data.emergencyContact || null,
          rollNumber: data.rollNumber || null,
          className: data.className || data['admitSession.class'] || '',
          section: data.section || null,
          admissionDate: admissionDate,
          previousSchool: data.previousSchool || null,
          houseNo: data['address.houseNo'] || null,
          street: data['address.street'] || null,
          city: data['address.city'] || '',
          state: data['address.state'] || '',
          pinCode: data['address.pinCode'] || null,
          fatherName: data['father.name'] || '',
          motherName: data['mother.name'] || '',
          schoolId: parseInt(data.schoolId) || 1, // Default to school ID 1 if not provided
        }
      });
      
      // 2. Create Parent Info
      await tx.parentInfo.create({
        data: {
          fatherQualification: data['father.qualification'] || null,
          fatherOccupation: data['father.occupation'] || null,
          fatherContact: data['father.contactNumber'] || null,
          fatherEmail: data['father.email'] || null,
          fatherAadhaarNo: data['father.aadhaarNo'] || null,
          fatherAnnualIncome: data['father.annualIncome'] || null,
          fatherIsCampusEmployee: data['father.isCampusEmployee'] || 'no',
          motherQualification: data['mother.qualification'] || null,
          motherOccupation: data['mother.occupation'] || null,
          motherContact: data['mother.contactNumber'] || null,
          motherEmail: data['mother.email'] || null,
          motherAadhaarNo: data['mother.aadhaarNo'] || null,
          motherAnnualIncome: data['mother.annualIncome'] || null,
          motherIsCampusEmployee: data['mother.isCampusEmployee'] || 'no',
          guardianName: data['guardian.name'] || null,
          guardianAddress: data['guardian.address'] || null,
          guardianContact: data['guardian.contactNumber'] || null,
          studentId: newStudent.id
        }
      });
      
      // 3. Create Session Info
      await tx.sessionInfo.create({
        data: {
          admitGroup: data['admitSession.group'] || null,
          admitStream: data['admitSession.stream'] || null,
          admitClass: data['admitSession.class'] || null,
          admitSection: data['admitSession.section'] || null,
          admitRollNo: data['admitSession.rollNo'] || null,
          admitSemester: data['admitSession.semester'] || null,
          admitFeeGroup: data['admitSession.feeGroup'] || null,
          admitHouse: data['admitSession.house'] || null,
          currentGroup: data['currentSession.group'] || null,
          currentStream: data['currentSession.stream'] || null,
          currentClass: data['currentSession.class'] || null,
          currentSection: data['currentSession.section'] || null,
          currentRollNo: data['currentSession.rollNo'] || null,
          currentSemester: data['currentSession.semester'] || null,
          currentFeeGroup: data['currentSession.feeGroup'] || null,
          currentHouse: data['currentSession.house'] || null,
          studentId: newStudent.id
        }
      });
      
      // 4. Create Transport Info
      await tx.transportInfo.create({
        data: {
          transportMode: data['transport.mode'] || null,
          transportArea: data['transport.area'] || null,
          transportStand: data['transport.stand'] || null,
          transportRoute: data['transport.route'] || null,
          transportDriver: data['transport.driver'] || null,
          studentId: newStudent.id
        }
      });
      
      // 5. Create Documents
      await tx.documents.create({
        data: {
          ...documentPaths,
          academicRegistrationNo: data['academic.registrationNo'] || null,
          studentId: newStudent.id
        }
      });
      
      // 6. Create Education Info
      await tx.educationInfo.create({
        data: {
          lastSchool: data['lastEducation.school'] || null,
          lastSchoolAddress: data['lastEducation.address'] || null,
          lastTcDate: lastTcDate,
          lastClass: data['lastEducation.prevClass'] || null,
          lastPercentage: data['lastEducation.percentage'] || null,
          lastAttendance: data['lastEducation.attendance'] || null,
          lastExtraActivity: data['lastEducation.extraActivity'] || null,
          studentId: newStudent.id
        }
      });
      
      // 7. Create Other Info
      await tx.otherInfo.create({
        data: {
          belongToBPL: data['other.belongToBPL'] || 'no',
          minority: data['other.minority'] || 'no',
          disability: data['other.disability'] || null,
          accountNo: data['other.accountNo'] || null,
          bank: data['other.bank'] || null,
          ifscCode: data['other.ifscCode'] || null,
          medium: data['other.medium'] || null,
          lastYearResult: data['other.lastYearResult'] || null,
          singleParent: data['other.singleParent'] || 'no',
          onlyChild: data['other.onlyChild'] || 'no',
          onlyGirlChild: data['other.onlyGirlChild'] || 'no',
          adoptedChild: data['other.adoptedChild'] || 'no',
          siblingAdmissionNo: data['other.siblingAdmissionNo'] || null,
          transferCase: data['other.transferCase'] || 'no',
          livingWith: data['other.livingWith'] || null,
          motherTongue: data['other.motherTongue'] || null,
          admissionType: data['other.admissionType'] || 'new',
          udiseNo: data['other.udiseNo'] || null,
          studentId: newStudent.id
        }
      });
      
      // Return complete student with all relations
      return tx.student.findUnique({
        where: { id: newStudent.id },
        include: {
          parentInfo: true,
          sessionInfo: true,
          transportInfo: true,
          documents: true,
          educationInfo: true,
          otherInfo: true
        }
      });
    });
    
    res.json({ 
      success: true, 
      message: 'Student registered successfully',
      data: student
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to register student',
      error: error.message
    });
  }
});

// Get a student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        parentInfo: true,
        sessionInfo: true,
        transportInfo: true,
        documents: true,
        educationInfo: true,
        otherInfo: true
      }
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching student',
      error: error.message
    });
  }
});

export default router;