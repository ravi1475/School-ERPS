import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface CheckRecord {
  id: string;
  checkNumber: string;
  admissionNumber: string;
  studentName: string;
  class: string;
  section: string;
  amount: number;
  issueDate: string;
  bounceDate: string;
  reason: string;
  bankName: string;
  parentContact: string;
  status: 'Pending' | 'Recovered' | 'Legal Action' | 'Written Off';
  recoveryDate: string | null;
  penaltyAmount: number;
  followupNotes: string;
}

const CheckBounceSystem: React.FC = () => {
  // State
  const [records, setRecords] = useState<CheckRecord[]>([]);
  const [formData, setFormData] = useState<Omit<CheckRecord, 'id'>>({
    checkNumber: '',
    admissionNumber: '',
    studentName: '',
    class: '',
    section: '',
    amount: 0,
    issueDate: new Date().toISOString().split('T')[0],
    bounceDate: new Date().toISOString().split('T')[0],
    reason: 'Insufficient Funds',
    bankName: '',
    parentContact: '',
    status: 'Pending',
    recoveryDate: null,
    penaltyAmount: 0,
    followupNotes: ''
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState<keyof CheckRecord>('bounceDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedRecord, setSelectedRecord] = useState<CheckRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [followupNote, setFollowupNote] = useState('');

  // Load initial data (mock - would be from API in production)
  useEffect(() => {
    const mockData: CheckRecord[] = [
      {
        id: '1',
        checkNumber: 'CHK10598',
        admissionNumber: 'ADM001',
        studentName: 'John Doe',
        class: '10',
        section: 'A',
        amount: 5000,
        issueDate: '2025-03-01',
        bounceDate: '2025-03-05',
        reason: 'Insufficient Funds',
        bankName: 'City Bank',
        parentContact: '+91 9876543210',
        status: 'Pending',
        recoveryDate: null,
        penaltyAmount: 250,
        followupNotes: 'Called parent on March 6, promised to pay by March 15.'
      },
      {
        id: '2',
        checkNumber: 'CHK22456',
        admissionNumber: 'ADM018',
        studentName: 'Jane Smith',
        class: '9',
        section: 'B',
        amount: 7500,
        issueDate: '2025-02-15',
        bounceDate: '2025-02-20',
        reason: 'Payment Stopped',
        bankName: 'National Bank',
        parentContact: '+91 8765432109',
        status: 'Recovered',
        recoveryDate: '2025-03-01',
        penaltyAmount: 350,
        followupNotes: 'Sent reminder SMS on Feb 22. Parent visited on March 1 with cash payment including penalty.'
      },
      {
        id: '3',
        checkNumber: 'CHK38761',
        admissionNumber: 'ADM045',
        studentName: 'Sam Wilson',
        class: '11',
        section: 'C',
        amount: 12000,
        issueDate: '2025-01-10',
        bounceDate: '2025-01-15',
        reason: 'Signature Mismatch',
        bankName: 'Global Bank',
        parentContact: '+91 7654321098',
        status: 'Legal Action',
        recoveryDate: null,
        penaltyAmount: 600,
        followupNotes: 'Multiple follow-ups failed. Notice sent on Feb 10. Case referred to legal team on Feb 28.'
      }
    ];
    setRecords(mockData);
  }, []);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUpdateMode && editId) {
      // Update existing record
      setRecords(prev => prev.map(record => 
        record.id === editId ? { ...formData, id: editId } : record
      ));
      showNotification('Check bounce record updated successfully!', 'success');
    } else {
      // Add new record
      const newRecord: CheckRecord = {
        ...formData,
        id: Date.now().toString()
      };
      setRecords(prev => [newRecord, ...prev]);
      showNotification('Check bounce record added successfully!', 'success');
    }
    
    // Reset form and state
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      checkNumber: '',
      admissionNumber: '',
      studentName: '',
      class: '',
      section: '',
      amount: 0,
      issueDate: new Date().toISOString().split('T')[0],
      bounceDate: new Date().toISOString().split('T')[0],
      reason: 'Insufficient Funds',
      bankName: '',
      parentContact: '',
      status: 'Pending',
      recoveryDate: null,
      penaltyAmount: 0,
      followupNotes: ''
    });
    setIsFormVisible(false);
    setIsUpdateMode(false);
    setEditId(null);
  };

  const handleEdit = (record: CheckRecord) => {
    setFormData({
      checkNumber: record.checkNumber,
      admissionNumber: record.admissionNumber,
      studentName: record.studentName,
      class: record.class,
      section: record.section,
      amount: record.amount,
      issueDate: record.issueDate,
      bounceDate: record.bounceDate,
      reason: record.reason,
      bankName: record.bankName,
      parentContact: record.parentContact,
      status: record.status,
      recoveryDate: record.recoveryDate,
      penaltyAmount: record.penaltyAmount,
      followupNotes: record.followupNotes
    });
    setIsUpdateMode(true);
    setEditId(record.id);
    setIsFormVisible(true);
  };

  const handleViewDetails = (record: CheckRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleAddFollowup = (record: CheckRecord) => {
    setSelectedRecord(record);
    setFollowupNote('');
    setIsFollowupModalOpen(true);
  };

  const submitFollowup = () => {
    if (!selectedRecord || !followupNote.trim()) return;
    
    const updatedRecords = records.map(record => {
      if (record.id === selectedRecord.id) {
        const dateStr = new Date().toLocaleDateString();
        const newNote = `[${dateStr}] ${followupNote}\n\n${record.followupNotes}`;
        return { ...record, followupNotes: newNote };
      }
      return record;
    });
    
    setRecords(updatedRecords);
    setIsFollowupModalOpen(false);
    showNotification('Follow-up note added successfully!', 'success');
  };

  const markAsRecovered = (id: string, includePenalty: boolean) => {
    setRecords(prev => prev.map(record => {
      if (record.id === id) {
        return {
          ...record,
          status: 'Recovered' as const,
          recoveryDate: new Date().toISOString().split('T')[0],
          followupNotes: `[${new Date().toLocaleDateString()}] Marked as recovered${includePenalty ? ' with penalty.' : ' without penalty.'}\n\n${record.followupNotes}`
        };
      }
      return record;
    }));
    setIsDetailModalOpen(false);
    showNotification('Check marked as recovered!', 'success');
  };

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSort = (field: keyof CheckRecord) => {
    setSortDirection(prev => (sortField === field && prev === 'asc' ? 'desc' : 'asc'));
    setSortField(field);
  };

  // Filter and sort records
  const filteredRecords = records
    .filter(record => 
      (record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.checkNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass === '' || record.class === filterClass) &&
      (filterSection === '' || record.section === filterSection) &&
      (filterStatus === '' || record.status === filterStatus)
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

  // Get unique values for filters
  const classes = [...new Set(records.map(record => record.class))].sort();
  const sections = [...new Set(records.map(record => record.section))].sort();
  const statuses = ['Pending', 'Recovered', 'Legal Action', 'Written Off'];

  // Calculate statistics
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
  const pendingAmount = records
    .filter(record => record.status === 'Pending' || record.status === 'Legal Action')
    .reduce((sum, record) => sum + record.amount, 0);
  const recoveredAmount = records
    .filter(record => record.status === 'Recovered')
    .reduce((sum, record) => sum + record.amount, 0);
  const penaltyCollected = records
    .filter(record => record.status === 'Recovered')
    .reduce((sum, record) => sum + record.penaltyAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-6 px-6 sm:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Check Bounce Management</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetForm();
                  setIsFormVisible(!isFormVisible);
                }}
                className="bg-white text-indigo-700 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200"
              >
                {isFormVisible ? "Cancel" : "Register Bounced Check"}
              </motion.button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 px-6 py-4 sm:px-8 border-b border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Total Bounced Amount</p>
                <p className="text-2xl font-bold text-gray-800">₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Pending Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Recovered Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{recoveredAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Penalty Collected</p>
                <p className="text-2xl font-bold text-blue-600">₹{penaltyCollected.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-indigo-50 px-6 py-6 sm:px-8 border-b border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-800 mb-4">
                    {isUpdateMode ? "Update Check Bounce Record" : "Register New Bounced Check"}
                  </h2>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check Number</label>
                      <input
                        required
                        type="text"
                        name="checkNumber"
                        value={formData.checkNumber}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. CHK12345"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                      <input
                        required
                        type="text"
                        name="admissionNumber"
                        value={formData.admissionNumber}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. ADM001"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <input
                        required
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <input
                        required
                        type="text"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <input
                        required
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. A"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check Amount</label>
                      <input
                        required
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 5000"
                        min="1"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check Issue Date</label>
                      <input
                        required
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bounce Date</label>
                      <input
                        required
                        type="date"
                        name="bounceDate"
                        value={formData.bounceDate}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bounce Reason</label>
                      <select
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Insufficient Funds">Insufficient Funds</option>
                        <option value="Payment Stopped">Payment Stopped</option>
                        <option value="Signature Mismatch">Signature Mismatch</option>
                        <option value="Account Closed">Account Closed</option>
                        <option value="Stale Check">Stale Check</option>
                        <option value="Technical Reason">Technical Reason</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <input
                        required
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. City Bank"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact</label>
                      <input
                        required
                        type="text"
                        name="parentContact"
                        value={formData.parentContact}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. +91 9876543210"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Recovered">Recovered</option>
                        <option value="Legal Action">Legal Action</option>
                        <option value="Written Off">Written Off</option>
                      </select>
                    </div>
                    
                    {formData.status === 'Recovered' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recovery Date</label>
                        <input
                          type="date"
                          name="recoveryDate"
                          value={formData.recoveryDate || ''}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Amount</label>
                      <input
                        type="number"
                        name="penaltyAmount"
                        value={formData.penaltyAmount}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 250"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Notes</label>
                      <textarea
                        name="followupNotes"
                        value={formData.followupNotes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter any follow-up details or communication with parents..."
                      />
                    </div>
                    
                    <div className="sm:col-span-2 lg:col-span-3 flex justify-end mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {isUpdateMode ? "Update Record" : "Register Check"}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filters */}
          <div className="px-6 py-4 sm:px-8 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Search by name, admission or check number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Sections</option>
                  {sections.map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('checkNumber')}
                  >
                    <div className="flex items-center">
                      Check No.
                      {sortField === 'checkNumber' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('admissionNumber')}
                  >
                    <div className="flex items-center">
                      Adm No.
                      {sortField === 'admissionNumber' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('studentName')}
                  >
                    <div className="flex items-center">
                      Student
                      {sortField === 'studentName' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('class')}
                  >
                    <div className="flex items-center">
                      Class
                      {sortField === 'class' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>