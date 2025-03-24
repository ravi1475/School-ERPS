import React, { useState } from "react";

interface SupportFormData {
  date: string;
  schoolName: string;
  user: string;
  contactNo: string;
  complaint: string;
  file1: File | null;
  file2: File | null;
}

interface SupportFormProps {
  onSubmit: (formData: SupportFormData) => void;
  onClose: () => void;
}

const SupportForm: React.FC<SupportFormProps> = ({ onSubmit, onClose }) => {
  const getISTTime = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:mm
  };

  const initialFormState: SupportFormData = {
    date: getISTTime(),
    schoolName: "NATIONAL PUBLIC SCHOOL",
    user: "",
    contactNo: "",
    complaint: "",
    file1: null,
    file2: null,
  };

  const [formData, setFormData] = useState<SupportFormData>(initialFormState);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData({
      ...initialFormState,
      date: getISTTime(),
    });
    const fileInput1 = document.getElementById("file1") as HTMLInputElement;
    const fileInput2 = document.getElementById("file2") as HTMLInputElement;
    if (fileInput1) fileInput1.value = "";
    if (fileInput2) fileInput2.value = "";
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl relative">
        <h1 className="text-2xl text-[#1D4ED8] font-semibold text-center mb-6 relative">
          SUPPORT
        </h1>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="p-2">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between mb-4">
              <div className="w-[48%]">
                <label
                  htmlFor="date"
                  className="block text-sm text-black font-medium mb-1"
                >
                  Date & Time (IST)
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
              <div className="w-[48%]">
                <label
                  htmlFor="schoolName"
                  className="block text-sm text-black font-medium mb-1"
                >
                  School Name
                </label>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  placeholder="School Name"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="w-[48%]">
                <label
                  htmlFor="user"
                  className="block text-sm text-black font-medium mb-1"
                >
                  User
                </label>
                <input
                  type="text"
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  placeholder="User"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
              <div className="w-[48%]">
                <label
                  htmlFor="contactNo"
                  className="block text-sm text-black font-medium mb-1"
                >
                  Contact No
                </label>
                <input
                  type="text"
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  placeholder="Contact No"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="complaint"
                className="block text-sm text-black font-medium mb-1"
              >
                Complaint
              </label>
              <textarea
                id="complaint"
                name="complaint"
                value={formData.complaint}
                onChange={handleInputChange}
                placeholder="Enter your complaint here"
                className="w-full p-2 border border-gray-300 rounded-md text-sm text-black h-24 resize-y"
              />
            </div>
            <div className="flex justify-between mb-4">
              <div className="w-[48%]">
                <label
                  htmlFor="file1"
                  className="block text-sm text-black font-medium mb-1"
                >
                  Attach file 1
                </label>
                <input
                  type="file"
                  id="file1"
                  name="file1"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
              <div className="w-[48%]">
                <label
                  htmlFor="file2"
                  className="block text-sm text-black font-medium mb-1"
                >
                  Attach file 2
                </label>
                <input
                  type="file"
                  id="file2"
                  name="file2"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-yellow-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportForm;