import React, { useState } from "react";
import SupportTabs from "./SupportTabs";
import SupportForm from "./SupportForm";

interface SupportTicket {
  id: number;
  date: string;
  school: string;
  user: string;
  complaint: string;
  file1: File | null;
  file2: File | null;
  contactNo: string;
  status: "open" | "close" | "reopen";
}

const SupportDashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 1,
      date: "22/02/2025",
      school: "NATIONAL PUBLIC SCHOOL",
      user: "Divya Shardwa",
      complaint:
        "Hello Team, May we request you to provide us with the complete dump data or history of our records as a csv file or in any format. Let me know if you have any questions. Thank You",
      file1: null,
      file2: null,
      contactNo: "",
      status: "open",
    },
  ]);

  const handleAddTicket = (formData: {
    date: string;
    schoolName: string;
    user: string;
    contactNo: string;
    complaint: string;
    file1: File | null;
    file2: File | null;
  }) => {
    const newTicket: SupportTicket = {
      id: tickets.length + 1,
      date: formData.date,
      school: formData.schoolName,
      user: formData.user,
      complaint: formData.complaint,
      file1: formData.file1,
      file2: formData.file2,
      contactNo: formData.contactNo,
      status: "open",
    };
    setTickets([...tickets, newTicket]);
    setShowForm(false);
  };

  const handleStatusChange = (id: number, status: "open" | "close" | "reopen") => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-[#1D4ED8] font-semibold text-center mb-6">
        SUPPORT
      </h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="divya"
            className="p-2 border rounded"
          />
          <button className="p-2 bg-gray-200 rounded">🔍</button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add New
        </button>
      </div>

      {showForm && (
        <SupportForm
          onSubmit={handleAddTicket}
          onClose={() => setShowForm(false)}
        />
      )}

      <SupportTabs tickets={tickets} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default SupportDashboard;