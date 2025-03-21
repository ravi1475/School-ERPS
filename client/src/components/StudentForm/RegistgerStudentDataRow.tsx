import React from "react";
import { useNavigate } from "react-router-dom";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNo: string;
};

type StudentDataRowProps = {
  student: Student;
  onShowDetails?: (id: string) => void;
};

const StudentDataRow: React.FC<StudentDataRowProps> = ({ student, onShowDetails }) => {
  const navigate = useNavigate();

  const handleShowDetails = () => {
    // You can either use the onShowDetails prop if you want to keep that functionality
    if (onShowDetails) {
      onShowDetails(student.id);
    }
    
    // Or directly navigate to the student details page
    navigate(`/student/${student.id}`);
  };

  return (
    <tr className="border-b border-gray-300">
      <td className="px-4 py-2">{`${student.firstName} ${student.lastName}`}</td>
      <td className="px-4 py-2">{student.admissionNo}</td>
      <td className="px-4 py-2">{student.className}</td>
      <td className="px-4 py-2">{student.section}</td>
      <td className="px-4 py-2">{student.rollNo}</td>
      <td className="px-4 py-2">
        <button
          onClick={handleShowDetails}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
        >
          Show Details
        </button>
      </td>
    </tr>
  );
};

export default StudentDataRow;
