import React, { useState } from "react";
import SupportTicketsTable from "./SupportTicketsTable";

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

interface SupportTabsProps {
  tickets: SupportTicket[];
  onStatusChange: (id: number, status: "open" | "close" | "reopen") => void;
}

const SupportTabs: React.FC<SupportTabsProps> = ({ tickets, onStatusChange }) => {
  const [activeTab, setActiveTab] = useState<"open" | "close" | "reopen">("open");

  const openTickets = tickets.filter((ticket) => ticket.status === "open");
  const closeTickets = tickets.filter((ticket) => ticket.status === "close");
  const reopenTickets = tickets.filter((ticket) => ticket.status === "reopen");

  const getFilteredTickets = () => {
    if (activeTab === "open") return openTickets;
    if (activeTab === "close") return closeTickets;
    return reopenTickets;
  };

  return (
    <div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("open")}
          className={`px-4 py-2 rounded-full text-white border-2 ${
            activeTab === "open"
              ? "bg-blue-600 border-blue-600"
              : "bg-gray-400 border-gray-400"
          }`}
        >
          OPEN ({openTickets.length})
        </button>
        <button
          onClick={() => setActiveTab("close")}
          className={`px-4 py-2 rounded-full text-white border-2 ${
            activeTab === "close"
              ? "bg-blue-600 border-blue-600"
              : "bg-gray-400 border-gray-400"
          }`}
        >
          CLOSE ({closeTickets.length})
        </button>
        <button
          onClick={() => setActiveTab("reopen")}
          className={`px-4 py-2 rounded-full text-white border-2 ${
            activeTab === "reopen"
              ? "bg-blue-600 border-blue-600"
              : "bg-gray-400 border-gray-400"
          }`}
        >
          RE-OPEN ({reopenTickets.length})
        </button>
      </div>
      <SupportTicketsTable
        tickets={getFilteredTickets()}
        onStatusChange={onStatusChange}
      />
      <div className="mt-4 flex justify-between items-center">
        <p>Records: {getFilteredTickets().length}</p>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 bg-gray-200 rounded">{"<"}</button>
          <button className="px-2 py-1 bg-gray-200 rounded">{">"}</button>
          <input
            type="text"
            placeholder="Page no"
            className="w-20 p-1 border rounded"
          />
          <button className="px-4 py-1 bg-green-600 text-white rounded">GO</button>
        </div>
      </div>
    </div>
  );
};

export default SupportTabs;