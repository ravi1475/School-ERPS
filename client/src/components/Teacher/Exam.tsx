import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Trash, Eye, XCircle, Calendar, Clock, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Exam } from './types'
import toast, { Toaster } from 'react-hot-toast';

// First, let's define the Teacher interface
interface Teacher {
  id: string;
  name: string;
  assignedClasses: string[];
  assignedSubjects: string[];
}

// Mock API call - replace this with your actual API call
const fetchTeacherData = async (teacherId: string): Promise<Teacher> => {
  const response = await fetch(`/api/teachers/${teacherId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch teacher data');
  }
  return response.json();
};

const ExamManager: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newExam, setNewExam] = useState<Partial<Exam>>({});
  const [editExam, setEditExam] = useState<Partial<Exam>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create separate refs for each modal
  const viewModalRef = useRef<HTMLDivElement>(null);
  const createModalRef = useRef<HTMLDivElement>(null);
  const editModalRef = useRef<HTMLDivElement>(null);

  const validateForm = (exam: Partial<Exam>) => {
    const errors: Record<string, string> = {};
    if (!exam.examName) errors.examName = 'Exam name is required';
    if (!exam.className) errors.className = 'Class is required';
    if (!exam.subject) errors.subject = 'Subject is required';
    if (!exam.date) errors.date = 'Exam date is required';
    return errors;
  };

  // Add useEffect to load exams from localStorage when component mounts
  useEffect(() => {
    const savedExams = localStorage.getItem('exams');
    if (savedExams) {
      try {
        setExams(JSON.parse(savedExams));
      } catch (error) {
        console.error('Error loading exams:', error);
      }
    }
  }, []);

  // Add useEffect to fetch teacher data when component mounts
  useEffect(() => {
    const loadTeacherData = async () => {
      setIsLoading(true);
      try {
        // Get teacherId from your auth context/service
        const teacherId = getCurrentTeacherId(); 
        const data = await fetchTeacherData(teacherId);
        setTeacherData(data);
      } catch (error) {
        console.error('Error loading teacher data:', error);
        toast.error('Failed to load teacher data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherData();
  }, []);

  const handleCreateExam = () => {
    const errors = validateForm(newExam);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const exam: Exam = {
      id: String(Date.now()),
      examName: newExam.examName!,
      subject: newExam.subject!,
      date: newExam.date!,
      className: newExam.className!,
      startTime: newExam.startTime || '09:00',
      endTime: newExam.endTime || '11:00',
      room: newExam.room || 'TBD'
    };

    const updatedExams = [...exams, exam];
    setExams(updatedExams);
    
    // Save to localStorage
    try {
      localStorage.setItem('exams', JSON.stringify(updatedExams));
      toast.success('Exam saved successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    } catch (error) {
      toast.error('Error saving exam. Please try again.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    }
    
    setIsCreateModalOpen(false);
    setNewExam({});
    setErrors({});
  };

  const handleUpdateExam = () => {
    const errors = validateForm(editExam);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const updatedExams = exams.map((exam) =>
      exam.id === editExam.id
        ? { ...exam, ...editExam }
        : exam
    );
    
    setExams(updatedExams);
    
    // Save to localStorage
    try {
      localStorage.setItem('exams', JSON.stringify(updatedExams));
      toast.success('Exam updated successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    } catch (error) {
      toast.error('Error updating exam. Please try again.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    }
    
    setIsEditModalOpen(false);
    setEditExam({});
    setErrors({});
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      const updatedExams = exams.filter((exam) => exam.id !== id);
      setExams(updatedExams);
      
      // Save to localStorage
      try {
        localStorage.setItem('exams', JSON.stringify(updatedExams));
        toast.success('Exam deleted successfully!', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        });
      } catch (error) {
        toast.error('Error deleting exam. Please try again.', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModalOpen && viewModalRef.current && !viewModalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
      if (isCreateModalOpen && createModalRef.current && !createModalRef.current.contains(event.target as Node)) {
        setIsCreateModalOpen(false);
      }
      if (isEditModalOpen && editModalRef.current && !editModalRef.current.contains(event.target as Node)) {
        setIsEditModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen, isCreateModalOpen, isEditModalOpen]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-emerald-600" />
          Exams
        </h1>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" /> Create Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">{exam.examName}</h2>
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                  onClick={() => { setSelectedExam(exam); setIsModalOpen(true); }}
                  title="View Details"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button 
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                  onClick={() => { setEditExam(exam); setIsEditModalOpen(true); }}
                  title="Edit Exam"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  onClick={() => handleDeleteExam(exam.id)}
                  title="Delete Exam"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{exam.date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{exam.startTime} - {exam.endTime}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span><strong>Class:</strong> {exam.className}</span>
                <span><strong>Subject:</strong> {exam.subject}</span>
              </div>
              {exam.room && (
                <div className="text-sm text-gray-600">
                  <strong>Room:</strong> {exam.room}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View Exam Modal */}
      <AnimatePresence>
        {isModalOpen && selectedExam && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={viewModalRef}
              className="bg-white rounded-lg p-6 w-full max-w-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedExam.examName}</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <XCircle className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date: {selectedExam.date}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Subject: {selectedExam.subject}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Class:</span> {selectedExam.className}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Exam Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={createModalRef}
              className="bg-white rounded-lg p-6 w-full max-w-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Create New Exam</h2>
                <button onClick={() => setIsCreateModalOpen(false)}>
                  <XCircle className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Exam Name*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newExam.examName || ''}
                    onChange={(e) => setNewExam({ ...newExam, examName: e.target.value })}
                  />
                  {errors.examName && <p className="text-sm text-red-500 mt-1">{errors.examName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Class*</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newExam.className || ''}
                    onChange={(e) => setNewExam({ ...newExam, className: e.target.value })}
                  >
                    <option value="">Select Class</option>
                    {teacherData?.assignedClasses.map((className) => (
                      <option key={className} value={className}>
                        Class {className}
                      </option>
                    ))}
                  </select>
                  {errors.className && <p className="text-sm text-red-500 mt-1">{errors.className}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subject*</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newExam.subject || ''}
                    onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  >
                    <option value="">Select Subject</option>
                    {teacherData?.assignedSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date*</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={newExam.date || ''}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  />
                  {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Time*</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={newExam.startTime || ''}
                    onChange={(e) => setNewExam({ ...newExam, startTime: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Time*</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={newExam.endTime || ''}
                    onChange={(e) => setNewExam({ ...newExam, endTime: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Room*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newExam.room || ''}
                    onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleCreateExam}
                  className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700"
                >
                  Create Exam
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Exam Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={editModalRef}
              className="bg-white rounded-lg p-6 w-full max-w-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Edit Exam</h2>
                <button onClick={() => setIsEditModalOpen(false)}>
                  <XCircle className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Exam Name*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={editExam.examName || ''}
                    onChange={(e) => setEditExam({ ...editExam, examName: e.target.value })}
                  />
                  {errors.examName && <p className="text-sm text-red-500 mt-1">{errors.examName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Class*</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editExam.className || ''}
                    onChange={(e) => setEditExam({ ...editExam, className: e.target.value })}
                  >
                    <option value="">Select Class</option>
                    {teacherData?.assignedClasses.map((className) => (
                      <option key={className} value={className}>
                        Class {className}
                      </option>
                    ))}
                  </select>
                  {errors.className && <p className="text-sm text-red-500 mt-1">{errors.className}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subject*</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editExam.subject || ''}
                    onChange={(e) => setEditExam({ ...editExam, subject: e.target.value })}
                  >
                    <option value="">Select Subject</option>
                    {teacherData?.assignedSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date*</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={editExam.date || ''}
                    onChange={(e) => setEditExam({ ...editExam, date: e.target.value })}
                  />
                  {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
                </div>

                <button
                  onClick={handleUpdateExam}
                  className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700"
                >
                  Update Exam
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamManager;