import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader, ArrowLeft, FileText, User, MapPin, Users, Calendar, CreditCard } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// Define the Registration interface based on the schema
interface Registration {
  registrationId: string;
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
  
  // Father Details
  fatherName: string;
  fatherMobileNo: string;
  smsAlert: boolean;
  fatherEmail: string;
  fatherAadharCardNo: string;
  isFatherCampusEmployee: boolean;
  
  // Mother Details
  motherName: string;
  motherMobileNo: string;
  motherAadharCardNo: string;
  
  // Documents
  casteCertificate?: string;
  studentAadharCard?: string;
  fatherAadharCard?: string;
  motherAadharCard?: string;
  previousClassMarksheet?: string;
  transferCertificate?: string;
  studentDateOfBirthCertificate?: string;
  
  // Relationship with School
  schoolId?: number;
}

// API service to fetch the registration data
const fetchRegistrationData = async (formNo: string): Promise<any> => {
  try {
    console.log(`http://localhost:5000/register/student?formNo=${formNo}`);
    const response = await fetch(`http://localhost:5000/register/student?formNo=${formNo}`);
    if (!response.ok) {
      throw new Error('Failed to fetch registration data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching registration data:', error);
    throw error;
  }
};

// Create a component to display document status
const DocumentStatus: React.FC<{ document: string | undefined; label: string }> = ({ document, label }) => {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200">
      {document ? (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="text-green-500" size={16} />
        </div>
      ) : (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50">
          <AlertCircle className="text-amber-500" size={16} />
        </div>
      )}
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`ml-auto text-xs font-medium py-1 px-2 rounded-full ${
        document ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
      }`}>
        {document ? "Uploaded" : "Pending"}
      </span>
    </div>
  );
};

// InfoCard component for displaying sections
const InfoCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-white">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// InfoItem component for displaying individual data points
const InfoItem: React.FC<{ label: string; value: string | boolean }> = ({ label, value }) => {
  let displayValue = value;
  
  if (typeof value === 'boolean') {
    displayValue = value ? 'Yes' : 'No';
  }
  
  return (
    <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{displayValue as string}</p>
    </div>
  );
};

