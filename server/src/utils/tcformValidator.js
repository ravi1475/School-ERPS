import { z } from 'zod';

// Enum schemas matching the Prisma enums
const WhetherFailedEnum = z.enum(['Yes', 'No', 'NA', 'CBSEBoard']);
const ExamAppearedInEnum = z.enum([
  'School', 'Board', 'NA', 'CBSEBoard', 
  'SchoolFailed', 'SchoolPassed', 'SchoolCompartment', 
  'BoardPassed', 'BoardFailed', 'BoardCompartment'
]);
const QualifiedStatusEnum = z.enum([
  'Yes', 'No', 'NA', 'Pass', 'Fail', 'Compartment',
  'AsperCBSEBoardResult', 'AppearedinclassXExam', 'AppearedinclassXIIExam'
]);
const ReasonForLeavingEnum = z.enum([
  'FamilyRelocation', 'AdmissionInOtherSchool', 'Duetolongabsencewithoutinformation',
  'FatherJobTransfer', 'GetAdmissioninHigherClass', 'GoingtoNativePlace',
  'ParentWill', 'Passedoutfromtheschool', 'Shiftingtootherplace',
  'TransferCase', 'Other'
]);
const ConductStatusEnum = z.enum([
  'Excellent', 'Good', 'Satisfactory', 'NeedsImprovement', 'Poor'
]);
const FeeConcessionStatusEnum = z.enum(['None', 'Partial', 'Full']);

// Base schema for TC data
const TCBaseSchema = {
  // Required fields
  fullName: z.string().min(3, "Student name must be at least 3 characters"),
  fatherName: z.string().min(3, "Father's name must be at least 3 characters"),
  motherName: z.string().min(3, "Mother's name must be at least 3 characters"),
  dateOfBirth: z.string().datetime("Invalid date of birth format"),
  nationality: z.string().min(2, "Nationality must be at least 2 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  dateOfAdmission: z.string().datetime("Invalid date of admission format"),
  currentClass: z.string().min(1, "Class must be at least 1 character"),
  whetherFailed: WhetherFailedEnum,
  section: z.string().min(1, "Section must be at least 1 character"),
  examAppearedIn: ExamAppearedInEnum,
  qualifiedForPromotion: QualifiedStatusEnum,
  reasonForLeaving: ReasonForLeavingEnum,
  dateOfLeaving: z.string().datetime("Invalid date of leaving format"),
  lastAttendanceDate: z.string().datetime("Invalid last attendance date format"),
  maxAttendance: z.number().int().min(0, "Max attendance must be a positive number"),
  obtainedAttendance: z.number().int().min(0, "Obtained attendance must be a positive number"),
  subjectsStudied: z.string(),
  generalConduct: ConductStatusEnum,
  feesPaidUpTo: z.string().datetime("Invalid fees paid up to date format"),
  
  // Optional fields
  rollNumber: z.string().optional(),
  toClass: z.string().optional(),
  classInWords: z.string().optional(),
  behaviorRemarks: z.string().optional(),
  tcCharge: z.number().min(0, "TC charge must be a positive number").optional(),
  feeConcession: FeeConcessionStatusEnum.optional(),
  admissionNumber: z.string(),
  tcNumber: z.string().optional(),
};

// Schema for creating a new TC
export const TCCreateSchema = z.object({
  ...TCBaseSchema,
  studentId: z.number().int().positive("Student ID must be a positive integer"),
  schoolId: z.number().int().positive("School ID must be a positive integer"),
});

// Schema for updating an existing TC (all fields optional)
export const TCUpdateSchema = TCCreateSchema.partial().omit({
  studentId: true,
  schoolId: true,
}).extend({
  // Fields that must be provided even in updates
  fullName: z.string().min(3, "Student name must be at least 3 characters"),
  currentClass: z.string().min(1, "Class must be at least 1 character"),
  dateOfLeaving: z.string().datetime("Invalid date of leaving format"),
});

// Helper function to convert frontend model to backend model
export const convertFrontendToBackend = (frontendData) => {
  return {
    fullName: frontendData.studentName,
    currentClass: frontendData.studentClass,
    whetherFailed: frontendData.whetherFailed,
    examAppearedIn: frontendData.examIn,
    qualifiedForPromotion: frontendData.qualified,
    subjectsStudied: frontendData.subject,
    generalConduct: frontendData.generalConduct,
    feeConcession: frontendData.feesConcessionAvailed,
    rollNumber: frontendData.rollNo,
    maxAttendance: parseInt(frontendData.maxAttendance || '0'),
    obtainedAttendance: parseInt(frontendData.obtainedAttendance || '0'),
    tcCharge: parseFloat(frontendData.tcCharge || '0'),
    tcNumber: frontendData.tcNo,
    // Pass other fields directly
    fatherName: frontendData.fatherName,
    motherName: frontendData.motherName,
    dateOfBirth: frontendData.dateOfBirth,
    nationality: frontendData.nationality,
    category: frontendData.category,
    dateOfAdmission: frontendData.dateOfAdmission,
    reasonForLeaving: frontendData.reason,
    dateOfLeaving: frontendData.dateOfLeaving,
    lastAttendanceDate: frontendData.lastAttendanceDate,
    toClass: frontendData.toClass,
    classInWords: frontendData.classInWords,
    behaviorRemarks: frontendData.behaviorRemarks,
    feesPaidUpTo: frontendData.feesPaidUpTo,
    admissionNumber: frontendData.admissionNumber
  };
};
