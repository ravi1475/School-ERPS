import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  attendanceRecordsState,
  attendanceFilterState,
  selectedClassState,
  attendanceSubmissionState,
  attendanceErrorState,
  filteredAttendanceRecordsSelector,
  attendanceStatsSelector,
  AttendanceRecord,
  AttendanceFilter
} from '../../recoil/attendenceAtoms';

interface Class {
  id: string;
  name: string;
  subject?: string;
}

interface Student {
  id: string;
  name: string;
  rollNo?: string;
  profileImage?: string;
}

const AttendanceManagement: React.FC = () => {
  // Local UI states
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'record' | 'history' | 'stats'>('record');
  const [studentAttendance, setStudentAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [bulkNotes, setBulkNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);

  // Recoil states
  const [attendanceRecords, setAttendanceRecords] = useRecoilState(attendanceRecordsState);
  const [filter, setFilter] = useRecoilState(attendanceFilterState);
  const [selectedClass, setSelectedClass] = useRecoilState(selectedClassState);
  const [submissionState, setSubmissionState] = useRecoilState(attendanceSubmissionState);
  const [error, setError] = useRecoilState(attendanceErrorState);
  
  // Computed values from selectors
  const filteredRecords = useRecoilValue(filteredAttendanceRecordsSelector);
  const stats = useRecoilValue(attendanceStatsSelector);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls with mock data for development
        // TODO: Replace with actual API calls
        setTimeout(() => {
          const mockClasses: Class[] = [
            { id: 'c1', name: 'Class 10-A', subject: 'Mathematics' },
            { id: 'c2', name: 'Class 9-B', subject: 'Science' },
            { id: 'c3', name: 'Class 11-C', subject: 'English' }
          ];
          
          const mockStudents: Student[] = [
            { id: 's1', name: 'John Smith', rollNo: '1001' },
            { id: 's2', name: 'Emma Johnson', rollNo: '1002' },
            { id: 's3', name: 'Michael Brown', rollNo: '1003' },
            { id: 's4', name: 'Olivia Davis', rollNo: '1004' },
            { id: 's5', name: 'William Wilson', rollNo: '1005' }
          ];
          
          const mockRecords: AttendanceRecord[] = [
            {
              id: 'ar1',
              studentId: 's1',
              classId: 'c1',
              date: new Date().toISOString().split('T')[0],
              status: 'present',
              recordedBy: 'teacher1',
              timestamp: new Date().toISOString()
            },
            {
              id: 'ar2',
              studentId: 's2',
              classId: 'c1',
              date: new Date().toISOString().split('T')[0],
              status: 'absent',
              notes: 'Called in sick',
              recordedBy: 'teacher1',
              timestamp: new Date().toISOString()
            }
          ];
          
          setClasses(mockClasses);
          setStudents(mockStudents);
          setAttendanceRecords(mockRecords);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [setAttendanceRecords, setError]);

  // Update class students when selected class changes
  useEffect(() => {
    if (selectedClass) {
      // In a real app, you'd fetch students for this specific class
      // For now, we'll just use all students as class students
      setClassStudents(students);
      
      // Initialize studentAttendance state with existing records for today
      const todayRecords = attendanceRecords.filter(
        record => record.classId === selectedClass && record.date === selectedDate
      );
      
      const initialAttendance: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
      classStudents.forEach(student => {
        const record = todayRecords.find(r => r.studentId === student.id);
        if (record) {
          initialAttendance[student.id] = record.status;
        }
      });
      
      setStudentAttendance(initialAttendance);
    } else {
      setClassStudents([]);
      setStudentAttendance({});
    }
  }, [selectedClass, students, attendanceRecords, selectedDate]);

  // Handler functions
  const handleFilterChange = (newFilter: Partial<AttendanceFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const handleClassSelection = (classId: string) => {
    setSelectedClass(classId);
    setFilter(prev => ({ ...prev, classId }));
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedClass) {
      setNotification({ type: 'error', message: 'Please select a class first' });
      return;
    }

    try {
      setSubmissionState('submitting');
      
      const recordsToSubmit: Partial<AttendanceRecord>[] = Object.entries(studentAttendance).map(
        ([studentId, status]) => ({
          id: `ar-${Date.now()}-${studentId}`, // Generate temporary ID
          studentId,
          classId: selectedClass,
          date: selectedDate,
          status,
          notes: bulkNotes || undefined,
          recordedBy: 'current-teacher-id', // In a real app, get from auth context
          timestamp: new Date().toISOString()
        })
      );

      // TODO: Replace with actual API call
      // Simulate API call
      setTimeout(() => {
        // Add new records to state
        setAttendanceRecords(prev => {
          // Remove any existing records for these students on this date
          const filteredRecords = prev.filter(record => 
            !(record.classId === selectedClass && 
              record.date === selectedDate &&
              Object.keys(studentAttendance).includes(record.studentId))
          );
          
          // Add the new records
          return [...filteredRecords, ...(recordsToSubmit as AttendanceRecord[])];
        });
        
        setSubmissionState('success');
        setNotification({ type: 'success', message: 'Attendance saved successfully' });
        setBulkNotes('');
        
        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record attendance');
      setSubmissionState('error');
      setNotification({ type: 'error', message: 'Failed to save attendance' });
    }
  };

  // Calculate attendance percentage for individual student
  const getStudentAttendanceStats = (studentId: string) => {
    const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
    const total = studentRecords.length;
    const present = studentRecords.filter(r => r.status === 'present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, percentage };
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 text-lg">Loading attendance data...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans">
      <h1 className="text-gray-800 mb-4 text-2xl font-semibold">Attendance Management</h1>
      
      {notification && (
        <div className={`p-3 rounded-md mb-4 animate-fadeIn ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex mb-4 border-b border-gray-200">
        <button 
          className={`py-2 px-5 text-base cursor-pointer transition-all border-b-2 ${
            activeTab === 'record' 
              ? 'text-blue-600 border-blue-600 font-medium' 
              : 'text-gray-600 border-transparent'
          }`}
          onClick={() => setActiveTab('record')}
        >
          Record Attendance
        </button>
        <button 
          className={`py-2 px-5 text-base cursor-pointer transition-all border-b-2 ${
            activeTab === 'history' 
              ? 'text-blue-600 border-blue-600 font-medium' 
              : 'text-gray-600 border-transparent'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Attendance History
        </button>
        <button 
          className={`py-2 px-5 text-base cursor-pointer transition-all border-b-2 ${
            activeTab === 'stats' 
              ? 'text-blue-600 border-blue-600 font-medium' 
              : 'text-gray-600 border-transparent'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>
      
      {activeTab === 'record' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">Class:</label>
              <select
                value={selectedClass || ''}
                onChange={e => handleClassSelection(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.subject}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">Notes (applies to all):</label>
              <input
                type="text"
                value={bulkNotes}
                onChange={e => setBulkNotes(e.target.value)}
                placeholder="Add notes for this attendance session"
                className="p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          {selectedClass ? (
            <>
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => {
                    const allPresent = {};
                    classStudents.forEach(student => {
                      allPresent[student.id] = 'present';
                    });
                    setStudentAttendance(allPresent);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition"
                >
                  Mark All Present
                </button>
                
                <button 
                  onClick={() => {
                    const allAbsent = {};
                    classStudents.forEach(student => {
                      allAbsent[student.id] = 'absent';
                    });
                    setStudentAttendance(allAbsent);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition"
                >
                  Mark All Absent
                </button>
              </div>
              
              <div className="mb-5 overflow-x-auto">
                <table className="w-full border-collapse shadow-sm">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Roll No</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Student Name</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Status</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Previous Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map(student => {
                      const stats = getStudentAttendanceStats(student.id);
                      return (
                        <tr key={student.id}>
                          <td className="py-3 px-4 border-b border-gray-100">{student.rollNo || 'N/A'}</td>
                          <td className="py-3 px-4 border-b border-gray-100">{student.name}</td>
                          <td className="py-3 px-4 border-b border-gray-100">
                            <div className="flex flex-wrap gap-1">
                              <button 
                                className={`py-1 px-2 border rounded-md text-sm transition ${
                                  studentAttendance[student.id] === 'present' 
                                    ? 'bg-green-600 border-green-700 text-white' 
                                    : 'bg-gray-50 border-gray-300'
                                }`}
                                onClick={() => handleAttendanceChange(student.id, 'present')}
                              >
                                Present
                              </button>
                              <button 
                                className={`py-1 px-2 border rounded-md text-sm transition ${
                                  studentAttendance[student.id] === 'absent' 
                                    ? 'bg-red-600 border-red-700 text-white' 
                                    : 'bg-gray-50 border-gray-300'
                                }`}
                                onClick={() => handleAttendanceChange(student.id, 'absent')}
                              >
                                Absent
                              </button>
                              <button 
                                className={`py-1 px-2 border rounded-md text-sm transition ${
                                  studentAttendance[student.id] === 'late' 
                                    ? 'bg-amber-500 border-amber-600 text-white' 
                                    : 'bg-gray-50 border-gray-300'
                                }`}
                                onClick={() => handleAttendanceChange(student.id, 'late')}
                              >
                                Late
                              </button>
                              <button 
                                className={`py-1 px-2 border rounded-md text-sm transition ${
                                  studentAttendance[student.id] === 'excused' 
                                    ? 'bg-indigo-600 border-indigo-700 text-white' 
                                    : 'bg-gray-50 border-gray-300'
                                }`}
                                onClick={() => handleAttendanceChange(student.id, 'excused')}
                              >
                                Excused
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 border-b border-gray-100">
                            <div className="flex flex-col">
                              <span className="font-semibold text-base">{stats.percentage}%</span>
                              <span className="text-xs text-gray-600">({stats.present}/{stats.total} days)</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mt-5">
                <button 
                  className={`py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base transition ${
                    submissionState === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={submissionState === 'submitting'}
                  onClick={handleSubmitAttendance}
                >
                  {submissionState === 'submitting' ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Please select a class to record attendance</p>
            </div>
          )}
        </div>
      )}
          
      {activeTab === 'history' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Filter Records</h2>
            <div className="flex flex-wrap gap-3">
              <input
                type="date"
                value={filter.date || ''}
                onChange={e => handleFilterChange({ date: e.target.value })}
                className="p-2 border border-gray-300 rounded-md text-sm"
              />
              
              <select
                value={filter.classId || ''}
                onChange={e => handleFilterChange({ classId: e.target.value })}
                className="p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              
              <select
                value={filter.status || ''}
                onChange={e => handleFilterChange({ status: e.target.value as any })}
                className="p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
              
              <button 
                onClick={() => setFilter({ date: new Date().toISOString().split('T')[0] })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-3">Records ({filteredRecords.length})</h2>
            {filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse shadow-sm">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Date</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Student</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Class</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Status</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Notes</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map(record => (
                      <tr key={record.id}>
                        <td className="py-3 px-4 border-b border-gray-100">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 border-b border-gray-100">{students.find(s => s.id === record.studentId)?.name || 'Unknown'}</td>
                        <td className="py-3 px-4 border-b border-gray-100">{classes.find(c => c.id === record.classId)?.name || 'Unknown'}</td>
                        <td className="py-3 px-4 border-b border-gray-100">
                          <span className={`inline-block py-1 px-2 rounded-full text-xs font-medium ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            record.status === 'late' ? 'bg-amber-100 text-amber-800' :
                            'bg-indigo-100 text-indigo-800'
                          }`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-gray-100">{record.notes || '-'}</td>
                        <td className="py-3 px-4 border-b border-gray-100">{record.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center border rounded-md bg-gray-50">
                <p className="text-gray-500">No attendance records found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      )}
          
      {activeTab === 'stats' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Statistics Filters</h2>
            <div className="flex flex-wrap gap-3">
              <select
                value={filter.classId || ''}
                onChange={e => handleFilterChange({ classId: e.target.value })}
                className="p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              
              <input
                type="month"
                value={filter.date?.substring(0, 7) || ''}
                onChange={e => {
                  const yearMonth = e.target.value;
                  if (yearMonth) {
                    handleFilterChange({ date: `${yearMonth}-01` });
                  }
                }}
                className="p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-3">Attendance Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600">
                <h3 className="text-sm text-gray-600 mb-2">Total Records</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-600">
                <h3 className="text-sm text-gray-600 mb-2">Present</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.present}</p>
                <p className="text-sm text-gray-600">{stats.presentPercent.toFixed(1)}%</p>
                <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${stats.presentPercent}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-600">
                <h3 className="text-sm text-gray-600 mb-2">Absent</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.absent}</p>
                <p className="text-sm text-gray-600">
                  {stats.total > 0 ? ((stats.absent / stats.total) * 100).toFixed(1) : '0.0'}%
                </p>
                <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.absent / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
                <h3 className="text-sm text-gray-600 mb-2">Late</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.late}</p>
                <p className="text-sm text-gray-600">
                  {stats.total > 0 ? ((stats.late / stats.total) * 100).toFixed(1) : '0.0'}%
                </p>
                <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.late / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-600">
                <h3 className="text-sm text-gray-600 mb-2">Excused</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.excused}</p>
                <p className="text-sm text-gray-600">
                  {stats.total > 0 ? ((stats.excused / stats.total) * 100).toFixed(1) : '0.0'}%
                </p>
                <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.excused / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {selectedClass && (
            <div>
              <h2 className="text-xl font-medium mb-3">Student Attendance Statistics</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse shadow-sm">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Student Name</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Present Days</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Absent Days</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Late Days</th>
                      <th className="py-3 px-4 text-left bg-gray-50 font-semibold border-b border-gray-200">Excused Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map(student => {
                      const stats = getStudentAttendanceStats(student.id);
                      return (
                        <tr key={student.id}>
                          <td className="py-3 px-4 border-b border-gray-100">{student.name}</td>
                          <td className="py-3 px-4 border-b border-gray-100">{stats.present}</td>
                          <td className="py-3 px-4 border-b border-gray-100">{stats.total - stats.present}</td>
                          <td className="py-3 px-4 border-b border-gray-100">{stats.total - stats.present}</td>
                          <td className="py-3 px-4 border-b border-gray-100">{stats.total - stats.present}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;