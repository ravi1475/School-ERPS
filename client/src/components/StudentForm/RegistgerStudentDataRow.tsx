import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Student = {
  formNo: string;
  firstName: string;
  lastName: string;
  gender: string;
  regnDate: string;
  paymentStatus: string;
};

type StudentDataRowProps = {
  student: Student;
  onShowDetails?: (id: string) => void;
};

const StudentDataRow: React.FC<StudentDataRowProps> = ({ student, onShowDetails }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShowDetails = async () => {
    try {
      setError(null);
      setIsLoading(true);
      if (onShowDetails) {
        await onShowDetails(student.formNo);
      } else {
        await navigate(`/school/students/register/allstudent/${student.formNo}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to show details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr className="border-b border-gray-300">
      <td className="px-4 py-2">{`${student.firstName} ${student.lastName}`}</td>
      <td className="px-4 py-2">{student.formNo}</td>
      <td className="px-4 py-2">{student.gender}</td>
      <td className="px-4 py-2">{student.regnDate}</td>
      <td className="px-4 py-2">{student.paymentStatus}</td>
      <td className="px-4 py-2">
        <button
          onClick={handleShowDetails}
          className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
        >
          Show Details
        </button>
      </td>
    </tr>
  );
};

export default StudentDataRow;
