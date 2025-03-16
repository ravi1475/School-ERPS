import { useState, ChangeEvent, FormEvent } from 'react';
import { 
  StudentFormData, 
  Documents, 
  UseStudentRegistrationReturn, 
  Step 
} from './StudentFormTypes';
import { validateStep, validateForm } from './StudentFormValidation';
import { STUDENT_API, handleApiResponse } from '../../config/api';

/**
 * Custom hook for managing student registration form state and validation
 */
export const useStudentRegistration = (): UseStudentRegistrationReturn => {
  // Form steps
  const steps: Step[] = [
    { id: 1, title: 'Basic Info', icon: '👤' },
    { id: 2, title: 'Academic', icon: '🎓' },
    { id: 3, title: 'Contact', icon: '📱' },
    { id: 4, title: 'Address', icon: '🏠' },
    { id: 5, title: 'Parents', icon: '👪' },
    { id: 6, title: 'Documents', icon: '📄' },
    { id: 7, title: 'Other', icon: 'ℹ️' },
  ];

  // Initial form state
  const initialFormData: StudentFormData = {
    // Basic information
    branchName: '',
    admissionNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    admissionDate: new Date().toISOString().split('T')[0], // Today's date
    studentId: '',
    dateOfBirth: '',
    religion: '',
    gender: '',
    bloodGroup: '',
    caste: '',
    
    // Academic information
    admitSession: {
      group: '',
      stream: '',
      class: '',
      section: '',
      rollNo: '',
      semester: '',
      feeGroup: '',
      house: '',
    },
    currentSession: {
      group: '',
      stream: '',
      class: '',
      section: '',
      rollNo: '',
      semester: '',
      feeGroup: '',
      house: '',
    },
    className: '',
    section: '',
    rollNumber: '',
    academic: {
      registrationNo: '',
    },
    previousSchool: '',
    
    // Contact & Transport
    mobileNumber: '',
    email: '',
    emergencyContact: '',
    transport: {
      mode: '',
      area: '',
      stand: '',
      route: '',
      driver: '',
    },
    
    // Address
    address: {
      street: '',
      houseNo: '',
      city: '',
      state: '',
      pinCode: '',
    },
    
    // Parents & Guardian
    father: {
      name: '',
      qualification: '',
      occupation: '',
      email: '',
      contactNumber: '',
      aadhaarNo: '',
      annualIncome: '',
      isCampusEmployee: 'no',
    },
    mother: {
      name: '',
      qualification: '',
      occupation: '',
      email: '',
      contactNumber: '',
      aadhaarNo: '',
      annualIncome: '',
      isCampusEmployee: 'no',
    },
    guardian: {
      name: '',
      address: '',
      contactNumber: '',
    },
    
    // Documents
    documents: {
      studentImage: null,
      fatherImage: null,
      motherImage: null,
      guardianImage: null,
      signature: null,
      fatherAadhar: null,
      motherAadhar: null,
      birthCertificate: null,
      migrationCertificate: null,
      aadhaarCard: null,
    },
    
    // Other details
    aadhaarNumber: '',
    nationality: 'Indian',
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
      udiseNo: '',
    },
    lastEducation: {
      school: '',
      address: '',
      tcDate: '',
      prevClass: '',
      percentage: '',
      attendance: '',
      extraActivity: '',
    },
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
    const { name, value } = e.target;
    
    let updatedFormData;
    
    // Update form data (handle nested properties)
    if (name.includes('.')) {
      updatedFormData = updateNestedValue({ ...formData }, name, value);
    } else {
      updatedFormData = {
        ...formData,
        [name]: value
      };
    }
    
    setFormData(updatedFormData);
    
    // Clear error and success when form is changed
    if (error) setError('');
    if (success) setSuccess(false);
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
    
    // Validate all fields before submission
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix all validation errors before submitting.');
      return;
    }
    
    // Explicitly check for the required fields that might not be caught by validation
    const requiredFields = {
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'admissionNo': 'Admission Number',
      'dateOfBirth': 'Date of Birth',
      'gender': 'Gender',
      'mobileNumber': 'Mobile Number',
      'className': 'Class',
      'address.city': 'City',
      'address.state': 'State',
      'father.name': 'Father\'s Name',
      'mother.name': 'Mother\'s Name'
    };
    
    const missingFields: string[] = [];
    
    Object.entries(requiredFields).forEach(([field, label]) => {
      let value;
      
      if (field.includes('.')) {
        // Handle nested fields
        const parts = field.split('.');
        let obj: any = {...formData}; // Use any type for dynamic access
        for (const part of parts) {
          if (!obj || obj[part] === undefined || obj[part] === null || obj[part] === '') {
            missingFields.push(label);
            break;
          }
          obj = obj[part];
        }
      } else {
        // Handle top-level fields
        // Use type assertion to allow string indexing
        value = (formData as any)[field];
        if (value === undefined || value === null || value === '') {
          missingFields.push(label);
        }
      }
    });
    
    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setValidationErrors({});
    
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Log form submission attempt
      console.log('Starting student registration submission');
      
      // Make sure dateOfBirth is properly formatted - it's required by the schema
      if (!formData.dateOfBirth) {
        throw new Error('Date of Birth is required');
      }
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'documents') {
          if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue !== undefined && nestedValue !== null) {
                formDataToSend.append(`${key}.${nestedKey}`, String(nestedValue));
              } else {
                // Handle null or undefined values by sending empty string
                formDataToSend.append(`${key}.${nestedKey}`, '');
              }
            });
          } else if (value !== undefined && value !== null) {
            formDataToSend.append(key, String(value));
          } else {
            // Handle null or undefined values by sending empty string
            formDataToSend.append(key, '');
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
      
      // Fix for missing fields: add direct mappings for required fields
      formDataToSend.append('fatherName', formData.father.name || '');
      formDataToSend.append('motherName', formData.mother.name || '');
      formDataToSend.append('city', formData.address.city || '');
      formDataToSend.append('state', formData.address.state || '');
      
      // Log the API endpoint being used
      console.log('Submitting to endpoint:', STUDENT_API.CREATE);
      console.log('Form data keys being sent:', Array.from(formDataToSend.keys()));
      
      // Make the API call with explicit mode and credentials
      const response = await fetch(STUDENT_API.CREATE, {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header when sending FormData
        mode: 'cors',
        credentials: 'include',
      });

      console.log('Server response status:', response.status);
      
      // Parse response using the helper function
      const result = await handleApiResponse(response);
      
      console.log('Registration successful, server response:', result);

      // Store the response data in localStorage for potential use in printing or viewing details
      if (result.data && result.data.id) {
        localStorage.setItem('lastRegisteredStudent', JSON.stringify(result.data));
      }

      setSuccess(true);
      
      // Display notification/alert and scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      console.error('Registration submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during submission. Please try again.';
      setError(errorMessage);
      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
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
    prevStep
  };
}; 