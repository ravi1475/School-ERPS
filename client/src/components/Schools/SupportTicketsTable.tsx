import React, { useState } from "react";
import ViewTicketModal from "./Support_viewTicket";

interface SupportTicket {
  id: number;
  date: string;
  school: string;
  user: string;
  complaint: string;
  file1: File | null;
  file2: File | null;
  contactNo: string;
  status: "open" | "close";
}

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  onStatusChange: (id: number, status: "open" | "close") => void;
}

const SupportTicketsTable: React.FC<SupportTicketsTableProps> = ({
  tickets,
  onStatusChange,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const handleStatusChange = (id: number, value: string) => {
    onStatusChange(id, value as "open" | "close");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-black">
        <thead className="text-xs text-white uppercase bg-gray-800">
          <tr>
            <th className="px-4 py-2">SNo</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">School</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Complaint</th>
            <th className="px-4 py-2">Attachment</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">View</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <tr key={ticket.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{ticket.date}</td>
                <td className="px-4 py-2">{ticket.school}</td>
                <td className="px-4 py-2">{ticket.user}</td>
                <td className="px-4 py-2">{ticket.complaint}</td>
                <td className="px-4 py-2">
                  {ticket.file1 || ticket.file2 ? (
                    <div>
                      {ticket.file1 && (
                        <span className="text-green-600">{ticket.file1.name}</span>
                      )}
                      {ticket.file1 && ticket.file2 && <br />}
                      {ticket.file2 && (
                        <span className="text-green-600">{ticket.file2.name}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">No files</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    className="p-1 border rounded text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="close">Close</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                   

 className="text-green-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-4 py-2 text-center">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedTicket && (
        <ViewTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default SupportTicketsTable;