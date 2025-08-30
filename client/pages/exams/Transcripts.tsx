import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { cn } from '@/lib/utils';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload,
  FileText, Send, CheckCircle, AlertCircle, Clock, Award,
  GraduationCap, User, Calendar, Printer, Share, Copy,
  Shield, Zap, BarChart3, Mail, Phone, MapPin, Star, Settings
} from 'lucide-react';

interface SubjectGrade {
  subjectCode: string;
  subjectName: string;
  credits: number;
  semester: string;
  academicYear: string;
  grade: string;
  gradePoints: number;
  marks: number;
  maxMarks: number;
  examType: 'Regular' | 'Supplementary' | 'Improvement';
  status: 'Pass' | 'Fail' | 'Incomplete';
}

interface Transcript {
  id: string;
  studentId: string;
  rollNumber: string;
  name: string;
  program: string;
  specialization?: string;
  admissionYear: string;
  graduationYear?: string;
  subjects: SubjectGrade[];
  overallCGPA: number;
  totalCredits: number;
  completedCredits: number;
  gradeDistribution: { [grade: string]: number };
  honors?: string;
  remarks?: string;
  classification: 'First Class' | 'Second Class' | 'Third Class' | 'Pass' | 'Fail';
  status: 'In Progress' | 'Completed' | 'Provisional' | 'Final';
  requestedBy: string;
  requestDate: string;
  generatedDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  issuedDate?: string;
  certificateNumber?: string;
  verificationCode?: string;
  digitalSignature?: string;
  transcriptType: 'Official' | 'Unofficial' | 'Provisional';
  deliveryMethod: 'Physical' | 'Digital' | 'Email';
  purpose: 'Higher Studies' | 'Employment' | 'Immigration' | 'Personal' | 'Other';
  recipientDetails?: {
    name: string;
    organization: string;
    address: string;
    email: string;
  };
}

interface TranscriptTemplate {
  id: string;
  name: string;
  description: string;
  layout: 'Standard' | 'Detailed' | 'Compact' | 'International';
  includePhoto: boolean;
  includeQRCode: boolean;
  includeWatermark: boolean;
  headerInfo: string[];
  footerInfo: string[];
  gradeScale: string;
  isDefault: boolean;
  status: 'Active' | 'Inactive';
}

const initialTranscripts: Transcript[] = [
  {
    id: 'TR001',
    studentId: 'ST001',
    rollNumber: '2020CSE001',
    name: 'Arun',
    program: 'Bachelor of Technology - Computer Science',
    specialization: 'Artificial Intelligence',
    admissionYear: '2020',
    graduationYear: '2024',
    subjects: [
      {
        subjectCode: 'MA101',
        subjectName: 'Engineering Mathematics-I',
        credits: 4,
        semester: '1st',
        academicYear: '2020-21',
        grade: 'A',
        gradePoints: 9.0,
        marks: 85,
        maxMarks: 100,
        examType: 'Regular',
        status: 'Pass'
      },
      {
        subjectCode: 'CS101',
        subjectName: 'Programming Fundamentals',
        credits: 4,
        semester: '1st',
        academicYear: '2020-21',
        grade: 'A+',
        gradePoints: 10.0,
        marks: 92,
        maxMarks: 100,
        examType: 'Regular',
        status: 'Pass'
      },
      {
        subjectCode: 'PH101',
        subjectName: 'Engineering Physics',
        credits: 3,
        semester: '1st',
        academicYear: '2020-21',
        grade: 'B+',
        gradePoints: 8.0,
        marks: 78,
        maxMarks: 100,
        examType: 'Regular',
        status: 'Pass'
      }
    ],
    overallCGPA: 8.95,
    totalCredits: 160,
    completedCredits: 160,
    gradeDistribution: { 'A+': 15, 'A': 20, 'B+': 8, 'B': 3, 'C+': 1 },
    honors: 'Magna Cum Laude',
    classification: 'First Class',
    status: 'Final',
    requestedBy: 'Manikandan',
    requestDate: '2024-06-15',
    generatedDate: '2024-06-16',
    approvedBy: 'Dr. Academic Officer',
    approvalDate: '2024-06-16',
    issuedDate: '2024-06-17',
    certificateNumber: 'TRANS/2024/CSE/001',
    verificationCode: 'VER2024CS001',
    transcriptType: 'Official',
    deliveryMethod: 'Digital',
    purpose: 'Higher Studies',
    recipientDetails: {
      name: 'Stanford University',
      organization: 'Admissions Office',
      address: '450 Serra Mall, Stanford, CA 94305',
      email: 'admissions@gmail.com'
    }
  },
  {
    id: 'TR002',
    studentId: 'ST002',
    rollNumber: '2021ECE045',
    name: 'Ramu',
    program: 'Bachelor of Technology - Electronics & Communication',
    admissionYear: '2021',
    subjects: [
      {
        subjectCode: 'MA101',
        subjectName: 'Engineering Mathematics-I',
        credits: 4,
        semester: '1st',
        academicYear: '2021-22',
        grade: 'B+',
        gradePoints: 8.0,
        marks: 75,
        maxMarks: 100,
        examType: 'Regular',
        status: 'Pass'
      },
      {
        subjectCode: 'EC101',
        subjectName: 'Basic Electronics',
        credits: 4,
        semester: '1st',
        academicYear: '2021-22',
        grade: 'A',
        gradePoints: 9.0,
        marks: 88,
        maxMarks: 100,
        examType: 'Regular',
        status: 'Pass'
      }
    ],
    overallCGPA: 7.85,
    totalCredits: 160,
    completedCredits: 96,
    gradeDistribution: { 'A': 12, 'B+': 15, 'B': 8, 'C+': 4 },
    classification: 'Second Class',
    status: 'In Progress',
    requestedBy: 'suresh',
    requestDate: '2024-11-20',
    transcriptType: 'Unofficial',
    deliveryMethod: 'Email',
    purpose: 'Employment'
  }
];

