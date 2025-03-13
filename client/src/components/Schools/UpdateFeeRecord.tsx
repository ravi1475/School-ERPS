import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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

interface UpdateFeeRecordProps {
  isOpen: boolean;
  onClose: () => void;
  record: FeeRecord | null;
  onUpdate: (updatedRecord: FeeRecord) => void;
  classOptions: string[];
  sectionOptions: string[];
}

const API_URL = 'http://localhost:5000/api/fees';

const UpdateFeeRecord: React.FC<UpdateFeeRecordProps> = ({
  isOpen,
  onClose,
  record,
  onUpdate,
  classOptions,
  sectionOptions
}) => {
  const [formData, setFormData] = useState<FeeRecord>({
    id: '',
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalAmountPaid, setOriginalAmountPaid] = useState(0);
  
  // Initialize form data when record changes
  useEffect(() => {
    if (record) {
      setFormData({...record});
      setOriginalAmountPaid(record.amountPaid - record.feeAmount); // Store the original amount paid without current payment
    }
  }, [record]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: ['feeAmount', 'totalFees', 'amountPaid'].includes(name) ? parseFloat(value) || 0 : value
      };

      // When feeAmount changes, automatically update amountPaid
      if (name === 'feeAmount') {
        const currentPayment = parseFloat(value) || 0;
        updatedData.amountPaid = originalAmountPaid + currentPayment;
      }

      // Auto-calculate status based on totalFees and amountPaid
      if (['totalFees', 'amountPaid', 'feeAmount'].includes(name) && updatedData.totalFees > 0) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create payload with proper data formatting
      const payload = {
        ...formData,
        // Ensure numbers are sent as numbers
        totalFees: parseFloat(formData.totalFees.toString()),
        amountPaid: parseFloat(formData.amountPaid.toString()),
        feeAmount: parseFloat(formData.feeAmount.toString()),
        // Keep date in YYYY-MM-DD format
        paymentDate: formData.paymentDate,
        // Include schoolId if needed by your API
        schoolId: 1 // Use the appropriate school ID
      };
      
      console.log('Updating fee record:', payload);
      
      // Call API to update the record
      const response = await axios.put(`${API_URL}/${formData.id}`, payload);
      
      if (response.data.success) {
        // Call the update function from parent component
        onUpdate(formData);
        onClose();
      } else {
        setError(`Failed to update: ${response.data.message}`);
      }
    } catch (err: any) {
      console.error('Error updating fee record:', err);
      // Enhanced error logging
      if (err.response) {
        console.error('Server response:', err.response.data);
        setError(`Server error: ${err.response.data.message || 'Unknown error'}`);
      } else {
        setError(`Failed to update fee record: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Update Fee Record</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previously Paid Amount <span className="text-xs text-gray-500">(excluding current payment)</span></label>
                  <input
                    disabled
                    type="number"
                    value={originalAmountPaid}
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Payment Amount</label>
                  <input
                    type="number"
                    name="feeAmount"
                    value={formData.feeAmount}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount Paid</label>
                  <input
                    disabled
                    type="number"
                    value={formData.amountPaid}
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                    min="0"
                    step="0.01"
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
                    <option value="Cheque">Cheque</option>
                    <option value="Online">Online Transfer</option>
                    <option value="Card">Card Payment</option>
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

                <div className="md:col-span-2 mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateFeeRecord;