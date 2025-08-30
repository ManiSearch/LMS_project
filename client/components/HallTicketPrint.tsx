import React from 'react';

interface HallTicketData {
  studentName: string;
  registrationNumber: string;
  rollNumber: string;
  program: string;
  academicYear: string;
  semester: string;
  subject: string;
  examCode: string;
  examType: string;
  examDate: string;
  examTime: string;
  venue: string;
  seatNumber: string;
  duration: string;
  examName: string;
  instructions: string[];
  qrCode: string;
  generatedDate: string;
}

interface HallTicketPrintProps {
  ticket: HallTicketData;
  instituteName?: string;
  instituteLogo?: string;
}

export const HallTicketPrint: React.FC<HallTicketPrintProps> = ({ 
  ticket, 
  instituteName = "EDUCATIONAL INSTITUTE",
  instituteLogo 
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none print:p-0">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          {instituteLogo && (
            <img src={instituteLogo} alt="Institute Logo" className="h-16 w-16 mr-4" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{instituteName}</h1>
            <h2 className="text-xl font-semibold text-gray-600 mt-1">EXAMINATION HALL TICKET</h2>
          </div>
          <div className="ml-4 text-right">
            <div className="border border-gray-800 p-2 text-xs">
              <div>QR Code</div>
              <div className="font-mono">{ticket.qrCode}</div>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-700">{ticket.examName}</h3>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="space-y-3">
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Student Name:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.studentName}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Reg. Number:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.registrationNumber}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Roll Number:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.rollNumber}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Program:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.program}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Academic Year:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.academicYear}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Semester:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.semester}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Subject:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.subject}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Exam Code:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.examCode}
            </span>
          </div>
        </div>
      </div>

      {/* Exam Details */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="space-y-3">
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Exam Type:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.examType}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Exam Date:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {new Date(ticket.examDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Exam Time:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.examTime}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Duration:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.duration}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Venue:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.venue}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32 text-gray-700">Seat Number:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium">
              {ticket.seatNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-3 text-lg">EXAMINATION INSTRUCTIONS:</h4>
        <div className="grid grid-cols-2 gap-4">
          {ticket.instructions.map((instruction, index) => (
            <div key={index} className="flex items-start">
              <span className="font-bold mr-2 text-gray-600">{index + 1}.</span>
              <span className="text-gray-700">{instruction}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Photo and Signature Section */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="text-center">
          <div className="border border-gray-400 h-32 w-24 mx-auto mb-2 flex items-center justify-center bg-gray-50">
            <span className="text-xs text-gray-500">Student Photo</span>
          </div>
          <p className="text-xs text-gray-600">Affix recent passport size photograph</p>
        </div>
        
        <div className="text-center">
          <div className="border-b border-gray-400 h-16 mb-2 flex items-end justify-center">
            <span className="text-xs text-gray-500 mb-1">Student Signature</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="border-b border-gray-400 h-16 mb-2 flex items-end justify-center">
            <span className="text-xs text-gray-500 mb-1">Examination Controller</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-400 pt-4 text-center">
        <p className="text-xs text-gray-600">
          This hall ticket is valid only for the examination mentioned above. 
          Any alteration or damage will render this ticket invalid.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Generated on: {new Date(ticket.generatedDate).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default HallTicketPrint;
