import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { StudentDetails, IssuedCertificate } from './types';
import { dummyStudentData } from './data';

interface TCFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  certificate: IssuedCertificate | null;
  setIssuedCertificates: React.Dispatch<React.SetStateAction<IssuedCertificate[]>>;
}

const TCFormModal: React.FC<TCFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  certificate,
  setIssuedCertificates
}) => {
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<IssuedCertificate>({
    studentName: "",
    studentClass: "",
    admissionNumber: "",
    motherName: "",
    fatherName: "",
    nationality: "",
    category: "",
    dateOfBirth: "",
    issueDate: new Date().toISOString().split('T')[0],
    leavingDate: new Date().toISOString().split('T')[0],
    reason: "",
    examIn: "",
    qualified: "",
    gamesPlayed: "",
    extraActivity: "",
    tcNo: "",
    subject: "",
    generalConduct: "",
    dateOfLeaving: new Date().toISOString().split('T')[0],
    remarks: "",
    maxAttendance: "",
    obtainedAttendance: "",
    lastAttendanceDate: new Date().toISOString().split('T')[0],
    whetherFailed: "",
    tcCharge: "",
    toClass: "",
    classInWords: "",
    behaviorRemarks: "",
    rollNo: "",
    dateOfIssue: new Date().toISOString().split('T')[0],
    admitClass: "",
    feesPaidUpTo: "",
    feesConcessionAvailed: "",
    dateOfAdmission: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isEdit && certificate) {
      setFormData(certificate);
      setAdmissionNumber(certificate.admissionNumber);
    } else {
      resetForm();
    }
  }, [isEdit, certificate]);

  const resetForm = () => {
    setFormData({
      studentName: "",
      studentClass: "",
      admissionNumber: "",
      motherName: "",
      fatherName: "",
      nationality: "",
      category: "",
      dateOfBirth: "",
      issueDate: new Date().toISOString().split('T')[0],
      leavingDate: new Date().toISOString().split('T')[0],
      reason: "",
      examIn: "",
      qualified: "",
      gamesPlayed: "",
      extraActivity: "",
      tcNo: "",
      subject: "",
      generalConduct: "",
      dateOfLeaving: new Date().toISOString().split('T')[0],
      remarks: "",
      maxAttendance: "",
      obtainedAttendance: "",
      lastAttendanceDate: new Date().toISOString().split('T')[0],
      feesPaidUpTo: "",
      whetherFailed: "",
      tcCharge: "",
      toClass: "",
      classInWords: "",
      behaviorRemarks: "",
      rollNo: "",
      dateOfIssue: new Date().toISOString().split('T')[0],
      admitClass: "",
      feesConcessionAvailed: "",
      dateOfAdmission: new Date().toISOString().split('T')[0]
    });
    setAdmissionNumber("");
    setStudentDetails(null);
  };

  const fetchStudentData = async (admissionNo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (dummyStudentData[admissionNo]) {
        const student = dummyStudentData[admissionNo];
        setStudentDetails(student);
        setFormData(prev => ({
          ...prev,
          ...student,
          admissionNumber: student.admissionNumber,
          studentName: student.fullName,
          studentClass: student.currentClass,
          subject: student.subjectStudied,
          generalConduct: student.conduct,
          remarks: student.remarks,
          dateOfLeaving: student.dateOfLeaving,
          dateOfIssue: student.dateOfIssue,
          admitClass: student.admitClass,
          feesPaidUpTo: student.feesUpToDate
        }));
      } else {
        setError("Student not found. Please check the admission number.");
      }
    } catch (err) {
      setError("Error fetching student data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (admissionNumber.length >= 5) {
      fetchStudentData(admissionNumber);
    } else {
      setError("Please enter a valid admission number");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCertificate: IssuedCertificate = {
      ...formData,
      admissionNumber: admissionNumber,
      studentName: studentDetails?.fullName || formData.studentName,
      leavingDate: formData.leavingDate
    };

    if (isEdit) {
      setIssuedCertificates(prev =>
        prev.map(cert => cert.admissionNumber === admissionNumber ? newCertificate : cert)
      );
      toast.success('Certificate updated successfully!');
    } else {
      setIssuedCertificates(prev => [newCertificate, ...prev]);
      toast.success('Transfer Certificate generated successfully!');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-7xl w-[95%] max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Transfer Certificate' : 'Generate Transfer Certificate'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Number
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="flex-1 p-2 border rounded-md"
                placeholder="Enter admission number"
                readOnly={isEdit}
                required
              />
              {!isEdit && (
                <button
                  type="button"
                  onClick={handleAdmissionSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              )}
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.studentName}
                className="w-full p-2 border rounded-md bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father's Name</label>
              <input
                type="text"
                value={formData.fatherName}
                className="w-full p-2 border rounded-md bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
              <input
                type="text"
                value={formData.motherName}
                className="w-full p-2 border rounded-md bg-gray-50"
                readOnly
              />
            </div>

            {/* Academic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Admit Class</label>
              <input
                type="text"
                value={formData.admitClass}
                className="w-full p-2 border rounded-md bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Studying/Studied Class</label>
              <input
                type="text"
                value={formData.studentClass}
                className="w-full p-2 border rounded-md bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                value={formData.rollNo}
                className="w-full p-2 border rounded-md"
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              />
            </div>

            {/* Financial Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">TC Charge</label>
              <input
                type="number"
                value={formData.tcCharge}
                onChange={(e) => setFormData({ ...formData, tcCharge: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fees Paid Up To</label>
              <input
                type="date"
                value={formData.feesPaidUpTo}
                onChange={(e) => setFormData({ ...formData, feesPaidUpTo: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Academic Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Attendance</label>
              <input
                type="text"
                value={formData.maxAttendance}
                onChange={(e) => setFormData({ ...formData, maxAttendance: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Obtained Attendance</label>
              <input
                type="text"
                value={formData.obtainedAttendance}
                onChange={(e) => setFormData({ ...formData, obtainedAttendance: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Whether Failed</label>
              <select
                value={formData.whetherFailed}
                onChange={(e) => setFormData({ ...formData, whetherFailed: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Compartment">Compartment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam In</label>
              <select
                value={formData.examIn}
                onChange={(e) => setFormData({ ...formData, examIn: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                <option value="School">School</option>
                <option value="Board">Board</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Qualified</label>
              <select
                value={formData.qualified}
                onChange={(e) => setFormData({ ...formData, qualified: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Promoted">Promoted</option>
              </select>
            </div>

            {/* Transfer Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">To Class</label>
              <input
                type="text"
                value={formData.toClass}
                onChange={(e) => setFormData({ ...formData, toClass: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class in Words</label>
              <input
                type="text"
                value={formData.classInWords}
                onChange={(e) => setFormData({ ...formData, classInWords: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Existing Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">TC Number</label>
              <input
                type="text"
                value={formData.tcNo}
                className="w-full p-2 border rounded-md"
                onChange={(e) => setFormData({ ...formData, tcNo: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Issue</label>
              <input
                type="date"
                value={formData.dateOfIssue}
                className="w-full p-2 border rounded-md"
                onChange={(e) => setFormData({ ...formData, dateOfIssue: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Leaving</label>
              <input
                type="date"
                value={formData.dateOfLeaving}
                className="w-full p-2 border rounded-md"
                onChange={(e) => setFormData({ ...formData, dateOfLeaving: e.target.value })}
              />
            </div>

            {/* Behavior and Conduct */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Conduct Remark</label>
              <input
                value={formData.behaviorRemarks}
                onChange={(e) => setFormData({ ...formData, behaviorRemarks: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Enter conduct remarks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Remark</label>
              <select
                value={formData.generalConduct}
                onChange={(e) => setFormData({ ...formData, generalConduct: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Remark</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Satisfactory">Satisfactory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subjects Studied</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Enter subjects (comma separated)"
              />
            </div>

            {/* Games Played with Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Games Played</label>
              <select
                value={formData.gamesPlayed}
                onChange={(e) => setFormData({ ...formData, gamesPlayed: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Game</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Badminton">Badminton</option>
                <option value="Athletics">Athletics</option>
              </select>
            </div>

            {/* Extra Activities with Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Extra Activities</label>
              <select
                value={formData.extraActivity}
                onChange={(e) => setFormData({ ...formData, extraActivity: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Activity</option>
                <option value="Music">Music</option>
                <option value="Dance">Dance</option>
                <option value="Drama">Drama</option>
                <option value="Debate">Debate</option>
                <option value="Art">Art</option>
                <option value="Chess">Chess</option>
                <option value="Scouting">Scouting</option>
              </select>
            </div>

            {/* Transfer Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason for Transfer</label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Reason</option>
                <option value="Family Relocation">Family Relocation</option>
                <option value="Admission in Other School">Admission in Other School</option>
                <option value="Parent's Request">Parent's Request</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEdit ? 'Update Certificate' : 'Generate Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TCFormModal;