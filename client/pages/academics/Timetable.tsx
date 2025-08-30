import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/forms/FormField';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { Label } from '@/components/ui/label';
import { 
  Calendar, Clock, Plus, Download, Upload, MapPin, Users, X, Save, RefreshCw, 
  Edit3, Trash2, Eye, Filter, Search, Bell, BookOpen, UserCheck, 
  AlertTriangle, CheckCircle, Settings, ChevronDown, ChevronLeft, ChevronRight,
  FileText, Printer, Share2, Copy, MoreHorizontal, Sparkles, Zap, Target,
  Brain, Shuffle, BarChart3, TrendingUp, Activity, Smartphone, Monitor, 
  ChevronRight as ChevronRightIcon, Loader2, Wand2, GraduationCap, School,
  Calendar as CalendarIcon, ClockIcon, StarIcon, UserIcon, GroupIcon
} from 'lucide-react';

// User role simulation - in real app this would come from auth context
const getCurrentUserRole = () => {
  // For demo purposes, you can change this to test different roles
  return 'admin'; // 'admin', 'faculty', 'student', 'parent'
};

const getCurrentUser = () => {
  const role = getCurrentUserRole();
  const users = {
    admin: { id: 'admin1', name: 'Dr. Pranesh', role: 'admin', department: 'Administration', institute: 'Tech University' },
    faculty: { id: 'faculty1', name: 'Dr. Saranya', role: 'faculty', department: 'Computer Science', subjects: ['Data Structures', 'Algorithms', 'Database Systems'], maxLoad: 18 },
    student: { id: 'student1', name: 'Anish', role: 'student', program: 'B.Tech CSE', semester: '5', section: 'A', rollNumber: 'CSE2021001' },
    parent: { id: 'parent1', name: 'Arun Kumar', role: 'parent', children: [{ id: 'student1', name: 'Naveen Kumar', program: 'B.Tech CSE', semester: '5', rollNumber: 'CSE2021001' }] }
  };
  return users[role as keyof typeof users];
};

