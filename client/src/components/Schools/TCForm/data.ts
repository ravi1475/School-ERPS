import { IssuedCertificate, StudentDetails } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

// Dummy data for testing
export const dummyStudentData: Record<string, StudentDetails> = {
  "12345": {
    fullName: "John Doe",
    fatherName: "Michael Doe",
    motherName: "Sarah Doe",
    nationality: "American",
    category: "General",
    dateOfBirth: "2005-05-15",
    dateOfAdmission: "2020-06-01",
    class: "10th Grade",
    section: "A",
    admissionNumber: "12345",
    currentClass: "10th Grade",
    admitClass: "9th Grade",
    academicYear: "2023-2024",
    lastAttendanceDate: "2024-03-15",
    lastClass: "10th Grade",
    tcNo: "TC-12345",
    school: "City High School",
    behavior: "Excellent",
    feesUpToDate: "2024-03-15",
    reason: "",
    maxAttendance: "220",
    obtainedAttendance: "210",
    lastExam: "Final Exam",
    whetherFailed: "No",
    tcCharge: "Paid",
    examIn: "School",
    qualified: "Yes",
    toClass: "11th Grade",
    classInWords: "Eleventh",
    conduct: "Good",
    remark: "Good student",
    behaviorRemarks: "Exemplary behavior",
    subjectStudied: "Math, Science",
    gamesPlayed: ["Football", "Cricket"],
    extraActivity: ["Music", "Debate"],
    rollNo: "123",
    dateOfLeaving: "2024-03-15",
    dateOfIssue: "2024-03-18",
    remarks: "None",
    schoolDetails: {
      schoolName: "National Public School",
      address: "Main Safiabad Road, Narela, Delhi-110040",
      recognitionId: "1310262",
      affiliationNo: "2730363",
      contact: "8750490890",
      email: "nps.narela@gmail.com",
      website: "www.nationalpublicschool.in",
      imageUrl: "https://example.com/school-logo.png",
    },
  },
  "67890": {
    fullName: "Jane Smith",
    fatherName: "Robert Smith",
    motherName: "Mary Smith",
    nationality: "British",
    category: "SC",
    dateOfBirth: "2006-08-22",
    dateOfAdmission: "2021-06-01",
    class: "9th Grade",
    section: "A",
    admissionNumber: "67890",
    currentClass: "9th Grade",
    admitClass: "8th Grade",
    academicYear: "2023-2024",
    lastAttendanceDate: "2024-03-15",
    lastClass: "9th Grade",
    tcNo: "TC-67890",
    school: "Town High School",
    behavior: "Good",
    feesUpToDate: "2024-02-28",
    reason: "",
    maxAttendance: "220",
    obtainedAttendance: "210",
    lastExam: "Midterm Exam",
    whetherFailed: "No",
    tcCharge: "Unpaid",
    examIn: "Private",
    qualified: "No",
    toClass: "10th Grade",
    classInWords: "Tenth",
    conduct: "Satisfactory",
    remark: "Needs improvement",
    behaviorRemarks: "Generally well-behaved",
    subjectStudied: "English, History",
    gamesPlayed: ["Basketball", "Chess"],
    extraActivity: ["Drama", "Art"],
    rollNo: "456",
    dateOfLeaving: "2024-03-15",
    dateOfIssue: "2024-03-18",
    remarks: "None",
    schoolDetails: {
      schoolName: "Town High School",
      address: "Main Street, Town, Delhi-110001",
      recognitionId: "1310263",
      affiliationNo: "2730364",
      contact: "8750490891",
      email: "townhighschool@gmail.com",
      website: "www.townhighschool.in",
      imageUrl: "https://example.com/town-school-logo.png",
    },
  },
};

