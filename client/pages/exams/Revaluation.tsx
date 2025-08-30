/**
 * Comprehensive Role-Based Revaluation Module
 * 
 * This module provides complete revaluation workflow management for different roles:
 * - Admin: Manage and oversee revaluation requests and execution
 * - Faculty: Re-evaluate assigned answer sheets with detailed review
 * - Student: Raise and track revaluation requests with payment integration
 * - Parent: Stay informed on student academic processes
 * 
 * Features:
 * - Service request integration for revaluation submissions
 * - Automatic evaluator assignment with location allocation
 * - Online payment processing for revaluation fees
 * - Answer sheet annotation and review system
 * - Complete audit trail and status tracking
 * - Role-based access control and notifications
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
import { PermissionGuard } from '@/components/PermissionGuard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  DollarSign, 
  Calendar,
  Upload,
  Download,
  Send,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  User,
  Star,
  MessageSquare,
  AlertTriangle,
  Shield,
  BookOpen,
  PenTool,
  Save,
  Settings,
  Bell,
  TrendingUp,
  BarChart3,
  Activity,
  Archive
} from 'lucide-react';

// Enhanced interfaces for comprehensive revaluation management
interface RevaluationRequest {
  id: string;
  serviceRequestId: string; // Link to Service Request module
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  registrationNumber: string;
  program: string;
  academicYear: string;
  semester: string;
  subject: string;
  subjectCode: string;
  examType: string;
  originalMarks: number;
  revaluatedMarks?: number;
  totalMarks: number;
  marksDifference?: number;
  requestDate: string;
  deadline: string;
  reason: string;
  detailedConcerns: string;
  questionsForReview: string[];
  status: 'submitted' | 'payment_pending' | 'payment_completed' | 'under_review' | 'assigned' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  
  // Payment information
  fee: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentReference?: string;
  paymentDate?: string;
  
  // Assignment information
  assignedEvaluator?: string;
  evaluatorName?: string;
  assignedLocation?: string;
  assignmentDate?: string;
  
  // Evaluation information
  revaluationDate?: string;
  originalEvaluatorId?: string;
  newEvaluatorId?: string;
  
  // Results and feedback
  approvalDate?: string;
  completionDate?: string;
  adminRemarks?: string;
  evaluatorRemarks?: string;
  studentResponse?: string;
  
  // File attachments
  originalAnswerSheetUrl?: string;
  annotatedAnswerSheetUrl?: string;
  revaluatedAnswerSheetUrl?: string;
  supportingDocuments: string[];
  
  // Audit trail
  statusHistory: StatusHistoryEntry[];
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  
  // Notifications
  notificationsSent: NotificationLog[];
  studentNotified: boolean;
  parentNotified: boolean;
}

interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  updatedBy: string;
  remarks?: string;
  automaticUpdate: boolean;
}

interface NotificationLog {
  type: 'email' | 'sms' | 'push' | 'in_app';
  recipient: string;
  sentAt: string;
  subject: string;
  status: 'sent' | 'delivered' | 'failed';
}

interface RevaluationPolicy {
  id: string;
  examType: string;
  subjectCategory: string;
  feeAmount: number;
  timeLimit: number; // Days from result publication
  marksDifferenceThreshold: number; // Minimum difference to trigger refund
  allowedAttempts: number;
  refundPolicy: string;
  paymentMethods: string[];
  requiredDocuments: string[];
  evaluationTimeframe: number; // Days to complete revaluation
  isActive: boolean;
}

interface RevaluationAssignment {
  id: string;
  requestId: string;
  evaluatorId: string;
  evaluatorName: string;
  locationId: string;
  locationName: string;
  assignedDate: string;
  expectedCompletionDate: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  notificationSent: boolean;
}

interface PaymentTransaction {
  id: string;
  requestId: string;
  amount: number;
  currency: string;
  method: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionDate: string;
  gateway: string;
  gatewayResponse?: string;
}

export default function Revaluation() {
  const { user } = useAuth();
  const userRole = user?.role || 'admin';

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<RevaluationRequest | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAnswerSheetDialogOpen, setIsAnswerSheetDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [selectedAnswerSheet, setSelectedAnswerSheet] = useState<string | null>(null);

  // Sample data - in production, this would come from API
  const [revaluationRequests, setRevaluationRequests] = useState<RevaluationRequest[]>([
    {
      id: 'REV001',
      serviceRequestId: 'SR2024001',
      examId: 'EX001',
      examName: 'Computer Science Mid-term Examination',
      studentId: 'ST001',
      studentName: 'Dinesh',
      registrationNumber: 'CS2024001',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      subject: 'Data Structures and Algorithms',
      subjectCode: 'CS201',
      examType: 'Mid-term',
      originalMarks: 65,
      revaluatedMarks: 72,
      totalMarks: 100,
      marksDifference: 7,
      requestDate: '2024-03-20T10:00:00Z',
      deadline: '2024-03-27T23:59:59Z',
      reason: 'Discrepancy in practical component evaluation',
      detailedConcerns: 'I believe there was an error in evaluating Question 4 (practical implementation). The algorithm implementation was correct but may have been overlooked.',
      questionsForReview: ['Question 4 - Algorithm Implementation', 'Question 6 - Time Complexity Analysis'],
      status: 'completed',
      fee: 500,
      paymentStatus: 'completed',
      paymentReference: 'PAY2024001',
      paymentDate: '2024-03-20T10:30:00Z',
      assignedEvaluator: 'FAC002',
      evaluatorName: 'Prof.Mahesh',
      assignedLocation: 'Computer Lab A',
      assignmentDate: '2024-03-21T09:00:00Z',
      revaluationDate: '2024-03-22T14:00:00Z',
      originalEvaluatorId: 'FAC001',
      newEvaluatorId: 'FAC002',
      completionDate: '2024-03-23T16:00:00Z',
      adminRemarks: 'Revaluation approved due to significant marking discrepancy.',
      evaluatorRemarks: 'Upon review, the practical implementation was indeed correct. Marks have been revised accordingly.',
      originalAnswerSheetUrl: '/uploads/answer-sheets/CS201_ST001_original.pdf',
      revaluatedAnswerSheetUrl: '/uploads/answer-sheets/CS201_ST001_revaluated.pdf',
      supportingDocuments: [],
      statusHistory: [
        { status: 'submitted', timestamp: '2024-03-20T10:00:00Z', updatedBy: 'ST001', automaticUpdate: false },
        { status: 'payment_completed', timestamp: '2024-03-20T10:30:00Z', updatedBy: 'SYSTEM', automaticUpdate: true },
        { status: 'assigned', timestamp: '2024-03-21T09:00:00Z', updatedBy: 'ADM001', automaticUpdate: false },
        { status: 'completed', timestamp: '2024-03-23T16:00:00Z', updatedBy: 'FAC002', automaticUpdate: false }
      ],
      lastUpdatedBy: 'FAC002',
      lastUpdatedAt: '2024-03-23T16:00:00Z',
      notificationsSent: [],
      studentNotified: true,
      parentNotified: true
    },
    {
      id: 'REV002',
      serviceRequestId: 'SR2024002',
      examId: 'EX002',
      examName: 'Mathematics Final Examination',
      studentId: 'ST002',
      studentName: 'Sabari',
      registrationNumber: 'CS2024002',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      subject: 'Advanced Mathematics',
      subjectCode: 'MT201',
      examType: 'Final',
      originalMarks: 58,
      totalMarks: 100,
      requestDate: '2024-03-21T14:00:00Z',
      deadline: '2024-03-28T23:59:59Z',
      reason: 'Calculation errors in integration problems',
      detailedConcerns: 'Several integration problems appear to have calculation errors. Request review of Questions 7, 8, and 9.',
      questionsForReview: ['Question 7 - Integration by Parts', 'Question 8 - Definite Integrals', 'Question 9 - Area Calculation'],
      status: 'in_progress',
      fee: 500,
      paymentStatus: 'completed',
      paymentReference: 'PAY2024002',
      paymentDate: '2024-03-21T14:30:00Z',
      assignedEvaluator: 'FAC003',
      evaluatorName: 'Dr. Ramesh',
      assignedLocation: 'Mathematics Department',
      assignmentDate: '2024-03-22T10:00:00Z',
      revaluationDate: '2024-03-23T10:00:00Z',
      originalEvaluatorId: 'FAC004',
      newEvaluatorId: 'FAC003',
      adminRemarks: 'Request approved for revaluation. Assigned to senior faculty member.',
      originalAnswerSheetUrl: '/uploads/answer-sheets/MT201_ST002_original.pdf',
      supportingDocuments: [],
      statusHistory: [
        { status: 'submitted', timestamp: '2024-03-21T14:00:00Z', updatedBy: 'ST002', automaticUpdate: false },
        { status: 'payment_completed', timestamp: '2024-03-21T14:30:00Z', updatedBy: 'SYSTEM', automaticUpdate: true },
        { status: 'assigned', timestamp: '2024-03-22T10:00:00Z', updatedBy: 'ADM001', automaticUpdate: false },
        { status: 'in_progress', timestamp: '2024-03-23T10:00:00Z', updatedBy: 'FAC003', automaticUpdate: false }
      ],
      lastUpdatedBy: 'FAC003',
      lastUpdatedAt: '2024-03-23T10:00:00Z',
      notificationsSent: [],
      studentNotified: true,
      parentNotified: false
    },
    {
      id: 'REV003',
      serviceRequestId: 'SR2024003',
      examId: 'EX003',
      examName: 'Physics Laboratory Assessment',
      studentId: 'ST003',
      studentName: 'Balu',
      registrationNumber: 'PH2024001',
      program: 'Bachelor of Physics',
      academicYear: '2023-2024',
      semester: 'Semester 4',
      subject: 'Experimental Physics',
      subjectCode: 'PH301',
      examType: 'Practical',
      originalMarks: 42,
      totalMarks: 80,
      requestDate: '2024-03-22T09:00:00Z',
      deadline: '2024-03-29T23:59:59Z',
      reason: 'Laboratory procedure evaluation discrepancy',
      detailedConcerns: 'The practical procedure was followed correctly but marks seem to reflect otherwise. Request review of experimental setup and data analysis sections.',
      questionsForReview: ['Experimental Setup', 'Data Collection', 'Analysis and Interpretation'],
      status: 'under_review',
      fee: 750,
      paymentStatus: 'completed',
      paymentReference: 'PAY2024003',
      paymentDate: '2024-03-22T09:30:00Z',
      originalAnswerSheetUrl: '/uploads/answer-sheets/PH301_ST003_original.pdf',
      supportingDocuments: ['/uploads/documents/experimental_data_ST003.xlsx'],
      statusHistory: [
        { status: 'submitted', timestamp: '2024-03-22T09:00:00Z', updatedBy: 'ST003', automaticUpdate: false },
        { status: 'payment_completed', timestamp: '2024-03-22T09:30:00Z', updatedBy: 'SYSTEM', automaticUpdate: true },
        { status: 'under_review', timestamp: '2024-03-22T15:00:00Z', updatedBy: 'ADM001', automaticUpdate: false }
      ],
      lastUpdatedBy: 'ADM001',
      lastUpdatedAt: '2024-03-22T15:00:00Z',
      notificationsSent: [],
      studentNotified: true,
      parentNotified: true
    }
  ]);

  const [revaluationPolicies] = useState<RevaluationPolicy[]>([
    {
      id: 'POL001',
      examType: 'Mid-term',
      subjectCategory: 'Theory',
      feeAmount: 500,
      timeLimit: 7,
      marksDifferenceThreshold: 5,
      allowedAttempts: 1,
      refundPolicy: 'Full refund if marks difference >= 5 points',
      paymentMethods: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
      requiredDocuments: ['Original Answer Sheet Copy', 'Payment Receipt'],
      evaluationTimeframe: 5,
      isActive: true
    },
    {
      id: 'POL002',
      examType: 'Final',
      subjectCategory: 'Theory',
      feeAmount: 750,
      timeLimit: 10,
      marksDifferenceThreshold: 7,
      allowedAttempts: 1,
      refundPolicy: 'Full refund if marks difference >= 7 points',
      paymentMethods: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
      requiredDocuments: ['Original Answer Sheet Copy', 'Payment Receipt'],
      evaluationTimeframe: 7,
      isActive: true
    },
    {
      id: 'POL003',
      examType: 'Practical',
      subjectCategory: 'Laboratory',
      feeAmount: 750,
      timeLimit: 5,
      marksDifferenceThreshold: 6,
      allowedAttempts: 1,
      refundPolicy: 'Full refund if marks difference >= 6 points',
      paymentMethods: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
      requiredDocuments: ['Lab Report', 'Experimental Data', 'Payment Receipt'],
      evaluationTimeframe: 5,
      isActive: true
    }
  ]);

  // Available evaluators for assignment
  const [availableEvaluators] = useState([
    { id: 'FAC002', name: 'Prof. Mahesh', subjects: ['Computer Science', 'Mathematics'], rating: 4.9 },
    { id: 'FAC003', name: 'Dr.Ramesh', subjects: ['Mathematics', 'Physics'], rating: 4.8 },
    { id: 'FAC005', name: 'Dr. Dinesh', subjects: ['Computer Science', 'Engineering'], rating: 4.7 },
    { id: 'FAC006', name: 'Prof. Logesh', subjects: ['Physics', 'Chemistry'], rating: 4.9 }
  ]);

  // Filter requests based on search and filters
  const filteredRequests = revaluationRequests.filter(request => {
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || request.subjectCode === filterSubject;
    
    // Role-based filtering
    if (userRole === 'student') {
      return matchesSearch && matchesStatus && matchesSubject && request.studentId === user?.id;
    }
    if (userRole === 'parent') {
      // In real implementation, this would check parent-child relationship
      return matchesSearch && matchesStatus && matchesSubject;
    }
    if (userRole === 'faculty') {
      return matchesSearch && matchesStatus && matchesSubject && 
             (request.assignedEvaluator === user?.id || request.status === 'assigned');
    }
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Calculate statistics
  const stats = {
    total: revaluationRequests.length,
    submitted: revaluationRequests.filter(r => r.status === 'submitted').length,
    inProgress: revaluationRequests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length,
    completed: revaluationRequests.filter(r => r.status === 'completed').length,
    rejected: revaluationRequests.filter(r => r.status === 'rejected').length,
    totalFeeCollected: revaluationRequests
      .filter(r => r.paymentStatus === 'completed')
      .reduce((sum, r) => sum + r.fee, 0),
    averageProcessingTime: 5.2,
    successRate: 78
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'payment_pending': return 'bg-yellow-100 text-yellow-800';
      case 'payment_completed': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
      case 'assigned': return 'bg-indigo-100 text-indigo-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'payment_pending': return <CreditCard className="h-4 w-4" />;
      case 'payment_completed': return <CheckCircle className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      case 'assigned': return <Users className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Role-based content rendering
  const renderRoleBasedContent = () => {
    switch (userRole) {
      case 'admin':
        return renderAdminInterface();
      case 'faculty':
        return renderFacultyInterface();
      case 'student':
        return renderStudentInterface();
      case 'parent':
        return renderParentInterface();
      default:
        return renderAdminInterface();
    }
  };

  const renderAdminInterface = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-6">
        {renderDashboard()}
      </TabsContent>

      <TabsContent value="requests" className="mt-6">
        {renderRequestsManagement()}
      </TabsContent>

      <TabsContent value="assignments" className="mt-6">
        {renderAssignmentsManagement()}
      </TabsContent>

      <TabsContent value="policies" className="mt-6">
        {renderPoliciesManagement()}
      </TabsContent>

      <TabsContent value="payments" className="mt-6">
        {renderPaymentsManagement()}
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        {renderAnalytics()}
      </TabsContent>
    </Tabs>
  );

  const renderFacultyInterface = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="assignments">My Assignments</TabsTrigger>
        <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>

      <TabsContent value="assignments" className="mt-6">
        {renderFacultyAssignments()}
      </TabsContent>

      <TabsContent value="evaluate" className="mt-6">
        {renderFacultyEvaluation()}
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        {renderFacultyCompleted()}
      </TabsContent>

      <TabsContent value="schedule" className="mt-6">
        {renderFacultySchedule()}
      </TabsContent>
    </Tabs>
  );

  const renderStudentInterface = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="request">New Request</TabsTrigger>
        <TabsTrigger value="track">Track Requests</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
      </TabsList>

      <TabsContent value="request" className="mt-6">
        {renderStudentRequest()}
      </TabsContent>

      <TabsContent value="track" className="mt-6">
        {renderStudentTracking()}
      </TabsContent>

      <TabsContent value="results" className="mt-6">
        {renderStudentResults()}
      </TabsContent>

      <TabsContent value="policies" className="mt-6">
        {renderStudentPolicies()}
      </TabsContent>
    </Tabs>
  );

  const renderParentInterface = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Ward's Revaluation Requests
          </CardTitle>
          <p className="text-sm text-gray-600">Monitor your child's revaluation requests and outcomes</p>
        </CardHeader>
        <CardContent>
          {renderParentView()}
        </CardContent>
      </Card>
    </div>
  );

  // Enhanced functionality handlers for all interactions
  const handleViewRequest = (request: RevaluationRequest) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleEditRequest = (request: RevaluationRequest) => {
    setSelectedRequest(request);
    setIsEditDialogOpen(true);
  };

  const handleSendPaymentReminder = (requestId: string) => {
    const request = revaluationRequests.find(r => r.id === requestId);
    if (request) {
      alert(`Payment reminder sent to ${request.studentName} (${request.registrationNumber})`);
      // Update notification log
      setRevaluationRequests(prev => prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              notificationsSent: [...req.notificationsSent, {
                type: 'email',
                recipient: request.studentName,
                sentAt: new Date().toISOString(),
                subject: 'Payment Reminder',
                status: 'sent' as const
              }]
            }
          : req
      ));
    }
  };

  const handleViewAnswerSheet = (sheetUrl: string, type: string) => {
    setSelectedAnswerSheet(sheetUrl);
    setIsAnswerSheetDialogOpen(true);
  };

  const handleDownloadDocument = (url: string, filename: string) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Downloading ${filename}...`);
  };

  const handleSendNotification = (requestId: string, type: string) => {
    const request = revaluationRequests.find(r => r.id === requestId);
    if (request) {
      alert(`${type} notification sent to ${request.studentName}`);
    }
  };

  const handleUpdateStatus = (requestId: string, newStatus: string, remarks?: string) => {
    setRevaluationRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: newStatus as any,
            lastUpdatedAt: new Date().toISOString(),
            lastUpdatedBy: user?.name || 'Admin',
            adminRemarks: remarks || req.adminRemarks,
            statusHistory: [...req.statusHistory, {
              status: newStatus,
              timestamp: new Date().toISOString(),
              updatedBy: user?.name || 'Admin',
              remarks: remarks,
              automaticUpdate: false
            }]
          }
        : req
    ));
  };

  const handleAssignEvaluator = (requestId: string, evaluatorId: string, evaluatorName: string) => {
    setRevaluationRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            assignedEvaluator: evaluatorId,
            evaluatorName: evaluatorName,
            status: 'assigned',
            assignmentDate: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString()
          }
        : req
    ));
    setIsAssignDialogOpen(false);
    alert(`Request assigned to ${evaluatorName}`);
  };

  const handleProcessPayment = (requestId: string) => {
    setRevaluationRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            paymentStatus: 'completed',
            paymentDate: new Date().toISOString(),
            paymentReference: `PAY${Date.now()}`,
            status: 'payment_completed'
          }
        : req
    ));
    setIsPaymentDialogOpen(false);
    alert('Payment processed successfully!');
  };

  const handleContactSupport = (type: string) => {
    alert(`${type} support contact initiated. You will be redirected to the support portal.`);
  };

  const handleExportData = (format: string) => {
    alert(`Exporting revaluation data in ${format} format...`);
  };

  const handleSendFeedback = (requestId: string, feedback: string) => {
    setRevaluationRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            evaluatorRemarks: feedback,
            lastUpdatedAt: new Date().toISOString()
          }
        : req
    ));
    setIsFeedbackDialogOpen(false);
    alert('Feedback sent successfully!');
  };

  const handleCreateRequest = () => {
    const newRequest: RevaluationRequest = {
      id: `REV${Date.now()}`,
      serviceRequestId: `SR${Date.now()}`,
      examId: 'EX999',
      examName: 'New Exam Request',
      studentId: user?.id || 'ST001',
      studentName: user?.name || 'Current Student',
      registrationNumber: 'CS2024001',
      program: 'Computer Science',
      academicYear: '2023-2024',
      semester: 'Current Semester',
      subject: 'New Subject',
      subjectCode: 'NEW001',
      examType: 'Regular',
      originalMarks: 50,
      totalMarks: 100,
      requestDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      reason: 'New revaluation request',
      detailedConcerns: 'Detailed concerns about marking',
      questionsForReview: ['Question 1', 'Question 2'],
      status: 'submitted',
      fee: 500,
      paymentStatus: 'pending',
      supportingDocuments: [],
      statusHistory: [{
        status: 'submitted',
        timestamp: new Date().toISOString(),
        updatedBy: user?.name || 'Student',
        automaticUpdate: false
      }],
      lastUpdatedBy: user?.name || 'Student',
      lastUpdatedAt: new Date().toISOString(),
      notificationsSent: [],
      studentNotified: false,
      parentNotified: false
    };

    setRevaluationRequests([...revaluationRequests, newRequest]);
    setIsCreateDialogOpen(false);
    alert('Revaluation request created successfully!');
  };

  const handleRefreshData = () => {
    alert('Data refreshed successfully!');
  };

  const handleBulkOperation = (operation: string, selectedIds: string[]) => {
    alert(`Performing ${operation} on ${selectedIds.length} selected items`);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-xs text-blue-700 mt-1">This semester</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-900">{stats.inProgress}</p>
                <p className="text-xs text-orange-700 mt-1">Active evaluations</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
                <p className="text-xs text-green-700 mt-1">Success rate: {stats.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Fee Collected</p>
                <p className="text-3xl font-bold text-purple-900">₹{stats.totalFeeCollected.toLocaleString()}</p>
                <p className="text-xs text-purple-700 mt-1">This month</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revaluationRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium">{request.studentName}</p>
                      <p className="text-sm text-gray-500">
                        {request.subject} • {request.id}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(request.status)}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Awaiting Assignment</p>
                    <p className="text-sm text-yellow-700">3 requests need evaluator assignment</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Due Today</p>
                    <p className="text-sm text-blue-700">2 evaluations due for completion</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Ready for Approval</p>
                    <p className="text-sm text-green-700">4 completed evaluations awaiting approval</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRequestsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revaluation Requests</h2>
          <p className="text-gray-600">Review and manage student revaluation requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by student name, ID, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="CS201">Data Structures (CS201)</SelectItem>
            <SelectItem value="MT201">Advanced Mathematics (MT201)</SelectItem>
            <SelectItem value="PH301">Experimental Physics (PH301)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Original Marks</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.studentName}</p>
                      <p className="text-sm text-gray-500">{request.registrationNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.subject}</p>
                      <p className="text-sm text-gray-500">{request.subjectCode} • {request.examType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium">{request.originalMarks}/{request.totalMarks}</p>
                      {request.revaluatedMarks && (
                        <p className="text-sm text-green-600">→ {request.revaluatedMarks}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{request.fee}</p>
                      <Badge variant="outline" className={
                        request.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }>
                        {request.paymentStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status.replace('_', ' ')}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.evaluatorName ? (
                      <div>
                        <p className="font-medium">{request.evaluatorName}</p>
                        <p className="text-sm text-gray-500">{request.assignedLocation}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsReviewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === 'under_review' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
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

  const renderAssignmentsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Evaluator Assignments</h2>
          <p className="text-gray-600">Manage evaluator assignments and locations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {availableEvaluators.map((evaluator) => (
          <Card key={evaluator.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{evaluator.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{evaluator.rating}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Subjects</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {evaluator.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="font-bold text-blue-600">
                      {revaluationRequests.filter(r => r.assignedEvaluator === evaluator.id).length}
                    </p>
                    <p className="text-gray-600">Assigned</p>
                  </div>
                  <div>
                    <p className="font-bold text-green-600">
                      {revaluationRequests.filter(r => r.assignedEvaluator === evaluator.id && r.status === 'completed').length}
                    </p>
                    <p className="text-gray-600">Completed</p>
                  </div>
                  <div>
                    <p className="font-bold text-orange-600">
                      {revaluationRequests.filter(r => r.assignedEvaluator === evaluator.id && r.status === 'in_progress').length}
                    </p>
                    <p className="text-gray-600">In Progress</p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPoliciesManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revaluation Policies</h2>
          <p className="text-gray-600">Configure revaluation fees, timelines, and policies</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {revaluationPolicies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{policy.examType} - {policy.subjectCategory}</CardTitle>
                <Badge variant={policy.isActive ? 'default' : 'secondary'}>
                  {policy.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Fee Amount</p>
                  <p className="text-gray-600">₹{policy.feeAmount}</p>
                </div>
                <div>
                  <p className="font-medium">Time Limit</p>
                  <p className="text-gray-600">{policy.timeLimit} days</p>
                </div>
                <div>
                  <p className="font-medium">Refund Threshold</p>
                  <p className="text-gray-600">{policy.marksDifferenceThreshold} marks</p>
                </div>
                <div>
                  <p className="font-medium">Evaluation Time</p>
                  <p className="text-gray-600">{policy.evaluationTimeframe} days</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-sm mb-2">Refund Policy</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {policy.refundPolicy}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPaymentsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <p className="text-gray-600">Track revaluation fee payments and refunds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Collected</p>
                <p className="text-2xl font-bold">₹{stats.totalFeeCollected.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Pending</p>
                <p className="text-2xl font-bold">
                  {revaluationRequests.filter(r => r.paymentStatus === 'pending').length}
                </p>
              </div>
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Refunds Due</p>
                <p className="text-2xl font-bold">
                  {revaluationRequests.filter(r => 
                    r.status === 'completed' && 
                    r.marksDifference && 
                    r.marksDifference >= 5
                  ).length}
                </p>
              </div>
              <RefreshCw className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Refund Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revaluationRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.studentName}</p>
                      <p className="text-sm text-gray-500">{request.registrationNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>₹{request.fee}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      request.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      request.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {request.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.paymentDate ? new Date(request.paymentDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {request.status === 'completed' && request.marksDifference && request.marksDifference >= 5 ? (
                      <Badge className="bg-orange-100 text-orange-800">Due</Badge>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.paymentStatus === 'pending' && (
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revaluation Analytics</h2>
          <p className="text-gray-600">Insights and trends for revaluation processes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Select defaultValue="month">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Average Processing Time</p>
                <p className="text-3xl font-bold text-blue-900">{stats.averageProcessingTime} days</p>
                <p className="text-xs text-green-600 mt-1">↓ 0.5 days from last month</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Success Rate</p>
                <p className="text-3xl font-bold text-green-900">{stats.successRate}%</p>
                <p className="text-xs text-green-600 mt-1">↑ 5% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Refund Rate</p>
                <p className="text-3xl font-bold text-purple-900">23%</p>
                <p className="text-xs text-purple-600 mt-1">Due to mark differences ≥5</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Student Satisfaction</p>
                <p className="text-3xl font-bold text-orange-900">4.2/5</p>
                <p className="text-xs text-orange-600 mt-1">Based on feedback surveys</p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Revaluation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Mathematics</span>
                <div className="flex items-center gap-2">
                  <Progress value={65} className="w-24" />
                  <span className="text-sm font-medium">65%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Computer Science</span>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="w-24" />
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Physics</span>
                <div className="flex items-center gap-2">
                  <Progress value={35} className="w-24" />
                  <span className="text-sm font-medium">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Chemistry</span>
                <div className="flex items-center gap-2">
                  <Progress value={28} className="w-24" />
                  <span className="text-sm font-medium">28%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Request Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Chart visualization would be implemented here</p>
                <p className="text-sm text-gray-400">Showing revaluation request trends over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFacultyAssignments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Revaluation Assignments</CardTitle>
          <p className="text-sm text-gray-600">Revaluation requests assigned to you</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revaluationRequests.filter(r => r.assignedEvaluator === user?.id).map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">{request.subject} ({request.subjectCode})</p>
                    <p className="text-sm text-gray-500">Request ID: {request.id}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(request.status)}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium">Original Marks</p>
                    <p className="text-gray-600">{request.originalMarks}/{request.totalMarks}</p>
                  </div>
                  <div>
                    <p className="font-medium">Assignment Date</p>
                    <p className="text-gray-600">{request.assignmentDate ? new Date(request.assignmentDate).toLocaleDateString() : '-'}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-sm mb-2">Student Concerns</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{request.detailedConcerns}</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsEvaluationDialogOpen(true);
                    }}
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Start Evaluation
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Sheet
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFacultyEvaluation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revaluation Interface</CardTitle>
          <p className="text-sm text-gray-600">Re-evaluate answer sheets and provide feedback</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Answer Sheet Viewer */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg p-4 bg-gray-50 min-h-96">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Answer Sheet: {selectedRequest?.id}</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded border min-h-80 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Answer sheet viewer would be implemented here</p>
                    <p className="text-sm text-gray-400">View original annotations and student responses</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revaluation Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revaluation Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium">Original Marks</Label>
                    <p className="text-2xl font-bold text-gray-700">{selectedRequest?.originalMarks || 65}/100</p>
                  </div>

                  <div>
                    <Label className="font-medium">Revised Marks</Label>
                    <Input
                      type="number"
                      placeholder="Enter revised marks"
                      max="100"
                      min="0"
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Evaluator Remarks</Label>
                    <Textarea
                      placeholder="Provide detailed feedback on the revaluation..."
                      className="min-h-24"
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Questions Reviewed</Label>
                    <div className="space-y-2">
                      {selectedRequest?.questionsForReview.map((question, index) => (
                        <label key={index} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" defaultChecked />
                          {question}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Progress
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Revaluation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFacultyCompleted = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Completed Revaluations</CardTitle>
          <p className="text-sm text-gray-600">Your completed revaluation assessments</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Original → Revised</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Student Feedback</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revaluationRequests.filter(r => r.assignedEvaluator === user?.id && r.status === 'completed').map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{request.originalMarks}</span>
                      <span>→</span>
                      <span className="font-medium text-green-600">{request.revaluatedMarks}</span>
                      <span className="text-xs text-gray-500">
                        ({request.marksDifference > 0 ? '+' : ''}{request.marksDifference})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{request.completionDate ? new Date(request.completionDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
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

  const renderFacultySchedule = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revaluation Schedule</CardTitle>
          <p className="text-sm text-gray-600">Your upcoming revaluation sessions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Today's Sessions</h3>
                <Badge className="bg-blue-600">2 sessions</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>10:00 AM - 12:00 PM</span>
                  <span>•</span>
                  <span>Computer Lab A</span>
                  <span>•</span>
                  <span>Mathematics Revaluation</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>2:00 PM - 4:00 PM</span>
                  <span>•</span>
                  <span>Physics Lab</span>
                  <span>•</span>
                  <span>Experimental Physics</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Upcoming This Week</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wednesday, March 25</p>
                    <p className="text-sm text-gray-600">Computer Science Revaluation - Hall A</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">3 requests</p>
                    <p className="text-xs text-gray-500">9:00 AM - 12:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Friday, March 27</p>
                    <p className="text-sm text-gray-600">Mathematics Revaluation - Room 205</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">2 requests</p>
                    <p className="text-xs text-gray-500">2:00 PM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentRequest = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Revaluation Request</CardTitle>
          <p className="text-sm text-gray-600">Request revaluation for your examination results</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exam">Exam</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EX001">Computer Science Mid-term</SelectItem>
                    <SelectItem value="EX002">Mathematics Final</SelectItem>
                    <SelectItem value="EX003">Physics Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CS201">Data Structures (CS201)</SelectItem>
                    <SelectItem value="MT201">Advanced Mathematics (MT201)</SelectItem>
                    <SelectItem value="PH301">Experimental Physics (PH301)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Revaluation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calculation_error">Calculation/Addition Error</SelectItem>
                  <SelectItem value="partial_evaluation">Partial Evaluation of Answer</SelectItem>
                  <SelectItem value="missed_answer">Answer Not Evaluated</SelectItem>
                  <SelectItem value="marking_scheme">Marking Scheme Discrepancy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="concerns">Detailed Concerns</Label>
              <Textarea
                id="concerns"
                placeholder="Please provide specific details about your concerns. Mention question numbers and specific issues you believe need review..."
                className="min-h-24"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 50 characters required</p>
            </div>

            <div>
              <Label>Questions for Review</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Question 1 - Multiple Choice (10 marks)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Question 2 - Short Answer (15 marks)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Question 3 - Long Answer (25 marks)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Question 4 - Practical (30 marks)</span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-800">Payment Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Revaluation Fee</p>
                  <p className="text-2xl font-bold text-blue-900">₹500</p>
                </div>
                <div>
                  <p className="font-medium">Refund Policy</p>
                  <p className="text-blue-700">Full refund if marks increase by ≥5 points</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  <span>I agree to the revaluation terms and conditions</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" onClick={() => setIsPaymentDialogOpen(true)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Payment
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentTracking = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Revaluation Requests</CardTitle>
          <p className="text-sm text-gray-600">Monitor the status of your revaluation requests</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revaluationRequests.filter(r => r.studentId === user?.id).map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">{request.subject} - {request.examName}</p>
                    <p className="text-sm text-gray-500">Request ID: {request.id}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1">{request.status.replace('_', ' ')}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium">Original Marks</p>
                    <p className="text-gray-600">{request.originalMarks}/{request.totalMarks}</p>
                  </div>
                  <div>
                    <p className="font-medium">Fee Status</p>
                    <Badge variant="outline" className={
                      request.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }>
                      {request.paymentStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">Submitted</p>
                    <p className="text-gray-600">{new Date(request.requestDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {request.status === 'completed' && request.revaluatedMarks && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">Revaluation Completed</p>
                        <p className="text-sm text-green-700">
                          Revised Marks: {request.revaluatedMarks}/{request.totalMarks}
                          {request.marksDifference && (
                            <span className="ml-2">
                              ({request.marksDifference > 0 ? '+' : ''}{request.marksDifference} marks)
                            </span>
                          )}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                )}

                {request.evaluatorRemarks && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="font-medium text-sm mb-1">Evaluator Remarks</p>
                    <p className="text-sm text-gray-700">{request.evaluatorRemarks}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {request.revaluatedAnswerSheetUrl && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Sheet
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentResults = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revaluation Results</CardTitle>
          <p className="text-sm text-gray-600">View your revaluation outcomes and updated marks</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revaluationRequests
              .filter(r => r.studentId === user?.id && r.status === 'completed')
              .map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{request.subject}</h3>
                        <p className="text-sm text-gray-600">{request.examName}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                      <div>
                        <p className="text-xl font-bold text-gray-600">{request.originalMarks}</p>
                        <p className="text-sm text-gray-500">Original Marks</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-green-600">{request.revaluatedMarks}</p>
                        <p className="text-sm text-gray-500">Revised Marks</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-blue-600">
                          {request.marksDifference > 0 ? '+' : ''}{request.marksDifference}
                        </p>
                        <p className="text-sm text-gray-500">Difference</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-purple-600">
                          {Math.round((request.revaluatedMarks / request.totalMarks) * 100)}%
                        </p>
                        <p className="text-sm text-gray-500">Percentage</p>
                      </div>
                    </div>

                    {request.evaluatorRemarks && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="font-medium text-sm text-blue-800 mb-1">Evaluator Feedback</p>
                        <p className="text-sm text-blue-700">{request.evaluatorRemarks}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Updated Sheet
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentPolicies = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revaluation Policies</CardTitle>
          <p className="text-sm text-gray-600">Understanding revaluation process, fees, and timelines</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Fee Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {revaluationPolicies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4">
                    <h4 className="font-medium">{policy.examType}</h4>
                    <p className="text-sm text-gray-600">{policy.subjectCategory}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">₹{policy.feeAmount}</p>
                    <p className="text-xs text-gray-500">per subject</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Important Guidelines</h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Time Limit</p>
                    <p className="text-sm text-blue-700">Revaluation requests must be submitted within 7-10 days of result publication</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Refund Policy</p>
                    <p className="text-sm text-green-700">Full fee refund if marks increase by 5+ points for theory subjects, 6+ for practical</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-orange-50 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800">Process</p>
                    <p className="text-sm text-orange-700">Revaluation is conducted by a different evaluator to ensure fairness</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-purple-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-800">Timeline</p>
                    <p className="text-sm text-purple-700">Results are typically available within 5-7 working days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderParentView = () => (
    <div className="space-y-4">
      {revaluationRequests
        .filter(r => r.studentId === 'ST001') // In real implementation, filter by parent-child relationship
        .map((request) => (
          <div key={request.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{request.subject} - {request.examName}</p>
                <p className="text-sm text-gray-500">Request submitted on {new Date(request.requestDate).toLocaleDateString()}</p>
              </div>
              <Badge variant="outline" className={getStatusColor(request.status)}>
                {request.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Original Marks</p>
                <p className="text-gray-600">{request.originalMarks}/{request.totalMarks}</p>
              </div>
              <div>
                <p className="font-medium">Fee Paid</p>
                <p className="text-gray-600">₹{request.fee}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p className="text-gray-600">{request.status.replace('_', ' ')}</p>
              </div>
            </div>

            {request.status === 'completed' && request.revaluatedMarks && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-800">Revaluation Completed</p>
                <p className="text-sm text-green-700">
                  Revised Marks: {request.revaluatedMarks}/{request.totalMarks}
                  {request.marksDifference && (
                    <span className="ml-2">
                      ({request.marksDifference > 0 ? '+' : ''}{request.marksDifference} marks change)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
    </div>
  );

  // Dialog components
  const renderPaymentDialog = () => (
    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment for Revaluation</DialogTitle>
          <DialogDescription>Complete payment to submit your revaluation request</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Revaluation Fee</span>
              <span className="font-bold">₹500</span>
            </div>
          </div>

          <div>
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" className="justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </Button>
              <Button variant="outline" className="justify-start">
                <Phone className="h-4 w-4 mr-2" />
                UPI
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded">
            <p className="font-medium text-blue-800 mb-1">Refund Policy</p>
            <p className="text-blue-700">If your marks increase by 5 or more points, the full fee will be refunded automatically.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            handleProcessPayment(selectedRequest?.id || '');
            setIsPaymentDialogOpen(false);
          }}>
            Pay ₹500
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <PermissionGuard resource="revaluation" operation="read">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revaluation Management</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive revaluation workflow for all stakeholders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <User className="h-4 w-4 mr-2" />
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Badge>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Role-based Interface */}
        {renderRoleBasedContent()}

        {/* Dialogs */}
        {renderPaymentDialog()}
      </div>
    </PermissionGuard>
  );
}
