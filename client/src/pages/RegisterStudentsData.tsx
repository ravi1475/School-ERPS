import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import RegisterStudentDataTable from "./../components/StudentForm/RegisterStudentDataTable";

const StudentDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterClass, setFilterClass] = useState("");
  const [formNo, setFormNo] = useState(""); // State to store the input value

  return (
    <div className="w-full p-4 grid grid-cols-1">
      <div className="border-gray-200 border rounded-xl p-4 shadow-sm shadow-gray-300">
        <h1 className="text-2xl font-bold text-center mb-6">Register Students Data</h1>

        {/* Search and Filter Section */}
        <div className="space-y-6">
          {/* Search and Filter Input in One Row */}
          <div className="flex items-center border border-gray-300 p-2 rounded-md">
            {/* Class Selection Dropdown */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="p-2 border rounded-md w-fit bg-white"
            >
              <option value="">All Classes</option>
              <option value="Nursery">Nursery</option>
              <option value="KG">KG</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
              <option value="5th">5th</option>
              <option value="6th">6th</option>
              <option value="7th">7th</option>
              <option value="8th">8th</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>

            {/* Search Input Field */}
            <div className="flex items-center space-x-2 flex-grow border-l pl-2">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search student by Form No.."
                className="outline-none w-full bg-transparent"
                value={formNo}
                onChange={(e) => setFormNo(e.target.value)} // Update state when typing
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && formNo) {
                    navigate(`/school/students/register/allStudents/${formNo}`);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Student Data Table */}
        <div className="mt-6 border border-gray-300 rounded-md p-4">
          <RegisterStudentDataTable />
        </div>
      </div>
    </div>
  );
};

export default StudentDataPage;
