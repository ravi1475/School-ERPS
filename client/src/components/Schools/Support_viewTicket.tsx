import React from "react";

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

interface ViewTicketModalProps {
  ticket: SupportTicket;
  onClose: () => void;
}

const ViewTicketModal: React.FC<ViewTicketModalProps> = ({ ticket, onClose }) => {
  const isImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  // Handle click on the overlay to close the modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click target is the overlay itself (not the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl relative h-[90vh] overflow-y-scroll scrollbar-hide">
        <h2 className="text-xl text-[#1D4ED8] font-semibold mb-4 mr-12">Ticket Details</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="space-y-4">
          <div>
            <strong>Date:</strong> {ticket.date}
          </div>
          <div>
            <strong>School:</strong> {ticket.school}
          </div>
          <div>
            <strong>User:</strong> {ticket.user}
          </div>
          <div>
            <strong>Contact No:</strong> {ticket.contactNo}
          </div>
          <div>
            <strong>Complaint:</strong> {ticket.complaint}
          </div>
          <div>
            <strong>Status:</strong> {ticket.status}
          </div>
          <div>
            <strong>Attached Files:</strong>
            <div className="mt-2 space-y-4">
              {ticket.file1 ? (
                isImage(ticket.file1) ? (
                  <div>
                    <p>{ticket.file1.name}</p>
                    <img
                      src={URL.createObjectURL(ticket.file1)}
                      alt={ticket.file1.name}
                      className="max-w-full h-auto mt-2 rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <a
                      href={URL.createObjectURL(ticket.file1)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {ticket.file1.name}
                    </a>
                  </div>
                )
              ) : (
                <p>No File 1</p>
              )}
              {ticket.file2 ? (
                isImage(ticket.file2) ? (
                  <div>
                    <p>{ticket.file2.name}</p>
                    <img
                      src={URL.createObjectURL(ticket.file2)}
                      alt={ticket.file2.name}
                      className="max-w-full h-auto mt-2 rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <a
                      href={URL.createObjectURL(ticket.file2)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {ticket.file2.name}
                    </a>
                  </div>
                )
              ) : (
                <p>No File 2</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicketModal;