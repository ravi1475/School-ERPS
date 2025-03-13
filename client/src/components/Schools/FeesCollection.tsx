import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import UpdateFeeRecord from './UpdateFeeRecord'; // Make sure this component is imported

// Types
interface FeeRecord {
  id: string;
  admissionNumber: string;
  studentName: string;
  class: string;
  section: string;
  totalFees: number;
  amountPaid: number;
  feeAmount: number;
  paymentDate: string;
  paymentMode: string;
  receiptNumber: string;
  status: 'Paid' | 'Pending' | 'Partial';
}

const API_URL = 'http://localhost:5000/api/fees';

const FeeCollectionApp: React.FC = () => {
  // State
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [formData, setFormData] = useState<Omit<FeeRecord, 'id'>>({
    admissionNumber: '',
    studentName: '',
    class: '',
    section: '',
    totalFees: 0,
    amountPaid: 0,
    feeAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    receiptNumber: '',
    status: 'Paid'
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [sortField, setSortField] = useState<keyof FeeRecord>('paymentDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Update functionality
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // Add this state to track previous fee amount
  const [previousFeeAmount, setPreviousFeeAmount] = useState(0);

  // Class options with Nursery and 1-12
  const classOptions = ['Nursery', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  
  // Section options A to D
  const sectionOptions = ['A', 'B', 'C', 'D'];
  
  // Load data from backend
  useEffect(() => {
    fetchFeeRecords();
  }, []);

  // Fetch records from backend
  const fetchFeeRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(API_URL);
      if (response.data.success) {
        // Transform dates to string format for the component
        const formattedRecords = response.data.data.map((record: any) => ({
          ...record,
          paymentDate: new Date(record.paymentDate).toISOString().split('T')[0]
        }));
        setRecords(formattedRecords);
      } else {
        setError('Failed to fetch fee records: ' + response.data.message);
      }
      
    } catch (err: any) {
      console.error('Error fetching fee records:', err);
      setError(`Failed to fetch fee records: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: ['feeAmount', 'totalFees', 'amountPaid'].includes(name) ? parseFloat(value) || 0 : value
      };

      // When feeAmount changes, correctly update amountPaid
      if (name === 'feeAmount') {
        const currentPayment = parseFloat(value) || 0;
        // Remove the previous fee amount and add the new one
        updatedData.amountPaid = prev.amountPaid - previousFeeAmount + currentPayment;
        // Update the previous fee amount for next change
        setPreviousFeeAmount(currentPayment);
      }

      // Auto-calculate status based on totalFees and amountPaid
      if (['totalFees', 'amountPaid', 'feeAmount'].includes(name) && updatedData.totalFees > 0) {
        // For status calculation, we need the total amount that will be paid
        const totalPaid = updatedData.amountPaid;
        
        if (totalPaid >= updatedData.totalFees) {
          updatedData.status = 'Paid';
        } else if (totalPaid > 0) {
          updatedData.status = 'Partial';
        } else {
          updatedData.status = 'Pending';
        }
      }

      return updatedData;
    });
  };

  // When the form is reset, also reset the previous fee amount
  const resetForm = () => {
    setFormData({
      admissionNumber: '',
      studentName: '',
      class: '',
      section: '',
      totalFees: 0,
      amountPaid: 0,
      feeAmount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash',
      receiptNumber: '',
      status: 'Paid'
    });
    setPreviousFeeAmount(0); // Reset previous fee amount
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create payload with correct data types as expected by the API
      const payload = {
        admissionNumber: formData.admissionNumber.trim(),
        studentName: formData.studentName.trim(),
        class: formData.class,
        section: formData.section,
        totalFees: Number(formData.totalFees),
        amountPaid: Number(formData.amountPaid),
        feeAmount: Number(formData.feeAmount),
        paymentDate: formData.paymentDate.toString(),
        paymentMode: formData.paymentMode,
        receiptNumber: formData.receiptNumber.trim(),
        status: formData.status,
        schoolId: 1  // Make sure this matches your database schema
      };

    
      
      console.log('Sending data to API:', payload);
      
      // Call the API to create a new fee record
      const response = await axios.post(API_URL, payload);
      
      if (response.data.success) {
        // Format the date for the UI
        const savedRecord = {
          ...response.data.data,
          paymentDate: new Date(response.data.data.paymentDate).toISOString().split('T')[0]
        };
        
        setRecords(prev => [savedRecord, ...prev]);
        showNotification('Fee record added successfully!', 'success');
        
        // Use the resetForm function to reset the form
        resetForm();
        
        // Close form with animation
        setIsFormVisible(false);
      } else {
        showNotification(`Failed to add record: ${response.data.message}`, 'error');
      }
    } catch (err: any) {
      console.error('Error adding fee record:', err);
      // Enhanced error logging
      if (err.response) {
        console.error('Server response:', err.response.data);
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          // Show detailed validation errors
          showNotification(`Validation errors: ${err.response.data.errors.join(', ')}`, 'error');
        } else {
          showNotification(`Server error: ${err.response.data.message || 'Unknown error'}`, 'error');
        }
      } else {
        showNotification(`Failed to add fee record: ${err.message || 'Unknown error'}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to open the update modal with selected record
  const handleUpdateClick = (record: FeeRecord) => {
    setSelectedRecord(record);
    setIsUpdateModalOpen(true);
  };

  // Handle record update
  const handleRecordUpdate = async (updatedRecord: FeeRecord) => {
    try {
      setIsLoading(true);
      
      // Create payload with proper data formatting
      const payload = {
        admissionNumber: updatedRecord.admissionNumber.trim(),
        studentName: updatedRecord.studentName.trim(),
        class: updatedRecord.class,
        section: updatedRecord.section,
        totalFees: Number(updatedRecord.totalFees),
        amountPaid: Number(updatedRecord.amountPaid),
        feeAmount: Number(updatedRecord.feeAmount),
        paymentDate: updatedRecord.paymentDate,
        paymentMode: updatedRecord.paymentMode,
        receiptNumber: updatedRecord.receiptNumber.trim(),
        status: updatedRecord.status,
        schoolId: 1
      };
      
      // Log the payload for debugging
      console.log('Updating record with payload:', JSON.stringify(payload, null, 2));
      
      // Call API to update the record
      const response = await axios.put(`${API_URL}/${updatedRecord.id}`, payload);
      
      if (response.data.success) {
        // Rest of your code...
      }
    } catch (err: any) {
      console.error('Error updating fee record:', err);
      
      // Enhanced error logging with complete details
      if (err.response) {
        console.error('Full server response:', JSON.stringify(err.response.data, null, 2));
        
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          const errorDetails = err.response.data.errors.join(', ');
          console.log('Validation errors:', errorDetails);
          showNotification(`Validation errors: ${errorDetails}`, 'error');
        } else {
          showNotification(`Server error: ${err.response.data.message || 'Unknown error'}`, 'error');
        }
      } else {
        showNotification(`Failed to update fee record: ${err.message || 'Unknown error'}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle record deletion
  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        setIsLoading(true);
        
        // Call API to delete the record
        const response = await axios.delete(`${API_URL}/${id}`);
        
        if (response.data.success) {
          // Remove the record from local state
          setRecords(records.filter(record => record.id !== id));
          showNotification('Fee record deleted successfully!', 'success');
        } else {
          showNotification(`Failed to delete record: ${response.data.message}`, 'error');
        }
      } catch (err: any) {
        console.error('Error deleting fee record:', err);
        showNotification(`Failed to delete fee record: ${err.message || 'Unknown error'}`, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSort = (field: keyof FeeRecord) => {
    setSortDirection(prev => (sortField === field && prev === 'asc' ? 'desc' : 'asc'));
    setSortField(field);
  };

  // Filter and sort records
  const filteredRecords = records
    .filter(record => 
      (record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass === '' || record.class === filterClass) &&
      (filterSection === '' || record.section === filterSection)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  // Render arrow indicator for sorting
  const renderSortArrow = (field: keyof FeeRecord) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  };
    // Continue from previous code...

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Notification component */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Fee Collection</h1>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
          >
            {isFormVisible ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Fee Record
              </>
            )}
          </button>
        </div>
  
        {/* Add new fee form */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Add New Fee Record</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                    <input
                      type="text"
                      name="admissionNumber"
                      value={formData.admissionNumber}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Class</option>
                      {classOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Section</option>
                      {sectionOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Fees</label>
                    <input
                      type="number"
                      name="totalFees"
                      value={formData.totalFees || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount (Current Payment)</label>
                    <input
                      type="number"
                      name="feeAmount"
                      value={formData.feeAmount || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (Total)</label>
                    <input
                      type="number"
                      name="amountPaid"
                      value={formData.amountPaid || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                    </select>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                    <input
                      type="text"
                      name="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Paid">Paid</option>
                      <option value="Partial">Partial</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
  
                  <div className="md:col-span-2 lg:col-span-3 mt-4">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Fee Record'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Filters and search */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or admission number..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Classes</option>
                {classOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Section</label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sections</option>
                {sectionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
  
            <div className="flex items-end">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterClass('');
                  setFilterSection('');
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition duration-300 ease-in-out"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
  
        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
  
        {/* Records table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading && records.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading fee records...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('admissionNumber')}>
                      Adm No {renderSortArrow('admissionNumber')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('studentName')}>
                      Student Name {renderSortArrow('studentName')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('class')}>
                      Class {renderSortArrow('class')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalFees')}>
                      Total Fees {renderSortArrow('totalFees')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('amountPaid')}>
                      Paid {renderSortArrow('amountPaid')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('feeAmount')}>
                      Payment {renderSortArrow('feeAmount')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentDate')}>
                      Date {renderSortArrow('paymentDate')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentMode')}>
                      Mode {renderSortArrow('paymentMode')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                      Status {renderSortArrow('status')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{record.admissionNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.studentName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.class}-{record.section}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{record.totalFees.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{record.amountPaid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{record.feeAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(record.paymentDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.paymentMode}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'Partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateClick(record)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {isLoading ? 'Loading records...' : 'No fee records found.'}
              </p>
            </div>
          )}
        </div>
  
        {/* Update modal */}
        {selectedRecord && (
          <UpdateFeeRecord
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            record={selectedRecord}
            onUpdate={handleRecordUpdate}
            classOptions={classOptions}
            sectionOptions={sectionOptions}
          />
        )}
      </div>
    );
  };
  
  export default FeeCollectionApp;