export const dummyIssuedCertificates: IssuedCertificate[] = [
  {
    studentName: "John Doe",
    studentClass: "10th Grade",
    admissionNumber: "12345",
    motherName: "Sarah Doe",
    fatherName: "Michael Doe",
    nationality: "American",
    category: "General",
    dateOfBirth: "2005-05-15",
    lastClass: "10th Grade",
    issueDate: "2024-03-10",
    dateOfLeaving: "2024-03-15",
    reason: "Family relocation",
    examIn: "School",
    qualified: "Yes",
    gamesPlayed: ["Football", "Cricket"],
    extraActivity: ["Music", "Debate"],
    tcNo: "520",
    subject: "Math, Science",
    generalConduct: "Good",
    remarks: "None",
    maxAttendance: "220",
    obtainedAttendance: "210",
    tcCharge: "Paid",
    dateOfIssue: "2024-03-10",
    toClass: "11th Grade",
    classInWords: "Eleventh",
    lastAttendanceDate: "2024-03-15",
    behaviorRemarks: "Exemplary behavior",
    rollNo: "123",
    admitClass: "9th Grade",
    feesPaidUpTo: "2024-03-15",
    feesConcessionAvailed: "None",
    dateOfAdmission: "2020-06-01",
    schoolDetails: {
      schoolName: "National Public School",
      address: "Main Safiabad Road, Narela, Delhi-110040",
      recognitionId: "1310262",
      affiliationNo: "2730363",
      contact: "8750490890",
      email: "nps.narela@gmail.com",
      website: "www.nationalpublicschool.in",
      imageUrl: "https://example.com/school-logo.png",
    },
  },
  {
    studentName: "Jane Smith",
    studentClass: "9th Grade",
    admissionNumber: "67890",
    motherName: "Mary Smith",
    fatherName: "Robert Smith",
    nationality: "British",
    category: "SC",
    dateOfBirth: "2006-08-22",
    lastClass: "9th Grade",
    issueDate: "2024-03-12",
    dateOfLeaving: "2024-03-15",
    reason: "Change of residence",
    examIn: "Private",
    qualified: "No",
    gamesPlayed: ["Basketball", "Chess"],
    extraActivity: ["Drama", "Art"],
    tcNo: "234",
    subject: "English, History",
    generalConduct: "Satisfactory",
    remarks: "None",
    maxAttendance: "220",
    obtainedAttendance: "210",
    tcCharge: "Unpaid",
    dateOfIssue: "2024-03-12",
    toClass: "10th Grade",
    classInWords: "Tenth",
    lastAttendanceDate: "2024-03-15",
    behaviorRemarks: "Generally well-behaved",
    rollNo: "456",
    admitClass: "8th Grade",
    feesPaidUpTo: "2024-02-28",
    feesConcessionAvailed: "Partial",
    dateOfAdmission: "2021-06-01",
    schoolDetails: {
      schoolName: "Town High School",
      address: "Main Street, Town, Delhi-110001",
      recognitionId: "1310263",
      affiliationNo: "2730364",
      contact: "8750490891",
      email: "townhighschool@gmail.com",
      website: "www.townhighschool.in",
      imageUrl: "https://example.com/town-school-logo.png",
    },
  },
];

// API functions
export const fetchStudentData = async (admissionNumber: string): Promise<StudentDetails> => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${admissionNumber}`);
    if (!response.ok) throw new Error('Student not found');
    return await response.json();
  } catch (error) {
    // Fallback to dummy data if API fails
    if (dummyStudentData[admissionNumber]) {
      return dummyStudentData[admissionNumber];
    }
    throw error;
  }
};

export const fetchIssuedCertificates = async (): Promise<IssuedCertificate[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates`);
    if (!response.ok) throw new Error('Failed to fetch certificates');
    return await response.json();
  } catch (error) {
    // Fallback to dummy data if API fails
    return dummyIssuedCertificates;
  }
};

export const createCertificate = async (certificate: IssuedCertificate): Promise<IssuedCertificate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificate),
    });
    if (!response.ok) throw new Error('Failed to create certificate');
    return await response.json();
  } catch (error) {
    // Fallback to adding to dummy data if API fails
    dummyIssuedCertificates.unshift(certificate);
    return certificate;
  }
};

export const updateCertificate = async (certificate: IssuedCertificate): Promise<IssuedCertificate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/${certificate.admissionNumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificate),
    });
    if (!response.ok) throw new Error('Failed to update certificate');
    return await response.json();
  } catch (error) {
    // Fallback to updating dummy data if API fails
    const index = dummyIssuedCertificates.findIndex(c => c.admissionNumber === certificate.admissionNumber);
    if (index !== -1) {
      dummyIssuedCertificates[index] = certificate;
    }
    return certificate;
  }
};

export const deleteCertificate = async (admissionNumber: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/${admissionNumber}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete certificate');
  } catch (error) {
    // Fallback to deleting from dummy data if API fails
    const index = dummyIssuedCertificates.findIndex(c => c.admissionNumber === admissionNumber);
    if (index !== -1) {
      dummyIssuedCertificates.splice(index, 1);
    }
  }
};
