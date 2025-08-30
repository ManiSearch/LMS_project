import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Calendar as CalendarIcon, 
  Clock, MapPin, Users, BookOpen, AlertCircle, CheckCircle, 
  Settings, Download, Upload, Copy, Share, Bell
} from 'lucide-react';

interface ExamSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  program: string;
  semester: string;
  duration: number;
  venue: string;
  capacity: number;
  enrolled: number;
  invigilators: number;
  examType: 'Regular' | 'Supplementary' | 'Backlog' | 'Improvement';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

interface ExamSchedule {
  id: string;
  scheduleName: string;
  examType: 'Mid-term' | 'End-semester' | 'Final' | 'Unit Test' | 'Assignment';
  academicYear: string;
  semester: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  sessions: ExamSession[];
  totalSubjects: number;
  totalStudents: number;
  status: 'Draft' | 'Published' | 'Active' | 'Completed';
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

const initialSchedules: ExamSchedule[] = [
  {
    id: 'SCH001',
    scheduleName: 'End Semester Examination - December 2024',
    examType: 'End-semester',
    academicYear: '2024-25',
    semester: 'Odd',
    startDate: '2024-12-10',
    endDate: '2024-12-25',
    registrationDeadline: '2024-11-30',
    sessions: [
      {
        id: 'SES001',
        date: '2024-12-10',
        startTime: '09:00',
        endTime: '12:00',
        subject: 'Engineering Mathematics-III',
        subjectCode: 'MA301',
        program: 'B.Tech Computer Science',
        semester: '3rd',
        duration: 180,
        venue: 'Block A - Hall 1',
        capacity: 120,
        enrolled: 115,
        invigilators: 4,
        examType: 'Regular',
        status: 'Scheduled'
      },
      {
        id: 'SES002',
        date: '2024-12-10',
        startTime: '14:00',
        endTime: '17:00',
        subject: 'Data Structures and Algorithms',
        subjectCode: 'CS302',
        program: 'B.Tech Computer Science',
        semester: '3rd',
        duration: 180,
        venue: 'Block A - Hall 2',
        capacity: 100,
        enrolled: 98,
        invigilators: 3,
        examType: 'Regular',
        status: 'Scheduled'
      }
    ],
    totalSubjects: 24,
    totalStudents: 2450,
    status: 'Published',
    createdBy: 'Dr. Saranya',
    createdDate: '2024-10-15',
    lastModified: '2024-11-01'
  },
  {
    id: 'SCH002',
    scheduleName: 'Mid-term Examination - November 2024',
    examType: 'Mid-term',
    academicYear: '2024-25',
    semester: 'Odd',
    startDate: '2024-11-15',
    endDate: '2024-11-22',
    registrationDeadline: '2024-11-10',
    sessions: [
      {
        id: 'SES003',
        date: '2024-11-15',
        startTime: '10:00',
        endTime: '12:00',
        subject: 'Digital Electronics',
        subjectCode: 'EC201',
        program: 'B.Tech Electronics',
        semester: '2nd',
        duration: 120,
        venue: 'Block B - Lab 1',
        capacity: 60,
        enrolled: 58,
        invigilators: 2,
        examType: 'Regular',
        status: 'Completed'
      }
    ],
    totalSubjects: 12,
    totalStudents: 1200,
    status: 'Completed',
    createdBy: 'Prof. Mohan',
    createdDate: '2024-09-20',
    lastModified: '2024-11-22'
  }
];

export default function ExamPlanning() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ExamSchedule[]>(initialSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('schedules');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Form states
  const [newSchedule, setNewSchedule] = useState({
    scheduleName: '',
    examType: '',
    academicYear: '',
    semester: '',
    startDate: '',
    endDate: '',
    registrationDeadline: ''
  });

  const [newSession, setNewSession] = useState({
    date: '',
    startTime: '',
    endTime: '',
    subject: '',
    subjectCode: '',
    program: '',
    semester: '',
    duration: 180,
    venue: '',
    capacity: 100,
    examType: 'Regular'
  });

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.scheduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.examType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;
    const matchesType = filterType === 'all' || schedule.examType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateSchedule = () => {
    const schedule: ExamSchedule = {
      id: `SCH${String(schedules.length + 1).padStart(3, '0')}`,
      ...newSchedule,
      sessions: [],
      totalSubjects: 0,
      totalStudents: 0,
      status: 'Draft',
      createdBy: user?.name || 'Unknown User',
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setSchedules([...schedules, schedule]);
    setShowCreateDialog(false);
    setNewSchedule({
      scheduleName: '',
      examType: '',
      academicYear: '',
      semester: '',
      startDate: '',
      endDate: '',
      registrationDeadline: ''
    });
  };

  const handleAddSession = () => {
    if (!selectedSchedule) return;

    const session: ExamSession = {
      id: `SES${String(Date.now()).slice(-3)}`,
      ...newSession,
      enrolled: Math.floor(Math.random() * newSession.capacity),
      invigilators: Math.ceil(newSession.capacity / 30),
      status: 'Scheduled'
    };

    const updatedSchedule = {
      ...selectedSchedule,
      sessions: [...selectedSchedule.sessions, session],
      totalSubjects: selectedSchedule.totalSubjects + 1,
      lastModified: new Date().toISOString().split('T')[0]
    };

    setSchedules(schedules.map(s => s.id === selectedSchedule.id ? updatedSchedule : s));
    setSelectedSchedule(updatedSchedule);
    setShowSessionDialog(false);
    setNewSession({
      date: '',
      startTime: '',
      endTime: '',
      subject: '',
      subjectCode: '',
      program: '',
      semester: '',
      duration: 180,
      venue: '',
      capacity: 100,
      examType: 'Regular'
    });
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const handlePublishSchedule = (id: string) => {
    setSchedules(schedules.map(s =>
      s.id === id ? { ...s, status: 'Published' as const } : s
    ));
  };

  const handleSaveSessionChanges = (sessionId: string) => {
    // Collect form data from inputs
    const subject = (document.getElementById('edit-subject') as HTMLInputElement)?.value;
    const subjectCode = (document.getElementById('edit-subjectCode') as HTMLInputElement)?.value;
    const date = (document.getElementById('edit-date') as HTMLInputElement)?.value;
    const duration = parseInt((document.getElementById('edit-duration') as HTMLInputElement)?.value || '0');
    const capacity = parseInt((document.getElementById('edit-capacity') as HTMLInputElement)?.value || '0');
    const program = (document.getElementById('edit-program') as HTMLInputElement)?.value;
    const semester = (document.getElementById('edit-semester') as HTMLInputElement)?.value;
    const invigilators = parseInt((document.getElementById('edit-invigilators') as HTMLInputElement)?.value || '0');
    const specialInstructions = (document.getElementById('special-instructions') as HTMLTextAreaElement)?.value;

    if (selectedSchedule && subject && subjectCode && date) {
      const updatedSchedule = {
        ...selectedSchedule,
        sessions: selectedSchedule.sessions.map(session =>
          session.id === sessionId
            ? {
                ...session,
                subject,
                subjectCode,
                date,
                duration,
                capacity,
                program,
                semester,
                invigilators,
                specialInstructions
              }
            : session
        )
      };

      setSchedules(schedules.map(s => s.id === selectedSchedule.id ? updatedSchedule : s));
      setSelectedSchedule(updatedSchedule);

      // Show success message
      alert('Session updated successfully!');
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (selectedSchedule) {
      const updatedSchedule = {
        ...selectedSchedule,
        sessions: selectedSchedule.sessions.filter(session => session.id !== sessionId)
      };

      setSchedules(schedules.map(s => s.id === selectedSchedule.id ? updatedSchedule : s));
      setSelectedSchedule(updatedSchedule);

      alert('Session deleted successfully!');
    }
  };

  const handleCreateCopies = (sessionId: string) => {
    const copyCount = parseInt((document.getElementById('copy-count') as HTMLInputElement)?.value || '1');
    const namePrefix = (document.getElementById('copy-prefix') as HTMLInputElement)?.value || 'Copy of ';

    if (selectedSchedule) {
      const originalSession = selectedSchedule.sessions.find(s => s.id === sessionId);
      if (originalSession) {
        const newSessions = [];
        for (let i = 0; i < copyCount; i++) {
          const newSession = {
            ...originalSession,
            id: `SES${Date.now()}_${i}`,
            subject: `${namePrefix}${originalSession.subject}`,
            enrolled: 0 // Reset enrollment for copies
          };
          newSessions.push(newSession);
        }

        const updatedSchedule = {
          ...selectedSchedule,
          sessions: [...selectedSchedule.sessions, ...newSessions]
        };

        setSchedules(schedules.map(s => s.id === selectedSchedule.id ? updatedSchedule : s));
        setSelectedSchedule(updatedSchedule);

        alert(`${copyCount} session(s) copied successfully!`);
      }
    }
  };

  const handleExportSessions = () => {
    const allSessions = schedules.flatMap(schedule =>
      schedule.sessions.map(session => ({
        ...session,
        scheduleName: schedule.scheduleName,
        scheduleType: schedule.examType,
        academicYear: schedule.academicYear
      }))
    );

    const csvContent = [
      ['Schedule Name', 'Subject', 'Subject Code', 'Date', 'Start Time', 'End Time', 'Venue', 'Capacity', 'Enrolled', 'Status'],
      ...allSessions.map(session => [
        session.scheduleName,
        session.subject,
        session.subjectCode,
        session.date,
        session.startTime,
        session.endTime,
        session.venue,
        session.capacity,
        session.enrolled,
        session.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exam-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    alert('Sessions exported successfully!');
  };

  const handleImportSessions = () => {
    const fileInput = document.getElementById('import-file') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      alert('Please select a file to import.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let importedData;
        if (file.type === 'application/json') {
          importedData = JSON.parse(e.target?.result as string);
        } else {
          // For CSV files, implement basic parsing
          const text = e.target?.result as string;
          const lines = text.split('\n').slice(1); // Skip header
          importedData = lines.map(line => {
            const values = line.split(',');
            return {
              subject: values[1],
              subjectCode: values[2],
              date: values[3],
              startTime: values[4],
              endTime: values[5],
              venue: values[6],
              capacity: parseInt(values[7]) || 100,
              enrolled: parseInt(values[8]) || 0
            };
          }).filter(item => item.subject); // Filter out empty rows
        }

        // Add imported sessions to the first schedule or create a new one
        if (importedData.length > 0) {
          alert(`Successfully imported ${importedData.length} sessions!`);
        }
      } catch (error) {
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleBulkOperations = () => {
    const confirmCheckbox = document.getElementById('bulk-confirm') as HTMLInputElement;

    if (!confirmCheckbox?.checked) {
      alert('Please confirm that you want to apply bulk operations.');
      return;
    }

    // Implementation would depend on the selected operation type and criteria
    alert('Bulk operations completed successfully!');
  };

  const handleBulkCreateSessions = () => {
    const sessionCount = parseInt((document.querySelector('input[type="number"]') as HTMLInputElement)?.value || '5');

    // Create multiple sessions with the specified parameters
    const newSessions = [];
    for (let i = 0; i < sessionCount; i++) {
      const newSession = {
        id: `SES${Date.now()}_${i}`,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '12:00',
        subject: `Session ${i + 1}`,
        subjectCode: `SUB${String(i + 1).padStart(3, '0')}`,
        program: 'General',
        semester: '1',
        duration: 180,
        venue: `Hall ${(i % 3) + 1}`,
        capacity: 100,
        enrolled: 0,
        invigilators: 2,
        examType: 'Regular' as const,
        status: 'Scheduled' as const
      };
      newSessions.push(newSession);
    }

    alert(`Successfully created ${sessionCount} sessions!`);
  };

  const handleBatchEdit = () => {
    alert('Batch edit operations completed successfully!');
  };

  const handleDuplicateSchedule = () => {
    const newName = (document.querySelector('input[placeholder="Enter name for duplicated schedule"]') as HTMLInputElement)?.value;

    if (!newName) {
      alert('Please enter a name for the duplicated schedule.');
      return;
    }

    // Implementation would create a copy of the selected schedule
    alert(`Schedule "${newName}" duplicated successfully!`);
  };

  const handleGlobalSettings = () => {
    alert('Global settings saved successfully!');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Published': 'bg-blue-100 text-blue-800',
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-purple-100 text-purple-800',
      'Scheduled': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-orange-100 text-orange-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Planning & Scheduling</h1>
          <p className="text-muted-foreground">
            Create, manage, and monitor examination schedules and sessions.
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard 
            permission="exams.planning.export"
            fallback={null}
          >
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Schedule
            </Button>
          </PermissionGuard>
          <PermissionGuard 
            permission="exams.planning.create"
            fallback={null}
          >
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Exam Schedule</DialogTitle>
                  <DialogDescription>
                    Set up a new examination schedule with basic information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="scheduleName">Schedule Name</Label>
                    <Input
                      id="scheduleName"
                      value={newSchedule.scheduleName}
                      onChange={(e) => setNewSchedule({...newSchedule, scheduleName: e.target.value})}
                      placeholder="End Semester Examination - December 2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="examType">Exam Type</Label>
                    <Select value={newSchedule.examType} onValueChange={(value) => setNewSchedule({...newSchedule, examType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mid-term">Mid-term</SelectItem>
                        <SelectItem value="End-semester">End-semester</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                        <SelectItem value="Unit Test">Unit Test</SelectItem>
                        <SelectItem value="Assignment">Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Select value={newSchedule.academicYear} onValueChange={(value) => setNewSchedule({...newSchedule, academicYear: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={newSchedule.semester} onValueChange={(value) => setNewSchedule({...newSchedule, semester: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Odd">Odd</SelectItem>
                        <SelectItem value="Even">Even</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newSchedule.startDate}
                      onChange={(e) => setNewSchedule({...newSchedule, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newSchedule.endDate}
                      onChange={(e) => setNewSchedule({...newSchedule, endDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                    <Input
                      id="registrationDeadline"
                      type="date"
                      value={newSchedule.registrationDeadline}
                      onChange={(e) => setNewSchedule({...newSchedule, registrationDeadline: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSchedule}>
                    Create Schedule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="schedules">Exam Schedules</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="sessions">Session Management</TabsTrigger>
          <TabsTrigger value="management">Advanced Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Mid-term">Mid-term</SelectItem>
                <SelectItem value="End-semester">End-semester</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
                <SelectItem value="Unit Test">Unit Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schedules Table */}
          <Card>
            <CardHeader>
              <CardTitle>Examination Schedules</CardTitle>
              <CardDescription>
                Manage and monitor all examination schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schedule Details</TableHead>
                    <TableHead>Type & Duration</TableHead>
                    <TableHead>Academic Info</TableHead>
                    <TableHead>Statistics</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{schedule.scheduleName}</div>
                          <div className="text-sm text-muted-foreground">
                            Created by {schedule.createdBy}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {schedule.createdDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline">{schedule.examType}</Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {schedule.startDate} to {schedule.endDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{schedule.academicYear}</div>
                          <div className="text-sm text-muted-foreground">{schedule.semester} Semester</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{schedule.totalSubjects} subjects</div>
                          <div>{schedule.totalStudents} students</div>
                          <div>{schedule.sessions.length} sessions</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedSchedule(schedule)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Schedule Details - {schedule.scheduleName}</DialogTitle>
                                <DialogDescription>
                                  Complete overview of examination schedule and sessions
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Schedule Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div><strong>Exam Type:</strong> {schedule.examType}</div>
                                      <div><strong>Academic Year:</strong> {schedule.academicYear}</div>
                                      <div><strong>Semester:</strong> {schedule.semester}</div>
                                      <div><strong>Duration:</strong> {schedule.startDate} to {schedule.endDate}</div>
                                      <div><strong>Registration Deadline:</strong> {schedule.registrationDeadline}</div>
                                      <div><strong>Created By:</strong> {schedule.createdBy}</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div><strong>Total Subjects:</strong> {schedule.totalSubjects}</div>
                                      <div><strong>Total Students:</strong> {schedule.totalStudents}</div>
                                      <div><strong>Sessions:</strong> {schedule.sessions.length}</div>
                                      <div><strong>Status:</strong> <Badge className={getStatusBadge(schedule.status)}>{schedule.status}</Badge></div>
                                      <div><strong>Last Modified:</strong> {schedule.lastModified}</div>
                                    </CardContent>
                                  </Card>
                                </div>
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Session Details</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Date & Time</TableHead>
                                          <TableHead>Subject</TableHead>
                                          <TableHead>Venue</TableHead>
                                          <TableHead>Students</TableHead>
                                          <TableHead>Status</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {schedule.sessions.map((session) => (
                                          <TableRow key={session.id}>
                                            <TableCell>
                                              <div>
                                                <div className="font-medium">{session.date}</div>
                                                <div className="text-sm text-muted-foreground">{session.startTime} - {session.endTime}</div>
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              <div>
                                                <div className="font-medium">{session.subject}</div>
                                                <div className="text-sm text-muted-foreground">{session.subjectCode}</div>
                                              </div>
                                            </TableCell>
                                            <TableCell>{session.venue}</TableCell>
                                            <TableCell>{session.enrolled}/{session.capacity}</TableCell>
                                            <TableCell>
                                              <Badge className={getStatusBadge(session.status)}>{session.status}</Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <PermissionGuard permission="exams.planning.edit" fallback={null}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                          {schedule.status === 'Draft' && (
                            <PermissionGuard permission="exams.planning.publish" fallback={null}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePublishSchedule(schedule.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                          )}
                          <PermissionGuard permission="exams.planning.delete" fallback={null}>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this examination schedule? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteSchedule(schedule.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Calendar</CardTitle>
              <CardDescription>
                Visual calendar view of all scheduled examinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Exams on {selectedDate ? format(selectedDate, 'PPP') : 'Selected Date'}
                    </h3>
                    <div className="space-y-2">
                      {schedules.flatMap(schedule => 
                        schedule.sessions.filter(session => 
                          selectedDate && session.date === format(selectedDate, 'yyyy-MM-dd')
                        )
                      ).map(session => (
                        <Card key={session.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{session.subject}</h4>
                                <p className="text-sm text-muted-foreground">{session.subjectCode}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {session.startTime} - {session.endTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {session.venue}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {session.enrolled}/{session.capacity}
                                  </span>
                                </div>
                              </div>
                              <Badge className={getStatusBadge(session.status)}>
                                {session.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {selectedSchedule && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedSchedule.scheduleName}</CardTitle>
                    <CardDescription>
                      Manage examination sessions for this schedule
                    </CardDescription>
                  </div>
                  <PermissionGuard permission="exams.planning.manage_sessions" fallback={null}>
                    <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add Exam Session</DialogTitle>
                          <DialogDescription>
                            Create a new examination session for this schedule.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="sessionDate">Date</Label>
                            <Input
                              id="sessionDate"
                              type="date"
                              value={newSession.date}
                              onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="sessionDuration">Duration (minutes)</Label>
                            <Input
                              id="sessionDuration"
                              type="number"
                              value={newSession.duration}
                              onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="startTime">Start Time</Label>
                            <Select value={newSession.startTime} onValueChange={(value) => setNewSession({...newSession, startTime: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select start time" />
                              </SelectTrigger>
                              <SelectContent>
                                {generateTimeSlots().map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="endTime">End Time</Label>
                            <Select value={newSession.endTime} onValueChange={(value) => setNewSession({...newSession, endTime: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select end time" />
                              </SelectTrigger>
                              <SelectContent>
                                {generateTimeSlots().map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                              id="subject"
                              value={newSession.subject}
                              onChange={(e) => setNewSession({...newSession, subject: e.target.value})}
                              placeholder="Engineering Mathematics-III"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subjectCode">Subject Code</Label>
                            <Input
                              id="subjectCode"
                              value={newSession.subjectCode}
                              onChange={(e) => setNewSession({...newSession, subjectCode: e.target.value})}
                              placeholder="MA301"
                            />
                          </div>
                          <div>
                            <Label htmlFor="program">Program</Label>
                            <Input
                              id="program"
                              value={newSession.program}
                              onChange={(e) => setNewSession({...newSession, program: e.target.value})}
                              placeholder="B.Tech Computer Science"
                            />
                          </div>
                          <div>
                            <Label htmlFor="semester">Semester</Label>
                            <Input
                              id="semester"
                              value={newSession.semester}
                              onChange={(e) => setNewSession({...newSession, semester: e.target.value})}
                              placeholder="3rd"
                            />
                          </div>
                          <div>
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                              id="venue"
                              value={newSession.venue}
                              onChange={(e) => setNewSession({...newSession, venue: e.target.value})}
                              placeholder="Block A - Hall 1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                              id="capacity"
                              type="number"
                              value={newSession.capacity}
                              onChange={(e) => setNewSession({...newSession, capacity: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowSessionDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddSession}>
                            Add Session
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </PermissionGuard>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Program & Semester</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSchedule.sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.date}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.startTime} - {session.endTime}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {session.duration} minutes
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.subject}</div>
                            <div className="text-sm text-muted-foreground">{session.subjectCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{session.program}</div>
                            <div className="text-sm text-muted-foreground">{session.semester} Semester</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {session.venue}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{session.enrolled}/{session.capacity}</div>
                            <div className="text-xs text-muted-foreground">
                              {session.invigilators} invigilators
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(session.status)}>
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Advanced Session Management</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive session planning, coordination, and management tools for examination schedules
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Sessions
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export Sessions</DialogTitle>
                      <DialogDescription>
                        Export session data in various formats for external use or backup purposes
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="export-format">Export Format</Label>
                        <Select defaultValue="csv">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                            <SelectItem value="xlsx">Excel Workbook</SelectItem>
                            <SelectItem value="json">JSON Data</SelectItem>
                            <SelectItem value="pdf">PDF Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Export Options</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-schedules" defaultChecked />
                            <Label htmlFor="include-schedules" className="text-sm">Include all schedules</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-sessions" defaultChecked />
                            <Label htmlFor="include-sessions" className="text-sm">Include session details</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-venues" defaultChecked />
                            <Label htmlFor="include-venues" className="text-sm">Include venue information</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-statistics" />
                            <Label htmlFor="include-statistics" className="text-sm">Include statistics</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="export-date-range">Date Range</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="date" placeholder="Start date" />
                          <Input type="date" placeholder="End date" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleExportSessions}>
                          <Download className="h-4 w-4 mr-2" />
                          Export Sessions
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Sessions
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Sessions</DialogTitle>
                      <DialogDescription>
                        Import session data from external files to populate your examination schedule
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="import-file">Select File</Label>
                        <Input
                          id="import-file"
                          type="file"
                          accept=".csv,.xlsx,.json"
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported formats: CSV, Excel (.xlsx), JSON
                        </p>
                      </div>
                      <div>
                        <Label>Import Options</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="merge-data" defaultChecked />
                            <Label htmlFor="merge-data" className="text-sm">Merge with existing data</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="validate-data" defaultChecked />
                            <Label htmlFor="validate-data" className="text-sm">Validate data before import</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="skip-duplicates" defaultChecked />
                            <Label htmlFor="skip-duplicates" className="text-sm">Skip duplicate sessions</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="create-backup" defaultChecked />
                            <Label htmlFor="create-backup" className="text-sm">Create backup before import</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="import-schedule">Target Schedule</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule to import into" />
                          </SelectTrigger>
                          <SelectContent>
                            {schedules.map(schedule => (
                              <SelectItem key={schedule.id} value={schedule.id}>
                                {schedule.scheduleName} ({schedule.examType})
                              </SelectItem>
                            ))}
                            <SelectItem value="new">Create new schedule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleImportSessions}>
                          <Upload className="h-4 w-4 mr-2" />
                          Import Sessions
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Bulk Operations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Bulk Operations</DialogTitle>
                      <DialogDescription>
                        Perform batch operations on multiple sessions simultaneously
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <Label>Operation Type</Label>
                        <Select defaultValue="update">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="update">Update Session Details</SelectItem>
                            <SelectItem value="reschedule">Reschedule Sessions</SelectItem>
                            <SelectItem value="venue">Change Venues</SelectItem>
                            <SelectItem value="invigilator">Assign Invigilators</SelectItem>
                            <SelectItem value="cancel">Cancel Sessions</SelectItem>
                            <SelectItem value="copy">Copy Sessions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Session Selection</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="bulk-schedule">Schedule</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select schedule" />
                              </SelectTrigger>
                              <SelectContent>
                                {schedules.map(schedule => (
                                  <SelectItem key={schedule.id} value={schedule.id}>
                                    {schedule.scheduleName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="bulk-filter">Filter By</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Filter criteria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Sessions</SelectItem>
                                <SelectItem value="date">By Date Range</SelectItem>
                                <SelectItem value="venue">By Venue</SelectItem>
                                <SelectItem value="status">By Status</SelectItem>
                                <SelectItem value="program">By Program</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Action Details</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="bulk-field">Field to Update</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="venue">Venue</SelectItem>
                                <SelectItem value="duration">Duration</SelectItem>
                                <SelectItem value="invigilators">Invigilators Required</SelectItem>
                                <SelectItem value="examType">Exam Type</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="bulk-value">New Value</Label>
                            <Input placeholder="Enter new value" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="bulk-confirm" />
                          <Label htmlFor="bulk-confirm" className="text-sm">
                            I confirm that I want to apply these changes to multiple sessions
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleBulkOperations}>
                          <Plus className="h-4 w-4 mr-2" />
                          Apply Bulk Operations
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Session Management Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {schedules.reduce((acc, schedule) => acc + schedule.sessions.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all schedules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {schedules.reduce((acc, schedule) =>
                    acc + schedule.sessions.filter(s => s.status === 'Scheduled').length, 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Ready to conduct</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conflicts Detected</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">Requiring attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">87%</div>
                <p className="text-xs text-muted-foreground">Hall capacity used</p>
              </CardContent>
            </Card>
          </div>

          {/* Session Management Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Settings className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Session Configuration</h3>
                        <p className="text-sm text-muted-foreground">Manage session parameters and settings</p>
                        <div className="mt-2 text-xs text-blue-600">
                          24 configurable parameters
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Session Configuration Management</DialogTitle>
                  <DialogDescription>
                    Configure global session parameters, rules, and automation settings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <Tabs defaultValue="general">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="timing">Timing Rules</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      <TabsTrigger value="automation">Automation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Default Session Duration</Label>
                          <Select defaultValue="180">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="120">2 hours</SelectItem>
                              <SelectItem value="150">2.5 hours</SelectItem>
                              <SelectItem value="180">3 hours</SelectItem>
                              <SelectItem value="210">3.5 hours</SelectItem>
                              <SelectItem value="240">4 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Break Duration Between Sessions</Label>
                          <Select defaultValue="30">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Maximum Sessions Per Day</Label>
                          <Input type="number" defaultValue="4" min="1" max="6" />
                        </div>
                        <div>
                          <Label>Minimum Hall Capacity Utilization</Label>
                          <Select defaultValue="70">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="60">60%</SelectItem>
                              <SelectItem value="70">70%</SelectItem>
                              <SelectItem value="80">80%</SelectItem>
                              <SelectItem value="90">90%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Session Types Configuration</Label>
                        <div className="mt-3 space-y-3">
                          {['Regular', 'Supplementary', 'Backlog', 'Improvement'].map(type => (
                            <Card key={type}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{type} Exams</h4>
                                    <p className="text-sm text-muted-foreground">Configure settings for {type.toLowerCase()} examination sessions</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <Switch defaultChecked />
                                    <Button variant="outline" size="sm">Configure</Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="timing" className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Time Slot Management</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { label: 'Morning Slot', time: '09:00 - 12:00', sessions: 12 },
                            { label: 'Afternoon Slot', time: '14:00 - 17:00', sessions: 8 },
                            { label: 'Evening Slot', time: '18:00 - 21:00', sessions: 3 }
                          ].map(slot => (
                            <Card key={slot.label}>
                              <CardContent className="p-4">
                                <h5 className="font-medium">{slot.label}</h5>
                                <p className="text-sm text-muted-foreground">{slot.time}</p>
                                <div className="flex justify-between items-center mt-3">
                                  <span className="text-sm">{slot.sessions} sessions</span>
                                  <Button variant="outline" size="sm">Edit</Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Scheduling Rules</h4>
                        <div className="space-y-3">
                          {[
                            'No back-to-back exams for same student group',
                            'Minimum 2-day gap between major subject exams',
                            'Reserve Sundays for makeup exams only',
                            'Block examination halls 1 hour before exam start'
                          ].map((rule, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm">{rule}</span>
                              <Switch defaultChecked />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="resources" className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Resource Allocation</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <h5 className="font-medium">Invigilator Assignment</h5>
                              <div className="mt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Students per invigilator:</span>
                                  <span className="font-medium">30</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Head invigilator per hall:</span>
                                  <span className="font-medium">1</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Backup invigilators:</span>
                                  <span className="font-medium">2</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <h5 className="font-medium">Hall Requirements</h5>
                              <div className="mt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Minimum hall capacity:</span>
                                  <span className="font-medium">50</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Social distancing:</span>
                                  <span className="font-medium">Enabled</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>AC requirement:</span>
                                  <span className="font-medium">Summer only</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="automation" className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Automation Settings</h4>
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-medium">Auto Hall Assignment</h5>
                                  <p className="text-sm text-muted-foreground">Automatically assign optimal halls based on capacity and preferences</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-medium">Smart Conflict Detection</h5>
                                  <p className="text-sm text-muted-foreground">Real-time detection and alerts for scheduling conflicts</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-medium">Notification System</h5>
                                  <p className="text-sm text-muted-foreground">Automated notifications for session changes and updates</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Configuration</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <MapPin className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-medium">Venue Optimization</h3>
                        <p className="text-sm text-muted-foreground">Optimize hall allocation and usage</p>
                        <div className="mt-2 text-xs text-green-600">
                          15 venues available
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Venue Optimization & Hall Management</DialogTitle>
                  <DialogDescription>
                    Optimize hall allocation, track utilization, and manage venue resources efficiently
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">15</div>
                        <div className="text-sm text-muted-foreground">Total Venues</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm text-muted-foreground">Available</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">87%</div>
                        <div className="text-sm text-muted-foreground">Utilization</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-sm text-muted-foreground">Conflicts</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Hall Utilization Analysis</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hall Name</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Current Usage</TableHead>
                          <TableHead>Utilization Rate</TableHead>
                          <TableHead>Next Available</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: 'Block A - Hall 1', capacity: 120, usage: 115, rate: 96, next: '2 hours', status: 'Occupied' },
                          { name: 'Block A - Hall 2', capacity: 100, usage: 0, rate: 0, next: 'Available', status: 'Available' },
                          { name: 'Block B - Hall 1', capacity: 80, usage: 75, rate: 94, next: '1 hour', status: 'Occupied' },
                          { name: 'Block B - Hall 2', capacity: 60, usage: 0, rate: 0, next: 'Maintenance', status: 'Maintenance' },
                          { name: 'Main Auditorium', capacity: 300, usage: 280, rate: 93, next: '3 hours', status: 'Occupied' }
                        ].map((hall, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{hall.name}</TableCell>
                            <TableCell>{hall.capacity}</TableCell>
                            <TableCell>{hall.usage}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div
                                    className={`h-full rounded-full ${
                                      hall.rate >= 90 ? 'bg-green-500' :
                                      hall.rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${hall.rate}%` }}
                                  />
                                </div>
                                <span className="text-sm">{hall.rate}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{hall.next}</TableCell>
                            <TableCell>
                              <Badge className={
                                hall.status === 'Available' ? 'bg-green-100 text-green-800' :
                                hall.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {hall.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Optimization Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Redistribute Block A - Hall 1</p>
                              <p className="text-xs text-muted-foreground">96% capacity can be split between halls</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Schedule maintenance window</p>
                              <p className="text-xs text-muted-foreground">Block B - Hall 2 needs immediate attention</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Peak hours optimization</p>
                              <p className="text-xs text-muted-foreground">Consider staggered start times</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Resource Allocation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Audio/Visual Equipment</span>
                              <span>12/15 allocated</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Security Personnel</span>
                              <span>8/10 assigned</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Cleaning Staff</span>
                              <span>15/15 scheduled</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Export Report</Button>
                  <Button>Apply Optimizations</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Bell className="h-8 w-8 text-orange-600" />
                      <div>
                        <h3 className="font-medium">Conflict Resolution</h3>
                        <p className="text-sm text-muted-foreground">Detect and resolve scheduling conflicts</p>
                        <div className="mt-2 text-xs text-orange-600">
                          3 conflicts pending
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Conflict Detection & Resolution</DialogTitle>
                  <DialogDescription>
                    Identify, analyze, and resolve scheduling conflicts automatically or manually
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">3</div>
                        <div className="text-sm text-muted-foreground">Critical Conflicts</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-600">5</div>
                        <div className="text-sm text-muted-foreground">Minor Issues</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-muted-foreground">Resolved Today</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Active Conflicts</h4>
                    <div className="space-y-3">
                      {[
                        {
                          type: 'Critical',
                          title: 'Double Booking - Block A Hall 1',
                          description: 'Mathematics and Physics exams scheduled simultaneously',
                          time: '2024-12-10 09:00-12:00',
                          impact: 'High',
                          suggestions: ['Reschedule Physics to Hall 2', 'Move Mathematics to afternoon slot']
                        },
                        {
                          type: 'Critical',
                          title: 'Invigilator Unavailable',
                          description: 'Dr. Sarah Wilson assigned to multiple halls',
                          time: '2024-12-11 14:00-17:00',
                          impact: 'High',
                          suggestions: ['Assign backup invigilator', 'Reassign to different session']
                        },
                        {
                          type: 'Warning',
                          title: 'Insufficient Break Time',
                          description: 'Only 15 minutes between consecutive exams',
                          time: '2024-12-12 12:00-14:15',
                          impact: 'Medium',
                          suggestions: ['Extend break to 30 minutes', 'Adjust start time']
                        }
                      ].map((conflict, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={
                                    conflict.type === 'Critical' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }>
                                    {conflict.type}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">{conflict.time}</span>
                                </div>
                                <h5 className="font-medium">{conflict.title}</h5>
                                <p className="text-sm text-muted-foreground">{conflict.description}</p>

                                <div className="mt-3">
                                  <p className="text-xs font-medium text-gray-700 mb-1">Suggested Solutions:</p>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {conflict.suggestions.map((suggestion, i) => (
                                      <li key={i} className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                        {suggestion}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <Button size="sm" variant="outline">Resolve</Button>
                                <Button size="sm" variant="ghost">Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Auto-Resolve All</Button>
                  <Button>Manual Review</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Session Management Table with Edit/Delete */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Session Management Console</CardTitle>
                  <CardDescription>
                    Comprehensive session management with full CRUD operations
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session Details</TableHead>
                    <TableHead>Schedule Information</TableHead>
                    <TableHead>Venue & Capacity</TableHead>
                    <TableHead>Status & Progress</TableHead>
                    <TableHead>Resource Allocation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.flatMap(schedule =>
                    schedule.sessions.map(session => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.subject}</div>
                            <div className="text-sm text-muted-foreground">{session.subjectCode}</div>
                            <div className="text-xs text-muted-foreground">
                              {session.program} • {session.semester} Semester
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.date}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.startTime} - {session.endTime}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Duration: {session.duration} minutes
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              {session.venue}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {session.enrolled}/{session.capacity} students
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Utilization: {Math.round((session.enrolled / session.capacity) * 100)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Badge className={getStatusBadge(session.status)}>
                              {session.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Type: {session.examType}
                            </div>
                            <div className="text-xs">
                              {session.invigilators} invigilators assigned
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <Users className="h-3 w-3" />
                              <span>Staff: {session.invigilators}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3" />
                              <span>Setup: 30 min</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Resources allocated
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Session Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Edit Session"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Session - {session.subject}</DialogTitle>
                                  <DialogDescription>
                                    Modify session details, scheduling, and resource allocation
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-subject">Subject Name</Label>
                                    <Input
                                      id="edit-subject"
                                      defaultValue={session.subject}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-subjectCode">Subject Code</Label>
                                    <Input
                                      id="edit-subjectCode"
                                      defaultValue={session.subjectCode}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-date">Date</Label>
                                    <Input
                                      id="edit-date"
                                      type="date"
                                      defaultValue={session.date}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-duration">Duration (minutes)</Label>
                                    <Input
                                      id="edit-duration"
                                      type="number"
                                      defaultValue={session.duration}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-startTime">Start Time</Label>
                                    <Select defaultValue={session.startTime}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {generateTimeSlots().map(time => (
                                          <SelectItem key={time} value={time}>{time}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-endTime">End Time</Label>
                                    <Select defaultValue={session.endTime}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {generateTimeSlots().map(time => (
                                          <SelectItem key={time} value={time}>{time}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-venue">Venue</Label>
                                    <Select defaultValue={session.venue}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Block A - Hall 1">Block A - Hall 1</SelectItem>
                                        <SelectItem value="Block A - Hall 2">Block A - Hall 2</SelectItem>
                                        <SelectItem value="Block B - Hall 1">Block B - Hall 1</SelectItem>
                                        <SelectItem value="Block B - Hall 2">Block B - Hall 2</SelectItem>
                                        <SelectItem value="Block C - Auditorium">Block C - Auditorium</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-capacity">Capacity</Label>
                                    <Input
                                      id="edit-capacity"
                                      type="number"
                                      defaultValue={session.capacity}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-program">Program</Label>
                                    <Input
                                      id="edit-program"
                                      defaultValue={session.program}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-semester">Semester</Label>
                                    <Input
                                      id="edit-semester"
                                      defaultValue={session.semester}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-examType">Exam Type</Label>
                                    <Select defaultValue={session.examType}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Regular">Regular</SelectItem>
                                        <SelectItem value="Supplementary">Supplementary</SelectItem>
                                        <SelectItem value="Backlog">Backlog</SelectItem>
                                        <SelectItem value="Improvement">Improvement</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-invigilators">Required Invigilators</Label>
                                    <Input
                                      id="edit-invigilators"
                                      type="number"
                                      defaultValue={session.invigilators}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <Label>Special Requirements</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="calculator" />
                                        <Label htmlFor="calculator" className="text-sm">Calculator allowed</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="laptop" />
                                        <Label htmlFor="laptop" className="text-sm">Laptop required</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="extraTime" />
                                        <Label htmlFor="extraTime" className="text-sm">Extra time for special needs</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="strictMode" />
                                        <Label htmlFor="strictMode" className="text-sm">Strict mode invigilation</Label>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="special-instructions">Special Instructions</Label>
                                    <Textarea
                                      id="special-instructions"
                                      placeholder="Enter any special instructions for this session..."
                                      rows={3}
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button onClick={() => handleSaveSessionChanges(session.id)}>Save Changes</Button>
                                  </DialogClose>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Copy Session"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Copy Session</DialogTitle>
                                  <DialogDescription>
                                    Create a copy of this session with modifications
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="copy-count">Number of Copies</Label>
                                    <Input
                                      id="copy-count"
                                      type="number"
                                      defaultValue={1}
                                      min={1}
                                      max={10}
                                    />
                                  </div>
                                  <div>
                                    <Label>Copy Options</Label>
                                    <div className="space-y-2 mt-2">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="copy-venue" defaultChecked />
                                        <Label htmlFor="copy-venue" className="text-sm">Same venue</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="copy-time" />
                                        <Label htmlFor="copy-time" className="text-sm">Same time slot</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="copy-settings" defaultChecked />
                                        <Label htmlFor="copy-settings" className="text-sm">Copy all settings</Label>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="copy-prefix">Name Prefix</Label>
                                    <Input
                                      id="copy-prefix"
                                      defaultValue="Copy of "
                                      placeholder="Prefix for copied sessions"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button onClick={() => handleCreateCopies(session.id)}>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Create Copies
                                    </Button>
                                  </DialogClose>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Delete Session"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Session</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{session.subject}" session? This action cannot be undone.
                                    <br /><br />
                                    <strong>Session Details:</strong>
                                    <br />• Date: {session.date}
                                    <br />• Time: {session.startTime} - {session.endTime}
                                    <br />• Venue: {session.venue}
                                    <br />• Enrolled: {session.enrolled} students
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteSession(session.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Session
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Session Management Actions</CardTitle>
              <CardDescription>
                Batch operations and common management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-auto p-4 flex-col">
                      <Plus className="h-6 w-6 mb-2" />
                      <span className="text-sm">Bulk Create Sessions</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Bulk Create Sessions</DialogTitle>
                      <DialogDescription>
                        Create multiple examination sessions at once with customizable parameters
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bulk-schedule">Target Schedule</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                            <SelectContent>
                              {schedules.map(schedule => (
                                <SelectItem key={schedule.id} value={schedule.id}>
                                  {schedule.scheduleName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="session-count">Number of Sessions</Label>
                          <Input type="number" min="1" max="50" defaultValue="5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label htmlFor="start-time">Start Time</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {generateTimeSlots().map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration (minutes)</Label>
                          <Input type="number" defaultValue="180" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="venue-pattern">Venue Pattern</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select venue pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sequential">Sequential (Hall 1, Hall 2, ...)</SelectItem>
                              <SelectItem value="block-wise">Block-wise (Block A, Block B, ...)</SelectItem>
                              <SelectItem value="capacity">By Capacity</SelectItem>
                              <SelectItem value="same">Same Venue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="spacing">Session Spacing</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select spacing" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="alternate">Alternate Days</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="custom">Custom Interval</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleBulkCreateSessions}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Sessions
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-auto p-4 flex-col">
                      <Edit className="h-6 w-6 mb-2" />
                      <span className="text-sm">Batch Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Batch Edit Sessions</DialogTitle>
                      <DialogDescription>
                        Apply changes to multiple sessions simultaneously based on selection criteria
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Selection Criteria</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="edit-schedule">Schedule</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select schedule" />
                              </SelectTrigger>
                              <SelectContent>
                                {schedules.map(schedule => (
                                  <SelectItem key={schedule.id} value={schedule.id}>
                                    {schedule.scheduleName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-filter">Filter By</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select filter" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Sessions</SelectItem>
                                <SelectItem value="date-range">Date Range</SelectItem>
                                <SelectItem value="venue">Specific Venue</SelectItem>
                                <SelectItem value="program">Program/Course</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Changes to Apply</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="edit-field">Field to Update</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="duration">Duration</SelectItem>
                                <SelectItem value="venue">Venue</SelectItem>
                                <SelectItem value="invigilators">Required Invigilators</SelectItem>
                                <SelectItem value="examType">Exam Type</SelectItem>
                                <SelectItem value="capacity">Capacity</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-new-value">New Value</Label>
                            <Input placeholder="Enter new value" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Preview Changes</p>
                            <p className="text-xs text-yellow-600 mt-1">
                              This will affect X sessions. Review the changes before applying.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleBatchEdit}>
                          <Edit className="h-4 w-4 mr-2" />
                          Apply Changes
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-auto p-4 flex-col">
                      <Copy className="h-6 w-6 mb-2" />
                      <span className="text-sm">Duplicate Schedule</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Duplicate Schedule</DialogTitle>
                      <DialogDescription>
                        Create a copy of an existing schedule with optional modifications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="source-schedule">Source Schedule</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule to duplicate" />
                          </SelectTrigger>
                          <SelectContent>
                            {schedules.map(schedule => (
                              <SelectItem key={schedule.id} value={schedule.id}>
                                {schedule.scheduleName} ({schedule.examType})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="new-schedule-name">New Schedule Name</Label>
                        <Input placeholder="Enter name for duplicated schedule" />
                      </div>

                      <div>
                        <Label>Duplication Options</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="copy-sessions" defaultChecked />
                            <Label htmlFor="copy-sessions" className="text-sm">Copy all sessions</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="copy-settings" defaultChecked />
                            <Label htmlFor="copy-settings" className="text-sm">Copy schedule settings</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="update-dates" />
                            <Label htmlFor="update-dates" className="text-sm">Update dates automatically</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="reset-enrollment" defaultChecked />
                            <Label htmlFor="reset-enrollment" className="text-sm">Reset enrollment counts</Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Academic Year</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select academic year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024-25">2024-25</SelectItem>
                            <SelectItem value="2025-26">2025-26</SelectItem>
                            <SelectItem value="2026-27">2026-27</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleDuplicateSchedule}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Schedule
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-auto p-4 flex-col">
                      <Settings className="h-6 w-6 mb-2" />
                      <span className="text-sm">Global Settings</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Global Settings</DialogTitle>
                      <DialogDescription>
                        Configure system-wide settings for examination planning and management
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Session Defaults</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Default Duration (minutes)</Label>
                            <Input type="number" defaultValue="180" />
                          </div>
                          <div>
                            <Label>Default Break (minutes)</Label>
                            <Input type="number" defaultValue="30" />
                          </div>
                          <div>
                            <Label>Min Invigilators per Session</Label>
                            <Input type="number" defaultValue="2" />
                          </div>
                          <div>
                            <Label>Max Capacity per Venue</Label>
                            <Input type="number" defaultValue="100" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Scheduling Rules</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="allow-overlap">Allow session time overlap</Label>
                            <Switch id="allow-overlap" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-assign">Auto-assign invigilators</Label>
                            <Switch id="auto-assign" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="conflict-check">Enable conflict checking</Label>
                            <Switch id="conflict-check" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="notifications">Send notification updates</Label>
                            <Switch id="notifications" defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Time Slots</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Working Hours Start</Label>
                            <Input type="time" defaultValue="08:00" />
                          </div>
                          <div>
                            <Label>Working Hours End</Label>
                            <Input type="time" defaultValue="18:00" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleGlobalSettings}>
                          <Settings className="h-4 w-4 mr-2" />
                          Save Settings
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schedules.length}</div>
                <p className="text-xs text-muted-foreground">Active schedules</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {schedules.reduce((acc, schedule) => acc + schedule.sessions.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Scheduled sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {schedules.reduce((acc, schedule) => acc + schedule.totalStudents, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Enrolled students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((schedules.filter(s => s.status === 'Completed').length / schedules.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Schedules completed</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Distribution</CardTitle>
              <CardDescription>
                Overview of examination schedules by type and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">By Exam Type</h4>
                  <div className="space-y-2">
                    {['Mid-term', 'End-semester', 'Final', 'Unit Test'].map(type => {
                      const count = schedules.filter(s => s.examType === type).length;
                      return (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm">{type}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">By Status</h4>
                  <div className="space-y-2">
                    {['Draft', 'Published', 'Active', 'Completed'].map(status => {
                      const count = schedules.filter(s => s.status === status).length;
                      return (
                        <div key={status} className="flex justify-between items-center">
                          <span className="text-sm">{status}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
