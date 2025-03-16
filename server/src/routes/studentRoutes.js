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
    const files = req.files || {};
    
    console.log('Student registration data received:', Object.keys(data));
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'admissionNo', 'gender', 'mobileNumber', 'className', 'city', 'state', 'fatherName', 'motherName'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }
    
    // Format date fields - with extra error handling
    let dateOfBirth = null;
    let admissionDate = new Date();
    let lastTcDate = null;
    
    try {
      if (data.dateOfBirth) {
        dateOfBirth = new Date(data.dateOfBirth);
        if (isNaN(dateOfBirth.getTime())) {
          throw new Error(`Invalid date format for dateOfBirth: ${data.dateOfBirth}`);
        }
      }
      
      if (data.admissionDate) {
        admissionDate = new Date(data.admissionDate);
        if (isNaN(admissionDate.getTime())) {
          throw new Error(`Invalid date format for admissionDate: ${data.admissionDate}`);
        }
      }
      
      if (data['lastEducation.tcDate']) {
        lastTcDate = new Date(data['lastEducation.tcDate']);
        if (isNaN(lastTcDate.getTime())) {
          throw new Error(`Invalid date format for lastEducation.tcDate: ${data['lastEducation.tcDate']}`);
        }
      }
    } catch (dateError) {
      console.error('Date conversion error:', dateError);
      return res.status(400).json({
        success: false,
        message: dateError.message
      });
    }
    
    // Create document paths object
    const documentPaths = {};
    if (Object.keys(files).length > 0) {
      Object.keys(files).forEach(fieldName => {
        const file = files[fieldName][0];
        const normalizedFieldName = fieldName.replace('documents.', '') + 'Path';
        // Store relative path
        documentPaths[normalizedFieldName] = `/uploads/students/${file.filename}`;
      });
    }
    
    // Initialize schoolId with a default value
    let schoolId = 1;
    try {
      if (data.schoolId) {
        schoolId = parseInt(data.schoolId);
        if (isNaN(schoolId)) {
          schoolId = 1;
        }
      }
    } catch (e) {
      console.error('Error parsing schoolId:', e);
      schoolId = 1;
    }
    
    console.log('Creating student record with schoolId:', schoolId);
    
    // Create student with all related information using a transaction
    const student = await prisma.$transaction(async (tx) => {
      // Log the operation
      console.log('Starting database transaction for student creation');

      try {
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
            schoolId: schoolId,
          }
        });

        console.log(`Created student record with id: ${newStudent.id}`);
        
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
        
        console.log(`Created parent info for student id: ${newStudent.id}`);
        
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
        
        console.log(`Created session info for student id: ${newStudent.id}`);
        
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
        
        console.log(`Created transport info for student id: ${newStudent.id}`);
        
        // 5. Create Documents
        await tx.documents.create({
          data: {
            ...documentPaths,
            academicRegistrationNo: data['academic.registrationNo'] || null,
            studentId: newStudent.id
          }
        });
        
        console.log(`Created documents for student id: ${newStudent.id}`);
        
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
        
        console.log(`Created education info for student id: ${newStudent.id}`);
        
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
        
        console.log(`Created other info for student id: ${newStudent.id}`);
        
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
      } catch (txError) {
        console.error('Transaction error:', txError);
        throw txError; // Re-throw to be caught by the outer try-catch
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Student registered successfully',
      data: student
    });
  } catch (error) {
    console.error('Error creating student:', error);
    
    // Provide more detailed error message based on error type
    let errorMessage = 'Failed to register student';
    
    if (error.code) {
      // Handle Prisma database errors
      switch (error.code) {
        case 'P2002': // Unique constraint violation
          errorMessage = `A student with this ${error.meta?.target?.[0] || 'field'} already exists`;
          break;
        case 'P2003': // Foreign key constraint failed
          errorMessage = 'Invalid relation reference';
          break;
        case 'P2025': // Record not found
          errorMessage = 'Referenced record not found';
          break;
        default:
          errorMessage = `Database error: ${error.code}`;
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
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