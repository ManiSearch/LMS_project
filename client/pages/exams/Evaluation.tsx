/**
 * Comprehensive Role-Based Answer Sheet Evaluation Module
 * 
 * This module provides a complete evaluation workflow for different roles:
 * - Admin: Setup, manage, oversee entire evaluation workflow
 * - Faculty: Evaluate assigned answer sheets accurately and securely  
 * - Student: Access evaluation outcomes and request revaluation
 * - Parent: Monitor academic performance of their ward
 * 
 * Features:
 * - Upload and manage answer sheets with dummy number anonymity
 * - Zone-based evaluation management
 * - Digital annotation and question-wise marking
 * - Secure evaluation workflow with notifications
 * - Results publication and access control
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
  ClipboardCheck,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  Users,
  BarChart3,
  Download,
  Upload,
  Star,
  Send,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  Building,
  Shield,
  Lightbulb,
  Save,
  RotateCcw,
  AlertTriangle,
  PenTool,
  Printer,
  Bell,
  Settings,
  Archive
} from 'lucide-react';
import EvaluationNotificationSystem from '@/components/EvaluationNotificationSystem';
import { hasEvaluationPermission, canPerformEvaluationAction, EvaluationSecurityContext } from '@/utils/evaluationPermissions';

// Enhanced data interfaces
interface AnswerSheet {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  registrationNumber: string;
  dummyNumber: string; // For anonymity during evaluation
  subject: string;
  subjectCode: string;
  program: string;
  academicYear: string;
  semester: string;
  submittedAt: string;
  answerSheetUrl: string;
  answerKeyUrl?: string;
  assignedEvaluator?: string;
  evaluatorName?: string;
  assignedZone?: string;
  zoneName?: string;
  status: 'uploaded' | 'assigned' | 'evaluating' | 'completed' | 'reviewed' | 'published';
  marks?: number;
  totalMarks: number;
  percentage?: number;
  grade?: string;
  evaluationDate?: string;
  publishedDate?: string;
  remarks?: string;
  questionWiseMarks: Record<string, number>;
  sectionWiseMarks: Record<string, number>;
  annotations: Annotation[];
  revaluationRequested?: boolean;
  revaluationStatus?: 'pending' | 'approved' | 'rejected' | 'completed';
}

interface Annotation {
  id: string;
  questionNumber: string;
  x: number;
  y: number;
  width: number;
  height: number;
  comment: string;
  marks: number;
  evaluatorId: string;
  timestamp: string;
}

interface Evaluator {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  zones: string[];
  assignedSheets: number;
  completedSheets: number;
  pendingSheets: number;
  lastActive: string;
  expertise: string[];
  rating: number;
}

interface EvaluationZone {
  id: string;
  name: string;
  location: string;
  coordinator: string;
  coordinatorEmail: string;
  capacity: number;
  assignedEvaluators: string[];
  assignedSubjects: string[];
  status: 'active' | 'inactive';
  evaluationSchedule: {
    startDate: string;
    endDate: string;
    venue: string;
    instructions: string;
  };
}

interface AnswerKey {
  id: string;
  examId: string;
  subject: string;
  subjectCode: string;
  questionPaper: string;
  answerKeyUrl: string;
  solutionGuide: string;
  markingScheme: MarkingScheme[];
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

interface MarkingScheme {
  questionNumber: string;
  totalMarks: number;
  subQuestions: SubQuestion[];
  instructions: string;
}

interface SubQuestion {
  id: string;
  marks: number;
  keywords: string[];
  acceptableAnswers: string[];
}

interface EvaluationAssignment {
  id: string;
  evaluatorId: string;
  zoneId: string;
  answerSheetIds: string[];
  assignedAt: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  notificationSent: boolean;
}

interface ResultPublication {
  id: string;
  examId: string;
  subject: string;
  publishedBy: string;
  publishedAt: string;
  studentsCount: number;
  averageMarks: number;
  status: 'draft' | 'published';
  accessibleTo: ('student' | 'parent' | 'faculty' | 'admin')[];
}

export default function Evaluation() {
  const { user } = useAuth();
  const userRole = user?.role || 'admin';

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedSheet, setSelectedSheet] = useState<AnswerSheet | null>(null);
  const [selectedEvaluator, setSelectedEvaluator] = useState<Evaluator | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);

  // Sample data - replace with actual API calls
  const [answerSheets, setAnswerSheets] = useState<AnswerSheet[]>([
    {
      id: '1',
      examId: 'EX001',
      examName: 'Computer Science Mid-term Examination',
      studentId: 'ST001',
      studentName: 'Sathya',
      registrationNumber: 'CS2024001',
      dummyNumber: 'COMP001',
      subject: 'Data Structures and Algorithms',
      subjectCode: 'CS201',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      submittedAt: '2024-03-15T10:30:00',
      answerSheetUrl: '/uploads/answer-sheets/CS201_DUMMY001.pdf',
      answerKeyUrl: '/uploads/answer-keys/CS201_key.pdf',
      assignedEvaluator: 'EV001',
      evaluatorName: 'Dr. Saranya',
      assignedZone: 'ZONE001',
      zoneName: 'Central Evaluation Zone',
      status: 'completed',
      marks: 85,
      totalMarks: 100,
      percentage: 85,
      grade: 'A',
      evaluationDate: '2024-03-16T14:30:00',
      publishedDate: '2024-03-18T09:00:00',
      remarks: 'Excellent understanding of data structures. Good algorithmic approach.',
      questionWiseMarks: { 'Q1': 20, 'Q2': 18, 'Q3': 22, 'Q4': 25 },
      sectionWiseMarks: { 'Section A': 40, 'Section B': 45 },
      annotations: [],
      revaluationRequested: false
    },
    {
      id: '2',
      examId: 'EX001',
      examName: 'Computer Science Mid-term Examination',
      studentId: 'ST002',
      studentName: 'Nataraj',
      registrationNumber: 'CS2024002',
      dummyNumber: 'COMP002',
      subject: 'Data Structures and Algorithms',
      subjectCode: 'CS201',
      program: 'Bachelor of Computer Science',
      academicYear: '2023-2024',
      semester: 'Semester 2',
      submittedAt: '2024-03-15T10:45:00',
      answerSheetUrl: '/uploads/answer-sheets/CS201_DUMMY002.pdf',
      answerKeyUrl: '/uploads/answer-keys/CS201_key.pdf',
      assignedEvaluator: 'EV001',
      evaluatorName: 'Dr. Raj',
      assignedZone: 'ZONE001',
      zoneName: 'Central Evaluation Zone',
      status: 'evaluating',
      totalMarks: 100,
      questionWiseMarks: { 'Q1': 18, 'Q2': 20, 'Q3': 0, 'Q4': 0 },
      sectionWiseMarks: { 'Section A': 38, 'Section B': 0 },
      annotations: [],
      revaluationRequested: false
    },
    {
      id: '3',
      examId: 'EX002',
      examName: 'Mathematics Final Examination',
      studentId: 'ST003',
      studentName: 'Babu',
      registrationNumber: 'MT2024001',
      dummyNumber: 'COMP003',
      subject: 'Advanced Calculus',
      subjectCode: 'MT301',
      program: 'Bachelor of Mathematics',
      academicYear: '2023-2024',
      semester: 'Semester 4',
      submittedAt: '2024-03-14T11:00:00',
      answerSheetUrl: '/uploads/answer-sheets/MT301_DUMMY003.pdf',
      status: 'uploaded',
      totalMarks: 100,
      questionWiseMarks: {},
      sectionWiseMarks: {},
      annotations: [],
      revaluationRequested: false
    }
  ]);

  const [evaluators] = useState<Evaluator[]>([
    {
      id: 'EV001',
      name: 'Dr. Saran',
      email: 'saran@university.edu',
      phone: '+91 94555 90101',
      subjects: ['Data Structures', 'Algorithms', 'Computer Networks'],
      zones: ['ZONE001', 'ZONE002'],
      assignedSheets: 25,
      completedSheets: 20,
      pendingSheets: 5,
      lastActive: '2024-03-18T15:30:00',
      expertise: ['Programming', 'Database Systems', 'Software Engineering'],
      rating: 4.8
    },
    {
      id: 'EV002',
      name: 'Prof. Majoj',
      email: 'manoj@university.edu',
      phone: '+91 94555 90102',
      subjects: ['Advanced Mathematics', 'Statistics', 'Linear Algebra'],
      zones: ['ZONE002', 'ZONE003'],
      assignedSheets: 30,
      completedSheets: 28,
      pendingSheets: 2,
      lastActive: '2024-03-18T16:45:00',
      expertise: ['Applied Mathematics', 'Research Methodology'],
      rating: 4.9
    },
    {
      id: 'EV003',
      name: 'Dr. Rahul',
      email: 'rahul@university.edu',
      phone: '+91 94555 90103',
      subjects: ['Physics', 'Quantum Mechanics', 'Thermodynamics'],
      zones: ['ZONE001'],
      assignedSheets: 20,
      completedSheets: 15,
      pendingSheets: 5,
      lastActive: '2024-03-18T14:20:00',
      expertise: ['Experimental Physics', 'Theoretical Physics'],
      rating: 4.7
    }
  ]);

  const [evaluationZones] = useState<EvaluationZone[]>([
    {
      id: 'ZONE001',
      name: 'Central Evaluation Zone',
      location: 'Main Campus, Building A',
      coordinator: 'Dr. Saranya',
      coordinatorEmail: 'saranya@university.edu',
      capacity: 50,
      assignedEvaluators: ['EV001', 'EV003'],
      assignedSubjects: ['Computer Science', 'Physics'],
      status: 'active',
      evaluationSchedule: {
        startDate: '2024-03-16',
        endDate: '2024-03-20',
        venue: 'Conference Hall A',
        instructions: 'Arrive 30 minutes before scheduled time. Bring ID proof.'
      }
    },
    {
      id: 'ZONE002',
      name: 'North Campus Evaluation Zone',
      location: 'North Campus, Building B',
      coordinator: 'Prof. Mohan',
      coordinatorEmail: 'mohan@university.edu',
      capacity: 40,
      assignedEvaluators: ['EV001', 'EV002'],
      assignedSubjects: ['Mathematics', 'Statistics'],
      status: 'active',
      evaluationSchedule: {
        startDate: '2024-03-17',
        endDate: '2024-03-21',
        venue: 'Seminar Hall B',
        instructions: 'Please bring laptop for digital evaluation.'
      }
    }
  ]);

  const [answerKeys] = useState<AnswerKey[]>([
    {
      id: 'AK001',
      examId: 'EX001',
      subject: 'Data Structures and Algorithms',
      subjectCode: 'CS201',
      questionPaper: 'CS201_Question_Paper.pdf',
      answerKeyUrl: '/uploads/answer-keys/CS201_key.pdf',
      solutionGuide: '/uploads/solution-guides/CS201_solutions.pdf',
      markingScheme: [
        {
          questionNumber: 'Q1',
          totalMarks: 20,
          subQuestions: [
            {
              id: 'Q1a',
              marks: 10,
              keywords: ['array', 'sorting', 'time complexity'],
              acceptableAnswers: ['O(n log n)', 'merge sort', 'quick sort']
            }
          ],
          instructions: 'Award partial marks for correct approach even if final answer is wrong.'
        }
      ],
      uploadedBy: 'admin001',
      uploadedAt: '2024-03-15T08:00:00',
      version: 1
    }
  ]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'evaluating': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'published': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <Upload className="h-4 w-4" />;
      case 'assigned': return <Users className="h-4 w-4" />;
      case 'evaluating': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'published': return <Send className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredSheets = answerSheets.filter(sheet => {
    const matchesSearch = sheet.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.dummyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sheet.status === filterStatus;
    const matchesZone = filterZone === 'all' || sheet.assignedZone === filterZone;
    const matchesSubject = filterSubject === 'all' || sheet.subjectCode === filterSubject;
    
    return matchesSearch && matchesStatus && matchesZone && matchesSubject;
  });

  // Calculate statistics
  const stats = {
    totalSheets: answerSheets.length,
    uploaded: answerSheets.filter(s => s.status === 'uploaded').length,
    assigned: answerSheets.filter(s => s.status === 'assigned').length,
    evaluating: answerSheets.filter(s => s.status === 'evaluating').length,
    completed: answerSheets.filter(s => s.status === 'completed').length,
    published: answerSheets.filter(s => s.status === 'published').length,
    averageMarks: answerSheets.filter(s => s.marks).reduce((sum, s) => sum + (s.marks || 0), 0) / answerSheets.filter(s => s.marks).length || 0
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
        return renderAdminInterface(); // Default to admin view
    }
  };

  const renderAdminInterface = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="upload">Upload Sheets</TabsTrigger>
        <TabsTrigger value="zones">Zones</TabsTrigger>
        <TabsTrigger value="evaluators">Evaluators</TabsTrigger>
        <TabsTrigger value="answer-keys">Answer Keys</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-6">
        {renderDashboard()}
      </TabsContent>

      <TabsContent value="upload" className="mt-6">
        {renderUploadInterface()}
      </TabsContent>

      <TabsContent value="zones" className="mt-6">
        {renderZonesInterface()}
      </TabsContent>

      <TabsContent value="evaluators" className="mt-6">
        {renderEvaluatorsInterface()}
      </TabsContent>

      <TabsContent value="answer-keys" className="mt-6">
        {renderAnswerKeysInterface()}
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <EvaluationNotificationSystem
          onNotificationSent={(notification) => {
            console.log('Notification sent:', notification);
          }}
        />
      </TabsContent>

      <TabsContent value="export" className="mt-6">
        {renderExportInterface()}
      </TabsContent>

      <TabsContent value="results" className="mt-6">
        {renderResultsInterface()}
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
        {renderEvaluationInterface()}
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        {renderCompletedEvaluations()}
      </TabsContent>

      <TabsContent value="schedule" className="mt-6">
        {renderEvaluationSchedule()}
      </TabsContent>
    </Tabs>
  );

  const renderStudentInterface = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="results">My Results</TabsTrigger>
        <TabsTrigger value="revaluation">Revaluation</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="results" className="mt-6">
        {renderStudentResults()}
      </TabsContent>

      <TabsContent value="revaluation" className="mt-6">
        {renderRevaluationInterface()}
      </TabsContent>

      <TabsContent value="performance" className="mt-6">
        {renderPerformanceAnalysis()}
      </TabsContent>
    </Tabs>
  );

  const renderParentInterface = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Ward's Academic Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStudentResults()}
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Sheets</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalSheets}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Uploaded</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.uploaded}</p>
              </div>
              <Upload className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Evaluating</p>
                <p className="text-3xl font-bold text-orange-900">{stats.evaluating}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            alert('Exporting completed evaluations...\n\n' +
                  '📊 Export includes:\n' +
                  '• ' + stats.completed + ' completed answer sheets\n' +
                  '• Student details and marks\n' +
                  '• Evaluator information\n' +
                  '• Quality metrics\n\n' +
                  'CSV file ready for download!');
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
                <p className="text-xs text-green-600 mt-1">Click to export →</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            alert('Exporting published results...\n\n' +
                  '📊 Export includes:\n' +
                  '• ' + stats.published + ' published results\n' +
                  '• Final marks and grades\n' +
                  '• Publication timestamps\n' +
                  '• Student notification status\n\n' +
                  'Detailed report generated successfully!');
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Published</p>
                <p className="text-3xl font-bold text-purple-900">{stats.published}</p>
                <p className="text-xs text-purple-600 mt-1">Click to export →</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Avg. Marks</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.averageMarks.toFixed(1)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Evaluation Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {answerSheets.slice(0, 5).map((sheet) => (
              <div key={sheet.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(sheet.status)}
                  <div>
                    <p className="font-medium">{sheet.subject}</p>
                    <p className="text-sm text-gray-500">
                      {sheet.dummyNumber} • {sheet.evaluatorName || 'Unassigned'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(sheet.status)}>
                  {sheet.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUploadInterface = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upload Answer Sheets</h2>
          <p className="text-gray-600">Upload and manage answer sheets for evaluation</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Sheets
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Answer Sheets</DialogTitle>
              <DialogDescription>
                Upload answer sheets and assign dummy numbers for anonymous evaluation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                      <SelectItem value="MT301">Advanced Calculus (MT301)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="sheets">Answer Sheets</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Drag and drop answer sheets here, or click to browse</p>
                  <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, JPG, PNG (Max 10MB per file)</p>
                  <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                    <Button variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Upload Zip
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Bulk upload via zip file for large batches</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-blue-800">Upload Options</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    <Upload className="h-4 w-4" />
                    Automatic dummy number assignment for anonymity
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    <FileText className="h-4 w-4" />
                    Generate upload receipt with batch ID
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    <Mail className="h-4 w-4" />
                    Send upload confirmation to students
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Simulate file upload process
                  alert('Uploading answer sheets...\n\n' +
                        '📄 Processing 25 answer sheets\n' +
                        '🔢 Assigning dummy numbers (DUMMY001-DUMMY025)\n' +
                        '🔒 Securing student information\n' +
                        '📧 Sending notifications to evaluators\n\n' +
                        'Upload completed successfully!\n' +
                        'Batch ID: BATCH2024001\n' +
                        'Ready for evaluator assignment');
                  setIsUploadDialogOpen(false);
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload & Process Sheets
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by dummy number, subject, or registration..."
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
            <SelectItem value="uploaded">Uploaded</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="evaluating">Evaluating</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Answer Sheets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dummy Number</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Evaluator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell className="font-medium">{sheet.dummyNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sheet.subject}</p>
                      <p className="text-sm text-gray-500">{sheet.subjectCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>{sheet.examName}</TableCell>
                  <TableCell>{sheet.zoneName || 'Unassigned'}</TableCell>
                  <TableCell>{sheet.evaluatorName || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(sheet.status)}>
                      {getStatusIcon(sheet.status)}
                      <span className="ml-1">{sheet.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sheet.marks !== undefined ? (
                      <span className="font-medium">{sheet.marks}/{sheet.totalMarks}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
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

  const renderZonesInterface = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Evaluation Zones</h2>
          <p className="text-gray-600">Manage evaluation zones and assignments</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {evaluationZones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {zone.name}
                </CardTitle>
                <Badge variant={zone.status === 'active' ? 'default' : 'secondary'}>
                  {zone.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {zone.location}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Coordinator</p>
                  <p className="text-gray-600">{zone.coordinator}</p>
                </div>
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-gray-600">{zone.capacity} evaluators</p>
                </div>
              </div>

              <div>
                <p className="font-medium text-sm mb-2">Evaluation Schedule</p>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {zone.evaluationSchedule.startDate} to {zone.evaluationSchedule.endDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {zone.evaluationSchedule.venue}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    alert(`Schedule notification sent to all evaluators in ${zone.name}:\n\n` +
                          `📧 Email notifications sent\n` +
                          `📱 SMS reminders sent\n` +
                          `📅 Calendar invites sent\n\n` +
                          `Venue: ${zone.evaluationSchedule.venue}\n` +
                          `Date: ${zone.evaluationSchedule.startDate} to ${zone.evaluationSchedule.endDate}`);
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Notify All
                </Button>
                <Button variant="outline" size="sm">
                  <Edit3 className="h-4 w-4" />
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

  const renderEvaluatorsInterface = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Evaluators Management</h2>
          <p className="text-gray-600">Assign and manage evaluation faculty</p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Users className="h-4 w-4 mr-2" />
              Assign Evaluators
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Assign Evaluators to Answer Sheets</DialogTitle>
              <DialogDescription>
                Select evaluators and assign them to specific answer sheets or batches
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Zone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluationZones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CS201">Data Structures (CS201)</SelectItem>
                      <SelectItem value="MT301">Advanced Calculus (MT301)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Evaluator</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select evaluator" />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluators.map((evaluator) => (
                        <SelectItem key={evaluator.id} value={evaluator.id}>
                          {evaluator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">Available Answer Sheets</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {answerSheets.filter(s => s.status === 'uploaded').map((sheet) => (
                    <label key={sheet.id} className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50">
                      <input type="checkbox" />
                      <div className="flex-1">
                        <p className="font-medium">{sheet.dummyNumber}</p>
                        <p className="text-sm text-gray-500">{sheet.subject}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-blue-800">Notification Settings</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    <Mail className="h-4 w-4" />
                    Send email notification to evaluator with assignment details
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    <Phone className="h-4 w-4" />
                    Send SMS notification with schedule and venue information
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    <Calendar className="h-4 w-4" />
                    Send calendar invite for evaluation session
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    <AlertTriangle className="h-4 w-4" />
                    Set automatic deadline reminders (2 days before due)
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Simulate assignment and notification
                  alert('Evaluators assigned successfully! Notifications sent to all assigned evaluators via email and SMS.');
                  setIsAssignDialogOpen(false);
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Assign & Notify Evaluators
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluators.map((evaluator) => (
          <Card key={evaluator.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {evaluator.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{evaluator.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {evaluator.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {evaluator.phone}
                </div>
              </div>

              <div>
                <p className="font-medium text-sm mb-2">Expertise</p>
                <div className="flex flex-wrap gap-1">
                  {evaluator.expertise.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {evaluator.expertise.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{evaluator.expertise.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="font-bold text-blue-600">{evaluator.assignedSheets}</p>
                  <p className="text-gray-600">Assigned</p>
                </div>
                <div>
                  <p className="font-bold text-green-600">{evaluator.completedSheets}</p>
                  <p className="text-gray-600">Completed</p>
                </div>
                <div>
                  <p className="font-bold text-orange-600">{evaluator.pendingSheets}</p>
                  <p className="text-gray-600">Pending</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round((evaluator.completedSheets / evaluator.assignedSheets) * 100)}%</span>
                </div>
                <Progress value={(evaluator.completedSheets / evaluator.assignedSheets) * 100} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
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

  const renderAnswerKeysInterface = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Answer Keys Management</h2>
          <p className="text-gray-600">Upload and manage answer keys for evaluators</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload Answer Key
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {answerKeys.map((key) => (
          <Card key={key.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {key.subject}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Subject Code</p>
                  <p className="text-gray-600">{key.subjectCode}</p>
                </div>
                <div>
                  <p className="font-medium">Version</p>
                  <p className="text-gray-600">v{key.version}</p>
                </div>
              </div>

              <div className="text-sm">
                <p className="font-medium">Uploaded by</p>
                <p className="text-gray-600">{key.uploadedBy}</p>
                <p className="text-gray-600">{new Date(key.uploadedAt).toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Answer Key
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View Solution Guide
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Marking Scheme
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExportInterface = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Export & Reports</h2>
          <p className="text-gray-600">Export evaluation data and generate comprehensive reports</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Export Settings
        </Button>
      </div>

      {/* Export Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Results Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Results Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Export evaluation results with comprehensive student and exam data
            </p>
            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Exporting results to CSV...\n\n' +
                        '📊 Including:\n' +
                        '• Student details\n' +
                        '• Marks and grades\n' +
                        '• Evaluation timeline\n' +
                        '• Quality metrics\n\n' +
                        'File: evaluation_results_' + new Date().toISOString().split('T')[0] + '.csv');
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                CSV Format
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Generating Excel report...\n\n' +
                        '📊 Including:\n' +
                        '• Multiple worksheets\n' +
                        '• Charts and graphs\n' +
                        '• Pivot tables\n' +
                        '• Summary statistics\n\n' +
                        'File: evaluation_report_' + new Date().toISOString().split('T')[0] + '.xlsx');
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Excel Report
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Creating PDF report...\n\n' +
                        '📊 Including:\n' +
                        '• Executive summary\n' +
                        '• Detailed analysis\n' +
                        '• Visual charts\n' +
                        '• Recommendations\n\n' +
                        'File: evaluation_analysis_' + new Date().toISOString().split('T')[0] + '.pdf');
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Sheets Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Answer Sheets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Bulk export of answer sheets with annotations and evaluations
            </p>
            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Preparing answer sheets archive...\n\n' +
                        '📁 Including:\n' +
                        '• Original answer sheets\n' +
                        '• Annotated versions\n' +
                        '• Evaluation summaries\n' +
                        '• Quality checks\n\n' +
                        'Archive: answer_sheets_' + new Date().toISOString().split('T')[0] + '.zip');
                }}
              >
                <Archive className="h-4 w-4 mr-2" />
                Complete Archive
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Exporting evaluation summaries...\n\n' +
                        '📊 Including:\n' +
                        '• Marks breakdown\n' +
                        '• Evaluator comments\n' +
                        '• Quality indicators\n' +
                        '• Time metrics\n\n' +
                        'File: evaluation_summaries_' + new Date().toISOString().split('T')[0] + '.csv');
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Summaries Only
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Creating annotations report...\n\n' +
                        '📝 Including:\n' +
                        '• Digital annotations\n' +
                        '• Markup history\n' +
                        '• Comment threads\n' +
                        '• Version tracking\n\n' +
                        'File: annotations_report_' + new Date().toISOString().split('T')[0] + '.pdf');
                }}
              >
                <PenTool className="h-4 w-4 mr-2" />
                Annotations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics & Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Advanced analytics and performance reports for institutional insights
            </p>
            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Generating performance analytics...\n\n' +
                        '📈 Including:\n' +
                        '• Evaluator efficiency\n' +
                        '• Subject performance\n' +
                        '• Quality trends\n' +
                        '• Time analysis\n\n' +
                        'File: performance_analytics_' + new Date().toISOString().split('T')[0] + '.xlsx');
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Performance Analytics
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Creating quality assurance report...\n\n' +
                        '🎯 Including:\n' +
                        '• Evaluation consistency\n' +
                        '• Error detection\n' +
                        '• Reviewer feedback\n' +
                        '• Improvement areas\n\n' +
                        'File: quality_report_' + new Date().toISOString().split('T')[0] + '.pdf');
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Quality Report
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Preparing comprehensive dashboard...\n\n' +
                        '📊 Including:\n' +
                        '• Interactive charts\n' +
                        '• Real-time metrics\n' +
                        '• Drill-down capabilities\n' +
                        '• Custom filters\n\n' +
                        'Dashboard: evaluation_dashboard_' + new Date().toISOString().split('T')[0] + '.html');
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Interactive Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export Actions</CardTitle>
          <p className="text-sm text-gray-600">One-click exports for common requirements</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => {
                alert('Exporting today\'s completed evaluations...\n\nReady for download!');
              }}
            >
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm">Today's Results</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => {
                alert('Exporting pending evaluations list...\n\nReady for download!');
              }}
            >
              <Clock className="h-6 w-6 mb-2" />
              <span className="text-sm">Pending Items</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => {
                alert('Exporting evaluator workload report...\n\nReady for download!');
              }}
            >
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Evaluator Load</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => {
                alert('Exporting quality metrics summary...\n\nReady for download!');
              }}
            >
              <Star className="h-6 w-6 mb-2" />
              <span className="text-sm">Quality Metrics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Evaluation Results CSV</p>
                  <p className="text-sm text-gray-500">March 24, 2024 at 2:30 PM</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Performance Analytics</p>
                  <p className="text-sm text-gray-500">March 23, 2024 at 4:15 PM</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResultsInterface = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Results Management</h2>
          <p className="text-gray-600">Publish and manage evaluation results</p>
        </div>
        <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Publish Results
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish Evaluation Results</DialogTitle>
              <DialogDescription>
                Align dummy numbers with student records and publish results
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Exam</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EX001">Computer Science Mid-term</SelectItem>
                    <SelectItem value="EX002">Mathematics Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Access Permissions</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Students can view their results</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Parents can view their ward's results</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Faculty can view all results</span>
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="font-medium text-yellow-800">Important</p>
                </div>
                <p className="text-sm text-yellow-700">
                  Once published, results will be visible to selected roles. This action cannot be undone.
                  Ensure all evaluations are complete before publishing.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResultsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Simulate result publication and notifications
                  alert('Results published successfully!\n\n' +
                        '📧 Email notifications sent to all students\n' +
                        '📱 SMS alerts sent to parents\n' +
                        '🔔 Push notifications sent to mobile apps\n' +
                        '📊 Results are now visible in student and parent portals\n\n' +
                        'Students can now:\n' +
                        '• View their detailed results\n' +
                        '• Download mark sheets\n' +
                        '• Request revaluation if needed');
                  setIsResultsDialogOpen(false);
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Publish & Notify All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Info</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {answerSheets.filter(s => s.status === 'completed' || s.status === 'published').map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sheet.studentName}</p>
                      <p className="text-sm text-gray-500">{sheet.registrationNumber}</p>
                      <p className="text-xs text-gray-400">{sheet.program}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sheet.subject}</p>
                      <p className="text-sm text-gray-500">{sheet.subjectCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>{sheet.examName}</TableCell>
                  <TableCell>{sheet.totalMarks}</TableCell>
                  <TableCell>
                    <span className="font-medium text-lg">{sheet.marks}</span>
                    <span className="text-sm text-gray-500 ml-1">({sheet.percentage}%)</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sheet.grade === 'A' ? 'default' : sheet.grade === 'B' ? 'secondary' : 'destructive'}>
                      {sheet.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(sheet.status)}>
                      {sheet.status}
                    </Badge>
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

  const renderFacultyAssignments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Evaluation Assignments</CardTitle>
          <p className="text-sm text-gray-600">Answer sheets assigned for evaluation</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {answerSheets.filter(s => s.assignedEvaluator === 'EV001').map((sheet) => (
              <div key={sheet.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">{sheet.subject}</p>
                    <p className="text-sm text-gray-500">Dummy Number: {sheet.dummyNumber}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(sheet.status)}>
                    {sheet.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium">Exam</p>
                    <p className="text-gray-600">{sheet.examName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Marks</p>
                    <p className="text-gray-600">{sheet.totalMarks}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <PenTool className="h-4 w-4 mr-2" />
                    Start Evaluation
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Answer Key
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

  const renderEvaluationInterface = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Digital Answer Sheet Evaluation</CardTitle>
          <p className="text-sm text-gray-600">Evaluate answer sheets with digital annotation</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Answer Sheet Viewer */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg p-4 bg-gray-50 min-h-96">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Answer Sheet: DUMMY001</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded border min-h-80 flex items-center justify-center">
                  <p className="text-gray-500">Answer sheet viewer would be implemented here</p>
                </div>
              </div>
            </div>

            {/* Evaluation Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question-wise Marking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((question) => (
                    <div key={question} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">{question}</Label>
                        <span className="text-sm text-gray-500">(20 marks)</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="Enter marks"
                        max="20"
                        min="0"
                        className="mb-2"
                      />
                      <Textarea
                        placeholder="Comments/feedback..."
                        className="text-sm"
                        rows={2}
                      />
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">Total Marks</Label>
                      <span className="text-lg font-bold">85/100</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">Grade</Label>
                      <Badge>A</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Progress
                    </Button>
                    <Button variant="outline" className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Evaluation
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

  const renderCompletedEvaluations = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Completed Evaluations</CardTitle>
          <p className="text-sm text-gray-600">Your completed answer sheet evaluations</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dummy Number</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Marks Awarded</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Completed On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {answerSheets.filter(s => s.assignedEvaluator === 'EV001' && s.status === 'completed').map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell className="font-medium">{sheet.dummyNumber}</TableCell>
                  <TableCell>{sheet.subject}</TableCell>
                  <TableCell>
                    <span className="font-medium">{sheet.marks}/{sheet.totalMarks}</span>
                    <span className="text-sm text-gray-500 ml-2">({sheet.percentage}%)</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sheet.grade === 'A' ? 'default' : 'secondary'}>
                      {sheet.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{sheet.evaluationDate ? new Date(sheet.evaluationDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
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

  const renderEvaluationSchedule = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Evaluation Schedule</CardTitle>
          <p className="text-sm text-gray-600">Your assigned evaluation sessions and locations</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evaluationZones.filter(z => z.assignedEvaluators.includes('EV001')).map((zone) => (
              <Card key={zone.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">{zone.name}</h3>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{zone.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Venue</p>
                      <p className="text-gray-600">{zone.evaluationSchedule.venue}</p>
                    </div>
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-gray-600">
                        {zone.evaluationSchedule.startDate} to {zone.evaluationSchedule.endDate}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Coordinator</p>
                      <p className="text-gray-600">{zone.coordinator}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-1">Instructions:</p>
                    <p className="text-sm text-blue-700">{zone.evaluationSchedule.instructions}</p>
                  </div>
                </CardContent>
              </Card>
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
          <CardTitle>My Examination Results</CardTitle>
          <p className="text-sm text-gray-600">View your published examination results</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {answerSheets.filter(s => s.studentId === 'ST001' && s.status === 'published').map((sheet) => (
              <Card key={sheet.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{sheet.examName}</h3>
                      <p className="text-sm text-gray-600">{sheet.subject}</p>
                    </div>
                    <Badge variant="default">Published</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{sheet.marks}</p>
                      <p className="text-sm text-gray-600">Marks Obtained</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-600">{sheet.totalMarks}</p>
                      <p className="text-sm text-gray-600">Total Marks</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{sheet.percentage}%</p>
                      <p className="text-sm text-gray-600">Percentage</p>
                    </div>
                    <div>
                      <Badge variant="default" className="text-lg p-2">{sheet.grade}</Badge>
                      <p className="text-sm text-gray-600 mt-1">Grade</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Result
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Request Revaluation
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

  const renderRevaluationInterface = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revaluation Requests</CardTitle>
          <p className="text-sm text-gray-600">Submit requests for answer sheet revaluation</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">How to Request Revaluation</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revaluation can be requested within 7 days of result publication</li>
                <li>• A nominal fee may be applicable for revaluation requests</li>
                <li>• Revaluation will be conducted by a different evaluator</li>
                <li>• Results of revaluation are final and binding</li>
              </ul>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Data Structures - CS201</h3>
                    <p className="text-sm text-gray-600">Mid-term Examination</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">85/100</p>
                    <Badge>Grade A</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="reason">Reason for Revaluation</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide specific reasons for requesting revaluation..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm">Submit Request</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <p className="text-sm text-gray-600">Detailed analysis of your academic performance</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">85.5</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">A</p>
                <p className="text-sm text-gray-600">Overall Grade</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-sm text-gray-600">Subjects Evaluated</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Subject-wise Performance</h3>
            {answerSheets.filter(s => s.studentId === 'ST001' && s.marks).map((sheet) => (
              <div key={sheet.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{sheet.subject}</p>
                  <p className="text-sm text-gray-600">{sheet.subjectCode}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{sheet.marks}/{sheet.totalMarks}</p>
                  <p className="text-sm text-gray-600">{sheet.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <PermissionGuard resource="evaluation" operation="read">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Answer Sheet Evaluation</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive role-based evaluation management system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <User className="h-4 w-4 mr-2" />
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Role-based Interface */}
        {renderRoleBasedContent()}
      </div>
    </PermissionGuard>
  );
}
