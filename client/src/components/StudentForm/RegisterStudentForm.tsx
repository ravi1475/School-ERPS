import React from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  formNo: string;
  dob: string;
  category: string;
  religion: string;
  registerForClass: string;
  admissionCategory: string;
  bloodGroup: string;
  regnDate: string;
  testDate: string;
  transactionNo: string;
  singleParent: boolean;
  contactNo: string;
  studentEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  studentAadharCardNo: string;
  regnCharge: string;
  examSubject: string;
  paymentStatus: string;
  fatherName: string;
  fatherMobileNo: string;
  smsAlert: boolean;
  fatherEmail: string;
  fatherAadharCardNo: string;
  isFatherCampusEmployee: boolean;
  motherName: string;
  motherMobileNo: string;
  motherAadharCardNo: string;
  casteCertificate: File | null;
  studentAadharCard: File | null;
  fatherAadharCard: File | null;
  motherAadharCard: File | null;
  previousClassMarksheet: File | null;
  transferCertificate: File | null;
  studentDateOfBirthCertificate: File | null;
}

const RegistrationForm: React.FC<{ formData: FormData }> = ({ formData }) => {
  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-4xl border border-gray-800">
        {/* Header */}
        <div className="flex justify-between border-b border-gray-800">
          <div className="flex-grow"></div>
          <div className="text-center py-2">
            <div className="text-blue-700 font-medium">Registration Form</div>
            <div>Registration No.: {formData.formNo}</div>
          </div>
          <div className="border-l border-gray-800 w-32"></div>
        </div>

        {/* Program and Application Details */}
        <div className="border-b border-gray-800">
          <div className="text-center py-1 font-medium border-b border-gray-800">Program and Application Details</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2 w-1/3">Register for Class</td>
                <td className="border border-gray-800 p-2">{formData.registerForClass}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Personal Details */}
        <div className="border-b border-gray-800">
          <div className="text-center py-1 font-medium border-b border-gray-800">Personal Details</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2 w-1/3">Student Name</td>
                <td className="border border-gray-800 p-2">{formData.firstName} {formData.lastName}</td>
                <td className="border border-gray-800 p-2 w-1/4">Date of Birth</td>
                <td className="border border-gray-800 p-2">{formData.dob}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Aadhaar Card Number</td>
                <td className="border border-gray-800 p-2">{formData.studentAadharCardNo}</td>
                <td className="border border-gray-800 p-2">Gender</td>
                <td className="border border-gray-800 p-2">{formData.gender}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Email Address</td>
                <td className="border border-gray-800 p-2">{formData.studentEmail}</td>
                <td className="border border-gray-800 p-2">Religion</td>
                <td className="border border-gray-800 p-2">{formData.religion}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Paid Amount</td>
                <td className="border border-gray-800 p-2">{formData.regnCharge}</td>
                <td className="border border-gray-800 p-2">Transaction ID</td>
                <td className="border border-gray-800 p-2">{formData.transactionNo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Parents Details */}
        <div className="border-b border-gray-800">
          <div className="text-center py-1 font-medium border-b border-gray-800">Parent's Details</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2 w-1/4">Father's Name :</td>
                <td className="border border-gray-800 p-2">{formData.fatherName}</td>
                <td className="border border-gray-800 p-2 w-1/4">Aadhaar Card No. :</td>
                <td className="border border-gray-800 p-2">{formData.fatherAadharCardNo}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Mobile Number :</td>
                <td className="border border-gray-800 p-2">{formData.fatherMobileNo}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Mother's Name :</td>
                <td className="border border-gray-800 p-2">{formData.motherName}</td>
                <td className="border border-gray-800 p-2">Aadhaar Card No. :</td>
                <td className="border border-gray-800 p-2">{formData.motherAadharCardNo}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
