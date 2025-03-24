import React, { useEffect, useState } from "react";
import StudentDataRow from "./RegistgerStudentDataRow";
import { useNavigate } from "react-router-dom";

type Student = {
  formNo: string;
  firstName: string;
  lastName: string;
  gender: string;
  regnDate: string;
  paymentStatus: string;
};

const StudentDataTable: React.FC = () => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/register/student/allStudent");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      const allStudent: Student[] = data.data;
      setStudentData(allStudent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleShowDetails = (id: string) => {
    navigate(`/students/${id}`);
  };

  const totalPages = Math.ceil(studentData.length / itemsPerPage);
  const paginatedData = studentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-4 rounded-2xl">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-4">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={fetchStudents}
            className="mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Retry
          </button>
        </div>
      ) : studentData.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-200">
            <thead className="rounded-2xl bg-amber-200">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Student Name</th>
                <th className="border border-gray-300 px-4 py-2">Form No</th>
                <th className="border border-gray-300 px-4 py-2">Gender</th>
                <th className="border border-gray-300 px-4 py-2">Registration Date</th>
                <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((student) => (
                <tr
                  key={student.formNo}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border border-gray-300 px-4 py-2">{student.firstName} {student.lastName}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.formNo}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.gender}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.regnDate}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.paymentStatus}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleShowDetails(student.formNo)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Show Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDataTable;
