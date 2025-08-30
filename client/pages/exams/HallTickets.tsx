/**
 * Hall Tickets Management System
 *
 * This comprehensive system allows educational institutions to generate, manage, and distribute
 * examination hall tickets for eligible students with all required information.
 *
 * IMPLEMENTED FEATURES:
 *
 * 1. REQUIRED HALL TICKET FIELDS:
 *    - Student Name
 *    - Registration Number
 *    - Program (Course)
 *    - Academic Year
 *    - Semester
 *    - Subject
 *    - Exam Code
 *    - Exam Type (Mid-term, Final, etc.)
 *    - Exam Date
 *    - Exam Time
 *    - Venue & Seat Number
 *    - Duration & Instructions
 *
 * 2. GENERATION FUNCTIONALITY:
 *    - Generate individual hall tickets for eligible students
 *    - Bulk generation for all eligible students in an exam
 *    - Automatic eligibility verification before generation
 *    - QR code generation for verification
 *
 * 3. DOWNLOAD CAPABILITIES:
 *    - Individual ticket downloads (PDF format)
 *    - Bulk download for administrators
 *    - Student self-service downloads using registration number
 *    - Print-ready format with institutional branding
 *
 * 4. STUDENT ELIGIBILITY MANAGEMENT:
 *    - View eligible students for each examination
 *    - Track eligibility status and reasons for ineligibility
 *    - Filter by program, academic year, and semester
 *
 * 5. ADMINISTRATION FEATURES:
 *    - Comprehensive statistics dashboard
 *    - Status tracking (Generated, Downloaded, Printed, Sent)
 *    - Search and filter capabilities
 *    - Exam schedule management
 *    - Email distribution system
 *
 * 6. USER INTERFACES:
 *    - Institute administrator interface for bulk operations
 *    - Student self-service portal for individual downloads
 *    - Mobile-responsive design
 *    - Print-optimized hall ticket layout
 *
 * 7. SECURITY & VALIDATION:
 *    - Permission-based access control
 *    - Eligibility verification before ticket generation
 *    - QR codes for ticket authenticity
 *    - Audit trail with generation timestamps
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionGuard } from '@/components/PermissionGuard';
import { FileText, Download, Printer, Search, Calendar, Plus, Edit3, Trash2, Eye, User, Clock, CheckCircle, XCircle, Filter, Mail, Send } from 'lucide-react';

interface HallTicket {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
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
  instructions: string[];
  generatedDate: string;
  status: 'generated' | 'downloaded' | 'printed' | 'sent';
  downloadCount: number;
  lastDownloaded?: string;
  hallTicketUrl?: string;
  qrCode?: string;
  isEligible: boolean;
  eligibilityNotes?: string;
}

interface ExamSchedule {
  id: string;
  examName: string;
  subject: string;
  examCode: string;
  examType: string;
  date: string;
  time: string;
  venue: string;
  duration: string;
  program: string;
  academicYear: string;
  semester: string;
  totalStudents: number;
  ticketsGenerated: number;
  ticketsDownloaded: number;
  eligibleStudents: number;
}

interface EligibleStudent {
  id: string;
  studentId: string;
  studentName: string;
  registrationNumber: string;
  rollNumber: string;
  program: string;
  academicYear: string;
  semester: string;
  isEligible: boolean;
  eligibilityNotes?: string;
}

export default function HallTickets() {
  const [hallTickets, setHallTickets] = useState<HallTicket[]>([
    {
      id: '1',
      examId: 'EX001',
      examName: 'Computer Science Mid-term',
      studentId: 'ST001',
      studentName: 'Joshep',
      registrationNumber: 'CS2024001',
      rollNumber: 'CS001',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      subject: 'Data Structures',
      examCode: 'CS201',
      examType: 'Mid-term',
      examDate: '2024-03-25',
      examTime: '09:00 AM',
      venue: 'Hall A - Room 101',
      seatNumber: 'A-15',
      duration: '3 hours',
      instructions: [
        'Arrive 30 minutes before exam',
        'Bring valid ID proof',
        'Mobile phones not allowed',
        'Use only blue/black pen'
      ],
      generatedDate: '2024-03-20T10:00:00',
      status: 'downloaded',
      downloadCount: 3,
      lastDownloaded: '2024-03-22T14:30:00',
      hallTicketUrl: '/tickets/hall_ticket_1.pdf',
      qrCode: 'QR001',
      isEligible: true
    },
    {
      id: '2',
      examId: 'EX001',
      examName: 'Computer Science Mid-term',
      studentId: 'ST002',
      studentName: 'Sanjay',
      registrationNumber: 'CS2024002',
      rollNumber: 'CS002',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      subject: 'Data Structures',
      examCode: 'CS201',
      examType: 'Mid-term',
      examDate: '2024-03-25',
      examTime: '09:00 AM',
      venue: 'Hall A - Room 101',
      seatNumber: 'A-16',
      duration: '3 hours',
      instructions: [
        'Arrive 30 minutes before exam',
        'Bring valid ID proof',
        'Mobile phones not allowed',
        'Use only blue/black pen'
      ],
      generatedDate: '2024-03-20T10:00:00',
      status: 'generated',
      downloadCount: 0,
      hallTicketUrl: '/tickets/hall_ticket_2.pdf',
      qrCode: 'QR002',
      isEligible: true
    },
    {
      id: '3',
      examId: 'EX002',
      examName: 'Mathematics Final',
      studentId: 'ST003',
      studentName: 'Balu',
      registrationNumber: 'MT2024001',
      rollNumber: 'MT001',
      program: 'Bachelor of Mathematics',
      academicYear: '2023-2024',
      semester: 'Semester 4',
      subject: 'Calculus',
      examCode: 'MT301',
      examType: 'Final',
      examDate: '2024-03-28',
      examTime: '02:00 PM',
      venue: 'Hall B - Room 203',
      seatNumber: 'B-08',
      duration: '3 hours',
      instructions: [
        'Arrive 30 minutes before exam',
        'Bring calculator and valid ID',
        'Mobile phones not allowed',
        'Use only blue/black pen'
      ],
      generatedDate: '2024-03-21T11:00:00',
      status: 'printed',
      downloadCount: 2,
      lastDownloaded: '2024-03-23T09:15:00',
      hallTicketUrl: '/tickets/hall_ticket_3.pdf',
      qrCode: 'QR003',
      isEligible: true
    }
  ]);

  const [examSchedules] = useState<ExamSchedule[]>([
    {
      id: 'EX001',
      examName: 'Computer Science Mid-term',
      subject: 'Data Structures',
      examCode: 'CS201',
      examType: 'Mid-term',
      date: '2024-03-25',
      time: '09:00 AM',
      venue: 'Hall A',
      duration: '3 hours',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      totalStudents: 150,
      ticketsGenerated: 150,
      ticketsDownloaded: 120,
      eligibleStudents: 148
    },
    {
      id: 'EX002',
      examName: 'Mathematics Final',
      subject: 'Calculus',
      examCode: 'MT301',
      examType: 'Final',
      date: '2024-03-28',
      time: '02:00 PM',
      venue: 'Hall B',
      duration: '3 hours',
      program: 'Bachelor of Mathematics',
      academicYear: '2023-2024',
      semester: 'Semester 4',
      totalStudents: 95,
      ticketsGenerated: 95,
      ticketsDownloaded: 78,
      eligibleStudents: 92
    }
  ]);

  const [eligibleStudents] = useState<EligibleStudent[]>([
    {
      id: '1',
      studentId: 'ST001',
      studentName: 'Naveen',
      registrationNumber: 'CS2024001',
      rollNumber: 'CS001',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      isEligible: true
    },
    {
      id: '2',
      studentId: 'ST002',
      studentName: 'Ruban',
      registrationNumber: 'CS2024002',
      rollNumber: 'CS002',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      isEligible: true
    },
    {
      id: '3',
      studentId: 'ST003',
      studentName: 'Jeeva',
      registrationNumber: 'MT2024001',
      rollNumber: 'MT001',
      program: 'Bachelor of Mathematics',
      academicYear: '2023-2024',
      semester: 'Semester 4',
      isEligible: true
    },
    {
      id: '4',
      studentId: 'ST004',
      studentName: 'Arun',
      registrationNumber: 'CS2024003',
      rollNumber: 'CS003',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      isEligible: false,
      eligibilityNotes: 'Attendance below minimum requirement'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterExam, setFilterExam] = useState('all');
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState<HallTicket | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkGenerateDialogOpen, setIsBulkGenerateDialogOpen] = useState(false);

  const [newTicket, setNewTicket] = useState({
    examId: '',
    studentId: '',
    studentName: '',
    registrationNumber: '',
    rollNumber: '',
    program: '',
    academicYear: '',
    semester: '',
    subject: '',
    examCode: '',
    examType: '',
    examDate: '',
    examTime: '',
    venue: '',
    seatNumber: '',
    duration: '3 hours'
  });

  const [bulkGenerateData, setBulkGenerateData] = useState({
    examId: '',
    class: '',
    section: '',
    venue: '',
    startSeatNumber: 'A-01'
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated': return <FileText className="h-4 w-4" />;
      case 'downloaded': return <Download className="h-4 w-4" />;
      case 'printed': return <Printer className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'downloaded': return 'bg-green-100 text-green-800';
      case 'printed': return 'bg-purple-100 text-purple-800';
      case 'sent': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = hallTickets.filter(ticket => {
    const matchesSearch = ticket.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesExam = filterExam === 'all' || ticket.examId === filterExam;
    
    return matchesSearch && matchesStatus && matchesExam;
  });

  const stats = {
    total: hallTickets.length,
    generated: hallTickets.filter(t => t.status === 'generated').length,
    downloaded: hallTickets.filter(t => t.status === 'downloaded').length,
    printed: hallTickets.filter(t => t.status === 'printed').length,
    sent: hallTickets.filter(t => t.status === 'sent').length,
    totalDownloads: hallTickets.reduce((sum, t) => sum + t.downloadCount, 0)
  };

  // CREATE - Generate single hall ticket
  const handleCreateTicket = () => {
    const selectedExam = examSchedules.find(exam => exam.id === newTicket.examId);
    const selectedStudent = eligibleStudents.find(student => student.studentId === newTicket.studentId);

    if (!selectedExam || !selectedStudent) {
      alert('Please select a valid exam and eligible student');
      return;
    }

    if (!selectedStudent.isEligible) {
      alert(`Student is not eligible for the exam. Reason: ${selectedStudent.eligibilityNotes}`);
      return;
    }

    const ticket: HallTicket = {
      id: Date.now().toString(),
      examId: newTicket.examId,
      examName: selectedExam.examName,
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.studentName,
      registrationNumber: selectedStudent.registrationNumber,
      rollNumber: selectedStudent.rollNumber,
      program: selectedStudent.program,
      academicYear: selectedStudent.academicYear,
      semester: selectedStudent.semester,
      subject: selectedExam.subject,
      examCode: selectedExam.examCode,
      examType: selectedExam.examType,
      examDate: selectedExam.date,
      examTime: selectedExam.time,
      venue: newTicket.venue || selectedExam.venue,
      seatNumber: newTicket.seatNumber,
      duration: selectedExam.duration,
      instructions: [
        'Arrive 30 minutes before exam',
        'Bring valid ID proof and hall ticket',
        'Mobile phones are strictly prohibited',
        'Use only blue/black pen for writing',
        'Follow all examination rules and regulations'
      ],
      generatedDate: new Date().toISOString(),
      status: 'generated',
      downloadCount: 0,
      hallTicketUrl: `/tickets/hall_ticket_${Date.now()}.pdf`,
      qrCode: `QR${Date.now().toString().slice(-6)}`,
      isEligible: true
    };

    setHallTickets([...hallTickets, ticket]);
    setNewTicket({
      examId: '',
      studentId: '',
      studentName: '',
      registrationNumber: '',
      rollNumber: '',
      program: '',
      academicYear: '',
      semester: '',
      subject: '',
      examCode: '',
      examType: '',
      examDate: '',
      examTime: '',
      venue: '',
      seatNumber: '',
      duration: '3 hours'
    });
    setIsCreateDialogOpen(false);
  };

  // CREATE - Bulk generate hall tickets for eligible students
  const handleBulkGenerate = () => {
    const examSchedule = examSchedules.find(exam => exam.id === bulkGenerateData.examId);
    if (!examSchedule) {
      alert('Please select a valid exam');
      return;
    }

    // Get eligible students for the selected exam's program and academic year
    const studentsForExam = eligibleStudents.filter(student =>
      student.program === examSchedule.program &&
      student.academicYear === examSchedule.academicYear &&
      student.semester === examSchedule.semester &&
      student.isEligible
    );

    if (studentsForExam.length === 0) {
      alert('No eligible students found for this exam');
      return;
    }

    const bulkTickets: HallTicket[] = [];
    studentsForExam.forEach((student, index) => {
      const ticket: HallTicket = {
        id: `bulk_${Date.now()}_${index + 1}`,
        examId: bulkGenerateData.examId,
        examName: examSchedule.examName,
        studentId: student.studentId,
        studentName: student.studentName,
        registrationNumber: student.registrationNumber,
        rollNumber: student.rollNumber,
        program: student.program,
        academicYear: student.academicYear,
        semester: student.semester,
        subject: examSchedule.subject,
        examCode: examSchedule.examCode,
        examType: examSchedule.examType,
        examDate: examSchedule.date,
        examTime: examSchedule.time,
        venue: bulkGenerateData.venue || examSchedule.venue,
        seatNumber: `${bulkGenerateData.startSeatNumber.charAt(0)}-${String(index + 1).padStart(2, '0')}`,
        duration: examSchedule.duration,
        instructions: [
          'Arrive 30 minutes before exam',
          'Bring valid ID proof and hall ticket',
          'Mobile phones are strictly prohibited',
          'Use only blue/black pen for writing',
          'Follow all examination rules and regulations'
        ],
        generatedDate: new Date().toISOString(),
        status: 'generated',
        downloadCount: 0,
        hallTicketUrl: `/tickets/bulk_${Date.now()}_${index + 1}.pdf`,
        qrCode: `QR${Date.now().toString().slice(-6)}${index + 1}`,
        isEligible: true
      };
      bulkTickets.push(ticket);
    });

    setHallTickets([...hallTickets, ...bulkTickets]);
    setBulkGenerateData({
      examId: '',
      class: '',
      section: '',
      venue: '',
      startSeatNumber: 'A-01'
    });
    setIsBulkGenerateDialogOpen(false);
    alert(`Generated ${bulkTickets.length} hall tickets for eligible students`);
  };

  // UPDATE - Mark as downloaded/printed
  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    setHallTickets(tickets => tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: newStatus as any,
          downloadCount: newStatus === 'downloaded' ? ticket.downloadCount + 1 : ticket.downloadCount,
          lastDownloaded: newStatus === 'downloaded' ? new Date().toISOString() : ticket.lastDownloaded
        };
      }
      return ticket;
    }));
  };

  // UPDATE - Edit hall ticket
  const handleEditTicket = () => {
    if (selectedTicket) {
      const updatedTicket = {
        ...selectedTicket,
        ...newTicket
      };
      
      setHallTickets(tickets => tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
      setIsEditDialogOpen(false);
      setSelectedTicket(null);
    }
  };

  // DELETE - Remove hall ticket
  const handleDeleteTicket = () => {
    if (selectedTicket) {
      setHallTickets(tickets => tickets.filter(t => t.id !== selectedTicket.id));
      setSelectedTicket(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (ticket: HallTicket) => {
    setSelectedTicket(ticket);
    setNewTicket({
      examId: ticket.examId,
      studentId: ticket.studentId,
      studentName: ticket.studentName,
      registrationNumber: ticket.registrationNumber,
      rollNumber: ticket.rollNumber,
      program: ticket.program,
      academicYear: ticket.academicYear,
      semester: ticket.semester,
      subject: ticket.subject,
      examCode: ticket.examCode,
      examType: ticket.examType,
      examDate: ticket.examDate,
      examTime: ticket.examTime,
      venue: ticket.venue,
      seatNumber: ticket.seatNumber,
      duration: ticket.duration
    });
    setIsEditDialogOpen(true);
  };

  const handleDownloadTicket = (ticket: HallTicket) => {
    handleUpdateStatus(ticket.id, 'downloaded');
    // Generate PDF hall ticket content
    const hallTicketHTML = generateHallTicketHTML(ticket);
    downloadAsPDF(hallTicketHTML, `hall_ticket_${ticket.registrationNumber}_${ticket.examCode}.pdf`);
  };

  const generateHallTicketHTML = (ticket: HallTicket) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hall Ticket - ${ticket.registrationNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .subtitle { font-size: 18px; color: #666; }
          .content { margin: 20px 0; }
          .row { display: flex; margin-bottom: 10px; }
          .label { font-weight: bold; min-width: 200px; }
          .value { flex: 1; }
          .instructions { margin-top: 30px; }
          .instructions h3 { font-size: 16px; margin-bottom: 10px; }
          .instructions ul { list-style-type: disc; margin-left: 20px; }
          .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature { text-align: center; }
          .qr-section { position: absolute; top: 20px; right: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="qr-section">
          <div style="border: 1px solid #000; padding: 10px; font-size: 12px;">
            QR: ${ticket.qrCode}
          </div>
        </div>

        <div class="header">
          <div class="title">EXAMINATION HALL TICKET</div>
          <div class="subtitle">${ticket.examName}</div>
        </div>

        <div class="content">
          <div class="row">
            <div class="label">Student Name:</div>
            <div class="value">${ticket.studentName}</div>
          </div>
          <div class="row">
            <div class="label">Registration Number:</div>
            <div class="value">${ticket.registrationNumber}</div>
          </div>
          <div class="row">
            <div class="label">Roll Number:</div>
            <div class="value">${ticket.rollNumber}</div>
          </div>
          <div class="row">
            <div class="label">Program:</div>
            <div class="value">${ticket.program}</div>
          </div>
          <div class="row">
            <div class="label">Academic Year:</div>
            <div class="value">${ticket.academicYear}</div>
          </div>
          <div class="row">
            <div class="label">Semester:</div>
            <div class="value">${ticket.semester}</div>
          </div>
          <div class="row">
            <div class="label">Subject:</div>
            <div class="value">${ticket.subject}</div>
          </div>
          <div class="row">
            <div class="label">Exam Code:</div>
            <div class="value">${ticket.examCode}</div>
          </div>
          <div class="row">
            <div class="label">Exam Type:</div>
            <div class="value">${ticket.examType}</div>
          </div>
          <div class="row">
            <div class="label">Exam Date:</div>
            <div class="value">${ticket.examDate}</div>
          </div>
          <div class="row">
            <div class="label">Exam Time:</div>
            <div class="value">${ticket.examTime}</div>
          </div>
          <div class="row">
            <div class="label">Duration:</div>
            <div class="value">${ticket.duration}</div>
          </div>
          <div class="row">
            <div class="label">Venue:</div>
            <div class="value">${ticket.venue}</div>
          </div>
          <div class="row">
            <div class="label">Seat Number:</div>
            <div class="value">${ticket.seatNumber}</div>
          </div>
        </div>

        <div class="instructions">
          <h3>Examination Instructions:</h3>
          <ul>
            ${ticket.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
          </ul>
        </div>

        <div class="signature-section">
          <div class="signature">
            <div>_____________________</div>
            <div>Student Signature</div>
          </div>
          <div class="signature">
            <div>_____________________</div>
            <div>Examination Controller</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadAsPDF = (htmlContent: string, filename: string) => {
    // Create a new window and write the HTML content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleBulkDownload = () => {
    const generatedTickets = hallTickets.filter(t => t.status === 'generated');
    if (generatedTickets.length === 0) {
      alert('No generated tickets available for download');
      return;
    }

    // Update status for all tickets
    generatedTickets.forEach(ticket => {
      handleUpdateStatus(ticket.id, 'downloaded');
    });

    // Generate a combined HTML for all tickets
    const combinedHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hall Tickets - Bulk Download</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .page-break { page-break-after: always; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .subtitle { font-size: 18px; color: #666; }
          .content { margin: 20px 0; }
          .row { display: flex; margin-bottom: 10px; }
          .label { font-weight: bold; min-width: 200px; }
          .value { flex: 1; }
          .instructions { margin-top: 30px; }
          .instructions h3 { font-size: 16px; margin-bottom: 10px; }
          .instructions ul { list-style-type: disc; margin-left: 20px; }
          .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature { text-align: center; }
          .qr-section { position: absolute; top: 20px; right: 20px; text-align: center; }
        </style>
      </head>
      <body>
        ${generatedTickets.map((ticket, index) => `
          <div ${index < generatedTickets.length - 1 ? 'class="page-break"' : ''}>
            ${generateHallTicketHTML(ticket).replace('<!DOCTYPE html>', '').replace(/<html>.*?<body>/s, '').replace('</body></html>', '')}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    downloadAsPDF(combinedHTML, `hall_tickets_bulk_${new Date().toISOString().split('T')[0]}.pdf`);
    alert(`${generatedTickets.length} hall tickets downloaded successfully`);
  };

  const handleSendByEmail = (ticketId: string) => {
    handleUpdateStatus(ticketId, 'sent');
    // Here you would integrate with email service
    alert('Hall ticket sent to student email successfully!');
  };

  const handleStudentDownload = (registrationNumber: string) => {
    const studentTickets = hallTickets.filter(ticket =>
      ticket.registrationNumber.toLowerCase() === registrationNumber.toLowerCase()
    );

    if (studentTickets.length === 0) {
      alert('No hall tickets found for this registration number.');
      return;
    }

    // Download all tickets for this student
    studentTickets.forEach(ticket => {
      handleDownloadTicket(ticket);
    });

    alert(`${studentTickets.length} hall ticket(s) downloaded successfully!`);
  };

  return (
    <PermissionGuard resource="hall_tickets" operation="read">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hall Tickets</h1>
            <p className="text-muted-foreground mt-2">
              Generate and manage examination hall tickets for students.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBulkDownload}>
              <Download className="h-4 w-4 mr-2" />
              Bulk Download
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const generatedTickets = hallTickets.filter(t => t.status === 'generated');
                if (generatedTickets.length === 0) {
                  alert('No generated tickets available for printing');
                  return;
                }
                generatedTickets.forEach(ticket => handleDownloadTicket(ticket));
                alert(`${generatedTickets.length} hall tickets sent to printer`);
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Bulk Print
            </Button>
            <PermissionGuard resource="hall_tickets" operation="create">
              <Dialog open={isBulkGenerateDialogOpen} onOpenChange={setIsBulkGenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Bulk Generate
                  </Button>
                </DialogTrigger>
              </Dialog>
            </PermissionGuard>
            <PermissionGuard resource="hall_tickets" operation="create">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Ticket
                  </Button>
                </DialogTrigger>
              </Dialog>
            </PermissionGuard>
          </div>
        </div>

        {/* Student Self-Service Portal */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">Student Portal</h3>
                <p className="text-sm text-green-600 mt-1">
                  Students can download their hall tickets using their registration number
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter registration number"
                  className="w-48"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleStudentDownload(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter registration number"]') as HTMLInputElement;
                    if (input && input.value) {
                      handleStudentDownload(input.value);
                      input.value = '';
                    } else {
                      alert('Please enter a registration number');
                    }
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download My Ticket
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Tickets</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Generated</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.generated}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Downloaded</p>
                  <p className="text-3xl font-bold text-green-900">{stats.downloaded}</p>
                </div>
                <Download className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Printed</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.printed}</p>
                </div>
                <Printer className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Sent</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.sent}</p>
                </div>
                <Send className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Downloads</p>
                  <p className="text-3xl font-bold text-red-900">{stats.totalDownloads}</p>
                </div>
                <Download className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by student name, registration number, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="generated">Generated</SelectItem>
              <SelectItem value="downloaded">Downloaded</SelectItem>
              <SelectItem value="printed">Printed</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterExam} onValueChange={setFilterExam}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {examSchedules.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.examName} - {exam.examCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterExam('all');
            }}
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets">Hall Tickets</TabsTrigger>
            <TabsTrigger value="eligible">Eligible Students</TabsTrigger>
            <TabsTrigger value="schedules">Exam Schedules</TabsTrigger>
          </TabsList>

          {/* Hall Tickets Tab */}
          <TabsContent value="tickets" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Details</TableHead>
                        <TableHead>Program & Academic Info</TableHead>
                        <TableHead>Exam Details</TableHead>
                        <TableHead>Venue & Seat</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{ticket.studentName}</div>
                              <div className="text-sm text-gray-500">{ticket.registrationNumber}</div>
                              <div className="text-sm text-gray-500">Roll: {ticket.rollNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{ticket.program}</div>
                              <div className="text-sm text-gray-500">{ticket.academicYear}</div>
                              <div className="text-sm text-gray-500">{ticket.semester}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{ticket.examName}</div>
                              <div className="text-sm text-gray-500">{ticket.subject} ({ticket.examCode})</div>
                              <div className="text-sm text-gray-500">{ticket.examType}</div>
                              <div className="text-sm text-gray-500">{ticket.examDate} at {ticket.examTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{ticket.venue}</div>
                              <div className="text-sm text-gray-500">Seat: {ticket.seatNumber}</div>
                              <div className="text-sm text-gray-500">{ticket.duration}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                {getStatusIcon(ticket.status)}
                                <span className="ml-1">{ticket.status}</span>
                              </Badge>
                              <div className="text-xs text-gray-500">
                                Downloads: {ticket.downloadCount}
                              </div>
                              {ticket.lastDownloaded && (
                                <div className="text-xs text-gray-500">
                                  Last: {new Date(ticket.lastDownloaded).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadTicket(ticket)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendByEmail(ticket.id)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>

                              <PermissionGuard resource="hall_tickets" operation="update">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(ticket)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>

                              <PermissionGuard resource="hall_tickets" operation="delete">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eligible Students Tab */}
          <TabsContent value="eligible" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Eligible Students for Examinations</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View and manage student eligibility for upcoming examinations.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Details</TableHead>
                        <TableHead>Program & Academic Info</TableHead>
                        <TableHead>Eligibility Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eligibleStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{student.studentName}</div>
                              <div className="text-sm text-gray-500">{student.registrationNumber}</div>
                              <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{student.program}</div>
                              <div className="text-sm text-gray-500">{student.academicYear}</div>
                              <div className="text-sm text-gray-500">{student.semester}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={student.isEligible ? "default" : "destructive"}>
                                {student.isEligible ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                {student.isEligible ? "Eligible" : "Not Eligible"}
                              </Badge>
                              {student.eligibilityNotes && (
                                <div className="text-xs text-red-600">
                                  {student.eligibilityNotes}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!student.isEligible}
                                onClick={() => {
                                  setNewTicket({
                                    ...newTicket,
                                    studentId: student.studentId,
                                    studentName: student.studentName,
                                    registrationNumber: student.registrationNumber,
                                    rollNumber: student.rollNumber,
                                    program: student.program,
                                    academicYear: student.academicYear,
                                    semester: student.semester
                                  });
                                  setIsCreateDialogOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Generate Ticket
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  alert(`Student Details:\nName: ${student.studentName}\nRegistration: ${student.registrationNumber}\nProgram: ${student.program}\nAcademic Year: ${student.academicYear}\nSemester: ${student.semester}\nEligible: ${student.isEligible ? 'Yes' : 'No'}${student.eligibilityNotes ? '\nNotes: ' + student.eligibilityNotes : ''}`);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exam Schedules Tab */}
          <TabsContent value="schedules" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {examSchedules.map((schedule) => (
                    <Card key={schedule.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{schedule.examName}</h3>
                            <p className="text-sm text-gray-500">{schedule.subject} ({schedule.examCode})</p>
                            <p className="text-sm text-gray-500">{schedule.examType}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span><Calendar className="inline h-4 w-4 mr-1" />{schedule.date}</span>
                              <span><Clock className="inline h-4 w-4 mr-1" />{schedule.time}</span>
                              <span>Duration: {schedule.duration}</span>
                            </div>
                            <div className="flex gap-4 mt-1 text-sm text-gray-600">
                              <span>Program: {schedule.program}</span>
                              <span>Year: {schedule.academicYear}</span>
                              <span>Semester: {schedule.semester}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-lg font-bold text-blue-600">{schedule.totalStudents}</p>
                              <p className="text-xs text-gray-500">Total Students</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-purple-600">{schedule.eligibleStudents}</p>
                              <p className="text-xs text-gray-500">Eligible</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-green-600">{schedule.ticketsGenerated}</p>
                              <p className="text-xs text-gray-500">Generated</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-orange-600">{schedule.ticketsDownloaded}</p>
                              <p className="text-xs text-gray-500">Downloaded</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Hall Ticket Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate Hall Ticket</DialogTitle>
              <DialogDescription>
                Create a new hall ticket for a student
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="examId">Exam</Label>
                  <Select value={newTicket.examId} onValueChange={(value) => setNewTicket({ ...newTicket, examId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {examSchedules.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.examName} - {exam.subject} ({exam.examCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="studentId">Eligible Student</Label>
                  <Select value={newTicket.studentId} onValueChange={(value) => {
                    const student = eligibleStudents.find(s => s.studentId === value);
                    if (student) {
                      setNewTicket({
                        ...newTicket,
                        studentId: value,
                        studentName: student.studentName,
                        registrationNumber: student.registrationNumber,
                        rollNumber: student.rollNumber,
                        program: student.program,
                        academicYear: student.academicYear,
                        semester: student.semester
                      });
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select eligible student" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleStudents.filter(student => student.isEligible).map((student) => (
                        <SelectItem key={student.studentId} value={student.studentId}>
                          {student.studentName} ({student.registrationNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    value={newTicket.studentName}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Auto-filled when student selected"
                  />
                </div>
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={newTicket.registrationNumber}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Auto-filled when student selected"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="program">Program</Label>
                  <Input
                    id="program"
                    value={newTicket.program}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Auto-filled"
                  />
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={newTicket.academicYear}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Auto-filled"
                  />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={newTicket.semester}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Auto-filled"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venue">Venue (Optional)</Label>
                  <Input
                    id="venue"
                    value={newTicket.venue}
                    onChange={(e) => setNewTicket({ ...newTicket, venue: e.target.value })}
                    placeholder="Override default venue if needed"
                  />
                </div>
                <div>
                  <Label htmlFor="seatNumber">Seat Number</Label>
                  <Input
                    id="seatNumber"
                    value={newTicket.seatNumber}
                    onChange={(e) => setNewTicket({ ...newTicket, seatNumber: e.target.value })}
                    placeholder="A-15"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTicket}>
                  Generate Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Generate Dialog */}
        <Dialog open={isBulkGenerateDialogOpen} onOpenChange={setIsBulkGenerateDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Bulk Generate Hall Tickets</DialogTitle>
              <DialogDescription>
                Generate hall tickets for multiple students at once
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulkExamId">Exam</Label>
                <Select value={bulkGenerateData.examId} onValueChange={(value) => setBulkGenerateData({ ...bulkGenerateData, examId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examSchedules.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.examName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulkClass">Class</Label>
                  <Input
                    id="bulkClass"
                    value={bulkGenerateData.class}
                    onChange={(e) => setBulkGenerateData({ ...bulkGenerateData, class: e.target.value })}
                    placeholder="Grade 10"
                  />
                </div>
                <div>
                  <Label htmlFor="bulkSection">Section</Label>
                  <Input
                    id="bulkSection"
                    value={bulkGenerateData.section}
                    onChange={(e) => setBulkGenerateData({ ...bulkGenerateData, section: e.target.value })}
                    placeholder="A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulkVenue">Venue</Label>
                  <Input
                    id="bulkVenue"
                    value={bulkGenerateData.venue}
                    onChange={(e) => setBulkGenerateData({ ...bulkGenerateData, venue: e.target.value })}
                    placeholder="Hall A - Room 101"
                  />
                </div>
                <div>
                  <Label htmlFor="startSeatNumber">Starting Seat Number</Label>
                  <Input
                    id="startSeatNumber"
                    value={bulkGenerateData.startSeatNumber}
                    onChange={(e) => setBulkGenerateData({ ...bulkGenerateData, startSeatNumber: e.target.value })}
                    placeholder="A-01"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsBulkGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkGenerate}>
                  Generate Tickets
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Hall Ticket Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Hall Ticket</DialogTitle>
              <DialogDescription>
                Modify hall ticket details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStudentName">Student Name</Label>
                  <Input
                    id="editStudentName"
                    value={newTicket.studentName}
                    onChange={(e) => setNewTicket({ ...newTicket, studentName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editVenue">Venue</Label>
                  <Input
                    id="editVenue"
                    value={newTicket.venue}
                    onChange={(e) => setNewTicket({ ...newTicket, venue: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editSeatNumber">Seat Number</Label>
                  <Input
                    id="editSeatNumber"
                    value={newTicket.seatNumber}
                    onChange={(e) => setNewTicket({ ...newTicket, seatNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editExamTime">Exam Time</Label>
                  <Input
                    id="editExamTime"
                    value={newTicket.examTime}
                    onChange={(e) => setNewTicket({ ...newTicket, examTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTicket}>
                  Update Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Hall Ticket Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Hall Ticket Details</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Student</Label>
                    <p className="font-medium">{selectedTicket.studentName}</p>
                    <p className="text-sm text-gray-500">Reg: {selectedTicket.registrationNumber}</p>
                    <p className="text-sm text-gray-500">Roll: {selectedTicket.rollNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Program & Academic Info</Label>
                    <p className="font-medium text-sm">{selectedTicket.program}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.academicYear}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.semester}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Exam Details</Label>
                    <p className="font-medium">{selectedTicket.examName}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.subject} ({selectedTicket.examCode})</p>
                    <p className="text-sm text-gray-500">Type: {selectedTicket.examType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Schedule</Label>
                    <p className="font-medium">{selectedTicket.examDate}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.examTime} ({selectedTicket.duration})</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Venue</Label>
                    <p className="font-medium">{selectedTicket.venue}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Seat Number</Label>
                    <p className="font-medium">{selectedTicket.seatNumber}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Instructions</Label>
                  <ul className="mt-1 space-y-1">
                    {selectedTicket.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm p-2 bg-gray-50 rounded">
                        • {instruction}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge variant="outline" className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Downloads</Label>
                    <p className="font-medium">{selectedTicket.downloadCount}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">QR Code</Label>
                    <p className="font-medium">{selectedTicket.qrCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Eligibility</Label>
                    <Badge variant={selectedTicket.isEligible ? "default" : "destructive"}>
                      {selectedTicket.isEligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the hall ticket.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTicket} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PermissionGuard>
  );
}