// Academic configuration
const academicYears = ['2024-25', '2023-24', '2022-23'];
const institutes = ['Tech University', 'Engineering College', 'Science Institute'];
const programs = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'M.Tech CSE', 'BCA', 'MCA'];
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
const timeSlots = [
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM', 
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM'
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Mock data for comprehensive timetable
const subjects = [
  { id: 'sub1', name: 'Data Structures', code: 'CS301', credits: 4, type: 'core' },
  { id: 'sub2', name: 'Database Systems', code: 'CS302', credits: 4, type: 'core' },
  { id: 'sub3', name: 'Operating Systems', code: 'CS303', credits: 4, type: 'core' },
  { id: 'sub4', name: 'Computer Networks', code: 'CS304', credits: 4, type: 'core' },
  { id: 'sub5', name: 'Machine Learning', code: 'CS401', credits: 3, type: 'elective' },
  { id: 'sub6', name: 'Web Development', code: 'CS402', credits: 3, type: 'elective' },
  { id: 'sub7', name: 'Mobile App Development', code: 'CS403', credits: 3, type: 'elective' }
];

const faculty = [
  { id: 'fac1', name: 'Dr. Saranya', department: 'Computer Science', specialization: 'Algorithms', maxLoad: 18, currentLoad: 12, subjects: ['sub1', 'sub2'] },
  { id: 'fac2', name: 'Dr. Meena', department: 'Computer Science', specialization: 'Systems', maxLoad: 18, currentLoad: 15, subjects: ['sub3', 'sub4'] },
  { id: 'fac3', name: 'Prof. Anbu', department: 'Computer Science', specialization: 'AI/ML', maxLoad: 16, currentLoad: 10, subjects: ['sub5', 'sub6'] },
  { id: 'fac4', name: 'Dr. Anif', department: 'Computer Science', specialization: 'Web Technologies', maxLoad: 18, currentLoad: 14, subjects: ['sub6', 'sub7'] },
  { id: 'fac5', name: 'Dr. Ankitha', department: 'Computer Science', specialization: 'Mobile Development', maxLoad: 16, currentLoad: 8, subjects: ['sub7'] }
];

const rooms = [
  { id: 'room1', name: 'CS-101', type: 'classroom', capacity: 60 },
  { id: 'room2', name: 'CS-102', type: 'classroom', capacity: 80 },
  { id: 'room3', name: 'CS-Lab1', type: 'lab', capacity: 40 },
  { id: 'room4', name: 'CS-Lab2', type: 'lab', capacity: 40 },
  { id: 'room5', name: 'Auditorium', type: 'auditorium', capacity: 200 }
];

interface TimetableEntry {
  id: string;
  subject: string;
  subjectCode: string;
  faculty: string[];
  room: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar' | 'project' | 'break' | 'free' | 'flexible';
  isFlexible: boolean;
  credits: number;
}

interface FlexibleSlot {
  id: string;
  subject: string;
  facultyOptions: string[];
  selectedFaculty?: string;
  maxStudents: number;
  currentStudents: number;
}

const mockTimetableData = {
  'CSE-5A': {
    Monday: [
      { id: 't1', subject: 'Data Structures', subjectCode: 'CS301', faculty: ['Dr. Saranya'], room: 'CS-101', type: 'lecture', isFlexible: false, credits: 4 },
      { id: 't2', subject: 'Operating Systems', subjectCode: 'CS303', faculty: ['Dr. Meena'], room: 'CS-102', type: 'lecture', isFlexible: false, credits: 4 },
      { id: 't3', subject: 'Database Systems', subjectCode: 'CS302', faculty: ['Dr. Anif'], room: 'CS-103', type: 'lecture', isFlexible: false, credits: 4 },
      { id: 't4', subject: 'Computer Networks', subjectCode: 'CS304', faculty: ['Dr.Ankitha'], room: 'CS-104', type: 'lecture', isFlexible: false, credits: 4 },
      { id: 'break1', subject: 'Lunch Break', subjectCode: '', faculty: [], room: '', type: 'break', isFlexible: false, credits: 0 },
      { id: 't5', subject: 'Machine Learning', subjectCode: 'CS401', faculty: ['Prof. Anbu', 'Dr. Alex Chen'], room: 'CS-105', type: 'lecture', isFlexible: true, credits: 3 },
      { id: 't6', subject: 'Database Lab', subjectCode: 'CS302L', faculty: ['Dr. Saran'], room: 'CS-Lab1', type: 'lab', isFlexible: false, credits: 2 },
      { id: 't7', subject: 'Database Lab', subjectCode: 'CS302L', faculty: ['Dr. Saran'], room: 'CS-Lab1', type: 'lab', isFlexible: false, credits: 2 },
      { id: 't8', subject: 'Project Work', subjectCode: 'CS499', faculty: ['Dr. Saran'], room: 'CS-106', type: 'project', isFlexible: false, credits: 2 }
    ]
  }
};

const flexibleSlots: FlexibleSlot[] = [
  { id: 'flex1', subject: 'Machine Learning', facultyOptions: ['Prof. Lisa Davis', 'Dr. Alex Chen'], maxStudents: 30, currentStudents: 25 },
  { id: 'flex2', subject: 'Web Development', facultyOptions: ['Dr. Alex Chen', 'Dr. Emily White'], maxStudents: 25, currentStudents: 20 }
];

export default function Timetable() {
  // View-based navigation state
  const [currentView, setCurrentView] = useState<
    'list' | 'auto-generate' | 'manual-create' | 'flexible-assignment' | 'faculty-workload' | 'edit-schedule'
  >('list');
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [editingContext, setEditingContext] = useState<{day: string, timeSlot: string, slotIndex: number} | null>(null);

  const [currentUser] = useState(getCurrentUser());
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [selectedInstitute, setSelectedInstitute] = useState('Tech University');
  const [selectedProgram, setSelectedProgram] = useState('B.Tech CSE');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedSection, setSelectedSection] = useState('A');
  const [timetableData, setTimetableData] = useState(mockTimetableData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<'manual' | 'automatic'>('manual');
  const [facultyWorkload, setFacultyWorkload] = useState(faculty);
  const [isFacultyNotificationOpen, setIsFacultyNotificationOpen] = useState(false);
  const [isStudentPreferenceOpen, setIsStudentPreferenceOpen] = useState(false);
  const [selectedFlexibleSlot, setSelectedFlexibleSlot] = useState<FlexibleSlot | null>(null);
  const [studentPreferences, setStudentPreferences] = useState<Record<string, string>>({});
  const [notifications, setNotifications] = useState<any[]>([]);

  // Navigation helper functions
  const goToView = (view: typeof currentView) => {
    setCurrentView(view);
  };

  const goBack = () => {
    setCurrentView('list');
  };

  const timetableFormHandler = useFormHandler(
    ['subject', 'faculty', 'room', 'day', 'timeSlot', 'type'],
    {
      subject: '',
      faculty: '',
      room: '',
      day: 'Monday',
      timeSlot: '8:00 AM - 9:00 AM',
      type: 'lecture'
    }
  );

  const getFormData = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].value;
      return acc;
    }, {} as Record<string, any>);
  };

  const handleInputChange = (handler: any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handler.updateField(e.target.name, e.target.value);
  };

  const handleSubmit = (handler: any, onSubmit: (data: any) => Promise<void>) => (e: React.FormEvent) => {
    e.preventDefault();
    handler.submitForm(onSubmit);
  };

  // Professional color scheme
  const getSubjectColor = (subject: string, type: string) => {
    if (type === 'break') return 'bg-gradient-to-r from-amber-100 to-orange-200 text-amber-800 border-amber-300';
    
    const colorMap: Record<string, string> = {
      'Data Structures': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-blue-200',
      'Database Systems': 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-400 shadow-emerald-200',
      'Operating Systems': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400 shadow-purple-200',
      'Computer Networks': 'bg-gradient-to-r from-teal-500 to-teal-600 text-white border-teal-400 shadow-teal-200',
      'Machine Learning': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-400 shadow-indigo-200',
      'Web Development': 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-rose-400 shadow-rose-200',
      'Database Lab': 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-green-200',
      'Project Work': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-orange-200'
    };
    
    return colorMap[subject] || 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-slate-400 shadow-slate-200';
  };

  const handleAutomaticGeneration = async () => {
    setIsGenerating(true);
    try {
      // Simulate automatic timetable generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add notification for faculty
      const newNotification = {
        id: Date.now(),
        type: 'timetable_generated',
        message: 'New timetable has been generated for CSE-5A',
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      
    } catch (error) {
      console.error('Failed to generate timetable:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSlotAssignment = async (data: any) => {
    // Handle manual slot assignment
    console.log('Manual assignment:', data);
  };

  const handleEditScheduleEntry = (entry: any, day: string, timeSlot: string, slotIndex: number) => {
    setEditingEntry(entry);
    setEditingContext({ day, timeSlot, slotIndex });
    setCurrentView('edit-schedule');
  };

  const handleSaveScheduleEdit = async (updatedEntry: any) => {
    if (!editingContext) return;

    // Update the timetable data
    const programKey = `${selectedProgram.replace(' ', '')}-${selectedSemester}${selectedSection}`;
    const updatedData = { ...timetableData };

    if (!updatedData[programKey]) {
      updatedData[programKey] = {};
    }

    if (!updatedData[programKey][editingContext.day]) {
      updatedData[programKey][editingContext.day] = [];
    }

    updatedData[programKey][editingContext.day][editingContext.slotIndex] = updatedEntry;
    setTimetableData(updatedData);

    // Go back to main view
    setCurrentView('list');
    setEditingEntry(null);
    setEditingContext(null);

    console.log('Schedule updated:', updatedEntry);
  };

  const checkFacultyOverload = (facultyId: string, additionalHours: number) => {
    const facultyMember = facultyWorkload.find(f => f.id === facultyId);
    if (facultyMember) {
      return facultyMember.currentLoad + additionalHours > facultyMember.maxLoad;
    }
    return false;
  };

  const handleFlexibleSlotSelection = (slotId: string, facultyId: string) => {
    setStudentPreferences(prev => ({
      ...prev,
      [slotId]: facultyId
    }));
  };

  // Auto Generate Page
  const renderAutoGeneratePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRightIcon className="h-4 w-4 mr-2 rotate-180" />
            Back to Timetable
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automatic Timetable Generation</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered timetable generation with conflict resolution and optimization
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Generation Configuration
          </CardTitle>
          <CardDescription>
            Configure parameters for automatic timetable generation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Academic Year</Label>
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Program</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(program => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(sem => (
                    <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C'].map(section => (
                    <SelectItem key={section} value={section}>Section {section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Generation Options</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Optimize for faculty workload</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Minimize room conflicts</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Balanced daily schedule</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Include break times</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              Cancel
            </Button>
            <Button
              onClick={handleAutomaticGeneration}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Timetable
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Edit Schedule Entry Page
  const renderEditSchedulePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRightIcon className="h-4 w-4 mr-2 rotate-180" />
            Back to Timetable
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Schedule Entry</h1>
            <p className="text-muted-foreground mt-2">
              Modify schedule details for {editingContext?.day} - {editingContext?.timeSlot}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Schedule Details */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Schedule Information
            </CardTitle>
            <CardDescription>
              Current schedule entry details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {editingContext && (
              <>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-blue-800">Day</p>
                      <p className="text-blue-900">{editingContext.day}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Time Slot</p>
                      <p className="text-blue-900">{editingContext.timeSlot}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Program</p>
                      <p className="text-blue-900">{selectedProgram}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Section</p>
                      <p className="text-blue-900">Semester {selectedSemester} - Section {selectedSection}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-subject">Subject</Label>
                    <Select
                      value={editingEntry?.subject || ''}
                      onValueChange={(value) => {
                        const subject = subjects.find(s => s.name === value);
                        setEditingEntry({
                          ...editingEntry,
                          subject: value,
                          subjectCode: subject?.code || ''
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.name}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-faculty">Faculty</Label>
                    <Select
                      value={editingEntry?.faculty?.[0] || ''}
                      onValueChange={(value) =>
                        setEditingEntry({ ...editingEntry, faculty: [value] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculty.map((fac) => (
                          <SelectItem key={fac.id} value={fac.name}>
                            {fac.name} - {fac.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-room">Room</Label>
                    <Select
                      value={editingEntry?.room || ''}
                      onValueChange={(value) =>
                        setEditingEntry({ ...editingEntry, room: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.name}>
                            {room.name} ({room.type}) - Capacity: {room.capacity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-type">Class Type</Label>
                    <Select
                      value={editingEntry?.type || ''}
                      onValueChange={(value) =>
                        setEditingEntry({ ...editingEntry, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-credits">Credits</Label>
                    <Input
                      id="edit-credits"
                      type="number"
                      value={editingEntry?.credits || ''}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, credits: parseInt(e.target.value) || 0 })
                      }
                      placeholder="3"
                      min="1"
                      max="6"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-flexible"
                      checked={editingEntry?.isFlexible || false}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, isFlexible: e.target.checked })
                      }
                    />
                    <Label htmlFor="edit-flexible">Flexible slot (Multiple faculty options)</Label>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Panel - Additional Options */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-6 w-6 text-purple-600" />
              Advanced Options
            </CardTitle>
            <CardDescription>
              Additional configuration and conflict checking
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Conflict Detection */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Conflict Check
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Faculty Availability:</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Room Availability:</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Faculty Workload:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    12/18 hours
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" className="text-sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" className="text-sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="text-sm">
                  <Bell className="h-4 w-4 mr-1" />
                  Notify
                </Button>
              </div>
            </div>

            {/* Schedule Analytics */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-3">Schedule Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Daily Load:</span>
                  <span className="font-medium">6/8 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Weekly Load:</span>
                  <span className="font-medium">24/40 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Room Utilization:</span>
                  <span className="font-medium">85%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Changes
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Save as draft functionality
                  console.log('Saved as draft');
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSaveScheduleEdit(editingEntry)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Manual Create Page
  const renderManualCreatePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRightIcon className="h-4 w-4 mr-2 rotate-180" />
            Back to Timetable
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manual Timetable Creation</h1>
            <p className="text-muted-foreground mt-2">
              Create custom timetable entries with specific faculty and room assignments
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="h-6 w-6 text-green-600" />
            Manual Assignment
          </CardTitle>
          <CardDescription>
            Manually assign subjects, faculty, and rooms to specific time slots
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(timetableFormHandler, handleManualSlotAssignment)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Subject"
                name="subject"
                type="select"
                value={getFormData(timetableFormHandler).subject}
                onChange={handleInputChange(timetableFormHandler)}
                options={subjects.map(s => ({ label: s.name, value: s.id }))}
                required
              />
              <FormField
                label="Faculty"
                name="faculty"
                type="select"
                value={getFormData(timetableFormHandler).faculty}
                onChange={handleInputChange(timetableFormHandler)}
                options={faculty.map(f => ({ label: f.name, value: f.id }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Room"
                name="room"
                type="select"
                value={getFormData(timetableFormHandler).room}
                onChange={handleInputChange(timetableFormHandler)}
                options={rooms.map(r => ({ label: r.name, value: r.id }))}
                required
              />
              <FormField
                label="Class Type"
                name="type"
                type="select"
                value={getFormData(timetableFormHandler).type}
                onChange={handleInputChange(timetableFormHandler)}
                options={[
                  { label: 'Lecture', value: 'lecture' },
                  { label: 'Lab', value: 'lab' },
                  { label: 'Tutorial', value: 'tutorial' },
                  { label: 'Seminar', value: 'seminar' }
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Day"
                name="day"
                type="select"
                value={getFormData(timetableFormHandler).day}
                onChange={handleInputChange(timetableFormHandler)}
                options={days.map(d => ({ label: d, value: d }))}
                required
              />
              <FormField
                label="Time Slot"
                name="timeSlot"
                type="select"
                value={getFormData(timetableFormHandler).timeSlot}
                onChange={handleInputChange(timetableFormHandler)}
                options={timeSlots.map(t => ({ label: t, value: t }))}
                required
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600">
                <Plus className="h-4 w-4 mr-2" />
                Add to Timetable
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  // Flexible Assignment Page
  const renderFlexibleAssignmentPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRightIcon className="h-4 w-4 mr-2 rotate-180" />
            Back to Timetable
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Flexible Slot Management</h1>
            <p className="text-muted-foreground mt-2">
              Configure multi-faculty slots for elective courses and student preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shuffle className="h-6 w-6 text-purple-600" />
              Flexible Slots Configuration
            </CardTitle>
            <CardDescription>
              Manage multi-faculty slots for elective courses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {flexibleSlots.map((slot) => (
              <div key={slot.id} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">{slot.subject}</h4>
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    {slot.currentStudents}/{slot.maxStudents}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Faculty Options:</p>
                  {slot.facultyOptions.map((faculty, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium">{faculty}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600" />
              Add New Flexible Slot
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.filter(s => s.type === 'elective').map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Max Students</Label>
              <Input type="number" placeholder="30" />
            </div>

            <div>
              <Label>Faculty Options</Label>
              <div className="space-y-2">
                {faculty.map(f => (
                  <div key={f.id} className="flex items-center space-x-2">
                    <input type="checkbox" id={f.id} />
                    <Label htmlFor={f.id} className="text-sm">{f.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
              Create Flexible Slot
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Faculty Workload Page
  const renderFacultyWorkloadPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRightIcon className="h-4 w-4 mr-2 rotate-180" />
            Back to Timetable
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Faculty Workload Management</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and optimize faculty teaching loads and availability
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium">Average Load</p>
                <p className="text-3xl font-bold text-blue-800">87%</p>
                <p className="text-blue-600 text-sm">across all faculty</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium">Optimal Range</p>
                <p className="text-3xl font-bold text-green-800">12</p>
                <p className="text-green-600 text-sm">faculty members</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 font-medium">Overloaded</p>
                <p className="text-3xl font-bold text-red-800">3</p>
                <p className="text-red-600 text-sm">need attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            Faculty Workload Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {facultyWorkload.map((member) => {
            const utilizationPercent = (member.currentLoad / member.maxLoad) * 100;
            const isOverloaded = utilizationPercent > 90;
            const isUnderUtilized = utilizationPercent < 50;

            return (
              <div key={member.id} className={`p-4 rounded-xl border-2 ${
                isOverloaded ? 'bg-red-50 border-red-200' :
                isUnderUtilized ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{member.name}</h4>
                    <p className="text-sm text-slate-600">{member.specialization}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {member.currentLoad}/{member.maxLoad}
                    </div>
                    <div className="text-sm text-slate-600">hrs/week</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isOverloaded ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      isUnderUtilized ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{utilizationPercent.toFixed(1)}% utilized</span>
                  <div className="flex gap-2">
                    <Badge variant={isOverloaded ? 'destructive' : isUnderUtilized ? 'secondary' : 'default'}>
                      {isOverloaded ? 'Overloaded' : isUnderUtilized ? 'Under-utilized' : 'Optimal'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Adjust
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminInterface = () => (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-3xl p-8 shadow-xl border border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">
                    Timetable Generation System
                  </h1>
                  <p className="text-slate-600 text-lg mt-1">
                    Advanced scheduling with AI-powered optimization
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => goToView('faculty-workload')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Faculty Workload
              </Button>

              <Button
                onClick={() => goToView('flexible-assignment')}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
              >
                <Shuffle className="h-5 w-5 mr-2" />
                Flexible Slots
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl shadow-lg border-slate-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Automatic Generation
            </CardTitle>
            <CardDescription>
              AI-powered timetable generation with conflict resolution
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map(program => (
                      <SelectItem key={program} value={program}>{program}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => goToView('auto-generate')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl py-3"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Auto Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-slate-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-6 w-6 text-green-600" />
              Manual Assignment
            </CardTitle>
            <CardDescription>
              Customize slots with specific faculty and room assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map(program => (
                      <SelectItem key={program} value={program}>{program}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map(sem => (
                      <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => goToView('manual-create')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Manual Create
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFacultyInterface = () => (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 rounded-3xl p-8 shadow-xl border border-emerald-200">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg">
                  <UserIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    Faculty Dashboard
                  </h1>
                  <p className="text-slate-600 text-lg mt-1">
                    My teaching schedule and workload management
                  </p>
                </div>
              </div>
            </div>
            
            <Dialog open={isFacultyNotificationOpen} onOpenChange={setIsFacultyNotificationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 relative">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Faculty Notifications
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 rounded-xl border-2 ${
                        notification.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{notification.message}</p>
                            <p className="text-sm text-slate-600 mt-1">
                              {notification.timestamp.toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Faculty Workload Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-lg border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 font-medium">Teaching Load</p>
                <p className="text-3xl font-bold text-emerald-800">12/18</p>
                <p className="text-sm text-emerald-600">hours per week</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <ClockIcon className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium">Subjects</p>
                <p className="text-3xl font-bold text-blue-800">3</p>
                <p className="text-sm text-blue-600">active courses</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium">Classes</p>
                <p className="text-3xl font-bold text-purple-800">2</p>
                <p className="text-sm text-purple-600">sections assigned</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <GroupIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentInterface = () => (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 rounded-3xl p-8 shadow-xl border border-purple-200">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white shadow-lg">
                  <School className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                    My Class Schedule
                  </h1>
                  <p className="text-slate-600 text-lg mt-1">
                    {currentUser.program} - Semester {currentUser.semester}
                  </p>
                </div>
              </div>
            </div>
            
            <Dialog open={isStudentPreferenceOpen} onOpenChange={setIsStudentPreferenceOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3">
                  <StarIcon className="h-5 w-5 mr-2" />
                  Faculty Preferences
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <StarIcon className="h-6 w-6" />
                    Choose Preferred Faculty
                  </DialogTitle>
                  <DialogDescription>
                    Select your preferred faculty for flexible course slots
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {flexibleSlots.map((slot) => (
                    <div key={slot.id} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                      <h4 className="font-semibold text-lg mb-3">{slot.subject}</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {slot.facultyOptions.map((faculty, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-transparent hover:border-purple-300 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`slot-${slot.id}`}
                                value={faculty}
                                checked={studentPreferences[slot.id] === faculty}
                                onChange={() => handleFlexibleSlotSelection(slot.id, faculty)}
                                className="text-purple-600 focus:ring-purple-500"
                              />
                              <span className="font-medium">{faculty}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {Math.floor(Math.random() * 10) + 15} available slots
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsStudentPreferenceOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                    Save Preferences
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );

  const renderParentInterface = () => (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 rounded-3xl p-8 shadow-xl border border-orange-200">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
                    Child's Schedule
                  </h1>
                  <p className="text-slate-600 text-lg mt-1">
                    Monitor your child's academic timetable
                  </p>
                </div>
              </div>
            </div>
            
            {currentUser.children && currentUser.children.length > 1 && (
              <Select>
                <SelectTrigger className="w-64 rounded-xl border-2 border-orange-200">
                  <SelectValue placeholder="Select Child" />
                </SelectTrigger>
                <SelectContent>
                  {currentUser.children.map((child: any) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} - {child.program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimetableGrid = () => {
    const programKey = `${selectedProgram.replace(' ', '')}-${selectedSemester}${selectedSection}`;
    const data = timetableData[programKey as keyof typeof timetableData] || timetableData['CSE-5A'];

    return (
      <Card className="rounded-3xl shadow-2xl border-slate-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-slate-600 to-blue-600 rounded-xl text-white">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <span className="bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">
                {programKey} Timetable
              </span>
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div className="grid grid-cols-7 gap-0 bg-gradient-to-r from-slate-100 to-blue-100">
                <div className="p-4 font-bold text-center text-slate-700 bg-gradient-to-r from-slate-200 to-blue-200 border-r border-white">
                  Time Slot
                </div>
                {days.map((day) => (
                  <div key={day} className="p-4 font-bold text-center text-slate-700 border-r border-white last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Time Slots */}
              {timeSlots.map((slot, slotIndex) => (
                <div key={slot} className="grid grid-cols-7 gap-0 hover:bg-blue-25 transition-colors duration-200">
                  {/* Time Column */}
                  <div className="p-4 bg-gradient-to-r from-slate-100 to-blue-100 border-r border-b border-slate-200 flex flex-col justify-center">
                    <div className="text-sm font-semibold text-slate-700">{slot.split(' - ')[0]}</div>
                    <div className="text-xs text-slate-500">{slot.split(' - ')[1]}</div>
                  </div>
                  
                  {/* Day Columns */}
                  {days.map((day) => {
                    const dayData = data[day as keyof typeof data] || [];
                    const classData = dayData[slotIndex];

                    return (
                      <div 
                        key={day} 
                        className="p-3 border-r border-b border-slate-200 last:border-r-0 min-h-[90px] flex items-center justify-center group hover:bg-slate-50 transition-all duration-300"
                      >
                        {!classData ? (
                          <div className="w-full h-full flex items-center justify-center">
                            {currentUser.role === 'admin' ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-slate-400 hover:text-slate-600 hover:bg-blue-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                              >
                                <Plus className="h-5 w-5" />
                              </Button>
                            ) : (
                              <span className="text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">Free</span>
                            )}
                          </div>
                        ) : classData.type === 'break' ? (
                          <div className="w-full">
                            <Badge className="w-full justify-center bg-gradient-to-r from-amber-200 to-orange-300 text-amber-800 border-amber-400 rounded-xl py-3 shadow-lg">
                              🍽️ {classData.subject}
                            </Badge>
                          </div>
                        ) : (
                          <div className={`w-full p-4 rounded-2xl ${getSubjectColor(classData.subject, classData.type)} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 relative overflow-hidden`}>
                            <div className="space-y-2 relative z-10">
                              <div className="flex items-center justify-between">
                                <div className="font-semibold text-sm truncate" title={classData.subject}>
                                  {classData.subject}
                                </div>
                                {classData.isFlexible && (
                                  <Badge className="bg-white/20 text-white border-white/30 text-xs px-2 py-1 rounded-lg">
                                    Flexible
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs opacity-90 truncate">
                                {classData.faculty.join(', ')}
                              </div>
                              <div className="text-xs opacity-80 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {classData.room}
                              </div>
                              <div className="text-xs opacity-80">
                                {classData.credits} credits
                              </div>
                              {currentUser.role === 'admin' && (
                                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30 rounded-lg"
                                    onClick={() => handleEditScheduleEntry(classData, day, slot, slotIndex)}
                                    title="Edit schedule entry"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30 rounded-lg">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render based on current view
  if (currentView !== 'list') {
    switch (currentView) {
      case 'auto-generate':
        return renderAutoGeneratePage();
      case 'manual-create':
        return renderManualCreatePage();
      case 'flexible-assignment':
        return renderFlexibleAssignmentPage();
      case 'faculty-workload':
        return renderFacultyWorkloadPage();
      case 'edit-schedule':
        return renderEditSchedulePage();
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-8">
      {/* Render role-specific interface */}
      {currentUser.role === 'admin' && renderAdminInterface()}
      {currentUser.role === 'faculty' && renderFacultyInterface()}
      {currentUser.role === 'student' && renderStudentInterface()}
      {currentUser.role === 'parent' && renderParentInterface()}

      {/* Academic Configuration */}
      <Card className="rounded-3xl shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-3xl">
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="h-6 w-6 text-slate-600" />
            Academic Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
              <SelectTrigger className="rounded-xl border-2 border-slate-200">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="rounded-xl border-2 border-slate-200">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="rounded-xl border-2 border-slate-200">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map(sem => (
                  <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="rounded-xl border-2 border-slate-200">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                {['A', 'B', 'C'].map(section => (
                  <SelectItem key={section} value={section}>Section {section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 rounded-xl">
              <Search className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Professional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-3xl shadow-xl border-slate-200 bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium">Total Classes</p>
                <p className="text-4xl font-bold text-white mt-2">156</p>
                <p className="text-blue-100 text-sm">across all programs</p>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl">
                <School className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xl border-slate-200 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 font-medium">Faculty Load</p>
                <p className="text-4xl font-bold text-white mt-2">87%</p>
                <p className="text-emerald-100 text-sm">average utilization</p>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xl border-slate-200 bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium">Conflicts</p>
                <p className="text-4xl font-bold text-white mt-2">2</p>
                <p className="text-purple-100 text-sm">requires attention</p>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xl border-slate-200 bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium">Room Usage</p>
                <p className="text-4xl font-bold text-white mt-2">94%</p>
                <p className="text-orange-100 text-sm">optimal allocation</p>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          </CardContent>
        </Card>
      </div>

      {/* Main Timetable Grid */}
      {renderTimetableGrid()}
    </div>
  );
}
