import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, Edit, Trash, Search } from 'lucide-react';
import TCFormModal from './TCFormModal';
import TCViewModal from './TCViewModal';
import { IssuedCertificate } from './types';
import { dummyIssuedCertificates } from './data';

const TCList: React.FC = () => {
  const [issuedCertificates, setIssuedCertificates] = useState<IssuedCertificate[]>(dummyIssuedCertificates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<IssuedCertificate | null>(null);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewCertificate = (certificate: IssuedCertificate) => {
    setSelectedCertificate(certificate);
    setIsViewModalOpen(true);
  };

  const handleEditCertificate = (certificate: IssuedCertificate) => {
    setSelectedCertificate(certificate);
    setIsEditModalOpen(true);
  };

  const handleDeleteCertificate = (admissionNumber: string) => {
    setCertificateToDelete(admissionNumber);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCertificate = () => {
    if (certificateToDelete) {
      setIssuedCertificates(prev =>
        prev.filter(cert => cert.admissionNumber !== certificateToDelete)
      );
      setIsDeleteModalOpen(false);
      setCertificateToDelete(null);
    }
  };

  const filteredCertificates = issuedCertificates.filter(certificate => {
    const matchesClass = filterClass
      ? certificate.studentClass.toLowerCase().trim() === filterClass.toLowerCase().trim()
      : true;
  
    const matchesSearch = searchQuery
      ? Object.values(certificate).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;
    return matchesClass && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      <ToastContainer position="top-right" />
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Transfer Certificates</h2>
            <p className="text-gray-600 mt-1">Manage and generate student transfer certificates</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Generate New Certificate
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Filter by Class</option>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-md pl-10"
              placeholder="Search by name, admission number, or TC no"
            />
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TC No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leaving Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((certificate, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {certificate.tcNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {certificate.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {certificate.studentClass}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {certificate.admissionNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {certificate.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {certificate.leavingDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-full"
                        title="View Certificate"
                        onClick={() => handleViewCertificate(certificate)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-100 rounded-full"
                        title="Edit Certificate"
                        onClick={() => handleEditCertificate(certificate)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
                        title="Delete Certificate"
                        onClick={() => handleDeleteCertificate(certificate.admissionNumber)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCertificates.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TCFormModal
        isOpen={isModalOpen || isEditModalOpen}
        onClose={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
        isEdit={isEditModalOpen}
        certificate={selectedCertificate}
        setIssuedCertificates={setIssuedCertificates}
      />

      <TCViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        certificate={selectedCertificate}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-[95%]">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Delete Certificate</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this certificate?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCertificate}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TCList;