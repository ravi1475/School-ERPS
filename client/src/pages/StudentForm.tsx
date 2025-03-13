import React from 'react';
import { useStudentRegistration } from '../components/Hooks/useStudentRegistration';

const StudentRegistrationForm: React.FC = () => {
  const {
    currentStep,
    formData,
    isSubmitting,
    error,
    success,
    steps,
    handleChange,
    handleFileChange,
    handleSubmit,
    nextStep,
    prevStep
  } = useStudentRegistration();

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex flex-col items-center ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 mb-2 
              ${currentStep >= step.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
              <span className="text-xl">{step.icon}</span>
            </div>
            <span className="text-sm">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderForm = () => {
    const formSections: { [key: number]: JSX.Element } = {
      // Step 1: Basic Information
      1: (
        <div className="space-y-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block mb-4">
              <span className="text-gray-700">Branch Name</span>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Admission No *</span>
              <input
                type="text"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">First Name *</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Middle Name</span>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Last Name *</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Admission Date *</span>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">SR No / Student ID</span>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Date of Birth *</span>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Religion</span>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Gender *</span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Blood Group</span>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Caste</span>
              <input
                type="text"
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      ),
      
      // Step 2: Academic Information
      2: (
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Admit Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Group</span>
                <input
                  type="text"
                  name="admitSession.group"
                  value={formData.admitSession.group}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Stream</span>
                <input
                  type="text"
                  name="admitSession.stream"
                  value={formData.admitSession.stream}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Class *</span>
                <input
                  type="text"
                  name="admitSession.class"
                  value={formData.admitSession.class}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Section</span>
                <input
                  type="text"
                  name="admitSession.section"
                  value={formData.admitSession.section}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Roll No.</span>
                <input
                  type="text"
                  name="admitSession.rollNo"
                  value={formData.admitSession.rollNo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Semester</span>
                <input
                  type="text"
                  name="admitSession.semester"
                  value={formData.admitSession.semester}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Fee Group</span>
                <input
                  type="text"
                  name="admitSession.feeGroup"
                  value={formData.admitSession.feeGroup}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">House</span>
                <input
                  type="text"
                  name="admitSession.house"
                  value={formData.admitSession.house}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Current Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Group</span>
                <input
                  type="text"
                  name="currentSession.group"
                  value={formData.currentSession.group}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Stream</span>
                <input
                  type="text"
                  name="currentSession.stream"
                  value={formData.currentSession.stream}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Class *</span>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Section</span>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Roll No.</span>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Semester</span>
                <input
                  type="text"
                  name="currentSession.semester"
                  value={formData.currentSession.semester}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Fee Group</span>
                <input
                  type="text"
                  name="currentSession.feeGroup"
                  value={formData.currentSession.feeGroup}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">House</span>
                <input
                  type="text"
                  name="currentSession.house"
                  value={formData.currentSession.house}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Registration No</span>
                <input
                  type="text"
                  name="academic.registrationNo"
                  value={formData.academic.registrationNo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Previous School</span>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
      ),
      
      // Step 3: Contact & Transport
      3: (
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Mobile Number *</span>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Student Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Father's Mobile</span>
                <input
                  type="tel"
                  name="father.contactNumber"
                  value={formData.father.contactNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Mother's Mobile</span>
                <input
                  type="tel"
                  name="mother.contactNumber"
                  value={formData.mother.contactNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Emergency Contact</span>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Transport Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Transport Mode</span>
                <select
                  name="transport.mode"
                  value={formData.transport.mode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Mode</option>
                  <option value="school-bus">School Bus</option>
                  <option value="own">Own Transport</option>
                  <option value="public">Public Transport</option>
                  <option value="walking">Walking</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Area</span>
                <input
                  type="text"
                  name="transport.area"
                  value={formData.transport.area}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Stand</span>
                <input
                  type="text"
                  name="transport.stand"
                  value={formData.transport.stand}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Route</span>
                <input
                  type="text"
                  name="transport.route"
                  value={formData.transport.route}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Driver</span>
                <input
                  type="text"
                  name="transport.driver"
                  value={formData.transport.driver}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
      ),
      
      // Step 4: Address
      4: (
        <div className="space-y-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Permanent Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block mb-4">
              <span className="text-gray-700">Address</span>
              <textarea
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">House/Flat No.</span>
              <input
                type="text"
                name="address.houseNo"
                value={formData.address.houseNo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">City *</span>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">State *</span>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">PIN Code</span>
              <input
                type="text"
                name="address.pinCode"
                value={formData.address.pinCode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      ),
      
      // Step 5: Parents & Guardian
      5: (
        <div className="space-y-8">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">Father's Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Name *</span>
                <input
                  type="text"
                  name="father.name"
                  value={formData.father.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Qualification</span>
                <input
                  type="text"
                  name="father.qualification"
                  value={formData.father.qualification}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Occupation</span>
                <input
                  type="text"
                  name="father.occupation"
                  value={formData.father.occupation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Email</span>
                <input
                  type="email"
                  name="father.email"
                  value={formData.father.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Aadhar Card No</span>
                <input
                  type="text"
                  name="father.aadhaarNo"
                  value={formData.father.aadhaarNo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Annual Income</span>
                <input
                  type="text"
                  name="father.annualIncome"
                  value={formData.father.annualIncome}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Is Campus Employee</span>
                <select
                  name="father.isCampusEmployee"
                  value={formData.father.isCampusEmployee}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">Mother's Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Name *</span>
                <input
                  type="text"
                  name="mother.name"
                  value={formData.mother.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Qualification</span>
                <input
                  type="text"
                  name="mother.qualification"
                  value={formData.mother.qualification}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Occupation</span>
                <input
                  type="text"
                  name="mother.occupation"
                  value={formData.mother.occupation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Email</span>
                <input
                  type="email"
                  name="mother.email"
                  value={formData.mother.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Aadhar Card No</span>
                <input
                  type="text"
                  name="mother.aadhaarNo"
                  value={formData.mother.aadhaarNo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Annual Income</span>
                <input
                  type="text"
                  name="mother.annualIncome"
                  value={formData.mother.annualIncome}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Is Campus Employee</span>
                <select
                  name="mother.isCampusEmployee"
                  value={formData.mother.isCampusEmployee}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">Guardian Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Guardian Name</span>
                <input
                  type="text"
                  name="guardian.name"
                  value={formData.guardian.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Guardian Address</span>
                <textarea
                  name="guardian.address"
                  value={formData.guardian.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Guardian Mobile</span>
                <input
                  type="tel"
                  name="guardian.contactNumber"
                  value={formData.guardian.contactNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
      ),
      
      // Step 6: Document Upload
      6: (
        <div className="space-y-8">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Document Upload</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Student Image</span>
              <input
                type="file"
                name="studentImage"
                onChange={(e) => handleFileChange(e, 'studentImage')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="image/*"
              />
              {formData.documents.studentImage && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>

            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Father Image</span>
              <input
                type="file"
                name="fatherImage"
                onChange={(e) => handleFileChange(e, 'fatherImage')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="image/*"
              />
              {formData.documents.fatherImage && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
            
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Mother Image</span>
              <input
                type="file"
                name="motherImage"
                onChange={(e) => handleFileChange(e, 'motherImage')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="image/*"
              />
              {formData.documents.motherImage && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
            
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Guardian Image</span>
              <input
                type="file"
                name="guardianImage"
                onChange={(e) => handleFileChange(e, 'guardianImage')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="image/*"
              />
              {formData.documents.guardianImage && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
            
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Signature</span>
              <input
                type="file"
                name="signature"
                onChange={(e) => handleFileChange(e, 'signature')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="image/*"
              />
              {formData.documents.signature && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
            
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Father Aadhar Card</span>
              <input
                type="file"
                name="fatherAadhar"
                onChange={(e) => handleFileChange(e, 'fatherAadhar')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="application/pdf,image/*"
              />
              {formData.documents.fatherAadhar && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
            
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Mother Aadhar Card</span>
              <input
                type="file"
                name="motherAadhar"
                onChange={(e) => handleFileChange(e, 'motherAadhar')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="application/pdf,image/*"
              />
              {formData.documents.motherAadhar && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
            
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Birth Certificate</span>
              <input
                type="file"
                name="birthCertificate"
                onChange={(e) => handleFileChange(e, 'birthCertificate')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="application/pdf,image/*"
              />
              {formData.documents.birthCertificate && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
            
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Migration Certificate</span>
              <input
                type="file"
                name="migrationCertificate"
                onChange={(e) => handleFileChange(e, 'migrationCertificate')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="application/pdf,image/*"
              />
              {formData.documents.migrationCertificate && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
            
            <div className="block mb-4">
              <span className="text-gray-700 block mb-2">Aadhar Card</span>
              <input
                type="file"
                name="aadhaarCard"
                onChange={(e) => handleFileChange(e, 'aadhaarCard')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="application/pdf,image/*"
              />
              {formData.documents.aadhaarCard && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      
      // Step 7: Other Details
      7: (
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Other Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">Aadhar Card No</span>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Belong to BPL</span>
                <select
                  name="other.belongToBPL"
                  value={formData.other.belongToBPL}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Minority</span>
                <select
                  name="other.minority"
                  value={formData.other.minority}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Type of Disability</span>
                <input
                  type="text"
                  name="other.disability"
                  value={formData.other.disability}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Bank Account No</span>
                <input
                  type="text"
                  name="other.accountNo"
                  value={formData.other.accountNo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Bank</span>
                <input
                  type="text"
                  name="other.bank"
                  value={formData.other.bank}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">IFSC Code</span>
                <input
                  type="text"
                  name="other.ifscCode"
                  value={formData.other.ifscCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Medium of Instruction</span>
                <select
                  name="other.medium"
                  value={formData.other.medium}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Medium</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Last Year Result</span>
                <input
                  type="text"
                  name="other.lastYearResult"
                  value={formData.other.lastYearResult}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Single Parent</span>
                <select
                  name="other.singleParent"
                  value={formData.other.singleParent}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Only Child</span>
                <select
                  name="other.onlyChild"
                  value={formData.other.onlyChild}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Only Girl Child</span>
                <select
                  name="other.onlyGirlChild"
                  value={formData.other.onlyGirlChild}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Adopted Child</span>
                <select
                  name="other.adoptedChild"
                  value={formData.other.adoptedChild}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Sibling Admission No</span>
                <input
                  type="text"
                  name="other.siblingAdmissionNo"
                  value={formData.other.siblingAdmissionNo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Transfer Case</span>
                <select
                  name="other.transferCase"
                  value={formData.other.transferCase}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Living With</span>
                <select
                  name="other.livingWith"
                  value={formData.other.livingWith}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="parents">Both Parents</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Mother Tongue</span>
                <input
                  type="text"
                  name="other.motherTongue"
                  value={formData.other.motherTongue}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Nationality</span>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Admission Type</span>
                <select
                  name="other.admissionType"
                  value={formData.other.admissionType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="old">Old</option>
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">UDISE NO</span>
                <input
                  type="text"
                  name="other.udiseNo"
                  value={formData.other.udiseNo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Last Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block mb-4">
                <span className="text-gray-700">School</span>
                <input
                  type="text"
                  name="lastEducation.school"
                  value={formData.lastEducation.school}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Address</span>
                <textarea
                  name="lastEducation.address"
                  value={formData.lastEducation.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">TC Date</span>
                <input
                  type="date"
                  name="lastEducation.tcDate"
                  value={formData.lastEducation.tcDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Previous Class</span>
                <input
                  type="text"
                  name="lastEducation.prevClass"
                  value={formData.lastEducation.prevClass}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">CGPA/Percentage</span>
                <input
                  type="text"
                  name="lastEducation.percentage"
                  value={formData.lastEducation.percentage}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Attendance</span>
                <input
                  type="text"
                  name="lastEducation.attendance"
                  value={formData.lastEducation.attendance}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Extra Activities</span>
                <textarea
                  name="lastEducation.extraActivity"
                  value={formData.lastEducation.extraActivity}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </label>
            </div>
          </div>
        </div>
      )
    };

    return formSections[currentStep] || <div>Step not found</div>;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Student Registration Form</h2>
      
      {renderProgressBar()}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          Student registered successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {renderForm()}
        
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;