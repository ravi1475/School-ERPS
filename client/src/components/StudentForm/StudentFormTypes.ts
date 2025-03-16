// Define all types used in the Student Registration Form

// Define Documents type
export interface Documents {
  studentImage: File | null;
  fatherImage: File | null;
  motherImage: File | null;
  guardianImage: File | null;
  signature: File | null;
  fatherAadhar: File | null;
  motherAadhar: File | null;
  birthCertificate: File | null;
  migrationCertificate: File | null;
  aadhaarCard: File | null;
}

// Define Address type
export interface Address {
  street: string;
  houseNo: string;
  city: string;
  state: string;
  pinCode: string;
}

// Define Parent type
export interface Parent {
  name: string;
  qualification: string;
  occupation: string;
  email: string;
  contactNumber: string;
  aadhaarNo: string;
  annualIncome: string;
  isCampusEmployee: string;
}

// Define Guardian type
export interface Guardian {
  name: string;
  address: string;
  contactNumber: string;
}

// Define Session type
export interface Session {
  group: string;
  stream: string;
  class: string;
  section: string;
  rollNo: string;
  semester: string;
  feeGroup: string;
  house: string;
}

// Define Academic type
export interface Academic {
  registrationNo: string;
}

// Define Transport type
export interface Transport {
  mode: string;
  area: string;
  stand: string;
  route: string;
  driver: string;
}

// Define LastEducation type
export interface LastEducation {
  school: string;
  address: string;
  tcDate: string;
  prevClass: string;
  percentage: string;
  attendance: string;
  extraActivity: string;
}

// Define Other type
export interface Other {
  belongToBPL: string;
  minority: string;
  disability: string;
  accountNo: string;
  bank: string;
  ifscCode: string;
  medium: string;
  lastYearResult: string;
  singleParent: string;
  onlyChild: string;
  onlyGirlChild: string;
  adoptedChild: string;
  siblingAdmissionNo: string;
  transferCase: string;
  livingWith: string;
  motherTongue: string;
  admissionType: string;
  udiseNo: string;
}

// Define StudentFormData type - the complete student data structure
export interface StudentFormData {
  branchName: string;
  admissionNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  admissionDate: string;
  studentId: string;
  dateOfBirth: string;
  religion: string;
  gender: string;
  bloodGroup: string;
  caste: string;
  admitSession: Session;
  currentSession: Session;
  className: string;
  section: string;
  rollNumber: string;
  academic: Academic;
  previousSchool: string;
  mobileNumber: string;
  email: string;
  emergencyContact: string;
  transport: Transport;
  address: Address;
  father: Parent;
  mother: Parent;
  guardian: Guardian;
  documents: Documents;
  aadhaarNumber: string;
  nationality: string;
  other: Other;
  lastEducation: LastEducation;
}

// Define Step interface for the progress indicator
export interface Step {
  id: number;
  title: string;
  icon: string;
}

// Define validation patterns
export const VALIDATION_PATTERNS = {
  TEXT_ONLY: /^[A-Za-z\s]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[0-9]{10}$/,
  NUMERIC: /^[0-9]+$/,
  ALPHANUMERIC: /^[A-Za-z0-9\s]+$/,
  AADHAAR: /^[0-9]{12}$/,
  PINCODE: /^[0-9]{6}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  ACCOUNT_NUMBER: /^[0-9]{9,18}$/,
};

// Define the return type for the hook
export interface UseStudentRegistrationReturn {
  currentStep: number;
  formData: StudentFormData;
  isSubmitting: boolean;
  error: string;
  success: boolean;
  steps: Array<Step>;
  validationErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, documentType: keyof Documents) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
} 