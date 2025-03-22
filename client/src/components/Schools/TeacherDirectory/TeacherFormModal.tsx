import React, { useState } from 'react';
import { Teacher } from './types';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { AVAILABLE_CLASSES, SECTIONS } from './data';

interface TeacherFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode: 'add' | 'edit';
  teacherData: Partial<Teacher>;
  setTeacherData: (data: Partial<Teacher>) => void;
  onSubmit: () => void;
  validateInchargeClass: (value: string) => string;
  handleInputChange: (field: keyof Teacher, value: any) => void;
}

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  setIsOpen,
  mode,
  teacherData,
  onSubmit,
  handleInputChange,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('');

  if (!isOpen) return null;

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle section selection for a class
  const handleSectionSelection = (classNum: string, section: string) => {
    const updatedSections = teacherData.sections?.map((s) =>
      s.class === classNum
        ? {
            ...s,
            sections: s.sections.includes(section)
              ? s.sections.filter((sec) => sec !== section) // Remove section if already selected
              : [...s.sections, section], // Add section if not selected
          }
        : s
    );

    handleInputChange('sections', updatedSections || []);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'add' ? 'Add New Teacher' : 'Edit Teacher'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {teacherData.profileImage && (
                <div className="mt-2">
                  <img
                    src={teacherData.profileImage}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone*
              </label>
              <input
                type="tel"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation*
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.designation || ''}
                onChange={(e) => handleInputChange('designation', e.target.value)}
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience*
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.experience || ''}
                onChange={(e) => handleInputChange('experience', e.target.value)}
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joining Date*
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.joinDate || ''}
                onChange={(e) => handleInputChange('joinDate', e.target.value)}
              />
            </div>

            {/* Class Incharge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Incharge
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleInputChange('isClassIncharge', true)}
                  className={`px-4 py-2 rounded-md ${
                    teacherData.isClassIncharge
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleInputChange('isClassIncharge', false)}
                  className={`px-4 py-2 rounded-md ${
                    !teacherData.isClassIncharge
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Incharge Class and Section */}
            {teacherData.isClassIncharge && (
              <div className="mt-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incharge Class* <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      teacherData.isClassIncharge && !teacherData.inchargeClass
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      handleInputChange('inchargeClass', e.target.value);
                      handleInputChange('inchargeSection', ''); // Reset section when class changes
                    }}
                  >
                    <option value="">Select Class</option>
                    {AVAILABLE_CLASSES.map((classNum) => (
                      <option key={classNum} value={classNum}>
                        Class {classNum}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedClass && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Incharge Section* <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                        teacherData.isClassIncharge && !teacherData.inchargeSection
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={teacherData.inchargeSection || ''}
                      onChange={(e) => handleInputChange('inchargeSection', e.target.value)}
                    >
                      <option value="">Select Section</option>
                      {SECTIONS.map((section) => (
                      <option key={section} value={section}>
                        Section {section}
                      </option>
                    ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subjects* (comma separated)
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.subjects?.join(', ') || ''}
                onChange={(e) => handleInputChange('subjects', e.target.value.split(', '))}
              />
            </div>

            {/* Classes and Sections */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Classes and Sections
              </label>
              {AVAILABLE_CLASSES.map((classNum) => {
                const classData = teacherData.sections?.find((s) => s.class === classNum) || {
                  class: classNum,
                  sections: [],
                };
                return (
                  <div key={classNum} className="mb-4">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={teacherData.sections?.some((s) => s.class === classNum)}
                        onChange={(e) => {
                          const updatedSections = e.target.checked
                            ? [...(teacherData.sections || []), { class: classNum, sections: [] }]
                            : (teacherData.sections || []).filter((s) => s.class !== classNum);
                          handleInputChange('sections', updatedSections);
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2">Class {classNum}</span>
                    </div>
                    {teacherData.sections?.some((s) => s.class === classNum) && (
                      <div className="flex flex-wrap gap-2">
                        {SECTIONS.map((section) => (
                          <div key={section} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={classData.sections.includes(section)}
                              onChange={() => handleSectionSelection(classNum, section)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2">Section {section}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address*
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education*
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={teacherData.education || ''}
                onChange={(e) => handleInputChange('education', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {mode === 'add' ? 'Add Teacher' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherFormModal;