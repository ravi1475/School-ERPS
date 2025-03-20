import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { IssuedCertificate } from './types';
import { toast } from 'react-toastify';

interface TCViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: IssuedCertificate | null;
}

const TCViewModal: React.FC<TCViewModalProps> = ({ isOpen, onClose, certificate }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Transfer_Certificate",
    onAfterPrint: () => toast.success("Certificate printed successfully!"),
    onPrintError: () => toast.error("Failed to print the certificate. Please try again."),
  });

  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-[95%] max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-900">Transfer Certificate</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Certificate Content */}
        <div ref={componentRef} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold uppercase">TRANSFER CERTIFICATE</h3>
            <p className="text-gray-600 mt-1">School Management System</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 text-sm">TC No:</span>
                <p className="font-medium">{certificate.tcNo}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Admission No:</span>
                <p className="font-medium">{certificate.admissionNumber}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Issue Date:</span>
                <p className="font-medium">{certificate.issueDate}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Date of Admission:</span>
                <p className="font-medium">{certificate.dateOfAdmission}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium mb-2">Student Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 text-sm">Name:</span>
                  <p className="font-medium">{certificate.studentName}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Father's Name:</span>
                  <p className="font-medium">{certificate.fatherName}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Mother's Name:</span>
                  <p className="font-medium">{certificate.motherName}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Nationality:</span>
                  <p className="font-medium">{certificate.nationality}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Category:</span>
                  <p className="font-medium">{certificate.category}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Date of Birth:</span>
                  <p className="font-medium">{certificate.dateOfBirth}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Last Studied Class:</span>
                  <p className="font-medium">{certificate.studentClass}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">School/Board Last Exam in:</span>
                  <p className="font-medium">{certificate.examIn}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Whether Failed:</span>
                  <p className="font-medium">{certificate.whetherFailed}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Fees Up To:</span>
                  <p className="font-medium">{certificate.feesPaidUpTo}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Subjects Studied:</span>
                  <p className="font-medium">{certificate.subject}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Qualified for Promotion:</span>
                  <p className="font-medium">{certificate.qualified}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Total Working Days:</span>
                  <p className="font-medium">{certificate.maxAttendance}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Total Present Days:</span>
                  <p className="font-medium">{certificate.obtainedAttendance}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Fees Concession Availed:</span>
                  <p className="font-medium">{certificate.feesConcessionAvailed}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Games Played:</span>
                  <p className="font-medium">{certificate.gamesPlayed}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Extra-Curricular Activities:</span>
                  <p className="font-medium">{certificate.extraActivity}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">General Conduct:</span>
                  <p className="font-medium">{certificate.generalConduct}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Date of Leaving:</span>
                  <p className="font-medium">{certificate.dateOfLeaving}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Reason for Leaving:</span>
                  <p className="font-medium">{certificate.reason}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Remarks:</span>
                  <p className="font-medium">{certificate.remarks}</p>
                </div>
              </div>
            </div>
          </div>
        
        <div className='border-t border-gray-200 pt-10 mt-4'>
        <div className="flex justify-between"> 
          <h4 className="font-medium">Class Teacher </h4>
          <h4 className="font-medium">Checked By</h4>
          <h4 className="font-medium">Principal's Signature</h4>
        </div>
        <div className='pt-10'>
        <h4 className="font-medium">Counter Sign By Education Officer</h4>
        </div>
        </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-2"
          >
            <Printer className="h-5 w-5 inline-block" /> Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default TCViewModal;