import React from 'react';
import { Teacher } from './types';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, MapPin, XCircle } from 'lucide-react';

interface TeacherProfileModalProps {
  selectedTeacher: Teacher;
  setIsProfileOpen: (isOpen: boolean) => void;
}

const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  selectedTeacher,
  setIsProfileOpen,
}) => {
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
          <h2 className="text-xl font-bold text-gray-800">Teacher Profile</h2>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Profile Image */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-indigo-100">
              <img 
                src={selectedTeacher.profileImage} 
                alt={selectedTeacher.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              {selectedTeacher.name}
            </h3>
            <p className="text-blue-600 font-medium text-center">
              {selectedTeacher.designation}
            </p>
          </div>
          
          {/* Right Column - Details */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subjects */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500 uppercase">Subjects</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTeacher.subjects.join(', ')}
                </p>
              </div>
              
              {/* Email */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500 uppercase">Email</p>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-500" />
                  {selectedTeacher.email}
                </p>
              </div>
              
              {/* Phone */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500 uppercase">Phone</p>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-500" />
                  {selectedTeacher.phone}
                </p>
              </div>
              
              {/* Join Date */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500 uppercase">Join Date</p>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {new Date(selectedTeacher.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              {/* Class Incharge Details */}
              {selectedTeacher.isClassIncharge && (
                <div className="bg-gray-50 p-3 rounded-md col-span-2">
                  <p className="text-xs text-gray-500 uppercase mb-2">Class Incharge Details</p>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="font-medium text-blue-600">
                      Class {selectedTeacher.inchargeClass}
                    </div>
                    {selectedTeacher.sections.find(s => s.class === selectedTeacher.inchargeClass)?.sections.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        Sections: {selectedTeacher.sections
                          .find(s => s.class === selectedTeacher.inchargeClass)
                          ?.sections.map(section => (
                            <span 
                              key={section} 
                              className="inline-block bg-gray-100 px-2 py-1 rounded-full text-xs mr-1 mb-1"
                            >
                              {section}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Teaching Classes & Sections */}
              <div className="bg-gray-50 p-3 rounded-md col-span-2">
                <p className="text-xs text-gray-500 uppercase mb-2">Teaching Classes & Sections</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedTeacher.sections.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <div className="font-medium text-blue-600">Class {item.class}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Sections: {item.sections.map(section => (
                          <span 
                            key={section} 
                            className="inline-block bg-gray-100 px-2 py-1 rounded-full text-xs mr-1 mb-1"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500 uppercase">Experience</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTeacher.experience}
                </p>
              </div>

              {/* Education */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500 uppercase">Education</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTeacher.education}
                </p>
              </div>
              
              {/* Address */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500 uppercase">Address</p>
                <p className="text-sm font-medium text-gray-900 flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                  {selectedTeacher.address}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsProfileOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherProfileModal;