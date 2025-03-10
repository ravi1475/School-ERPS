import { useState } from 'react';

interface Student {
  id: number;
  srNo: number;
  name: string;
  class: string;
  section: string;
  rollNo: number;
}

export const ManageStudent = () => {
  const initialStudents: Student[] = [
    { id: 1, srNo: 1, name: 'John Doe', class: '10th', section: 'A', rollNo: 101 },
    { id: 2, srNo: 2, name: 'Jane Smith', class: '9th', section: 'B', rollNo: 102 },
    { id: 3, srNo: 3, name: 'Alice Johnson', class: '10th', section: 'C', rollNo: 103 },
    // Add more initial data as needed
  ];

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    rollNo: '',
  });

  // Get unique classes for the filter dropdown
  const uniqueClasses = [...new Set(students.map((student) => student.class))];

  // Filtered students based on search term and selected class
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toString().includes(searchTerm);

    const matchesClass = selectedClass ? student.class === selectedClass : true;

    return matchesSearch && matchesClass;
  });

  // Handle add/edit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.class.trim() || !formData.section.trim() || !formData.rollNo.trim()) {
      alert('Please fill all fields');
      return;
    }

    if (currentStudent) {
      // Update existing student
      setStudents(
        students.map((student) =>
          student.id === currentStudent.id
            ? {
                ...student,
                name: formData.name.trim(),
                class: formData.class.trim(),
                section: formData.section.trim(),
                rollNo: parseInt(formData.rollNo),
              }
            : student
        )
      );
    } else {
      // Add new student
      const newStudent: Student = {
        id: Math.max(...students.map((student) => student.id)) + 1,
        srNo: students.length + 1,
        name: formData.name.trim(),
        class: formData.class.trim(),
        section: formData.section.trim(),
        rollNo: parseInt(formData.rollNo),
      };
      setStudents([...students, newStudent]);
    }

    resetForm();
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  // Edit student
  const handleEdit = (student: Student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      section: student.section,
      rollNo: student.rollNo.toString(),
    });
    setIsModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      class: '',
      section: '',
      rollNo: '',
    });
    setCurrentStudent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total Students: {filteredStudents.length}
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Student
            </button>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full md:w-48 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{student.srNo}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.class}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.section}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.rollNo}</td>
                  <td className="px-6 py-4 text-sm text-center space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="px-6 py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedClass
                  ? 'Try adjusting your search or filter'
                  : 'Get started by adding a new student'}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentStudent ? 'Edit Student' : 'Add New Student'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {currentStudent ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};