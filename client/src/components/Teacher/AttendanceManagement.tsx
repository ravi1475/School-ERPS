import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaSearch, FaDownload, FaFilter, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Types
interface Student {
  id: string;
  name: string;
  rollNumber: string;
  profileImage?: string;
}

interface Class {
  id: string;
  name: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

const AttendanceManagement: React.FC = () => {
  // States
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'report'>('daily');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Mock data - replace with API calls in a real application
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockClasses: Class[] = [
        { id: '1', name: 'Class 1-A' },
        { id: '2', name: 'Class 2-B' },
        { id: '3', name: 'Class 3-C' },
      ];
      
      const mockStudents: Student[] = [
        { id: '1', name: 'John Doe', rollNumber: '101' },
        { id: '2', name: 'Jane Smith', rollNumber: '102' },
        { id: '3', name: 'Michael Johnson', rollNumber: '103' },
        { id: '4', name: 'Emily Davis', rollNumber: '104' },
        { id: '5', name: 'Robert Wilson', rollNumber: '105' },
      ];
      
      const mockAttendance: AttendanceRecord[] = [
        { id: '1', studentId: '1', date: new Date(), status: 'present' },
        { id: '2', studentId: '2', date: new Date(), status: 'present' },
        { id: '3', studentId: '3', date: new Date(), status: 'absent' },
        { id: '4', studentId: '4', date: new Date(), status: 'late' },
        { id: '5', studentId: '5', date: new Date(), status: 'excused', notes: 'Doctor appointment' },
      ];
      
      setClasses(mockClasses);
      setStudents(mockStudents);
      setAttendanceRecords(mockAttendance);
      setSelectedClass(mockClasses[0].id);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNumber.includes(searchQuery)
  );

  // Handle attendance status change
  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    const existingRecord = attendanceRecords.find(
      record => record.studentId === studentId && 
      format(record.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );

    if (existingRecord) {
      // Update existing record
      setAttendanceRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === existingRecord.id ? { ...record, status } : record
        )
      );
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        studentId,
        date: selectedDate,
        status
      };
      setAttendanceRecords(prev => [...prev, newRecord]);
    }
  };

  // Get attendance status for a student on the selected date
  const getAttendanceStatus = (studentId: string): 'present' | 'absent' | 'late' | 'excused' | null => {
    const record = attendanceRecords.find(
      record => record.studentId === studentId && 
      format(record.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
    return record ? record.status : null;
  };

  // Add notes to a student's attendance
  const handleAddNotes = (studentId: string, notes: string) => {
    const existingRecord = attendanceRecords.find(
      record => record.studentId === studentId && 
      format(record.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );

    if (existingRecord) {
      setAttendanceRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === existingRecord.id ? { ...record, notes } : record
        )
      );
    }
  };

  // Save all attendance records
  const handleSaveAttendance = () => {
    // In a real app, you would send the data to your backend
    console.log('Saving attendance records:', attendanceRecords);
    alert('Attendance saved successfully!');
  };

  // Calculate attendance statistics
  const calculateStats = () => {
    const total = students.length;
    const present = attendanceRecords.filter(
      record => format(record.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && 
      record.status === 'present'
    ).length;
    const absent = attendanceRecords.filter(
      record => format(record.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && 
      record.status === 'absent'
    ).length;
    const late = attendanceRecords.filter(
      record => format(record.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && 
      record.status === 'late'
    ).length;
    const excused = attendanceRecords.filter(
      record => format(record.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && 
      record.status === 'excused'
    ).length;
    
    return { total, present, absent, late, excused };
  };

  const stats = calculateStats();

  // Export attendance as CSV
  const exportAttendance = () => {
    // In a real app, this would generate a CSV file
    alert('Attendance data exported!');
  };

  // Handle student note edit
  const handleEditNotes = (studentId: string) => {
    setEditingStudentId(studentId);
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="mt-2 text-blue-100">Track and manage student attendance efficiently</p>
          </div>

          {/* Tabs */}
          <div className="bg-gray-100 px-6 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('daily')}
                className={`py-4 px-2 font-medium text-sm focus:outline-none ${
                  activeTab === 'daily' 
                    ? 'text-blue-700 border-b-2 border-blue-700' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                Daily Attendance
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`py-4 px-2 font-medium text-sm focus:outline-none ${
                  activeTab === 'report' 
                    ? 'text-blue-700 border-b-2 border-blue-700' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                Attendance Reports
              </button>
            </div>
          </div>

          {activeTab === 'daily' ? (
            <>
              {/* Controls */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date) => setSelectedDate(date)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                    
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FaFilter className="mr-2" /> Filters
                    </button>
                  </div>
                  
                  <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {showFilters && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-2">Additional Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                          <option>All</option>
                          <option>Present</option>
                          <option>Absent</option>
                          <option>Late</option>
                          <option>Excused</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                          <option>Name (A-Z)</option>
                          <option>Name (Z-A)</option>
                          <option>Roll Number</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
                        <select className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                          <option>All Students</option>
                          <option>Only Marked</option>
                          <option>Not Marked</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 mr-2">
                        Reset
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="p-6 bg-white border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="text-lg font-medium text-blue-800">{stats.total}</div>
                    <div className="text-sm text-blue-600">Total Students</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-lg font-medium text-green-800">{stats.present}</div>
                    <div className="text-sm text-green-600">Present</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="text-lg font-medium text-red-800">{stats.absent}</div>
                    <div className="text-sm text-red-600">Absent</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="text-lg font-medium text-yellow-800">{stats.late}</div>
                    <div className="text-sm text-yellow-600">Late</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="text-lg font-medium text-purple-800">{stats.excused}</div>
                    <div className="text-sm text-purple-600">Excused</div>
                  </div>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No.
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map(student => {
                      const status = getAttendanceStatus(student.id);
                      const record = attendanceRecords.find(
                        r => r.studentId === student.id && 
                        format(r.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                      );
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  {student.profileImage ? (
                                    <img src={student.profileImage} alt={student.name} className="h-10 w-10 rounded-full" />
                                  ) : (
                                    student.name.charAt(0)
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.rollNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusChange(student.id, 'present')}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  status === 'present' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, 'absent')}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  status === 'absent' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                                }`}
                              >
                                Absent
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, 'late')}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  status === 'late' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'
                                }`}
                              >
                                Late
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, 'excused')}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  status === 'excused' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-purple-50'
                                }`}
                              >
                                Excused
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isEditing && editingStudentId === student.id ? (
                              <input 
                                type="text"
                                defaultValue={record?.notes || ''}
                                onBlur={(e) => {
                                  handleAddNotes(student.id, e.target.value);
                                  setIsEditing(false);
                                  setEditingStudentId(null);
                                }}
                                className="border border-gray-300 rounded-md p-1 text-sm w-full"
                                autoFocus
                              />
                            ) : (
                              <div className="text-sm text-gray-900">
                                {record?.notes ? record.notes : 
                                  <span className="text-gray-400 italic">No notes</span>}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditNotes(student.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredStudents.length} of {students.length} students
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={exportAttendance}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FaDownload className="mr-2" /> Export
                  </button>
                  <button 
                    onClick={handleSaveAttendance}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save Attendance
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Reports tab (simplified for brevity)
            <div className="p-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      The reports section is under development. Please check back soon!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Report</h3>
                  <p className="text-gray-600 mb-4">View attendance statistics for the entire month</p>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200">
                    <FaEye className="mr-2" /> View Report
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Student Report</h3>
                  <p className="text-gray-600 mb-4">View individual student attendance patterns</p>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200">
                    <FaEye className="mr-2" /> View Report
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Class Comparison</h3>
                  <p className="text-gray-600 mb-4">Compare attendance across different classes</p>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200">
                    <FaEye className="mr-2" /> View Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;