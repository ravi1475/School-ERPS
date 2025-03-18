import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { 
  StudentFormData, 
  Documents, 
  UseStudentRegistrationReturn, 
  Step 
} from './StudentFormTypes';
import { validateStep, validateForm, hasValidationErrors } from './StudentFormValidation';
import { STUDENT_API, handleApiResponse } from '../../config/api';

/**
 * Custom hook for managing student registration form state and validation
 */
export const useStudentRegistration = (): UseStudentRegistrationReturn => {
  // Form steps
  const steps: Step[] = [
    { id: 1, title: 'Basic Details', icon: '👤' },
    { id: 2, title: 'Academic', icon: '📚' },
    { id: 3, title: 'Contact', icon: '📱' },
    { id: 4, title: 'Address', icon: '🏠' },
    { id: 5, title: 'Parents', icon: '👨‍👩‍👦' },
    { id: 6, title: 'Documents', icon: '📄' },
    { id: 7, title: 'Other', icon: '✅' }
  ];

  // Initial form state
  const initialFormData: StudentFormData = {
    branchName: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    penNo: '',
    gender: '',
    bloodGroup: '',
    nationality: '',
    religion: '',
    category: '',
    caste: '',
    aadhaarNumber: '',
    mobileNumber: '',
    email: '',
    emergencyContact: '',
    admissionNo: '',
    studentId: '',
    rollNumber: '',
    className: '',
    section: '',
    stream: '',
    semester: '',
    admissionDate: new Date().toISOString().split('T')[0],
    previousSchool: '',
    address: {
      houseNo: '',
      street: '',
      city: '',
      state: '',
      pinCode: '',
      permanentHouseNo: '',
      permanentStreet: '',
      permanentCity: '',
      permanentState: '',
      permanentPinCode: '',
      sameAsPresentAddress: false
    },
    father: {
      name: '',
      qualification: '',
      occupation: '',
      contactNumber: '',
      email: '',
      aadhaarNo: '',
      annualIncome: '',
      isCampusEmployee: 'no'
    },
    mother: {
      name: '',
      qualification: '',
      occupation: '',
      contactNumber: '',
      email: '',
      aadhaarNo: '',
      annualIncome: '',
      isCampusEmployee: 'no'
    },
    guardian: {
      name: '',
      address: '',
      contactNumber: ''
    },
    academic: {
      registrationNo: ''
    },
    admitSession: {
      group: '',
      stream: '',
      class: '',
      section: '',
      rollNo: '',
      semester: '',
      feeGroup: '',
      house: ''
    },
    currentSession: {
      group: '',
      stream: '',
      class: '',
      section: '',
      rollNo: '',
      semester: '',
      feeGroup: '',
      house: ''
    },
    transport: {
      mode: '',
      area: '',
      stand: '',
      route: '',
      driver: '',
      pickupLocation: '',
      dropLocation: ''
    },
    documents: {
      studentImage: null,
      fatherImage: null,
      motherImage: null,
      guardianImage: null,
      signature: null,
      parentSignature: null,
      fatherAadhar: null,
      motherAadhar: null,
      birthCertificate: null,
      migrationCertificate: null,
      aadhaarCard: null,
      affidavitCertificate: null,
      incomeCertificate: null,
      addressProof1: null,
      addressProof2: null
    },
    lastEducation: {
      school: '',
      address: '',
      tcDate: '',
      prevClass: '',
      percentage: '',
      attendance: '',
      extraActivity: ''
    },
    other: {
      belongToBPL: 'no',
      minority: 'no',
      disability: '',
      accountNo: '',
      bank: '',
      ifscCode: '',
      medium: '',
      lastYearResult: '',
      singleParent: 'no',
      onlyChild: 'no',
      onlyGirlChild: 'no',
      adoptedChild: 'no',
      siblingAdmissionNo: '',
      transferCase: 'no',
      livingWith: '',
      motherTongue: '',
      admissionType: 'new',
      udiseNo: ''
    }
  };

  // Form state management
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /**
   * Updates nested object properties with dot notation
   * @param obj Object to update
   * @param path Path in dot notation (e.g. 'father.name')
   * @param value New value
   * @returns Updated object
   */
  const updateNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const lastObj = keys.reduce((o, k) => {
      if (o[k] === undefined) o[k] = {};
      return o[k];
    }, obj);
    lastObj[lastKey] = value;
    return { ...obj };
  };

  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    
    // Special handling for checkbox inputs
    const isCheckbox = type === 'checkbox';
    const checkboxValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    let updatedFormData;
    
    // Update form data (handle nested properties)
    if (name.includes('.')) {
      updatedFormData = updateNestedValue({ ...formData }, name, isCheckbox ? checkboxValue : value);
    } else {
      updatedFormData = {
        ...formData,
        [name]: isCheckbox ? checkboxValue : value
      };
    }
    
    setFormData(updatedFormData);
    
    // Clear error and success when form is changed
    if (error) setError('');
    if (success) setSuccess(false);
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle file changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, documentType: keyof Documents): void => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
    
    // Clear error and success when form is changed
    if (error) setError('');
    if (success) setSuccess(false);
  };

  // Step navigation with validation
  const nextStep = (): void => {
    // Validate current step
    const errors = validateStep(formData, currentStep);
    
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      setValidationErrors({});
    } else {
      setValidationErrors(errors);
      setError('Please fix the validation errors before proceeding.');
    }
  };

  const prevStep = (): void => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setValidationErrors({});
    setError('');
  };

  // Form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validate all steps before submitting
    const allErrors = { ...validationErrors };
    for (let step = 1; step <= steps.length; step++) {
      const stepErrors = validateStep(formData, step);
      Object.assign(allErrors, stepErrors);
    }
    
    setValidationErrors(allErrors);
    
    if (hasValidationErrors(allErrors)) {
      setError("Please fix all validation errors before submitting.");
      // Scroll to top to show the error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add all text fields, ensuring proper nesting
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'documents') {
          if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              // Skip the sameAsPresentAddress checkbox as it's only for UI
              if (!(key === 'address' && nestedKey === 'sameAsPresentAddress')) {
                // Ensure empty strings are sent for empty fields
                const valueToSend = nestedValue === null || nestedValue === undefined 
                  ? '' 
                  : String(nestedValue);
                formDataToSend.append(`${key}.${nestedKey}`, valueToSend);
              }
            });
          } else {
            // Ensure empty strings are sent for empty fields
            const valueToSend = value === null || value === undefined 
              ? '' 
              : String(value);
            formDataToSend.append(key, valueToSend);
          }
        }
      });
      
      // Add document files
      Object.entries(formData.documents).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(`documents.${key}`, file);
        }
      });
      
      // Add school ID
      formDataToSend.append('schoolId', '1');  // Use the appropriate school ID

      console.log("Sending student data to API");
      
      // For debugging: log all form keys being sent
      console.log("Form data keys:", Array.from(formDataToSend.keys()));
      
      // Make the API call
      const response = await fetch(STUDENT_API.CREATE, {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header when sending FormData
      });

      // Parse response even if it's an error
      const result = await handleApiResponse(response);

      console.log("Server response:", response.status, result);

      if (!response.ok) {
        // Extract detailed error message if available
        const errorMessage = 
          result.message || 
          result.error || 
          (result.errors && Array.isArray(result.errors) ? 
            result.errors.map((e: any) => e.msg).join(", ") :
            `Server error (${response.status}): Failed to register student`);
        
        throw new Error(errorMessage);
      }

      console.log("Student registered successfully:", result);
      setSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error("Form submission error:", error);
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      // Scroll to top to show the error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate age whenever date of birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      calculateAge();
    }
  }, [formData.dateOfBirth]);
  
  // Copy present address to permanent address when sameAsPresentAddress is true
  useEffect(() => {
    if (formData.address.sameAsPresentAddress) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          permanentHouseNo: prev.address.houseNo,
          permanentStreet: prev.address.street,
          permanentCity: prev.address.city,
          permanentState: prev.address.state,
          permanentPinCode: prev.address.pinCode
        }
      }));
    }
  }, [formData.address.sameAsPresentAddress, formData.address.houseNo, 
      formData.address.street, formData.address.city, formData.address.state, 
      formData.address.pinCode]);

  // Calculate age based on date of birth
  const calculateAge = () => {
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      
      // Adjust age if birthday hasn't occurred yet this year
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age >= 0) {
        setFormData(prev => ({
          ...prev,
          age: age.toString()
        }));
      }
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    error,
    success,
    steps,
    validationErrors,
    handleChange,
    handleFileChange,
    handleSubmit,
    nextStep,
    prevStep,
    calculateAge
  };
}; 