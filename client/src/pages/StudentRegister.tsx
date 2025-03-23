import { useState, ChangeEvent, FormEvent } from "react";
// import RegisterStudentForm from "../components/StudentForm/RegisterStudentForm";
// import ReactDOMServer from "react-dom/server";

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  formNo: string;
  dob: string;
  category: string;
  religion: string;
  registerForClass: string;
  admissionCategory: string;
  bloodGroup: string;
  regnDate: string;
  testDate: string;
  transactionNo: string;
  singleParent: boolean;
  contactNo: string;
  studentEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  studentAadharCardNo: string;
  regnCharge: string;
  examSubject: string;
  paymentStatus: string;
  fatherName: string;
  fatherMobileNo: string;
  smsAlert: boolean;
  fatherEmail: string;
  fatherAadharCardNo: string;
  isFatherCampusEmployee: boolean;
  motherName: string;
  motherMobileNo: string;
  motherAadharCardNo: string;
  casteCertificate: File | null;
  studentAadharCard: File | null;
  fatherAadharCard: File | null;
  motherAadharCard: File | null;
  previousClassMarksheet: File | null;
  transferCertificate: File | null;
  studentDateOfBirthCertificate: File | null;
}

const StudentRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    formNo: "",
    dob: "",
    category: "",
    religion: "",
    registerForClass: "",
    admissionCategory: "",
    bloodGroup: "",
    regnDate: "",
    testDate: "",
    transactionNo: "",
    singleParent: false,
    contactNo: "",
    studentEmail: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    studentAadharCardNo: "",
    regnCharge: "",
    examSubject: "",
    paymentStatus: "",
    fatherName: "",
    fatherMobileNo: "",
    smsAlert: false,
    fatherEmail: "",
    fatherAadharCardNo: "",
    isFatherCampusEmployee: false,
    motherName: "",
    motherMobileNo: "",
    motherAadharCardNo: "",
    casteCertificate: null,
    studentAadharCard: null,
    fatherAadharCard: null,
    motherAadharCard: null,
    previousClassMarksheet: null,
    transferCertificate: null,
    studentDateOfBirthCertificate: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };


 const handlePrintInfo = () => {
    try {
      // Ensure formNo is available
      if (!formData.formNo) {
        alert("Please enter a valid Form Number.");
        return;
      }
  
      // Use formData directly as student data is already available
      const student = formData;
  
      const printContent = `
        <h2>Student Information</h2>
        <p><strong>First Name:</strong> ${student.firstName}</p>
        <p><strong>Last Name:</strong> ${student.lastName}</p>
        <p><strong>Gender:</strong> ${student.gender}</p>
        <p><strong>Form No:</strong> ${student.formNo}</p>
        <p><strong>Date of Birth:</strong> ${student.dob}</p>
        <p><strong>Category:</strong> ${student.category}</p>
        <p><strong>Religion:</strong> ${student.religion}</p>
        <p><strong>Registering for Class:</strong> ${student.registerForClass}</p>
        <p><strong>Admission Category:</strong> ${student.admissionCategory}</p>
        <p><strong>Blood Group:</strong> ${student.bloodGroup}</p>
        <p><strong>Registration Date:</strong> ${student.regnDate}</p>
        <p><strong>Test Date:</strong> ${student.testDate}</p>
        <p><strong>Transaction No:</strong> ${student.transactionNo}</p>
        <p><strong>Single Parent:</strong> ${student.singleParent ? "Yes" : "No"}</p>
        <p><strong>Contact No:</strong> ${student.contactNo}</p>
        <p><strong>Email:</strong> ${student.studentEmail}</p>
        <p><strong>Address:</strong> ${student.address}, ${student.city}, ${student.state} - ${student.pincode}</p>
        <p><strong>Student Aadhar Card No:</strong> ${student.studentAadharCardNo}</p>
        <p><strong>Registration Charge:</strong> ${student.regnCharge}</p>
        <p><strong>Exam Subject:</strong> ${student.examSubject}</p>
        <p><strong>Payment Status:</strong> ${student.paymentStatus}</p>
        <p><strong>Father's Name:</strong> ${student.fatherName}</p>
        <p><strong>Father's Mobile No:</strong> ${student.fatherMobileNo}</p>
        <p><strong>SMS Alert:</strong> ${student.smsAlert ? "Enabled" : "Disabled"}</p>
        <p><strong>Father's Email:</strong> ${student.fatherEmail}</p>
        <p><strong>Father's Aadhar Card No:</strong> ${student.fatherAadharCardNo}</p>
        <p><strong>Is Father Campus Employee:</strong> ${student.isFatherCampusEmployee ? "Yes" : "No"}</p>
        <p><strong>Mother's Name:</strong> ${student.motherName}</p>
        <p><strong>Mother's Mobile No:</strong> ${student.motherMobileNo}</p>
        <p><strong>Mother's Aadhar Card No:</strong> ${student.motherAadharCardNo}</p>
      `;
  
      // Open a new window and print the student details
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`<html><head><title>Student Info</title></head><body>${printContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Error printing student info:", error);
      alert("Failed to print student information.");
    }
  };

  const handlePrintForm = () => {
    try {
      const printContent = `<div className="flex justify-center p-4">
      <div className="w-full max-w-4xl border border-gray-800">
        <div className="flex justify-between border-b border-gray-800">
          <div className="flex-grow"></div>
          <div className="text-center py-2">
            <div className="text-blue-700 font-medium">Registration Form</div>
            <div>Registration No.: ${formData.formNo}</div>
          </div>
          <div className="border-l border-gray-800 w-32"></div>
        </div>

        <div className="border-b border-gray-800">
          <div className="text-center py-1 font-medium border-b border-gray-800">Program and Application Details</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2 w-1/3">Register for Class</td>
                <td className="border border-gray-800 p-2">${formData.registerForClass}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="border-b border-gray-800">
          <div className="text-center py-1 font-medium border-b border-gray-800">Personal Details</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2 w-1/3">Student Name</td>
                <td className="border border-gray-800 p-2">${formData.firstName} ${formData.lastName}</td>
                <td className="border border-gray-800 p-2 w-1/4">Date of Birth</td>
                <td className="border border-gray-800 p-2">${formData.dob}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Aadhaar Card Number</td>
                <td className="border border-gray-800 p-2">${formData.studentAadharCardNo}</td>
                <td className="border border-gray-800 p-2">Gender</td>
                <td className="border border-gray-800 p-2">${formData.gender}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Email Address</td>
                <td className="border border-gray-800 p-2">${formData.studentEmail}</td>
                <td className="border border-gray-800 p-2">Religion</td>
                <td className="border border-gray-800 p-2">${formData.religion}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Paid Amount</td>
                <td className="border border-gray-800 p-2">${formData.regnCharge}</td>
                <td className="border border-gray-800 p-2">Transaction ID</td>
                <td className="border border-gray-800 p-2">${formData.transactionNo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-b border-gray-800">
          <div className="text-center py-1 font-medium border-b border-gray-800">Parent's Details</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2 w-1/4">Father's Name :</td>
                <td className="border border-gray-800 p-2">${formData.fatherName}</td>
                <td className="border border-gray-800 p-2 w-1/4">Aadhaar Card No. :</td>
                <td className="border border-gray-800 p-2">${formData.fatherAadharCardNo}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Mobile Number :</td>
                <td className="border border-gray-800 p-2">${formData.fatherMobileNo}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">Mother's Name :</td>
                <td className="border border-gray-800 p-2">${formData.motherName}</td>
                <td className="border border-gray-800 p-2">Aadhaar Card No. :</td>
                <td className="border border-gray-800 p-2">${formData.motherAadharCardNo}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`
  
      // Open a new window and print the student details
      const printWindow = window.open("", "_blank");
      if (!printWindow) throw new Error("Failed to open print window");
  
      printWindow.document.write(`
        <html>
          <head>
            <title>Student Info</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
  
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Error printing student info:", error);
      alert("Failed to print student information.");
    }
  };

  
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      const response = await fetch(
        `http://localhost:5000/register/student/addNew?formNo=${formData.formNo}`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      // const data = await response.json();
      if (response.ok) {
        alert("Registration submitted successfully!");
      }
    } catch (err) {
      setError((err as Error).message);
      alert("Failed to submit registration. Please check your backend server.");
    } finally {
      // alert
    }
  };

  // if (loading) return <div className="text-center py-10">Submitting...</div>;
  // if (error)
  //   return (
  //     <div className="text-center py-10 text-red-500">
  //       {error}. Please ensure the backend server is running at
  //       http://localhost:5000.
  //     </div>
  //   );

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        STUDENT REGISTRATION
      </h1>
      <form onSubmit={handleSubmit}>
      {/* Student Information Section */}
      <div className="p-6 border rounded-lg shadow-md bg-white mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Student Information
        </h2>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form No
            </label>
            <input
              type="text"
              name="formNo"
              value={formData.formNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="Date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="Text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Religion
            </label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Register For Class
            </label>
            <input
              type="text"
              name="registerForClass"
              value={formData.registerForClass}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admission Category
            </label>
            <input
              type="text"
              name="admissionCategory"
              value={formData.admissionCategory}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Date
            </label>
            <input
              type="Date"
              name="regnDate"
              value={formData.regnDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Date
            </label>
            <input
              type="Date"
              name="testDate"
              value={formData.testDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracsaction Number
            </label>
            <input
              type="text"
              name="transactionNo"
              value={formData.transactionNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Email
            </label>
            <input
              type="email"
              name="studentEmail"
              value={formData.studentEmail}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="Text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="Text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="Text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              type="Text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Aadhar Card Number
            </label>
            <input
              type="Text"
              name="studentAadharCardNo"
              value={formData.studentAadharCardNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Charge
            </label>
            <input
              type="Text"
              name="regnCharge"
              value={formData.regnCharge}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Subject
            </label>
            <input
              type="Text"
              name="examSubject"
              value={formData.examSubject}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <input
              type="Text"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Single Parent
            </label>
            <input
              type="checkbox"
              name="singleParent"
              checked={formData.singleParent}
              onChange={handleChange}
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
     

      {/* Father Details Section */}
      <div className="p-6 border rounded-lg shadow-md bg-white mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Father Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father Name
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father Mobile No
            </label>
            <input
              type="text"
              name="fatherMobileNo"
              value={formData.fatherMobileNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father Email
            </label>
            <input
              type="text"
              name="fatherEmail"
              value={formData.fatherEmail}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father Aadhar Card No
            </label>
            <input
              type="text"
              name="fatherAadharCardNo"
              value={formData.fatherAadharCardNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMS Alert
            </label>
            <input
              type="checkbox"
              name="smsAlert"
              checked={formData.smsAlert}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Is Father Campus Employee
            </label>
            <input
              type="checkbox"
              name="isFatherCampusEmployee"
              checked={formData.isFatherCampusEmployee}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Mother Details Section */}
      <div className="p-6 border rounded-lg shadow-md bg-white mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Mother Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mother Name
            </label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mother Mobile No
            </label>
            <input
              type="text"
              name="motherMobileNo"
              value={formData.motherMobileNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mother Aadhar Card No
            </label>
            <input
              type="text"
              name="motherAadharCardNo"
              value={formData.motherAadharCardNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="p-6 border rounded-lg shadow-md bg-white mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caste Certificate
            </label>
            <input
              type="file"
              name="casteCertificate"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Aadhar Card
            </label>
            <input
              type="file"
              name="studentAadharCard"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father Aadhar Card
            </label>
            <input
              type="file"
              name="fatherAadharCard"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mother Aadhar Card
            </label>
            <input
              type="file"
              name="motherAdharCard"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Previous Class Marksheet
            </label>
            <input
              type="file"
              name="previousClassMarksheet"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transfer Certificate
            </label>
            <input
              type="file"
              name="transferCertificate"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Date of Birth Certificate
            </label>
            <input
              type="file"
              name="studentDateOfBirthCertificate"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

     {/* Buttons */}
 <div className="flex justify-end space-x-4 mb-4">
  {/* Print Info Button */}
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    onClick={handlePrintInfo}
  >
    Print Info
  </button>

  {/* Print Form Button */}
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    onClick={handlePrintForm}
  >
    Print Form
  </button>

  {/* Submit Button (Triggers API Request) */}
  
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      type="submit"
    >
      Save
    </button>

  {/* Reset Button (Does Not Trigger API Request) */}
  <button
    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
    onClick={() =>
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        formNo: "",
        dob: "",
        category: "",
        religion: "",
        registerForClass: "",
        admissionCategory: "",
        bloodGroup: "",
        regnDate: "",
        testDate: "",
        transactionNo: "",
        singleParent: false,
        contactNo: "",
        studentEmail: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        studentAadharCardNo: "",
        regnCharge: "",
        examSubject: "",
        paymentStatus: "",
        fatherName: "",
        fatherMobileNo: "",
        smsAlert: false,
        fatherEmail: "",
        fatherAadharCardNo: "",
        isFatherCampusEmployee: false,
        motherName: "",
        motherMobileNo: "",
        motherAadharCardNo: "",
        casteCertificate: null,
        studentAadharCard: null,
        fatherAadharCard: null,
        motherAadharCard: null,
        previousClassMarksheet: null,
        transferCertificate: null,
        studentDateOfBirthCertificate: null,
      })
    }
  >
    Reset
  </button>
    </div>
      </form>
    </div>
  );
};

export default StudentRegistration;
