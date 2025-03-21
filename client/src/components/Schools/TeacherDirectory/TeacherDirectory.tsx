import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { User2, UserPlus } from 'lucide-react';
import { MOCK_TEACHERS } from './data';
import { Teacher } from './types';
import TeacherTable from './TeacherTable';
import SearchFilters from './SearchFilter';
import Pagination from './Pegination';
import TeacherProfileModal from './TeacherProfileModal';
import TeacherFormModal from './TeacherFormModal';

const TeacherDirectory: React.FC = () => {
  // State management
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [classFilter, setClassFilter] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    subjects: [],
    classes: '',
    sections: [],
  });
  const [editTeacher, setEditTeacher] = useState<Partial<Teacher>>({
    subjects: [],
    classes: '',
    sections: [],
  });

  const itemsPerPage = 5;
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass =
      classFilter === 'all' || teacher.sections.some((section) => section.class === classFilter);

    return matchesSearch && matchesClass;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

  // Handle viewing a teacher's profile
  const handleViewProfile = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsProfileOpen(true);
  };

  // Handle adding a new teacher
  const handleAddTeacher = () => setIsAddModalOpen(true);

  // Handle editing a teacher
  const handleEditTeacher = (teacher: Teacher) => {
    setEditTeacher(teacher);
    setIsEditModalOpen(true);
  };

  // Handle deleting a teacher
  const handleDeleteTeacher = (id: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
      toast.success('Teacher deleted successfully!', {
        duration: 3000,
        style: {
          background: '#2563EB', 
          color: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#ffffff',
          secondary: '#2563EB', 
        },
      });
    }
  };

  // Validate incharge class
  const validateInchargeClass = (value: string): string => {
    const classes = value.replace(/\s/g, '').split(',');
    return classes[0] || '';
  };

  // Handle input changes for new teacher
  const handleInputChange = (field: keyof Teacher, value: any) => {
    if (field === 'inchargeClass') {
      const formattedValue = validateInchargeClass(value);
      setNewTeacher((prev) => ({ ...prev, [field]: formattedValue }));
    } else {
      setNewTeacher((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle input changes for editing teacher
  const handleEditInputChange = (field: keyof Teacher, value: any) => {
    if (field === 'inchargeClass') {
      const formattedValue = validateInchargeClass(value);
      setEditTeacher((prev) => ({ ...prev, [field]: formattedValue }));
    } else {
      setEditTeacher((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle form submission for adding a teacher
  const handleSubmit = () => {
    if (newTeacher.isClassIncharge) {
      if (!newTeacher.inchargeClass || !newTeacher.inchargeSection) {
        toast.error('Please select both incharge class and section', {
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#EF4444',
          },
        });
        return;
      }

      const existingIncharge = teachers.find(
        (t) =>
          t.isClassIncharge &&
          t.inchargeClass === newTeacher.inchargeClass &&
          t.inchargeSection === newTeacher.inchargeSection
      );

      if (existingIncharge) {
        toast.error(
          `${existingIncharge.name} is already incharge of Class ${newTeacher.inchargeClass} Section ${newTeacher.inchargeSection}`,
          {
            duration: 3000,
            style: {
              background: '#EF4444',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '8px',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#EF4444',
            },
          }
        );
        return;
      }
    }

    const teacherToAdd: Teacher = {
      id: teachers.length + 1,
      name: newTeacher.name || '',
      email: newTeacher.email || '',
      phone: newTeacher.phone || '',
      designation: newTeacher.designation || '',
      subjects: newTeacher.subjects || [],
      classes: newTeacher.classes || '',
      sections: newTeacher.sections || [],
      joinDate: newTeacher.joinDate || new Date().toISOString().split('T')[0],
      address: newTeacher.address || '',
      education: newTeacher.education || '',
      experience: newTeacher.experience || '',
      profileImage: newTeacher.profileImage || 'https://randomuser.me/api/portraits/men/0.jpg',
      isClassIncharge: newTeacher.isClassIncharge ?? false,
      inchargeClass: newTeacher.isClassIncharge ? newTeacher.inchargeClass : undefined,
      inchargeSection: newTeacher.isClassIncharge ? newTeacher.inchargeSection : undefined,
    };

    setTeachers((prev) => [...prev, teacherToAdd]);
    setIsAddModalOpen(false);
    setNewTeacher({ subjects: [], classes: '', sections: [] });
    toast.success('Teacher added successfully!', {
      duration: 3000,
      style: {
        background: '#2563EB', 
        color: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#2563EB',
      },
    });
  };

  // Handle form submission for editing a teacher
  const handleEditSubmit = () => {
    if (editTeacher.isClassIncharge) {
      if (!editTeacher.inchargeClass || !editTeacher.inchargeSection) {
        toast.error('Please select both incharge class and section', {
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#EF4444',
          },
        });
        return;
      }

      const existingIncharge = teachers.find(
        (t) =>
          t.id !== editTeacher.id &&
          t.isClassIncharge &&
          t.inchargeClass === editTeacher.inchargeClass &&
          t.inchargeSection === editTeacher.inchargeSection
      );

      if (existingIncharge) {
        toast.error(
          `${existingIncharge.name} is already incharge of Class ${editTeacher.inchargeClass} Section ${editTeacher.inchargeSection}`,
          {
            duration: 3000,
            style: {
              background: '#EF4444',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '8px',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#EF4444',
            },
          }
        );
        return;
      }
    }

    const updatedTeachers = teachers.map((teacher) =>
      teacher.id === editTeacher.id ? { ...teacher, ...editTeacher } : teacher
    );
    setTeachers(updatedTeachers);
    setIsEditModalOpen(false);
    toast.success('Teacher updated successfully!', {
      duration: 3000,
      style: {
        background: '#2563EB', 
        color: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#3B82F6',
      },
    });
  };

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
      }
    };

    if (isProfileOpen || isAddModalOpen || isEditModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, isAddModalOpen, isEditModalOpen]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, classFilter]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
          <User2 className="h-6 w-6 mr-2 text-blue-600" /> 
          Teacher Directory
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-300"
          onClick={handleAddTeacher}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Teacher
        </button>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
      />

      {/* Teacher Table */}
      <div className="overflow-x-auto">
        <TeacherTable
          currentTeachers={currentTeachers}
          handleViewProfile={handleViewProfile}
          handleEditTeacher={handleEditTeacher}
          handleDeleteTeacher={handleDeleteTeacher}
        />
      </div>

      {/* Pagination */}
      {filteredTeachers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          filteredTeachers={filteredTeachers}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Teacher Profile Modal */}
      {isProfileOpen && selectedTeacher && (
        <TeacherProfileModal
          selectedTeacher={selectedTeacher}
          setIsProfileOpen={setIsProfileOpen}
        />
      )}

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <TeacherFormModal
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
          mode="add"
          teacherData={newTeacher}
          setTeacherData={setNewTeacher}
          onSubmit={handleSubmit}
          validateInchargeClass={validateInchargeClass}
          handleInputChange={handleInputChange}
        />
      )}

      {/* Edit Teacher Modal */}
      {isEditModalOpen && editTeacher && (
        <TeacherFormModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          mode="edit"
          teacherData={editTeacher}
          setTeacherData={setEditTeacher}
          onSubmit={handleEditSubmit}
          validateInchargeClass={validateInchargeClass}
          handleInputChange={handleEditInputChange}
        />
      )}
    </div>
  );
};

export default TeacherDirectory;