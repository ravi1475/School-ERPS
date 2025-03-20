export interface StudentDetails {
  fullName: string;
  fatherName: string;
  motherName: string;
  nationality: string;
  category: string;
  dateOfBirth: string;
  dateOfAdmission: string;
  class?: string;
  section: string;
  admissionNumber: string;
  currentClass: string;
  admitClass: string;
  academicYear: string;
  lastAttendanceDate: string;
  lastClass?: string; 
  tcNo?: string; 
  school?: string; 
  behavior: string;
  feesUpToDate: string;
  reason: string;
  maxAttendance: string;
  obtainedAttendance: string;
  lastExam: string;
  whetherFailed: string;
  tcCharge: string;
  examIn: string;
  qualified: string;
  toClass: string;
  classInWords: string;
  conduct: string;
  remark: string;
  behaviorRemarks?: string;
  subjectStudied: string;
  gamesPlayed: string;
  extraActivity: string;
  rollNo: string;
  dateOfLeaving: string;
  dateOfIssue: string;
  remarks: string;
}
  
  export interface CertificateDetails {
    studentName: string;
    studentClass: string;
    issueDate: string;
    leavingDate: string;
    motherName: string;
    fatherName: string;
    nationality: string;
    category: string;
    dateOfBirth: string;
    toClass: string;
    classInWords: string;
    reason: string;
    examIn: string;
    qualified: string;
    gamesPlayed: string;
    extraActivity: string;
    subject: string;
    generalConduct: string;
    dateOfLeaving: string;
    remarks: string;
    maxAttendance: string;
    obtainedAttendance: string;
    lastAttendanceDate: string;
    feesPaidUpTo: string;
    whetherFailed: string;
    tcCharge: string;
    behaviorRemarks: string;
    rollNo: string;
    dateOfIssue: string;
    admitClass: string;
  }
  
  export interface IssuedCertificate extends CertificateDetails {
    admissionNumber: string;
    tcNo: string;
    feesConcessionAvailed: string;
    dateOfAdmission: string;
  }