// Main RegistrationDisplay component
const RegistrationDisplay: React.FC = () => {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { formNo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchRegistrationData(formNo);
        setRegistration(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to load registration data. Please try again.');
      } finally {
        // Add a small delay to ensure the loading state is visible for demo purposes
        setTimeout(() => setLoading(false), 1000);
      }
    };

    loadData();
  }, [formNo]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="mb-2 text-xl font-bold text-gray-800">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 md:p-6 bg-gray-50">
      {/* Loading overlay with blur effect */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <Loader className="animate-spin text-blue-600" size={48} />
              <p className="mt-4 text-lg font-medium text-gray-800">Loading registration data...</p>
            </div>
          </div>
        </div>
      )}

      {/* Content structure that will be visible through blur when loading */}
      <div className={`max-w-6xl mx-auto ${loading ? 'blur-sm' : ''}`}>
        {/* Header with back button and title */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
          <h1 className="ml-4 text-xl md:text-2xl font-bold text-gray-800">Registration Details</h1>
          {registration && (
            <div className="ml-auto">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                Form #{registration.formNo}
              </span>
            </div>
          )}
        </div>
        
        {registration && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="md:col-span-1 space-y-6">
              <InfoCard title="Personal Information" icon={<User className="text-blue-500" size={16} />}>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-blue-50 mb-3 text-center">
                    <h3 className="text-xl font-bold text-gray-800">{`${registration.firstName} ${registration.lastName}`}</h3>
                    <p className="text-sm text-gray-500">{registration.registerForClass} Class Student</p>
                  </div>
                  <InfoItem label="Gender" value={registration.gender} />
                  <InfoItem label="Date of Birth" value={registration.dob} />
                  <InfoItem label="Blood Group" value={registration.bloodGroup} />
                  <InfoItem label="Category" value={registration.category} />
                  <InfoItem label="Religion" value={registration.religion} />
                  <InfoItem label="Admission Category" value={registration.admissionCategory} />
                  <InfoItem label="Contact Number" value={registration.contactNo} />
                  <InfoItem label="Email" value={registration.studentEmail} />
                  <InfoItem label="Aadhar Card Number" value={registration.studentAadharCardNo} />
                </div>
              </InfoCard>
              
              <InfoCard title="Address" icon={<MapPin className="text-blue-500" size={16} />}>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Full Address</p>
                    <p className="text-sm font-medium text-gray-800">{registration.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem label="City" value={registration.city} />
                    <InfoItem label="State" value={registration.state} />
                  </div>
                  <InfoItem label="Pincode" value={registration.pincode} />
                </div>
              </InfoCard>
            </div>
            
            {/* Middle Column - Parent Info */}
            <div className="md:col-span-1 space-y-6">
              <InfoCard title="Parent Information" icon={<Users className="text-blue-500" size={16} />}>
                <div>
                  <div className="mb-4">
                    <h3 className="flex items-center text-sm font-medium text-gray-700 py-2 px-3 bg-gray-50 rounded-lg mb-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Father's Details
                    </h3>
                    <div className="space-y-3">
                      <InfoItem label="Name" value={registration.fatherName} />
                      <div className="grid grid-cols-2 gap-3">
                        <InfoItem label="Mobile Number" value={registration.fatherMobileNo} />
                        <InfoItem label="SMS Alerts" value={registration.smsAlert} />
                      </div>
                      <InfoItem label="Email" value={registration.fatherEmail} />
                      <InfoItem label="Aadhar Card Number" value={registration.fatherAadharCardNo} />
                      <InfoItem label="Campus Employee" value={registration.isFatherCampusEmployee} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-gray-700 py-2 px-3 bg-gray-50 rounded-lg mb-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Mother's Details
                    </h3>
                    <div className="space-y-3">
                      <InfoItem label="Name" value={registration.motherName} />
                      <InfoItem label="Mobile Number" value={registration.motherMobileNo} />
                      <InfoItem label="Aadhar Card Number" value={registration.motherAadharCardNo} />
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
            
            {/* Right Column - Registration Details and Documents */}
            <div className="md:col-span-1 space-y-6">
              <InfoCard title="Registration Details" icon={<Calendar className="text-blue-500" size={16} />}>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem label="Registration Date" value={registration.regnDate} />
                    <InfoItem label="Test Date" value={registration.testDate} />
                  </div>
                  <InfoItem label="Transaction Number" value={registration.transactionNo} />
                  <InfoItem label="Registration Charge" value={registration.regnCharge} />
                  <InfoItem label="Exam Subject" value={registration.examSubject} />
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Payment Status</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        registration.paymentStatus === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <CreditCard size={14} className="mr-1" />
                        {registration.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <InfoItem label="Single Parent" value={registration.singleParent} />
                </div>
              </InfoCard>
              
              <InfoCard title="Required Documents" icon={<FileText className="text-blue-500" size={16} />}>
                <div className="space-y-3">
                  <DocumentStatus document={registration.casteCertificate} label="Caste Certificate" />
                  <DocumentStatus document={registration.studentAadharCard} label="Student Aadhar Card" />
                  <DocumentStatus document={registration.fatherAadharCard} label="Father's Aadhar Card" />
                  <DocumentStatus document={registration.motherAadharCard} label="Mother's Aadhar Card" />
                  <DocumentStatus document={registration.previousClassMarksheet} label="Previous Class Marksheet" />
                  <DocumentStatus document={registration.transferCertificate} label="Transfer Certificate" />
                  <DocumentStatus document={registration.studentDateOfBirthCertificate} label="Birth Certificate" />
                </div>
              </InfoCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationDisplay;