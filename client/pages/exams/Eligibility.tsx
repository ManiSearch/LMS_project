/**
 * Comprehensive Role-Based Eligibility and Exam Registration System
 * 
 * This module provides complete eligibility checking, exam registration, and timetable management
 * for different roles:
 * - Admin: Configure timetables, criteria, handle exceptions, manage registrations
 * - Faculty: Monitor eligibility reports, approve exceptions, verify data
 * - Student: View timetables, check eligibility, pay fees, register for exams
 * - Parent: Monitor child's eligibility and exam readiness
 * 
 * Features:
 * - Automatic timetable generation with exam codes
 * - Comprehensive eligibility criteria (attendance, dues, fees)
 * - Exception handling with approval workflows
 * - Online/offline fee payment integration
 * - Registration number generation
 * - Role-based dashboards and notifications
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { PermissionGuard } from '@/components/PermissionGuard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Settings,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  DollarSign,
  CreditCard,
  FileText,
  Send,
  UserCheck,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Bell,
  Shield,
  TrendingUp,
  BarChart3,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Copy,
  CheckSquare,
  AlertCircle,
  Info
} from 'lucide-react';

// Enhanced interfaces for the comprehensive system
interface ExamTimetable {
  id: string;
  examCode: string;
  program: string;
  academicYear: string;
  semester: string;
  subject: string;
  subjectCode: string;
  examType: 'Regular' | 'Backlog' | 'Supplementary';
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  venue: string;
  maxMarks: number;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  invigilators: string[];
}

interface EligibilityCriteria {
  id: string;
  program: string;
  academicYear: string;
  semester: string;
  examType: 'Regular' | 'Backlog' | 'Supplementary';
  minAttendancePercent: number;
  requiresNoDues: boolean;
  requiresSemesterFee: boolean;
  requiresLibraryDues: boolean;
  requiresHostelDues: boolean;
  allowExceptions: boolean;
  exceptionApprovalLevel: 'HOD' | 'Principal' | 'Dean';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StudentEligibility {
  id: string;
  studentId: string;
  studentName: string;
  registrationNumber: string;
  program: string;
  academicYear: string;
  semester: string;
  rollNumber: string;
  section: string;
  contactNumber: string;
  email: string;
  parentContact: string;
  attendancePercent: number;
  semesterFeePaid: boolean;
  libraryDuesCleared: boolean;
  hostelDuesCleared: boolean;
  overallEligibilityStatus: 'Eligible' | 'Not Eligible' | 'Conditional' | 'Exception Approved';
  eligibilityIssues: string[];
  registrationNumber: string;
  registrationStatus: 'Not Registered' | 'Registered' | 'Fee Pending' | 'Payment Failed';
  examFeeAmount: number;
  examFeePaid: boolean;
  paymentMode: 'Online' | 'Offline' | 'Not Paid';
  paymentDate?: string;
  paymentReference?: string;
  lastUpdated: string;
}

interface ExceptionRequest {
  id: string;
  studentId: string;
  studentName: string;
  registrationNumber: string;
  program: string;
  semester: string;
  examType: string;
  reason: string;
  supportingDocuments: string[];
  requestedBy: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  reviewedBy?: string;
  reviewDate?: string;
  reviewComments?: string;
  approvalLevel: 'HOD' | 'Principal' | 'Dean';
}

interface ExamRegistration {
  id: string;
  studentId: string;
  examId: string;
  registrationNumber: string;
  hallTicketNumber: string;
  seatNumber: string;
  venue: string;
  registrationDate: string;
  isActive: boolean;
}

export default function Eligibility() {
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Dialog states
  const [isCreateTimetableDialogOpen, setIsCreateTimetableDialogOpen] = useState(false);
  const [isCreateCriteriaDialogOpen, setIsCreateCriteriaDialogOpen] = useState(false);
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  // Sample data - in real app this would come from API
  const [examTimetables, setExamTimetables] = useState<ExamTimetable[]>([
    {
      id: '1',
      examCode: 'CS2024MID001',
      program: 'Computer Science',
      academicYear: '2024',
      semester: 'Semester 3',
      subject: 'Data Structures',
      subjectCode: 'CS301',
      examType: 'Regular',
      examDate: '2024-04-15',
      startTime: '09:00',
      endTime: '12:00',
      duration: 180,
      venue: 'Hall A',
      maxMarks: 100,
      isPublished: true,
      createdBy: 'admin',
      createdAt: '2024-03-01T10:00:00Z',
      invigilators: ['Dr.joshua', 'Prof.deepak']
    },
    {
      id: '2',
      examCode: 'CS2024MID002',
      program: 'Computer Science',
      academicYear: '2024',
      semester: 'Semester 3',
      subject: 'Operating Systems',
      subjectCode: 'CS302',
      examType: 'Regular',
      examDate: '2024-04-17',
      startTime: '14:00',
      endTime: '17:00',
      duration: 180,
      venue: 'Hall B',
      maxMarks: 100,
      isPublished: true,
      createdBy: 'admin',
      createdAt: '2024-03-01T10:00:00Z',
      invigilators: ['Dr. Davis', 'Prof. Wilson']
    }
  ]);

  const [eligibilityCriteria, setEligibilityCriteria] = useState<EligibilityCriteria[]>([
    {
      id: '1',
      program: 'Computer Science',
      academicYear: '2024',
      semester: 'Semester 3',
      examType: 'Regular',
      minAttendancePercent: 75,
      requiresNoDues: true,
      requiresSemesterFee: true,
      requiresLibraryDues: true,
      requiresHostelDues: true,
      allowExceptions: true,
      exceptionApprovalLevel: 'HOD',
      isActive: true,
      createdAt: '2024-03-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    }
  ]);

  const [studentEligibilities, setStudentEligibilities] = useState<StudentEligibility[]>([
    {
      id: '1',
      studentId: 'ST001',
      studentName: 'Abinesh',
      registrationNumber: 'CS2024001',
      program: 'Computer Science',
      academicYear: '2024',
      semester: 'Semester 3',
      rollNumber: 'CS21001',
      section: 'A',
      contactNumber: '+1234567890',
      email: 'abinesh@gmail.com',
      parentContact: '+1234567891',
      attendancePercent: 85,
      semesterFeePaid: true,
      libraryDuesCleared: true,
      hostelDuesCleared: true,
      overallEligibilityStatus: 'Eligible',
      eligibilityIssues: [],
      registrationStatus: 'Registered',
      examFeeAmount: 500,
      examFeePaid: true,
      paymentMode: 'Online',
      paymentDate: '2024-03-15T10:00:00Z',
      paymentReference: 'PAY123456',
      lastUpdated: '2024-03-20T10:00:00Z'
    },
    {
      id: '2',
      studentId: 'ST002',
      studentName: 'Rahul',
      registrationNumber: 'CS2024002',
      program: 'Computer Science',
      academicYear: '2024',
      semester: 'Semester 3',
      rollNumber: 'CS21002',
      section: 'A',
      contactNumber: '+1234567892',
      email: 'rahul@gmail.com',
      parentContact: '+1234567893',
      attendancePercent: 65,
      semesterFeePaid: true,
      libraryDuesCleared: false,
      hostelDuesCleared: true,
      overallEligibilityStatus: 'Not Eligible',
      eligibilityIssues: ['Low Attendance', 'Library Dues Pending'],
      registrationStatus: 'Not Registered',
      examFeeAmount: 500,
      examFeePaid: false,
      paymentMode: 'Not Paid',
      lastUpdated: '2024-03-20T10:00:00Z'
    }
  ]);

  const [exceptionRequests, setExceptionRequests] = useState<ExceptionRequest[]>([
    {
      id: '1',
      studentId: 'ST002',
      studentName: 'Rahul',
      registrationNumber: 'CS2024002',
      program: 'Computer Science',
      semester: 'Semester 3',
      examType: 'Regular',
      reason: 'Medical emergency leading to low attendance',
      supportingDocuments: ['medical_certificate.pdf'],
      requestedBy: 'ST002',
      requestDate: '2024-03-18T10:00:00Z',
      status: 'Pending',
      approvalLevel: 'HOD'
    }
  ]);

  // Form states
  const [newTimetable, setNewTimetable] = useState({
    program: '',
    academicYear: '2024',
    semester: '',
    subject: '',
    subjectCode: '',
    examType: 'Regular' as const,
    examDate: '',
    startTime: '',
    endTime: '',
    duration: 180,
    venue: '',
    maxMarks: 100,
    invigilators: []
  });

  const [newCriteria, setNewCriteria] = useState({
    program: '',
    academicYear: '2024',
    semester: '',
    examType: 'Regular' as const,
    minAttendancePercent: 75,
    requiresNoDues: true,
    requiresSemesterFee: true,
    requiresLibraryDues: true,
    requiresHostelDues: true,
    allowExceptions: true,
    exceptionApprovalLevel: 'HOD' as const
  });

  const [newException, setNewException] = useState({
    studentId: '',
    examType: '',
    reason: '',
    supportingDocuments: []
  });

  // Utility functions
  const generateExamCode = (program: string, year: string, semester: string, subject: string, type: string) => {
    const programCode = program.replace(/\s+/g, '').substring(0, 2).toUpperCase();
    const semesterCode = semester.replace('Semester ', 'S');
    const typeCode = type.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${programCode}${year}${semesterCode}${typeCode}${random}`;
  };

  const checkStudentEligibility = (student: StudentEligibility, criteria: EligibilityCriteria) => {
    const issues = [];
    
    if (student.attendancePercent < criteria.minAttendancePercent) {
      issues.push('Low Attendance');
    }
    if (criteria.requiresSemesterFee && !student.semesterFeePaid) {
      issues.push('Semester Fee Pending');
    }
    if (criteria.requiresLibraryDues && !student.libraryDuesCleared) {
      issues.push('Library Dues Pending');
    }
    if (criteria.requiresHostelDues && !student.hostelDuesCleared) {
      issues.push('Hostel Dues Pending');
    }

    return {
      isEligible: issues.length === 0,
      issues
    };
  };

  // Statistics
  const stats = {
    totalTimetables: examTimetables.length,
    publishedTimetables: examTimetables.filter(t => t.isPublished).length,
    totalStudents: studentEligibilities.length,
    eligibleStudents: studentEligibilities.filter(s => s.overallEligibilityStatus === 'Eligible').length,
    registeredStudents: studentEligibilities.filter(s => s.registrationStatus === 'Registered').length,
    pendingPayments: studentEligibilities.filter(s => !s.examFeePaid).length,
    pendingExceptions: exceptionRequests.filter(r => r.status === 'Pending').length,
    totalRevenue: studentEligibilities.filter(s => s.examFeePaid).reduce((sum, s) => sum + s.examFeeAmount, 0)
  };

  // Event handlers
  const handleCreateTimetable = () => {
    const examCode = generateExamCode(
      newTimetable.program,
      newTimetable.academicYear,
      newTimetable.semester,
      newTimetable.subject,
      newTimetable.examType
    );

    const timetable: ExamTimetable = {
      id: Date.now().toString(),
      examCode,
      ...newTimetable,
      isPublished: false,
      createdBy: user?.name || 'Admin',
      createdAt: new Date().toISOString(),
      invigilators: []
    };

    setExamTimetables([...examTimetables, timetable]);
    setNewTimetable({
      program: '',
      academicYear: '2024',
      semester: '',
      subject: '',
      subjectCode: '',
      examType: 'Regular',
      examDate: '',
      startTime: '',
      endTime: '',
      duration: 180,
      venue: '',
      maxMarks: 100,
      invigilators: []
    });
    setIsCreateTimetableDialogOpen(false);
  };

  const handleCreateCriteria = () => {
    const criteria: EligibilityCriteria = {
      id: Date.now().toString(),
      ...newCriteria,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEligibilityCriteria([...eligibilityCriteria, criteria]);
    setNewCriteria({
      program: '',
      academicYear: '2024',
      semester: '',
      examType: 'Regular',
      minAttendancePercent: 75,
      requiresNoDues: true,
      requiresSemesterFee: true,
      requiresLibraryDues: true,
      requiresHostelDues: true,
      allowExceptions: true,
      exceptionApprovalLevel: 'HOD'
    });
    setIsCreateCriteriaDialogOpen(false);
  };

  const handleBulkEligibilityCheck = () => {
    const activeCriteria = eligibilityCriteria.find(c => c.isActive);
    if (!activeCriteria) return;

    const updatedStudents = studentEligibilities.map(student => {
      const { isEligible, issues } = checkStudentEligibility(student, activeCriteria);
      return {
        ...student,
        overallEligibilityStatus: isEligible ? 'Eligible' : 'Not Eligible' as const,
        eligibilityIssues: issues,
        lastUpdated: new Date().toISOString()
      };
    });

    setStudentEligibilities(updatedStudents);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible':
      case 'Registered':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Not Eligible':
      case 'Not Registered':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Conditional':
      case 'Fee Pending':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Exception Approved':
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Timetables</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalTimetables}</p>
                <p className="text-xs text-blue-700">{stats.publishedTimetables} published</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Eligible Students</p>
                <p className="text-3xl font-bold text-green-900">{stats.eligibleStudents}</p>
                <p className="text-xs text-green-700">of {stats.totalStudents} total</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Registrations</p>
                <p className="text-3xl font-bold text-orange-900">{stats.registeredStudents}</p>
                <p className="text-xs text-orange-700">{stats.pendingPayments} pending payments</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Fee Collection</p>
                <p className="text-3xl font-bold text-purple-900">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-purple-700">{stats.pendingExceptions} exceptions pending</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => setIsCreateTimetableDialogOpen(true)} className="h-16 flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6" />
              Create Timetable
            </Button>
            <Button variant="outline" onClick={() => setIsCreateCriteriaDialogOpen(true)} className="h-16 flex flex-col items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              Set Criteria
            </Button>
            <Button variant="outline" onClick={handleBulkEligibilityCheck} className="h-16 flex flex-col items-center gap-2">
              <RefreshCw className="h-6 w-6" />
              Check Eligibility
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TimetableManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Examination Timetable</h2>
          <p className="text-muted-foreground">Manage exam schedules and venues</p>
        </div>
        <Button onClick={() => setIsCreateTimetableDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Timetable
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Program & Semester</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examTimetables.map((timetable) => (
                <TableRow key={timetable.id}>
                  <TableCell className="font-mono">{timetable.examCode}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{timetable.subject}</div>
                      <div className="text-sm text-gray-500">{timetable.subjectCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{timetable.program}</div>
                      <div className="text-sm text-gray-500">{timetable.semester} - {timetable.academicYear}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{new Date(timetable.examDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{timetable.startTime} - {timetable.endTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>{timetable.venue}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{timetable.examType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={timetable.isPublished ? "default" : "secondary"}>
                      {timetable.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {!timetable.isPublished && (
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const EligibilityManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Eligibility Management</h2>
          <p className="text-muted-foreground">Check and manage student eligibility</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkEligibilityCheck}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Bulk Check
          </Button>
          <Button onClick={() => setIsCreateCriteriaDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Set Criteria
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Eligible">Eligible</SelectItem>
            <SelectItem value="Not Eligible">Not Eligible</SelectItem>
            <SelectItem value="Exception Approved">Exception Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Program & Semester</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Dues Status</TableHead>
                <TableHead>Eligibility Status</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentEligibilities
                .filter(student => 
                  student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .filter(student => filterStatus === 'all' || student.overallEligibilityStatus === filterStatus)
                .map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-sm text-gray-500">{student.registrationNumber}</div>
                      <div className="text-sm text-gray-500">{student.rollNumber} - Section {student.section}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.program}</div>
                      <div className="text-sm text-gray-500">{student.semester} - {student.academicYear}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${student.attendancePercent >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                        {student.attendancePercent}%
                      </span>
                      <Progress value={student.attendancePercent} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-3 w-3 ${student.semesterFeePaid ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="text-xs">Semester Fee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-3 w-3 ${student.libraryDuesCleared ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="text-xs">Library</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-3 w-3 ${student.hostelDuesCleared ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="text-xs">Hostel</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className={getStatusColor(student.overallEligibilityStatus)}>
                        {student.overallEligibilityStatus}
                      </Badge>
                      {student.eligibilityIssues.length > 0 && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                            {student.eligibilityIssues.length} issue{student.eligibilityIssues.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className={getStatusColor(student.registrationStatus)}>
                        {student.registrationStatus}
                      </Badge>
                      {student.examFeePaid && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            ₹{student.examFeeAmount} Paid
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {student.overallEligibilityStatus === 'Not Eligible' && (
                        <Button variant="outline" size="sm" onClick={() => setIsExceptionDialogOpen(true)}>
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const FacultyReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Eligibility Reports</h2>
          <p className="text-muted-foreground">View eligibility reports for students in your department</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">My Department Students</p>
                <p className="text-3xl font-bold text-blue-900">45</p>
                <p className="text-xs text-blue-700">Computer Science</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Eligible Students</p>
                <p className="text-3xl font-bold text-green-900">38</p>
                <p className="text-xs text-green-700">84.4% eligible</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">At Risk Students</p>
                <p className="text-3xl font-bold text-red-900">7</p>
                <p className="text-xs text-red-700">Need attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Exception Requests</p>
                <p className="text-3xl font-bold text-yellow-900">3</p>
                <p className="text-xs text-yellow-700">Pending review</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Eligibility Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { subject: 'Data Structures', eligible: 32, total: 38, issues: ['Low Attendance: 4', 'Fee Pending: 2'] },
              { subject: 'Operating Systems', eligible: 35, total: 38, issues: ['Low Attendance: 2', 'Library Dues: 1'] },
              { subject: 'Database Systems', eligible: 30, total: 38, issues: ['Low Attendance: 6', 'Hostel Dues: 2'] }
            ].map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium">{subject.subject}</h3>
                      <p className="text-sm text-gray-500">{subject.eligible}/{subject.total} eligible ({((subject.eligible/subject.total)*100).toFixed(1)}%)</p>
                    </div>
                    <Progress value={(subject.eligible/subject.total)*100} className="w-32" />
                  </div>
                  {subject.issues.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {subject.issues.map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FacultyExceptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exception Requests</h2>
          <p className="text-muted-foreground">Review and approve exception requests from students</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Current Issues</TableHead>
                <TableHead>Exception Reason</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  student: { name: 'Arul', reg: 'CS2024002', attendance: 65 },
                  subject: 'Data Structures',
                  issues: ['Low Attendance (65%)', 'Library Dues Pending'],
                  reason: 'Medical emergency leading to extended absence',
                  documents: ['medical_certificate.pdf', 'hospital_report.pdf'],
                  date: '2024-03-18'
                },
                {
                  student: { name: 'Mohan', reg: 'CS2024003', attendance: 72 },
                  subject: 'Operating Systems',
                  issues: ['Low Attendance (72%)'],
                  reason: 'Family emergency requiring travel',
                  documents: ['emergency_letter.pdf'],
                  date: '2024-03-19'
                }
              ].map((request, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.student.name}</div>
                      <div className="text-sm text-gray-500">{request.student.reg}</div>
                      <div className="text-sm text-gray-500">Attendance: {request.student.attendance}%</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{request.subject}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {request.issues.map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="block text-xs bg-red-50 text-red-700">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate" title={request.reason}>{request.reason}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {request.documents.map((doc, idx) => (
                        <Button key={idx} variant="outline" size="sm" className="text-xs h-6">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Recommend
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const FacultyVerification = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Verification</h2>
          <p className="text-muted-foreground">Verify attendance and academic data for students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Attendance
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
        </div>
      </div>

      {/* Data Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Attendance Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Updated:</span>
                <span className="text-sm font-medium">2024-03-20 10:30 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Verification:</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  12 students
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Source:</span>
                <span className="text-sm font-medium">Biometric System</span>
              </div>
              <Button className="w-full">
                <CheckSquare className="h-4 w-4 mr-2" />
                Verify Attendance Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Academic Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Assignment Completion:</span>
                <span className="text-sm font-medium">85% Average</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Internal Assessment:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Completed
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lab Records:</span>
                <span className="text-sm font-medium">All Submitted</span>
              </div>
              <Button className="w-full" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Review Records
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Requiring Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Students Requiring Verification</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Current Attendance</TableHead>
                <TableHead>Missing Data</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: 'Devan',
                  reg: 'CS2024004',
                  attendance: 78,
                  missing: ['Lab Session 5', 'Assignment 3'],
                  lastActivity: '2024-03-15'
                },
                {
                  name: 'Gokul',
                  reg: 'CS2024005',
                  attendance: 82,
                  missing: ['Internal Exam'],
                  lastActivity: '2024-03-18'
                }
              ].map((student, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.reg}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${student.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                        {student.attendance}%
                      </span>
                      <Progress value={student.attendance} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {student.missing.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="block text-xs bg-orange-50 text-orange-700">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(student.lastActivity).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const ExceptionManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exception Requests</h2>
          <p className="text-muted-foreground">Handle eligibility exception requests</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptionRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.studentName}</div>
                      <div className="text-sm text-gray-500">{request.registrationNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.program}</div>
                      <div className="text-sm text-gray-500">{request.semester}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.approvalLevel}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === 'Pending' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const StudentTimetable = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Examination Timetable</h2>
          <p className="text-muted-foreground">View your upcoming examinations schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Set Reminders
          </Button>
        </div>
      </div>

      {/* Current Student Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Manikandan</h3>
              <p className="text-blue-700">Registration: CS2024001 | Roll No: CS21001</p>
              <p className="text-blue-700">Computer Science - Semester 3 (2024)</p>
            </div>
            <Badge className="bg-blue-600">
              Section A
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Exams */}
      <div className="grid gap-6">
        {examTimetables
          .filter(exam => exam.isPublished)
          .map((exam) => (
            <Card key={exam.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{exam.subject}</h3>
                        <p className="text-sm text-gray-500">{exam.subjectCode} - {exam.examType} Exam</p>
                        <p className="text-sm text-gray-500">Exam Code: {exam.examCode}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{exam.startTime} - {exam.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{exam.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">Duration: {exam.duration} minutes</Badge>
                    <Badge variant="outline">Max Marks: {exam.maxMarks}</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  const StudentEligibility = () => {
    const currentStudent = studentEligibilities.find(s => s.studentId === 'ST001'); // Mock current student

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Eligibility Status</h2>
            <p className="text-muted-foreground">Check your eligibility for upcoming examinations</p>
          </div>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>

        {currentStudent && (
          <>
            {/* Overall Status */}
            <Card className={`border-2 ${currentStudent.overallEligibilityStatus === 'Eligible' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {currentStudent.overallEligibilityStatus === 'Eligible' ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-600" />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold">{currentStudent.overallEligibilityStatus}</h3>
                      <p className="text-gray-600">Overall eligibility status for examinations</p>
                    </div>
                  </div>
                  {currentStudent.overallEligibilityStatus !== 'Eligible' && (
                    <Button onClick={() => setIsExceptionDialogOpen(true)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Request Exception
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Eligibility Criteria Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Attendance</p>
                      <p className="text-2xl font-bold">{currentStudent.attendancePercent}%</p>
                      <p className="text-xs text-gray-500">Required: 75%</p>
                    </div>
                    {currentStudent.attendancePercent >= 75 ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                  <Progress value={currentStudent.attendancePercent} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Semester Fee</p>
                      <p className="text-lg font-bold">{currentStudent.semesterFeePaid ? 'Paid' : 'Pending'}</p>
                    </div>
                    {currentStudent.semesterFeePaid ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                  {!currentStudent.semesterFeePaid && (
                    <Button size="sm" className="w-full mt-3">
                      Pay Now
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Library Dues</p>
                      <p className="text-lg font-bold">{currentStudent.libraryDuesCleared ? 'Cleared' : 'Pending'}</p>
                    </div>
                    {currentStudent.libraryDuesCleared ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                  {!currentStudent.libraryDuesCleared && (
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Contact Library
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hostel Dues</p>
                      <p className="text-lg font-bold">{currentStudent.hostelDuesCleared ? 'Cleared' : 'Pending'}</p>
                    </div>
                    {currentStudent.hostelDuesCleared ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                  {!currentStudent.hostelDuesCleared && (
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Contact Hostel
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Issues and Actions */}
            {currentStudent.eligibilityIssues.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    Action Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentStudent.eligibilityIssues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <span>{issue}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Academic Office</p>
                      <p className="text-sm text-gray-500">+91 9876543210</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-500">academic@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Office Hours</p>
                      <p className="text-sm text-gray-500">9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  };

  const StudentRegistration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exam Registration</h2>
          <p className="text-muted-foreground">Register for upcoming examinations</p>
        </div>
      </div>

      {/* Registration Status */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h3 className="text-xl font-bold text-green-900">Registration Complete</h3>
                <p className="text-green-700">You are registered for all eligible examinations</p>
                <p className="text-sm text-green-600 mt-1">Registration Number: REG2024001</p>
              </div>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Hall Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registered Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Subjects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Code</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Seat Number</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  subject: 'Data Structures',
                  code: 'CS2024MID001',
                  datetime: 'April 15, 2024 - 09:00 AM',
                  venue: 'Hall A',
                  seat: 'A-101',
                  status: 'Confirmed'
                },
                {
                  subject: 'Operating Systems',
                  code: 'CS2024MID002',
                  datetime: 'April 17, 2024 - 02:00 PM',
                  venue: 'Hall B',
                  seat: 'B-205',
                  status: 'Confirmed'
                }
              ].map((exam, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{exam.subject}</TableCell>
                  <TableCell className="font-mono text-sm">{exam.code}</TableCell>
                  <TableCell>{exam.datetime}</TableCell>
                  <TableCell>{exam.venue}</TableCell>
                  <TableCell className="font-mono">{exam.seat}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      {exam.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Important Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Important Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm">Bring your hall ticket and valid ID card to the examination hall</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm">Report to the examination hall 15 minutes before the scheduled time</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm">Mobile phones and electronic devices are not allowed in the examination hall</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm">Use only blue/black ink pen for writing answers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StudentPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fee Payment</h2>
          <p className="text-muted-foreground">Manage your examination fee payments</p>
        </div>
      </div>

      {/* Payment Status */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h3 className="text-xl font-bold text-green-900">Payment Complete</h3>
                <p className="text-green-700">All examination fees have been paid</p>
                <p className="text-sm text-green-600 mt-1">Total Paid: ₹500 | Payment ID: PAY123456</p>
              </div>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono">PAY123456</TableCell>
                <TableCell>Examination Fee - Semester 3</TableCell>
                <TableCell className="font-medium">₹500</TableCell>
                <TableCell>March 15, 2024</TableCell>
                <TableCell>
                  <Badge variant="outline">Online</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Success</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Available Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">Online Payment</p>
                <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">Bank Transfer</p>
                <p className="text-sm text-gray-500">Direct bank transfer to university account</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-medium">Campus Payment</p>
                <p className="text-sm text-gray-500">Pay at university cash counter</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ParentOverview = () => {
    const childData = studentEligibilities.find(s => s.studentId === 'ST001'); // Mock child data

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Child's Academic Overview</h2>
            <p className="text-muted-foreground">Monitor your child's exam readiness and academic progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe Alerts
            </Button>
          </div>
        </div>

        {childData && (
          <>
            {/* Child Information Card */}
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <GraduationCap className="h-8 w-8 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-900">{childData.studentName}</h3>
                      <p className="text-purple-700">Registration: {childData.registrationNumber}</p>
                      <p className="text-purple-700">{childData.program} - {childData.semester}</p>
                      <p className="text-sm text-purple-600">Section {childData.section} | Roll No: {childData.rollNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${childData.overallEligibilityStatus === 'Eligible' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                      {childData.overallEligibilityStatus}
                    </Badge>
                    <p className="text-sm text-purple-600 mt-1">for examinations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Attendance</p>
                      <p className="text-2xl font-bold">{childData.attendancePercent}%</p>
                      <p className="text-xs text-gray-500">Required: 75%</p>
                    </div>
                    <div className={`p-2 rounded-full ${childData.attendancePercent >= 75 ? 'bg-green-100' : 'bg-red-100'}`}>
                      {childData.attendancePercent >= 75 ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </div>
                  <Progress value={childData.attendancePercent} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fee Status</p>
                      <p className="text-lg font-bold">{childData.semesterFeePaid ? 'Paid' : 'Pending'}</p>
                      <p className="text-xs text-gray-500">Semester Fee</p>
                    </div>
                    <div className={`p-2 rounded-full ${childData.semesterFeePaid ? 'bg-green-100' : 'bg-red-100'}`}>
                      {childData.semesterFeePaid ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Registration</p>
                      <p className="text-lg font-bold">{childData.registrationStatus}</p>
                      <p className="text-xs text-gray-500">Exam Registration</p>
                    </div>
                    <div className={`p-2 rounded-full ${childData.registrationStatus === 'Registered' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      {childData.registrationStatus === 'Registered' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Clock className="h-6 w-6 text-yellow-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Exam Fee</p>
                      <p className="text-lg font-bold">₹{childData.examFeeAmount}</p>
                      <p className="text-xs text-gray-500">{childData.examFeePaid ? 'Paid' : 'Pending'}</p>
                    </div>
                    <div className={`p-2 rounded-full ${childData.examFeePaid ? 'bg-green-100' : 'bg-red-100'}`}>
                      {childData.examFeePaid ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <DollarSign className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Exams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Examinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examTimetables.filter(exam => exam.isPublished).map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{exam.subject}</h4>
                          <p className="text-sm text-gray-500">{exam.subjectCode} - {exam.examType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{new Date(exam.examDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">{exam.startTime} - {exam.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Class Teacher</p>
                      <p className="text-sm text-gray-500">Prof.deepak: +91 9876543211</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Academic Office</p>
                      <p className="text-sm text-gray-500">Office: +91 9876543210</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Student Email</p>
                      <p className="text-sm text-gray-500">{childData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Student Mobile</p>
                      <p className="text-sm text-gray-500">{childData.contactNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  };

  const ParentEligibilityView = () => {
    const childData = studentEligibilities.find(s => s.studentId === 'ST001');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Eligibility Status</h2>
            <p className="text-muted-foreground">Detailed view of your child's examination eligibility</p>
          </div>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>

        {childData && (
          <>
            {/* Overall Status */}
            <Card className={`border-2 ${childData.overallEligibilityStatus === 'Eligible' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {childData.overallEligibilityStatus === 'Eligible' ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-600" />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold">{childData.overallEligibilityStatus}</h3>
                      <p className="text-gray-600">Overall eligibility status for examinations</p>
                      <p className="text-sm text-gray-500">Last updated: {new Date(childData.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                  {childData.eligibilityIssues.length > 0 && (
                    <div className="text-right">
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {childData.eligibilityIssues.length} Issue{childData.eligibilityIssues.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Attendance Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Current Attendance</span>
                      <span className={`font-bold ${childData.attendancePercent >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                        {childData.attendancePercent}%
                      </span>
                    </div>
                    <Progress value={childData.attendancePercent} />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Required Minimum</span>
                      <span>75%</span>
                    </div>
                    {childData.attendancePercent < 75 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700">
                          <AlertTriangle className="h-4 w-4 inline mr-1" />
                          Attendance is below required minimum. Contact class teacher for improvement plan.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Clearances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        {childData.semesterFeePaid ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Semester Fee</span>
                      </div>
                      <Badge variant={childData.semesterFeePaid ? "default" : "destructive"}>
                        {childData.semesterFeePaid ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        {childData.libraryDuesCleared ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Library Dues</span>
                      </div>
                      <Badge variant={childData.libraryDuesCleared ? "default" : "destructive"}>
                        {childData.libraryDuesCleared ? 'Cleared' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        {childData.hostelDuesCleared ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Hostel Dues</span>
                      </div>
                      <Badge variant={childData.hostelDuesCleared ? "default" : "destructive"}>
                        {childData.hostelDuesCleared ? 'Cleared' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Required */}
            {childData.eligibilityIssues.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    Action Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {childData.eligibilityIssues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <span>{issue}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Get Help
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-700">
                      <Info className="h-4 w-4 inline mr-1" />
                      You can help your child resolve these issues by contacting the respective departments or supporting with fee payments.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    );
  };

  const ParentPayments = () => {
    const childData = studentEligibilities.find(s => s.studentId === 'ST001');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Fee Payments</h2>
            <p className="text-muted-foreground">Manage and track your child's examination fee payments</p>
          </div>
          {!childData?.examFeePaid && (
            <Button onClick={() => setIsPaymentDialogOpen(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Make Payment
            </Button>
          )}
        </div>

        {childData && (
          <>
            {/* Payment Status */}
            <Card className={`border-2 ${childData.examFeePaid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {childData.examFeePaid ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-600" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">₹{childData.examFeeAmount}</h3>
                      <p className="text-gray-600">Examination Fee - {childData.examFeePaid ? 'Paid' : 'Pending'}</p>
                      {childData.examFeePaid && childData.paymentReference && (
                        <p className="text-sm text-gray-500">Payment ID: {childData.paymentReference}</p>
                      )}
                    </div>
                  </div>
                  {childData.examFeePaid && (
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            {!childData.examFeePaid && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Payment Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-20 flex flex-col items-center gap-2" onClick={() => setIsPaymentDialogOpen(true)}>
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <p className="font-medium">Pay Online</p>
                        <p className="text-xs">Credit/Debit Card, UPI, Net Banking</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <MapPin className="h-6 w-6" />
                      <div>
                        <p className="font-medium">Pay at Campus</p>
                        <p className="text-xs">Visit university cash counter</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment History */}
            {childData.examFeePaid && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">{childData.paymentReference}</TableCell>
                        <TableCell>Examination Fee - {childData.semester}</TableCell>
                        <TableCell className="font-medium">₹{childData.examFeeAmount}</TableCell>
                        <TableCell>{childData.paymentDate ? new Date(childData.paymentDate).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{childData.paymentMode}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    );
  };

  const ParentNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications & Alerts</h2>
          <p className="text-muted-foreground">Stay updated with your child's academic progress and exam updates</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Notification Settings
        </Button>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Exam Schedule Updates</p>
                <p className="text-sm text-gray-500">Get notified about timetable changes</p>
              </div>
              <Checkbox checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Eligibility Status Changes</p>
                <p className="text-sm text-gray-500">Alerts when eligibility status changes</p>
              </div>
              <Checkbox checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Reminders</p>
                <p className="text-sm text-gray-500">Reminders for pending fee payments</p>
              </div>
              <Checkbox checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Attendance Alerts</p>
                <p className="text-sm text-gray-500">Weekly attendance updates</p>
              </div>
              <Checkbox checked={true} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: 'success',
                title: 'Payment Successful',
                message: 'Examination fee payment of ₹500 completed successfully',
                time: '2 hours ago',
                icon: CheckCircle
              },
              {
                type: 'info',
                title: 'Exam Registration Confirmed',
                message: 'Your child has been successfully registered for all eligible examinations',
                time: '1 day ago',
                icon: UserCheck
              },
              {
                type: 'warning',
                title: 'Attendance Update',
                message: 'Current attendance is 85% - meeting required criteria',
                time: '2 days ago',
                icon: TrendingUp
              },
              {
                type: 'info',
                title: 'Timetable Published',
                message: 'Examination timetable for Semester 3 has been published',
                time: '3 days ago',
                icon: Calendar
              }
            ].map((notification, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded">
                <div className={`p-1 rounded-full ${
                  notification.type === 'success' ? 'bg-green-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  <notification.icon className={`h-4 w-4 ${
                    notification.type === 'success' ? 'text-green-600' :
                    notification.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>For Questions or Concerns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Parent Helpline</p>
                <p className="text-sm text-gray-500">+91 9876543212</p>
                <p className="text-xs text-gray-400">Mon-Fri 9AM-6PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Parent Portal Support</p>
                <p className="text-sm text-gray-500">parents@gmail.com</p>
                <p className="text-xs text-gray-400">24/7 email support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRoleBasedContent = () => {
    switch (userRole) {
      case 'admin':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="timetable" className="mt-6">
              <TimetableManagement />
            </TabsContent>

            <TabsContent value="eligibility" className="mt-6">
              <EligibilityManagement />
            </TabsContent>

            <TabsContent value="exceptions" className="mt-6">
              <ExceptionManagement />
            </TabsContent>
          </Tabs>
        );

      case 'faculty':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">Eligibility Reports</TabsTrigger>
              <TabsTrigger value="exceptions">Exception Requests</TabsTrigger>
              <TabsTrigger value="verification">Data Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-6">
              <FacultyReports />
            </TabsContent>

            <TabsContent value="exceptions" className="mt-6">
              <FacultyExceptions />
            </TabsContent>

            <TabsContent value="verification" className="mt-6">
              <FacultyVerification />
            </TabsContent>
          </Tabs>
        );

      case 'student':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timetable">Exam Timetable</TabsTrigger>
              <TabsTrigger value="eligibility">My Eligibility</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="payments">Fee Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="timetable" className="mt-6">
              <StudentTimetable />
            </TabsContent>

            <TabsContent value="eligibility" className="mt-6">
              <StudentEligibility />
            </TabsContent>

            <TabsContent value="registration" className="mt-6">
              <StudentRegistration />
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <StudentPayments />
            </TabsContent>
          </Tabs>
        );

      case 'parent':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility Status</TabsTrigger>
              <TabsTrigger value="payments">Fee Payments</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <ParentOverview />
            </TabsContent>

            <TabsContent value="eligibility" className="mt-6">
              <ParentEligibilityView />
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <ParentPayments />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <ParentNotifications />
            </TabsContent>
          </Tabs>
        );

      default:
        return null;
    }
  };

  return (
    <PermissionGuard resource="exam_eligibility" operation="read">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Eligibility & Exam Registration</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive eligibility checking, exam registration, and timetable management system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {userRole} View
            </Badge>
          </div>
        </div>

        {/* Role-based content */}
        {renderRoleBasedContent()}

        {/* Create Timetable Dialog */}
        <Dialog open={isCreateTimetableDialogOpen} onOpenChange={setIsCreateTimetableDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Examination Timetable</DialogTitle>
              <DialogDescription>
                Set up a new exam schedule with all necessary details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program">Program</Label>
                  <Select value={newTimetable.program} onValueChange={(value) => setNewTimetable({ ...newTimetable, program: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={newTimetable.semester} onValueChange={(value) => setNewTimetable({ ...newTimetable, semester: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semester 1">Semester 1</SelectItem>
                      <SelectItem value="Semester 2">Semester 2</SelectItem>
                      <SelectItem value="Semester 3">Semester 3</SelectItem>
                      <SelectItem value="Semester 4">Semester 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newTimetable.subject}
                    onChange={(e) => setNewTimetable({ ...newTimetable, subject: e.target.value })}
                    placeholder="Data Structures"
                  />
                </div>
                <div>
                  <Label htmlFor="subjectCode">Subject Code</Label>
                  <Input
                    id="subjectCode"
                    value={newTimetable.subjectCode}
                    onChange={(e) => setNewTimetable({ ...newTimetable, subjectCode: e.target.value })}
                    placeholder="CS301"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select value={newTimetable.examType} onValueChange={(value) => setNewTimetable({ ...newTimetable, examType: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Backlog">Backlog</SelectItem>
                      <SelectItem value="Supplementary">Supplementary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="examDate">Exam Date</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={newTimetable.examDate}
                    onChange={(e) => setNewTimetable({ ...newTimetable, examDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={newTimetable.venue}
                    onChange={(e) => setNewTimetable({ ...newTimetable, venue: e.target.value })}
                    placeholder="Hall A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newTimetable.startTime}
                    onChange={(e) => setNewTimetable({ ...newTimetable, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newTimetable.endTime}
                    onChange={(e) => setNewTimetable({ ...newTimetable, endTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxMarks">Max Marks</Label>
                  <Input
                    id="maxMarks"
                    type="number"
                    value={newTimetable.maxMarks}
                    onChange={(e) => setNewTimetable({ ...newTimetable, maxMarks: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTimetableDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTimetable}>
                Create Timetable
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Criteria Dialog */}
        <Dialog open={isCreateCriteriaDialogOpen} onOpenChange={setIsCreateCriteriaDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Set Eligibility Criteria</DialogTitle>
              <DialogDescription>
                Define the requirements for exam eligibility
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="criteriaProgram">Program</Label>
                  <Select value={newCriteria.program} onValueChange={(value) => setNewCriteria({ ...newCriteria, program: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="criteriaSemester">Semester</Label>
                  <Select value={newCriteria.semester} onValueChange={(value) => setNewCriteria({ ...newCriteria, semester: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semester 1">Semester 1</SelectItem>
                      <SelectItem value="Semester 2">Semester 2</SelectItem>
                      <SelectItem value="Semester 3">Semester 3</SelectItem>
                      <SelectItem value="Semester 4">Semester 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="examTypeCriteria">Exam Type</Label>
                  <Select value={newCriteria.examType} onValueChange={(value) => setNewCriteria({ ...newCriteria, examType: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Backlog">Backlog</SelectItem>
                      <SelectItem value="Supplementary">Supplementary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="minAttendance">Minimum Attendance (%)</Label>
                  <Input
                    id="minAttendance"
                    type="number"
                    value={newCriteria.minAttendancePercent}
                    onChange={(e) => setNewCriteria({ ...newCriteria, minAttendancePercent: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Required Clearances</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="semesterFee"
                      checked={newCriteria.requiresSemesterFee}
                      onCheckedChange={(checked) => setNewCriteria({ ...newCriteria, requiresSemesterFee: checked as boolean })}
                    />
                    <Label htmlFor="semesterFee">Semester Fee Payment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="libraryDues"
                      checked={newCriteria.requiresLibraryDues}
                      onCheckedChange={(checked) => setNewCriteria({ ...newCriteria, requiresLibraryDues: checked as boolean })}
                    />
                    <Label htmlFor="libraryDues">Library Dues Clearance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hostelDues"
                      checked={newCriteria.requiresHostelDues}
                      onCheckedChange={(checked) => setNewCriteria({ ...newCriteria, requiresHostelDues: checked as boolean })}
                    />
                    <Label htmlFor="hostelDues">Hostel Dues Clearance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowExceptions"
                      checked={newCriteria.allowExceptions}
                      onCheckedChange={(checked) => setNewCriteria({ ...newCriteria, allowExceptions: checked as boolean })}
                    />
                    <Label htmlFor="allowExceptions">Allow Exceptions</Label>
                  </div>
                </div>
              </div>

              {newCriteria.allowExceptions && (
                <div>
                  <Label htmlFor="approvalLevel">Exception Approval Level</Label>
                  <Select value={newCriteria.exceptionApprovalLevel} onValueChange={(value) => setNewCriteria({ ...newCriteria, exceptionApprovalLevel: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOD">Head of Department</SelectItem>
                      <SelectItem value="Principal">Principal</SelectItem>
                      <SelectItem value="Dean">Dean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateCriteriaDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCriteria}>
                Set Criteria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
