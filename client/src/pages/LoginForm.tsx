import React, { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface LoginFormProps {
  onLoginSuccess: (token: string, role: string) => void;
}

interface FormData {
  email: string;
  password: string;
}

type Role = 'admin' | 'school' | 'teacher';

const demoAccounts = {
  admin: { email: 'Ram@gmail.com', password: 'Ram@1234' },
  school: { email: 'Ram2@gmail.com', password: 'Ram@1234' },
  teacher: { email: 'Ram3@gmail.com', password: 'Ram@1234' },
};

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loginError, setLoginError] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  // Pre-fill form data when role changes
  useEffect(() => {
    if (selectedRole) {
      setFormData({
        email: demoAccounts[selectedRole].email,
        password: demoAccounts[selectedRole].password,
      });
    }
  }, [selectedRole]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear login error when user types
    if (loginError) {
      setLoginError('');
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep('credentials');
  };

  const handleBackToRoles = () => {
    setStep('role');
    setSelectedRole(null);
    setLoginError('');
  };

  // Function to handle successful login and navigation
  const handleLoginSuccess = (token: string, role: Role) => {
    // Call the provided callback for parent component state
    onLoginSuccess(token, role);
    
    // Navigate based on role
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'school':
        navigate('/school');
        break;
      case 'teacher':
        navigate('/teacher');
        break;
      default:
        // Fallback
        navigate('/dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!validateForm() || !selectedRole) return;
    
    setIsLoading(true);
    
    // Check if using demo credentials
    const selectedDemoAccount = demoAccounts[selectedRole];
    if (formData.email === selectedDemoAccount.email && 
        formData.password === selectedDemoAccount.password) {
      
      // Simulate loading for better UX
      setTimeout(() => {
        // Mock successful login with demo token
        const mockToken = `demo-token-${selectedRole}-${Date.now()}`;
        handleLoginSuccess(mockToken, selectedRole);
        setIsLoading(false);
      }, 800);
    } else {
      // For non-demo credentials, still try the API
      setSubmitForm(true);
    }
  };

  // Update useEffect to handle non-demo credentials
  useEffect(() => {
    if (!submitForm || !selectedRole) return;

    setIsLoading(true);

    console.log(`Attempting to call API: http://localhost:5000/api/${selectedRole}Login`);
    fetch(`http://localhost:5000/api/${selectedRole}Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.token) {
          handleLoginSuccess(data.data.token, selectedRole);
        } else {
          setLoginError('Invalid email or password');
        }
      })
      .catch(error => {
        console.error('Login failed', error);
        setLoginError('Backend connection failed. Try using the demo credentials.');
      })
      .finally(() => {
        setIsLoading(false);
        setSubmitForm(false);
      });
  }, [submitForm, selectedRole, formData, onLoginSuccess]);

  const roleOptions = [
    { role: 'admin', title: 'Administrator', description: 'Full system access and control', color: 'bg-purple-600 hover:bg-purple-700' },
    { role: 'school', title: 'School', description: 'Manage school resources and students', color: 'bg-blue-600 hover:bg-blue-700' },
    { role: 'teacher', title: 'Teacher', description: 'Access classes and student information', color: 'bg-green-600 hover:bg-green-700' },
  ];

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {step === 'role' ? 'Select Your Role' : `Sign in as ${selectedRole?.charAt(0).toUpperCase() + selectedRole?.slice(1)}`}
      </h2>

      {loginError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {loginError}
        </div>
      )}

      {step === 'role' ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {roleOptions.map((option) => (
            <motion.button
              key={option.role}
              onClick={() => handleRoleSelect(option.role as Role)}
              className={`w-full ${option.color} text-white p-4 rounded-lg flex items-center justify-between transition-all duration-300 transform hover:scale-102 hover:shadow-md`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg">{option.title}</span>
                <span className="text-sm opacity-90">{option.description}</span>
              </div>
              <FiUser className="text-xl" />
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FiMail />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FiLock />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={handleBackToRoles}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>

            <motion.button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${selectedRole === 'admin' ? 'bg-purple-600 hover:bg-purple-700' :
                selectedRole === 'school' ? 'bg-blue-600 hover:bg-blue-700' :
                  'bg-green-600 hover:bg-green-700'
                } text-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </div>
        </motion.form>
      )}

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="p-2 border border-purple-200 rounded-md bg-purple-50">
            <p className="font-bold text-purple-700">Admin</p>
            <p>{demoAccounts.admin.email}</p>
            <p>{demoAccounts.admin.password}</p>
          </div>
          <div className="p-2 border border-blue-200 rounded-md bg-blue-50">
            <p className="font-bold text-blue-700">School</p>
            <p>{demoAccounts.school.email}</p>
            <p>{demoAccounts.school.password}</p>
          </div>
          <div className="p-2 border border-green-200 rounded-md bg-green-50">
            <p className="font-bold text-green-700">Teacher</p>
            <p>{demoAccounts.teacher.email}</p>
            <p>{demoAccounts.teacher.password}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

