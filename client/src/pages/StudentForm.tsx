import React, { useState } from 'react';

const StudentRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    nationality: '',
    religion: '',
    category: '',
    aadhaarNumber: '',
    mobileNumber: '',
    email: '',
    emergencyContact: '',
    admissionNo: '',
    rollNumber: '',
    className: '',
    section: '',
    admissionDate: new Date().toISOString().split('T')[0],
    previousSchool: '',
    address: {
      houseNo: '',
      street: '',
      city: '',
      state: '',
      pinCode: ''
    },
    father: {
      name: '',
      occupation: '',
      contactNumber: '',
      email: ''
    },
    mother: {
      name: '',
      occupation: '',
      contactNumber: '',
      email: ''
    }
  });

  const steps = [
    { id: 1, title: 'Basic Details', icon: '👤' },
    { id: 2, title: 'Contact', icon: '📱' },
    { id: 3, title: 'Academic', icon: '📚' },
    { id: 4, title: 'Address', icon: '🏠' },
    { id: 5, title: 'Parents', icon: '👨‍👩‍👦' }
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as Record<string, any>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const validateCurrentStep = () => {
    switch(currentStep) {
      case 1:
        if (!formData.firstName) return "First name is required";
        if (!formData.lastName) return "Last name is required";
        if (!formData.dateOfBirth) return "Date of birth is required";
        if (!formData.gender) return "Gender is required";
        break;
      case 2:
        if (!formData.mobileNumber) return "Mobile number is required";
        break;
      case 3:
        if (!formData.admissionNo) return "Admission number is required";
        if (!formData.className) return "Class is required";
        break;
      case 4:
        if (!formData.address.city) return "City is required";
        if (!formData.address.state) return "State is required";
        break;
      case 5:
        if (!formData.father.name) return "Father's name is required";
        if (!formData.mother.name) return "Mother's name is required";
        break;
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Format dates for backend
      const formattedDateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null;
      const formattedAdmissionDate = formData.admissionDate ? new Date(formData.admissionDate).toISOString() : new Date().toISOString();
      
      // Map form data to API expected format
      const studentData = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName?.trim() || null,
        lastName: formData.lastName.trim(),
        dateOfBirth: formattedDateOfBirth,
        gender: formData.gender, 
        bloodGroup: formData.bloodGroup || null,
        nationality: formData.nationality?.trim() || null,
        religion: formData.religion?.trim() || null,
        category: formData.category?.trim() || null,
        aadhaarNumber: formData.aadhaarNumber?.trim() || null,
        mobileNumber: formData.mobileNumber?.trim(),
        email: formData.email?.trim() || null,
        emergencyContact: formData.emergencyContact?.trim() || null,
        admissionNo: formData.admissionNo.trim(),
        rollNumber: formData.rollNumber?.trim() || null,
        className: formData.className.trim(),
        section: formData.section?.trim() || null,
        admissionDate: formattedAdmissionDate,
        previousSchool: formData.previousSchool?.trim() || null,
        
        // Address fields flattened
        houseNo: formData.address.houseNo?.trim() || null,
        street: formData.address.street?.trim() || null,
        city: formData.address.city.trim(),
        state: formData.address.state.trim(),
        pinCode: formData.address.pinCode?.trim() || null,
        
        // Parent fields flattened
        fatherName: formData.father.name.trim(),
        fatherOccupation: formData.father.occupation?.trim() || null,
        fatherContact: formData.father.contactNumber?.trim() || null,
        fatherEmail: formData.father.email?.trim() || null,
        motherName: formData.mother.name.trim(),
        motherOccupation: formData.mother.occupation?.trim() || null,
        motherContact: formData.mother.contactNumber?.trim() || null,
        motherEmail: formData.mother.email?.trim() || null,
        
        // Add school ID - this is what was missing!
        schoolId: 1  // Use the appropriate school ID for your system
      };

      console.log("Sending student data to API:", studentData);
      
      // Make the API call
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      // Parse response even if it's an error
      const result = await response.json().catch(err => {
        console.error("Error parsing response:", err);
        return { message: "Invalid server response" };
      });

      console.log("Server response:", response.status, result);

      if (!response.ok) {
        // Extract detailed error message if available
        const errorMessage = 
          result.message || 
          result.error || 
          result.errors?.map(e => e.msg).join(", ") ||
          `Server error (${response.status}): Failed to register student`;
        
        throw new Error(errorMessage);
      }

      console.log("Student registered successfully:", result);
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        nationality: '',
        religion: '',
        category: '',
        aadhaarNumber: '',
        mobileNumber: '',
        email: '',
        emergencyContact: '',
        admissionNo: '',
        rollNumber: '',
        className: '',
        section: '',
        admissionDate: new Date().toISOString().split('T')[0],
        previousSchool: '',
        address: {
          houseNo: '',
          street: '',
          city: '',
          state: '',
          pinCode: ''
        },
        father: {
          name: '',
          occupation: '',
          contactNumber: '',
          email: ''
        },
        mother: {
          name: '',
          occupation: '',
          contactNumber: '',
          email: ''
        }
      });
      setCurrentStep(1);
      
    } catch (error) {
      console.error("Form submission error:", error);
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };
  
  const prevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

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
      1: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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
          </div>
          <div>
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
          </div>
        </div>
      ),
      2: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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
              <span className="text-gray-700">Category</span>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
          <div>
            <label className="block mb-4">
              <span className="text-gray-700">Aadhaar Number</span>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
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
      ),
      3: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block mb-4">
            <span className="text-gray-700">Admission Number *</span>
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
            <span className="text-gray-700">Roll Number</span>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
      ),
      4: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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
              <span className="text-gray-700">Street Address</span>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
          <div>
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
                <span className="text-gray-700">Contact Number</span>
                <input
                  type="tel"
                  name="father.contactNumber"
                  value={formData.father.contactNumber}
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
            </div>
          </div>
          <div>
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
                <span className="text-gray-700">Contact Number</span>
                <input
                  type="tel"
                  name="mother.contactNumber"
                  value={formData.mother.contactNumber}
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
            </div>
          </div>
        </div>
      )
    };

    return formSections[currentStep];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-8">Student Registration</h1>
        {renderProgressBar()}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">Student registration successful!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            {currentStep === steps.length ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next Step
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;