const initialTemplates: TranscriptTemplate[] = [
  {
    id: 'TEMP001',
    name: 'Standard Official Transcript',
    description: 'Default template for official transcripts with university letterhead',
    layout: 'Standard',
    includePhoto: true,
    includeQRCode: true,
    includeWatermark: true,
    headerInfo: ['University Logo', 'University Name', 'Transcript Title', 'Issue Date'],
    footerInfo: ['Registrar Signature', 'University Seal', 'Verification Code'],
    gradeScale: '10-Point Scale (A+ = 10, A = 9, B+ = 8, B = 7, C+ = 6, C = 5, F = 0)',
    isDefault: true,
    status: 'Active'
  },
  {
    id: 'TEMP002',
    name: 'International Format',
    description: 'ECTS compatible format for international applications',
    layout: 'International',
    includePhoto: false,
    includeQRCode: true,
    includeWatermark: true,
    headerInfo: ['University Logo', 'University Name', 'Transcript Title', 'ECTS Compatible'],
    footerInfo: ['Academic Officer', 'University Seal', 'Digital Signature'],
    gradeScale: 'ECTS Grade Scale (A-F)',
    isDefault: false,
    status: 'Active'
  }
];

export default function Transcripts() {
  const { user } = useAuth();
  const [transcripts, setTranscripts] = useState<Transcript[]>(initialTranscripts);
  const [templates, setTemplates] = useState<TranscriptTemplate[]>(initialTemplates);
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TranscriptTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('transcripts');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showBulkDialog, setBulkDialog] = useState(false);

  // Form states
  const [transcriptRequest, setTranscriptRequest] = useState({
    studentId: '',
    transcriptType: 'Official',
    purpose: 'Higher Studies',
    deliveryMethod: 'Digital',
    templateId: 'TEMP001',
    urgentRequest: false,
    recipientName: '',
    recipientOrganization: '',
    recipientAddress: '',
    recipientEmail: '',
    specialInstructions: ''
  });

  const [bulkRequest, setBulkRequest] = useState({
    studentList: '',
    transcriptType: 'Official',
    purpose: 'Employment',
    deliveryMethod: 'Email',
    templateId: 'TEMP001'
  });

  const filteredTranscripts = transcripts.filter(transcript => {
    const matchesSearch = transcript.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transcript.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transcript.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transcript.status === filterStatus;
    const matchesType = filterType === 'all' || transcript.transcriptType === filterType;
    const matchesProgram = filterProgram === 'all' || transcript.program.includes(filterProgram);
    
    return matchesSearch && matchesStatus && matchesType && matchesProgram;
  });

  const handleRequestTranscript = () => {
    const newTranscript: Transcript = {
      id: `TR${String(transcripts.length + 1).padStart(3, '0')}`,
      studentId: transcriptRequest.studentId,
      rollNumber: `2024XXX${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      name: 'New Student',
      program: 'Bachelor of Technology',
      admissionYear: '2020',
      subjects: [],
      overallCGPA: 0,
      totalCredits: 160,
      completedCredits: 0,
      gradeDistribution: {},
      classification: 'Pass',
      status: 'In Progress',
      requestedBy: user?.name || 'System',
      requestDate: new Date().toISOString().split('T')[0],
      transcriptType: transcriptRequest.transcriptType as any,
      deliveryMethod: transcriptRequest.deliveryMethod as any,
      purpose: transcriptRequest.purpose as any,
      recipientDetails: transcriptRequest.recipientEmail ? {
        name: transcriptRequest.recipientName,
        organization: transcriptRequest.recipientOrganization,
        address: transcriptRequest.recipientAddress,
        email: transcriptRequest.recipientEmail
      } : undefined
    };

    setTranscripts([...transcripts, newTranscript]);
    setShowRequestDialog(false);
    setTranscriptRequest({
      studentId: '',
      transcriptType: 'Official',
      purpose: 'Higher Studies',
      deliveryMethod: 'Digital',
      templateId: 'TEMP001',
      urgentRequest: false,
      recipientName: '',
      recipientOrganization: '',
      recipientAddress: '',
      recipientEmail: '',
      specialInstructions: ''
    });
  };

  const handleApproveTranscript = (transcriptId: string) => {
    setTranscripts(transcripts.map(t => 
      t.id === transcriptId 
        ? { 
            ...t, 
            status: 'Completed' as const,
            approvedBy: user?.name || 'System',
            approvalDate: new Date().toISOString().split('T')[0],
            generatedDate: new Date().toISOString().split('T')[0],
            certificateNumber: `TRANS/2024/${t.program.split(' ')[0]}/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            verificationCode: `VER2024${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
          }
        : t
    ));
  };

  const handleIssueTranscript = (transcriptId: string) => {
    setTranscripts(transcripts.map(t => 
      t.id === transcriptId 
        ? { 
            ...t, 
            status: 'Final' as const,
            issuedDate: new Date().toISOString().split('T')[0]
          }
        : t
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Provisional': 'bg-orange-100 text-orange-800',
      'Final': 'bg-green-100 text-green-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      'Official': 'bg-green-100 text-green-800',
      'Unofficial': 'bg-gray-100 text-gray-800',
      'Provisional': 'bg-orange-100 text-orange-800'
    };
    return variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const calculateGPA = (subjects: SubjectGrade[]) => {
    if (subjects.length === 0) return 0;
    const totalPoints = subjects.reduce((sum, subject) => sum + (subject.gradePoints * subject.credits), 0);
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const renderTranscriptPreview = (transcript: Transcript) => {
    const template = templates.find(t => t.id === 'TEMP001') || templates[0];
    
    return (
      <div className="bg-white p-8 border max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">University of Excellence</h1>
              <p className="text-sm text-gray-600">Established 1965</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">OFFICIAL TRANSCRIPT</h2>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Certificate No: {transcript.certificateNumber || 'PENDING'}</span>
            <span>Issue Date: {transcript.issuedDate || 'PENDING'}</span>
          </div>
        </div>

        {/* Student Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-1">STUDENT INFORMATION</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="mb-2"><strong>Name:</strong> {transcript.name}</div>
              <div className="mb-2"><strong>Roll Number:</strong> {transcript.rollNumber}</div>
              <div className="mb-2"><strong>Student ID:</strong> {transcript.studentId}</div>
            </div>
            <div>
              <div className="mb-2"><strong>Program:</strong> {transcript.program}</div>
              {transcript.specialization && (
                <div className="mb-2"><strong>Specialization:</strong> {transcript.specialization}</div>
              )}
              <div className="mb-2"><strong>Year of Admission:</strong> {transcript.admissionYear}</div>
              {transcript.graduationYear && (
                <div className="mb-2"><strong>Year of Graduation:</strong> {transcript.graduationYear}</div>
              )}
            </div>
          </div>
        </div>

        {/* Academic Record */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-1">ACADEMIC RECORD</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Subject Code</TableHead>
                <TableHead className="text-xs">Subject Name</TableHead>
                <TableHead className="text-xs">Credits</TableHead>
                <TableHead className="text-xs">Grade</TableHead>
                <TableHead className="text-xs">Points</TableHead>
                <TableHead className="text-xs">Semester</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transcript.subjects.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell className="text-xs">{subject.subjectCode}</TableCell>
                  <TableCell className="text-xs">{subject.subjectName}</TableCell>
                  <TableCell className="text-xs">{subject.credits}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="outline">{subject.grade}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{subject.gradePoints}</TableCell>
                  <TableCell className="text-xs">{subject.semester}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-1">ACADEMIC SUMMARY</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="mb-2"><strong>Total Credits Attempted:</strong> {transcript.totalCredits}</div>
              <div className="mb-2"><strong>Credits Completed:</strong> {transcript.completedCredits}</div>
              <div className="mb-2"><strong>Overall CGPA:</strong> {transcript.overallCGPA.toFixed(2)}</div>
            </div>
            <div>
              <div className="mb-2"><strong>Classification:</strong> {transcript.classification}</div>
              {transcript.honors && (
                <div className="mb-2"><strong>Honors:</strong> {transcript.honors}</div>
              )}
              <div className="mb-2"><strong>Status:</strong> {transcript.status}</div>
            </div>
          </div>
        </div>

        {/* Grade Scale */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-1">GRADING SCALE</h3>
          <p className="text-sm">{template.gradeScale}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-8 pt-4 border-t">
          <div className="text-sm">
            <div className="mb-2"><strong>Verified by:</strong></div>
            <div>Academic Registrar</div>
            <div>University of Excellence</div>
          </div>
          <div className="text-right text-sm">
            {transcript.verificationCode && (
              <>
                <div className="mb-2"><strong>Verification Code:</strong></div>
                <div className="font-mono">{transcript.verificationCode}</div>
              </>
            )}
          </div>
        </div>

        {template.includeQRCode && (
          <div className="flex justify-center mt-4">
            <div className="w-20 h-20 bg-gray-200 border-2 border-dashed flex items-center justify-center">
              <span className="text-xs">QR Code</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transcript Management</h1>
          <p className="text-muted-foreground">
            Generate, manage, and track academic transcripts and official documents.
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permission="exams.transcripts.bulk" fallback={null}>
            <Dialog open={showBulkDialog} onOpenChange={setBulkDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Bulk Generate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Transcript Generation</DialogTitle>
                  <DialogDescription>
                    Generate transcripts for multiple students simultaneously.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="studentList">Student List (one per line)</Label>
                    <Textarea
                      id="studentList"
                      value={bulkRequest.studentList}
                      onChange={(e) => setBulkRequest({...bulkRequest, studentList: e.target.value})}
                      placeholder="ST001&#10;ST002&#10;ST003"
                      rows={5}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Transcript Type</Label>
                      <Select value={bulkRequest.transcriptType} onValueChange={(value) => setBulkRequest({...bulkRequest, transcriptType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Official">Official</SelectItem>
                          <SelectItem value="Unofficial">Unofficial</SelectItem>
                          <SelectItem value="Provisional">Provisional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Template</Label>
                      <Select value={bulkRequest.templateId} onValueChange={(value) => setBulkRequest({...bulkRequest, templateId: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map(template => (
                            <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setBulkDialog(false)}>Cancel</Button>
                  <Button>Generate All</Button>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
          <PermissionGuard permission="exams.transcripts.request" fallback={null}>
            <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Request New Transcript</DialogTitle>
                  <DialogDescription>
                    Create a new transcript request for a student.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={transcriptRequest.studentId}
                      onChange={(e) => setTranscriptRequest({...transcriptRequest, studentId: e.target.value})}
                      placeholder="ST001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transcriptType">Transcript Type</Label>
                    <Select value={transcriptRequest.transcriptType} onValueChange={(value) => setTranscriptRequest({...transcriptRequest, transcriptType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Official">Official</SelectItem>
                        <SelectItem value="Unofficial">Unofficial</SelectItem>
                        <SelectItem value="Provisional">Provisional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={transcriptRequest.purpose} onValueChange={(value) => setTranscriptRequest({...transcriptRequest, purpose: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Higher Studies">Higher Studies</SelectItem>
                        <SelectItem value="Employment">Employment</SelectItem>
                        <SelectItem value="Immigration">Immigration</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deliveryMethod">Delivery Method</Label>
                    <Select value={transcriptRequest.deliveryMethod} onValueChange={(value) => setTranscriptRequest({...transcriptRequest, deliveryMethod: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Digital">Digital</SelectItem>
                        <SelectItem value="Physical">Physical</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="templateId">Template</Label>
                    <Select value={transcriptRequest.templateId} onValueChange={(value) => setTranscriptRequest({...transcriptRequest, templateId: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      value={transcriptRequest.recipientName}
                      onChange={(e) => setTranscriptRequest({...transcriptRequest, recipientName: e.target.value})}
                      placeholder="joshua / Organization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={transcriptRequest.recipientEmail}
                      onChange={(e) => setTranscriptRequest({...transcriptRequest, recipientEmail: e.target.value})}
                      placeholder="recipient@gmail.com"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="recipientOrganization">Organization</Label>
                    <Input
                      id="recipientOrganization"
                      value={transcriptRequest.recipientOrganization}
                      onChange={(e) => setTranscriptRequest({...transcriptRequest, recipientOrganization: e.target.value})}
                      placeholder="University / Company Name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="recipientAddress">Address</Label>
                    <Textarea
                      id="recipientAddress"
                      value={transcriptRequest.recipientAddress}
                      onChange={(e) => setTranscriptRequest({...transcriptRequest, recipientAddress: e.target.value})}
                      placeholder="Complete mailing address..."
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="urgentRequest"
                        checked={transcriptRequest.urgentRequest}
                        onCheckedChange={(checked) => setTranscriptRequest({...transcriptRequest, urgentRequest: checked})}
                      />
                      <Label htmlFor="urgentRequest">Urgent Request (Additional fees may apply)</Label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      value={transcriptRequest.specialInstructions}
                      onChange={(e) => setTranscriptRequest({...transcriptRequest, specialInstructions: e.target.value})}
                      placeholder="Any special requirements or instructions..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRequestTranscript}>
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transcripts">Transcript Requests</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="transcripts" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transcripts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {transcripts.filter(t => t.status === 'Final').length} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transcripts.filter(t => t.status === 'In Progress').length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Official Transcripts</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transcripts.filter(t => t.transcriptType === 'Official').length}
                </div>
                <p className="text-xs text-muted-foreground">Certified documents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2</div>
                <p className="text-xs text-muted-foreground">Average days</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, roll number, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Provisional">Provisional</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Official">Official</SelectItem>
                <SelectItem value="Unofficial">Unofficial</SelectItem>
                <SelectItem value="Provisional">Provisional</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transcripts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transcript Requests</CardTitle>
              <CardDescription>
                Manage and track all transcript requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Details</TableHead>
                    <TableHead>Program & Academic Info</TableHead>
                    <TableHead>Request Details</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTranscripts.map((transcript) => (
                    <TableRow key={transcript.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transcript.name}</div>
                          <div className="text-sm text-muted-foreground">{transcript.rollNumber}</div>
                          <div className="text-xs text-muted-foreground">{transcript.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{transcript.program}</div>
                          {transcript.specialization && (
                            <div className="text-sm text-muted-foreground">{transcript.specialization}</div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            CGPA: {transcript.overallCGPA.toFixed(2)} | {transcript.completedCredits}/{transcript.totalCredits} credits
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getTypeBadge(transcript.transcriptType)}>
                            {transcript.transcriptType}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            Purpose: {transcript.purpose}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Requested: {transcript.requestDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress 
                            value={
                              transcript.status === 'In Progress' ? 25 :
                              transcript.status === 'Completed' ? 75 :
                              transcript.status === 'Final' ? 100 : 0
                            } 
                            className="w-16 h-2" 
                          />
                          <div className="text-xs text-muted-foreground">
                            {transcript.status === 'Final' ? 'Issued' : 
                             transcript.status === 'Completed' ? 'Ready' :
                             'Processing'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(transcript.status)}>
                          {transcript.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTranscript(transcript);
                              setShowPreviewDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transcript.status === 'In Progress' && (
                            <PermissionGuard permission="exams.transcripts.approve" fallback={null}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveTranscript(transcript.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                          )}
                          {transcript.status === 'Completed' && (
                            <PermissionGuard permission="exams.transcripts.issue" fallback={null}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleIssueTranscript(transcript.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                          )}
                          {transcript.status === 'Final' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Download Transcript - {transcript.name}</DialogTitle>
                                  <DialogDescription>
                                    Choose download format and delivery options
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Download Format</Label>
                                    <Select defaultValue="pdf">
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pdf">PDF Document</SelectItem>
                                        <SelectItem value="docx">Word Document</SelectItem>
                                        <SelectItem value="jpeg">JPEG Image</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Document Options</Label>
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="watermark" defaultChecked />
                                        <Label htmlFor="watermark" className="text-sm">Include watermark</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="photo" />
                                        <Label htmlFor="photo" className="text-sm">Include student photo</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="qr-code" defaultChecked />
                                        <Label htmlFor="qr-code" className="text-sm">Include QR code</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="digital-signature" defaultChecked />
                                        <Label htmlFor="digital-signature" className="text-sm">Digital signature</Label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Delivery Method</Label>
                                    <Select defaultValue={transcript.deliveryMethod}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Digital">Digital Download</SelectItem>
                                        <SelectItem value="Email">Email to Recipient</SelectItem>
                                        <SelectItem value="Physical">Physical Mail</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          <PermissionGuard permission="exams.transcripts.edit" fallback={null}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Transcript Templates</h3>
              <p className="text-sm text-muted-foreground">
                Manage transcript layouts and formats
              </p>
            </div>
            <PermissionGuard permission="exams.transcripts.templates" fallback={null}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </PermissionGuard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                template.isDefault && "border-blue-200 bg-blue-50"
              )}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {template.isDefault && (
                        <Badge variant="outline">Default</Badge>
                      )}
                      <Badge className={getStatusBadge(template.status)}>
                        {template.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium mb-1">Layout: {template.layout}</div>
                      <div className="text-muted-foreground">{template.gradeScale}</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.includePhoto && (
                        <Badge variant="outline" className="text-xs">Photo</Badge>
                      )}
                      {template.includeQRCode && (
                        <Badge variant="outline" className="text-xs">QR Code</Badge>
                      )}
                      {template.includeWatermark && (
                        <Badge variant="outline" className="text-xs">Watermark</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Template Preview - {template.name}</DialogTitle>
                            <DialogDescription>
                              Preview of how this template will appear on official transcripts
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-white p-8 border max-w-4xl mx-auto rounded-lg shadow-sm">
                              {/* Template Preview Header */}
                              <div className="text-center mb-8">
                                <div className="flex items-center justify-center gap-4 mb-4">
                                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                    <GraduationCap className="h-8 w-8 text-white" />
                                  </div>
                                  <div>
                                    <h1 className="text-2xl font-bold text-gray-900">University of Excellence</h1>
                                    <p className="text-sm text-gray-600">Established 1965</p>
                                  </div>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">OFFICIAL TRANSCRIPT</h2>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                  <span>Template: {template.name}</span>
                                  <span>Layout: {template.layout}</span>
                                </div>
                              </div>

                              {/* Sample Student Information */}
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-1">STUDENT INFORMATION</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="mb-2"><strong>Name:</strong> Sample Student</div>
                                    <div className="mb-2"><strong>Roll Number:</strong> 2024CSE001</div>
                                    <div className="mb-2"><strong>Student ID:</strong> ST001</div>
                                  </div>
                                  <div>
                                    <div className="mb-2"><strong>Program:</strong> Bachelor of Technology - Computer Science</div>
                                    <div className="mb-2"><strong>Specialization:</strong> Artificial Intelligence</div>
                                    <div className="mb-2"><strong>Year of Admission:</strong> 2020</div>
                                    <div className="mb-2"><strong>Year of Graduation:</strong> 2024</div>
                                  </div>
                                </div>
                              </div>

                              {/* Sample Academic Record */}
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-1">ACADEMIC RECORD</h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-xs">Subject Code</TableHead>
                                      <TableHead className="text-xs">Subject Name</TableHead>
                                      <TableHead className="text-xs">Credits</TableHead>
                                      <TableHead className="text-xs">Grade</TableHead>
                                      <TableHead className="text-xs">Points</TableHead>
                                      <TableHead className="text-xs">Semester</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="text-xs">MA101</TableCell>
                                      <TableCell className="text-xs">Engineering Mathematics-I</TableCell>
                                      <TableCell className="text-xs">4</TableCell>
                                      <TableCell className="text-xs"><Badge variant="outline">A</Badge></TableCell>
                                      <TableCell className="text-xs">9.0</TableCell>
                                      <TableCell className="text-xs">1st</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-xs">CS101</TableCell>
                                      <TableCell className="text-xs">Programming Fundamentals</TableCell>
                                      <TableCell className="text-xs">4</TableCell>
                                      <TableCell className="text-xs"><Badge variant="outline">A+</Badge></TableCell>
                                      <TableCell className="text-xs">10.0</TableCell>
                                      <TableCell className="text-xs">1st</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-xs">PH101</TableCell>
                                      <TableCell className="text-xs">Engineering Physics</TableCell>
                                      <TableCell className="text-xs">3</TableCell>
                                      <TableCell className="text-xs"><Badge variant="outline">B+</Badge></TableCell>
                                      <TableCell className="text-xs">8.0</TableCell>
                                      <TableCell className="text-xs">1st</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Academic Summary */}
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-1">ACADEMIC SUMMARY</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="mb-2"><strong>Total Credits Attempted:</strong> 160</div>
                                    <div className="mb-2"><strong>Credits Completed:</strong> 160</div>
                                    <div className="mb-2"><strong>Overall CGPA:</strong> 8.95</div>
                                  </div>
                                  <div>
                                    <div className="mb-2"><strong>Classification:</strong> First Class</div>
                                    <div className="mb-2"><strong>Honors:</strong> Magna Cum Laude</div>
                                    <div className="mb-2"><strong>Status:</strong> Final</div>
                                  </div>
                                </div>
                              </div>

                              {/* Grade Scale */}
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-1">GRADING SCALE</h3>
                                <p className="text-sm">{template.gradeScale}</p>
                              </div>

                              {/* Template Features */}
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-1">TEMPLATE FEATURES</h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    {template.includePhoto ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span>Student Photo</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {template.includeQRCode ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span>QR Code</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {template.includeWatermark ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span>Security Watermark</span>
                                  </div>
                                </div>
                              </div>

                              {/* Footer */}
                              <div className="flex justify-between items-end mt-8 pt-4 border-t">
                                <div className="text-sm">
                                  <div className="mb-2"><strong>Verified by:</strong></div>
                                  <div>Academic Registrar</div>
                                  <div>University of Excellence</div>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="mb-2"><strong>Verification Code:</strong></div>
                                  <div className="font-mono">VER2024SAMPLE</div>
                                </div>
                              </div>

                              {template.includeQRCode && (
                                <div className="flex justify-center mt-4">
                                  <div className="w-20 h-20 bg-gray-200 border-2 border-dashed flex items-center justify-center">
                                    <span className="text-xs">QR Code</span>
                                  </div>
                                </div>
                              )}

                              {template.includeWatermark && (
                                <div className="absolute inset-0 bg-gray-100 opacity-5 flex items-center justify-center pointer-events-none">
                                  <div className="text-6xl font-bold text-gray-400 rotate-45 select-none">
                                    UNIVERSITY OF EXCELLENCE
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                              <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export Sample
                              </Button>
                              <Button variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Customize
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Edit Template - {template.name}</DialogTitle>
                            <DialogDescription>
                              Modify transcript template configuration and layout
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="template-name">Template Name</Label>
                              <Input
                                id="template-name"
                                defaultValue={template.name}
                              />
                            </div>
                            <div>
                              <Label htmlFor="template-layout">Layout Type</Label>
                              <Select defaultValue={template.layout}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Standard">Standard</SelectItem>
                                  <SelectItem value="Detailed">Detailed</SelectItem>
                                  <SelectItem value="Compact">Compact</SelectItem>
                                  <SelectItem value="International">International</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="template-description">Description</Label>
                              <Textarea
                                id="template-description"
                                defaultValue={template.description}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Template Features</Label>
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="include-photo"
                                    defaultChecked={template.includePhoto}
                                  />
                                  <Label htmlFor="include-photo" className="text-sm">Include Photo</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="include-qr"
                                    defaultChecked={template.includeQRCode}
                                  />
                                  <Label htmlFor="include-qr" className="text-sm">Include QR Code</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="include-watermark"
                                    defaultChecked={template.includeWatermark}
                                  />
                                  <Label htmlFor="include-watermark" className="text-sm">Include Watermark</Label>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="grade-scale">Grade Scale</Label>
                              <Textarea
                                id="grade-scale"
                                defaultValue={template.gradeScale}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="template-status">Status</Label>
                              <Select defaultValue={template.status}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="set-default"
                                  defaultChecked={template.isDefault}
                                />
                                <Label htmlFor="set-default" className="text-sm">Set as default template</Label>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Copy Template - {template.name}</DialogTitle>
                            <DialogDescription>
                              Create a copy of this template with modifications
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="copy-name">New Template Name</Label>
                              <Input
                                id="copy-name"
                                defaultValue={`${template.name} - Copy`}
                              />
                            </div>
                            <div>
                              <Label htmlFor="copy-description">Description</Label>
                              <Textarea
                                id="copy-description"
                                defaultValue={`Copy of ${template.description}`}
                              />
                            </div>
                            <div>
                              <Label>Modifications</Label>
                              <div className="space-y-2 mt-2">
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="modify-layout" />
                                  <Label htmlFor="modify-layout" className="text-sm">Modify layout settings</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="modify-features" />
                                  <Label htmlFor="modify-features" className="text-sm">Modify template features</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="modify-content" />
                                  <Label htmlFor="modify-content" className="text-sm">Modify content sections</Label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>
                              <Copy className="h-4 w-4 mr-2" />
                              Create Copy
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Volume</CardTitle>
                <CardDescription>
                  Monthly transcript request trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {transcripts.filter(t => t.purpose === 'Higher Studies').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Higher Studies</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {transcripts.filter(t => t.purpose === 'Employment').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Employment</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {transcripts.filter(t => t.purpose === 'Immigration').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Immigration</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Metrics</CardTitle>
                <CardDescription>
                  Efficiency and turnaround time analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Processing Time</span>
                    <span className="font-medium">3.2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Digital Delivery</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Student Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.6/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Program-wise Distribution</CardTitle>
              <CardDescription>
                Transcript requests by academic program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Computer Science', 'Electronics', 'Mechanical', 'Civil'].map(program => {
                  const count = transcripts.filter(t => t.program.includes(program)).length;
                  const percentage = transcripts.length > 0 ? Math.round((count / transcripts.length) * 100) : 0;
                  
                  return (
                    <div key={program} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{program}</div>
                        <div className="text-sm text-muted-foreground">{count} requests</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transcript Verification</CardTitle>
              <CardDescription>
                Verify the authenticity of issued transcripts using verification codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      placeholder="Enter verification code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="certificateNumber">Certificate Number</Label>
                    <Input
                      id="certificateNumber"
                      placeholder="Enter certificate number"
                    />
                  </div>
                  <div className="flex items-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Shield className="h-4 w-4 mr-2" />
                          Verify
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transcript Verification</DialogTitle>
                          <DialogDescription>
                            Verify the authenticity of a transcript using verification details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium mb-2">Verification Process</h4>
                            <p className="text-sm text-muted-foreground">
                              Enter the verification code and certificate number to verify transcript authenticity.
                              All official transcripts issued by the university can be verified through this system.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Verification Details</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="Verification Code" />
                              <Input placeholder="Certificate Number" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Student Information (Optional)</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="Student Name" />
                              <Input placeholder="Roll Number" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Additional Verification</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="verify-qr" />
                                <Label htmlFor="verify-qr" className="text-sm">Verify QR code authenticity</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="verify-signature" />
                                <Label htmlFor="verify-signature" className="text-sm">Verify digital signature</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="verify-watermark" />
                                <Label htmlFor="verify-watermark" className="text-sm">Verify security watermark</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button>
                            <Shield className="h-4 w-4 mr-2" />
                            Verify Transcript
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-4">Recent Verifications</h4>
                  <div className="space-y-2">
                    {transcripts.filter(t => t.verificationCode).slice(0, 5).map(transcript => (
                      <div key={transcript.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{transcript.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {transcript.certificateNumber} • {transcript.verificationCode}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transcript Preview</DialogTitle>
            <DialogDescription>
              Preview of the generated transcript document
            </DialogDescription>
          </DialogHeader>
          {selectedTranscript && (
            <div>
              {renderTranscriptPreview(selectedTranscript)}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
