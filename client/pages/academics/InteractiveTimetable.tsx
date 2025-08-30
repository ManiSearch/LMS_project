import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormField, FileUploadField } from '@/components/forms/FormField';
import { useFormHandler, useAcademicHandlers, useFileHandlers } from '@/hooks/useFormHandlers';
import { validationRules } from '@/utils/formUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, Plus, Download, Upload, MapPin, Users, X, Save, RefreshCw, Edit, Settings, BookOpen, User, GraduationCap, Eye, Filter, Copy, Shuffle, UserCheck, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

// Enhanced timetable data structure with faculty and room information
interface TimetableEntry {
  subject: string;
  teacher: string;
  room: string;
  duration: number;
  type: 'regular' | 'lab' | 'break' | 'flexible';
  alternateTeachers?: string[];
  workload?: number;
}

interface TimetableData {
  [className: string]: {
    [day: string]: TimetableEntry[];
  };
}

// Enhanced data with faculty workload tracking
const initialTimetableData: TimetableData = {
  'CSE - Year 1': {
    'Monday': [
      { subject: 'Data Structures', teacher: 'Dr. Sankar', room: 'Room 101', duration: 60, type: 'regular', workload: 4 },
      { subject: 'Mathematics', teacher: 'Prof. Ashok', room: 'Room 102', duration: 60, type: 'regular', workload: 6 },
      { subject: 'Physics Lab', teacher: 'Dr. Aadhik', room: 'Lab 201', duration: 120, type: 'lab', workload: 3 },
      { subject: 'Lunch Break', teacher: '', room: '', duration: 60, type: 'break', workload: 0 },
      { subject: 'Operating Systems', teacher: 'Mr. Gokul', room: 'Room 103', duration: 60, type: 'flexible', alternateTeachers: ['Dr. Abishek', 'Ms.Gayathiri'], workload: 5 },
      { subject: 'Software Engineering', teacher: 'Dr. Abishek', room: 'Room 104', duration: 60, type: 'regular', workload: 4 }
    ],
    'Tuesday': [
      { subject: 'Algorithms', teacher: 'Dr. Sankar', room: 'Room 101', duration: 60, type: 'regular', workload: 4 },
      { subject: 'Database Systems', teacher: 'Ms. Gayathiri', room: 'Room 205', duration: 60, type: 'regular', workload: 5 },
      { subject: 'Computer Networks', teacher: 'Mr. Tamil', room: 'Room 106', duration: 60, type: 'regular', workload: 3 },
      { subject: 'Lunch Break', teacher: '', room: '', duration: 60, type: 'break', workload: 0 },
      { subject: 'Machine Learning', teacher: 'Dr. Gokul', room: 'Lab 301', duration: 120, type: 'lab', workload: 6 },
      { subject: 'Ethics in Computing', teacher: 'Prof. Aadhik', room: 'Room 107', duration: 60, type: 'regular', workload: 2 }
    ],
    'Wednesday': [
      { subject: 'Web Development', teacher: 'Ms.Gobika', room: 'Lab 202', duration: 120, type: 'lab', workload: 5 },
      { subject: 'Discrete Mathematics', teacher: 'Prof. Ashok', room: 'Room 102', duration: 60, type: 'regular', workload: 6 },
      { subject: 'Computer Architecture', teacher: 'Dr. Abishek', room: 'Room 108', duration: 60, type: 'regular', workload: 4 },
      { subject: 'Lunch Break', teacher: '', room: '', duration: 60, type: 'break', workload: 0 },
      { subject: 'Mobile App Development', teacher: 'Mr. Gokul', room: 'Lab 302', duration: 120, type: 'flexible', alternateTeachers: ['Dr. Sankar', 'Ms. Gobika'], workload: 5 },
      { subject: 'Technical Writing', teacher: 'Dr. Aadhik', room: 'Room 109', duration: 60, type: 'regular', workload: 2 }
    ],
    'Thursday': [
      { subject: 'AI Fundamentals', teacher: 'Dr. Gokul', room: 'Room 110', duration: 60, type: 'regular', workload: 6 },
      { subject: 'Statistics', teacher: 'Prof. Ashok', room: 'Room 102', duration: 60, type: 'regular', workload: 6 },
      { subject: 'Cybersecurity', teacher: 'Dr. Abishek', room: 'Lab 203', duration: 120, type: 'lab', workload: 4 },
      { subject: 'Lunch Break', teacher: '', room: '', duration: 60, type: 'break', workload: 0 },
      { subject: 'Project Management', teacher: 'Ms.Gomathi', room: 'Room 111', duration: 60, type: 'regular', workload: 5 },
      { subject: 'Research Methodology', teacher: 'Dr. Aadhik', room: 'Room 112', duration: 60, type: 'regular', workload: 2 }
    ],
    'Friday': [
      { subject: 'Software Testing', teacher: 'Dr. Sankar', room: 'Lab 204', duration: 120, type: 'lab', workload: 4 },
      { subject: 'Human-Computer Interaction', teacher: 'Ms. Gomathi', room: 'Room 113', duration: 60, type: 'regular', workload: 5 },
      { subject: 'Cloud Computing', teacher: 'Mr.Tamil', room: 'Room 114', duration: 60, type: 'flexible', alternateTeachers: ['Dr. Gokul', 'Dr. Abishek'], workload: 3 },
      { subject: 'Lunch Break', teacher: '', room: '', duration: 60, type: 'break', workload: 0 },
      { subject: 'Capstone Project', teacher: 'Dr. Gokul', room: 'Project Lab', duration: 120, type: 'regular', workload: 6 },
      { subject: 'Industry Seminar', teacher: 'Guest Faculty', room: 'Auditorium', duration: 60, type: 'regular', workload: 0 }
    ],
    'Saturday': [
      { subject: 'Weekend Workshop', teacher: 'Various', room: 'Multiple', duration: 180, type: 'flexible', workload: 0 },
      { subject: 'Break', teacher: '', room: '', duration: 60, type: 'break', workload: 0 },
      { subject: 'Sports/Activities', teacher: 'PE Staff', room: 'Sports Complex', duration: 120, type: 'regular', workload: 0 },
      { subject: 'Study Hall', teacher: 'Supervisor', room: 'Library', duration: 120, type: 'regular', workload: 1 }
    ]
  }
};

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM', 
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type UserRole = 'super-admin' | 'admin' | 'faculty' | 'student' | 'parent';

export default function InteractiveTimetable() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('CSE - Year 1');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [selectedProgram, setSelectedProgram] = useState('Computer Science');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAutoGenerateDialog, setShowAutoGenerateDialog] = useState(false);
  const [showWorkloadDialog, setShowWorkloadDialog] = useState(false);
  const [showFlexibleDialog, setShowFlexibleDialog] = useState(false);
  const [editingCell, setEditingCell] = useState<{day: string, slot: number} | null>(null);
  const [timetableData, setTimetableData] = useState<TimetableData>(initialTimetableData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  const [filterByTeacher, setFilterByTeacher] = useState('');
  const [filterBySubject, setFilterBySubject] = useState('');
  const [selectedTimetableOption, setSelectedTimetableOption] = useState('default');

  const { timetableHandlers } = useAcademicHandlers();
  const { handleFileUpload, handleFileDownload } = useFileHandlers();

  // Role-based access control
  const currentUserRole = user?.role as UserRole || 'student';
  const isSuperAdmin = currentUserRole === 'super-admin';
  const isAdmin = currentUserRole === 'admin';
  const isFaculty = currentUserRole === 'faculty';
  const isStudent = currentUserRole === 'student';
  const isParent = currentUserRole === 'parent';

  // Form handler for creating timetable
  const {
    formState,
    updateField,
    submitForm,
    resetForm,
    isSubmitting,
    getFieldProps
  } = useFormHandler(
    ['academicYear', 'program', 'semester', 'className', 'generationType'],
    {
      academicYear: selectedAcademicYear,
      program: selectedProgram,
      semester: selectedSemester,
      className: selectedClass,
      generationType: 'auto'
    },
    {
      academicYear: [validationRules.required],
      program: [validationRules.required],
      semester: [validationRules.required],
      className: [validationRules.required],
      generationType: [validationRules.required]
    }
  );

  // Form handler for editing cell
  const editForm = useFormHandler(
    ['subject', 'teacher', 'room', 'duration', 'type'],
    {},
    {
      subject: [validationRules.required],
      teacher: [validationRules.required],
      room: [validationRules.required],
      duration: [validationRules.required],
      type: [validationRules.required]
    }
  );

  // Form handler for flexible timetable
  const flexibleForm = useFormHandler(
    ['primaryTeacher', 'alternateTeachers', 'subject', 'timeSlot'],
    {},
    {
      primaryTeacher: [validationRules.required],
      subject: [validationRules.required],
      timeSlot: [validationRules.required]
    }
  );

  // Auto-generate timetable based on constraints
  const handleAutoGenerate = async (formData: any) => {
    try {
      setIsRefreshing(true);
      // Simulate auto-generation logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would call backend API with constraints
      const result = await timetableHandlers.autoGenerate(formData);
      setShowAutoGenerateDialog(false);
      resetForm();
      await refreshTimetable();
    } catch (error) {
      console.error('Failed to auto-generate timetable:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle manual timetable creation
  const handleCreateTimetable = async (formData: any) => {
    try {
      const result = await timetableHandlers.create(formData);
      setShowCreateDialog(false);
      resetForm();
      await refreshTimetable();
    } catch (error) {
      console.error('Failed to create timetable:', error);
    }
  };

  // Handle cell edit with role permissions
  const handleEditCell = (day: string, slotIndex: number) => {
    if (isStudent || isParent) {
      return; // Students and parents can only view
    }

    const classData = timetableData[selectedClass];
    const currentEntry = classData?.[day]?.[slotIndex];
    if (!currentEntry || currentEntry.type === 'break') return;
    
    setEditingCell({ day, slot: slotIndex });
    editForm.updateField('subject', currentEntry.subject);
    editForm.updateField('teacher', currentEntry.teacher);
    editForm.updateField('room', currentEntry.room);
    editForm.updateField('duration', currentEntry.duration.toString());
    editForm.updateField('type', currentEntry.type);
    setShowEditDialog(true);
  };

  // Handle save cell edit
  const handleSaveCellEdit = async (formData: any) => {
    if (!editingCell) return;
    
    try {
      setTimetableData(prev => {
        const updated = { ...prev };
        if (updated[selectedClass] && updated[selectedClass][editingCell.day]) {
          updated[selectedClass][editingCell.day][editingCell.slot] = {
            ...updated[selectedClass][editingCell.day][editingCell.slot],
            subject: formData.subject,
            teacher: formData.teacher,
            room: formData.room,
            duration: parseInt(formData.duration),
            type: formData.type
          };
        }
        return updated;
      });
      
      setShowEditDialog(false);
      setEditingCell(null);
      editForm.resetForm();
    } catch (error) {
      console.error('Failed to update timetable:', error);
    }
  };

  // Handle flexible timetable assignment
  const handleFlexibleAssignment = async (formData: any) => {
    try {
      // Implementation for flexible timetable where multiple teachers can be assigned
      const result = await timetableHandlers.assignFlexible(formData);
      setShowFlexibleDialog(false);
      flexibleForm.resetForm();
      await refreshTimetable();
    } catch (error) {
      console.error('Failed to assign flexible timetable:', error);
    }
  };

  // Calculate faculty workload
  const calculateFacultyWorkload = () => {
    const workloadData: {[teacher: string]: {hours: number, subjects: string[], classes: string[]}} = {};
    
    Object.entries(timetableData).forEach(([className, schedule]) => {
      Object.entries(schedule).forEach(([day, entries]) => {
        entries.forEach(entry => {
          if (entry.teacher && entry.type !== 'break') {
            if (!workloadData[entry.teacher]) {
              workloadData[entry.teacher] = { hours: 0, subjects: [], classes: [] };
            }
            workloadData[entry.teacher].hours += entry.duration / 60;
            if (!workloadData[entry.teacher].subjects.includes(entry.subject)) {
              workloadData[entry.teacher].subjects.push(entry.subject);
            }
            if (!workloadData[entry.teacher].classes.includes(className)) {
              workloadData[entry.teacher].classes.push(className);
            }
          }
        });
      });
    });
    
    return workloadData;
  };

  // Handle file import
  const handleImport = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    try {
      await handleFileUpload(files[0]);
      const result = await timetableHandlers.import(files[0]);
      setShowImportDialog(false);
      await refreshTimetable();
    } catch (error) {
      console.error('Failed to import timetable:', error);
    }
  };

  // Handle export with role-based data
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      const exportData = {
        academicYear: selectedAcademicYear,
        program: selectedProgram,
        semester: selectedSemester,
        class: selectedClass,
        timetable: timetableData[selectedClass],
        workload: isAdmin ? calculateFacultyWorkload() : undefined,
        exportedAt: new Date().toISOString(),
        exportedBy: currentUserRole,
        exportedByUser: user?.name || 'Unknown User'
      };
      
      await handleFileDownload(exportData, `timetable-${selectedClass}-${selectedAcademicYear}`, format);
    } catch (error) {
      console.error('Failed to export timetable:', error);
    }
  };

  // Refresh timetable data
  const refreshTimetable = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, fetch fresh data based on selected parameters
    } catch (error) {
      console.error('Failed to refresh timetable:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get subject color based on type
  const getSubjectColor = (entry: TimetableEntry) => {
    if (entry.type === 'break') return 'bg-gray-100 text-gray-600';
    if (entry.type === 'lab') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (entry.type === 'flexible') return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  // Check if user has edit permissions
  const canEdit = isAdmin || isSuperAdmin;

  // Filter timetable based on selected filters
  const getFilteredTimetable = () => {
    if (!filterByTeacher && !filterBySubject) return timetableData[selectedClass];
    
    const filtered: {[day: string]: TimetableEntry[]} = {};
    Object.entries(timetableData[selectedClass] || {}).forEach(([day, entries]) => {
      filtered[day] = entries.filter(entry => {
        const teacherMatch = !filterByTeacher || entry.teacher.toLowerCase().includes(filterByTeacher.toLowerCase());
        const subjectMatch = !filterBySubject || entry.subject.toLowerCase().includes(filterBySubject.toLowerCase());
        return teacherMatch && subjectMatch;
      });
    });
    
    return filtered;
  };

  // Options for form fields
  const academicYearOptions = [
    { value: '2024-25', label: '2024-25' },
    { value: '2023-24', label: '2023-24' },
    { value: '2025-26', label: '2025-26' }
  ];

  const programOptions = [
    { value: 'Computer Science', label: 'Computer Science Engineering' },
    { value: 'Electrical', label: 'Electrical Engineering' },
    { value: 'Mechanical', label: 'Mechanical Engineering' },
    { value: 'Civil', label: 'Civil Engineering' },
    { value: 'Electronics', label: 'Electronics & Communication' }
  ];

  const semesterOptions = [
    { value: 'Semester 1', label: 'Semester 1' },
    { value: 'Semester 2', label: 'Semester 2' },
    { value: 'Semester 3', label: 'Semester 3' },
    { value: 'Semester 4', label: 'Semester 4' },
    { value: 'Semester 5', label: 'Semester 5' },
    { value: 'Semester 6', label: 'Semester 6' },
    { value: 'Semester 7', label: 'Semester 7' },
    { value: 'Semester 8', label: 'Semester 8' }
  ];

  const classOptions = [
    { value: 'CSE - Year 1', label: 'CSE - Year 1' },
    { value: 'CSE - Year 2', label: 'CSE - Year 2' },
    { value: 'CSE - Year 3', label: 'CSE - Year 3' },
    { value: 'CSE - Year 4', label: 'CSE - Year 4' },
    { value: 'ECE - Year 1', label: 'ECE - Year 1' },
    { value: 'ECE - Year 2', label: 'ECE - Year 2' },
    { value: 'MECH - Year 1', label: 'MECH - Year 1' },
    { value: 'MECH - Year 2', label: 'MECH - Year 2' }
  ];

  const subjectOptions = [
    { value: 'Data Structures', label: 'Data Structures & Algorithms' },
    { value: 'Operating Systems', label: 'Operating Systems' },
    { value: 'Database Systems', label: 'Database Management Systems' },
    { value: 'Computer Networks', label: 'Computer Networks' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile App Development', label: 'Mobile App Development' },
    { value: 'AI Fundamentals', label: 'Artificial Intelligence' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Mathematics', label: 'Engineering Mathematics' },
    { value: 'Physics', label: 'Engineering Physics' },
    { value: 'Statistics', label: 'Probability & Statistics' }
  ];

  const teacherOptions = [
    { value: 'Dr. Sankar', label: 'Dr. Sankar (CSE)' },
    { value: 'Prof. James', label: 'Prof.jaganadhan (Mathematics)' },
    { value: 'Ms. vasanthi', label: 'Ms.vasanthi (CSE)' },
    { value: 'Mr. Abinesh', label: 'Mr.Abinesh (CSE)' },
    { value: 'Dr. Balu', label: 'Dr. Balu (Physics)' },
    { value: 'Dr. Dinesh', label: 'Dr. Dinesh (CSE)' },
    { value: 'Mr. Tamil', label: 'Mr. Tamil(Networks)' }
  ];

  const roomOptions = [
    { value: 'Room 101', label: 'Room 101 (Lecture Hall)' },
    { value: 'Room 102', label: 'Room 102 (Classroom)' },
    { value: 'Room 103', label: 'Room 103 (Classroom)' },
    { value: 'Lab 201', label: 'Lab 201 (Computer Lab)' },
    { value: 'Lab 202', label: 'Lab 202 (Programming Lab)' },
    { value: 'Lab 301', label: 'Lab 301 (Research Lab)' },
    { value: 'Auditorium', label: 'Main Auditorium' },
    { value: 'Project Lab', label: 'Project Laboratory' }
  ];

  const generationTypeOptions = [
    { value: 'manual', label: 'Manual Creation' },
    { value: 'auto', label: 'Automatic Generation' },
    { value: 'template', label: 'From Template' }
  ];

  const timetableOptions = [
    { value: 'default', label: 'Default Schedule' },
    { value: 'flexible-1', label: 'Flexible Option 1' },
    { value: 'flexible-2', label: 'Flexible Option 2' }
  ];

  const workloadData = calculateFacultyWorkload();

  return (
    <>
      <Toaster />
      <div className="space-y-6">
        {/* Header with User Info */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
            <p className="text-muted-foreground">
              Comprehensive timetable system with role-based access and workload management
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {/*<div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{user?.name || 'Unknown User'}</span>
              <Badge variant="secondary" className="text-xs">
                {currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}
              </Badge>
            </div>*/}
            <Button 
              variant="outline" 
              onClick={refreshTimetable}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Academic Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Configuration</CardTitle>
            <CardDescription>
              Select academic year, program, semester and class to manage timetables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                label="Academic Year"
                name="academicYear"
                type="select"
                options={academicYearOptions}
                value={selectedAcademicYear}
                onChange={(value) => setSelectedAcademicYear(value)}
              />
              <FormField
                label="Program"
                name="program"
                type="select"
                options={programOptions}
                value={selectedProgram}
                onChange={(value) => setSelectedProgram(value)}
              />
              <FormField
                label="Semester"
                name="semester"
                type="select"
                options={semesterOptions}
                value={selectedSemester}
                onChange={(value) => setSelectedSemester(value)}
              />
              <FormField
                label="Class"
                name="class"
                type="select"
                options={classOptions}
                value={selectedClass}
                onChange={(value) => setSelectedClass(value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {canEdit && (
          <div className="flex gap-2 flex-wrap">
            <Dialog open={showAutoGenerateDialog} onOpenChange={setShowAutoGenerateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Auto Generate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Auto Generate Timetable</DialogTitle>
                  <DialogDescription>
                    Automatically create timetable based on constraints and availability
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  submitForm(handleAutoGenerate);
                }} className="space-y-4">
                  <FormField
                    label="Academic Year"
                    name="academicYear"
                    type="select"
                    options={academicYearOptions}
                    {...getFieldProps('academicYear')}
                    required
                  />
                  <FormField
                    label="Program"
                    name="program"
                    type="select"
                    options={programOptions}
                    {...getFieldProps('program')}
                    required
                  />
                  <FormField
                    label="Semester"
                    name="semester"
                    type="select"
                    options={semesterOptions}
                    {...getFieldProps('semester')}
                    required
                  />
                  <FormField
                    label="Class"
                    name="className"
                    type="select"
                    options={classOptions}
                    {...getFieldProps('className')}
                    required
                  />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      <Shuffle className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Generating...' : 'Generate Timetable'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAutoGenerateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Manual Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Manual Timetable</DialogTitle>
                  <DialogDescription>
                    Manually create timetable for selected class
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  submitForm(handleCreateTimetable);
                }} className="space-y-4">
                  <FormField
                    label="Generation Type"
                    name="generationType"
                    type="select"
                    options={generationTypeOptions}
                    {...getFieldProps('generationType')}
                    required
                  />
                  <FormField
                    label="Academic Year"
                    name="academicYear"
                    type="select"
                    options={academicYearOptions}
                    {...getFieldProps('academicYear')}
                    required
                  />
                  <FormField
                    label="Program"
                    name="program"
                    type="select"
                    options={programOptions}
                    {...getFieldProps('program')}
                    required
                  />
                  <FormField
                    label="Semester"
                    name="semester"
                    type="select"
                    options={semesterOptions}
                    {...getFieldProps('semester')}
                    required
                  />
                  <FormField
                    label="Class"
                    name="className"
                    type="select"
                    options={classOptions}
                    {...getFieldProps('className')}
                    required
                  />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Creating...' : 'Create Timetable'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showFlexibleDialog} onOpenChange={setShowFlexibleDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Flexible Assignment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Flexible Timetable Assignment</DialogTitle>
                  <DialogDescription>
                    Assign multiple teachers to same time slot for student choice
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  flexibleForm.submitForm(handleFlexibleAssignment);
                }} className="space-y-4">
                  <FormField
                    label="Subject"
                    name="subject"
                    type="select"
                    options={subjectOptions}
                    {...flexibleForm.getFieldProps('subject')}
                    required
                  />
                  <FormField
                    label="Primary Teacher"
                    name="primaryTeacher"
                    type="select"
                    options={teacherOptions}
                    {...flexibleForm.getFieldProps('primaryTeacher')}
                    required
                  />
                  <FormField
                    label="Alternate Teachers"
                    name="alternateTeachers"
                    type="select"
                    options={teacherOptions}
                    {...flexibleForm.getFieldProps('alternateTeachers')}
                    placeholder="Select alternate teachers"
                  />
                  <FormField
                    label="Time Slot"
                    name="timeSlot"
                    type="select"
                    options={timeSlots.map(slot => ({ value: slot, label: slot }))}
                    {...flexibleForm.getFieldProps('timeSlot')}
                    required
                  />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={flexibleForm.isSubmitting} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {flexibleForm.isSubmitting ? 'Assigning...' : 'Create Assignment'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowFlexibleDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Timetable</DialogTitle>
                  <DialogDescription>
                    Upload CSV or Excel file to import timetable data
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <FileUploadField
                    label="Select File"
                    name="timetableFile"
                    accept=".csv,.xlsx,.xls"
                    onFileSelect={handleImport}
                  />
                  <div className="text-sm text-muted-foreground">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showWorkloadDialog} onOpenChange={setShowWorkloadDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Faculty Workload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Faculty Workload Analysis</DialogTitle>
                  <DialogDescription>
                    View detailed workload distribution across faculty members
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Weekly Hours</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(workloadData).map(([teacher, data]) => (
                        <TableRow key={teacher}>
                          <TableCell className="font-medium">{teacher}</TableCell>
                          <TableCell>
                            <Badge variant={data.hours > 20 ? 'destructive' : data.hours > 15 ? 'default' : 'secondary'}>
                              {data.hours}h
                            </Badge>
                          </TableCell>
                          <TableCell>{data.subjects.length}</TableCell>
                          <TableCell>{data.classes.length}</TableCell>
                          <TableCell>
                            {data.hours > 20 ? (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Overloaded
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Optimal
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Student Timetable Selection (for students only) */}
        {isStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Timetable</CardTitle>
              <CardDescription>
                Select from available flexible timetable options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedTimetableOption} onValueChange={setSelectedTimetableOption}>
                <SelectTrigger className="w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timetableOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Across all programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Teaching staff</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(workloadData).reduce((acc, data) => acc + data.hours, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total teaching hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Room Utilization</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Classroom usage</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & View Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <FormField
                label="Filter by Teacher"
                name="teacherFilter"
                type="text"
                placeholder="Search teacher..."
                value={filterByTeacher}
                onChange={(e) => setFilterByTeacher(e.target.value)}
                className="w-48"
              />
              <FormField
                label="Filter by Subject"
                name="subjectFilter"
                type="text"
                placeholder="Search subject..."
                value={filterBySubject}
                onChange={(e) => setFilterBySubject(e.target.value)}
                className="w-48"
              />
              <div className="flex gap-2 ml-auto">
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('csv')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('excel')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('pdf')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Timetable Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Timetable - {selectedClass}</CardTitle>
            <CardDescription>
              {canEdit ? 'Click on any cell to edit the schedule entry' : 'View-only access for your role'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32 bg-gray-50">Time</TableHead>
                    {days.map((day) => (
                      <TableHead key={day} className="text-center bg-gray-50 font-semibold">{day}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map((slot, index) => (
                    <TableRow key={slot} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium bg-gray-50/50 border-r">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{slot}</span>
                        </div>
                      </TableCell>
                      {days.map((day) => {
                        const filteredTimetable = getFilteredTimetable();
                        const entry = filteredTimetable?.[day]?.[index];
                        
                        if (!entry) {
                          return (
                            <TableCell key={day} className="text-center p-2">
                              <div className="h-20 flex items-center justify-center text-gray-400">
                                <span className="text-sm">Free Period</span>
                              </div>
                            </TableCell>
                          );
                        }
                        
                        const isBreak = entry.type === 'break';
                        const isFlexible = entry.type === 'flexible';
                        
                        return (
                          <TableCell key={day} className="text-center p-2">
                            <div 
                              className={`h-20 rounded-lg border-2 p-2 transition-all duration-200 ${
                                getSubjectColor(entry)
                              } ${canEdit && !isBreak ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}`}
                              onClick={() => canEdit && handleEditCell(day, index)}
                            >
                              <div className="flex flex-col justify-center h-full">
                                <div className="font-semibold text-sm mb-1">
                                  {entry.subject}
                                </div>
                                {!isBreak && (
                                  <>
                                    <div className="text-xs opacity-80 mb-1">
                                      {entry.teacher}
                                    </div>
                                    <div className="text-xs opacity-70 flex items-center justify-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {entry.room}
                                    </div>
                                    {isFlexible && entry.alternateTeachers && (
                                      <div className="text-xs opacity-60 mt-1">
                                        +{entry.alternateTeachers.length} more
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Cell Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Schedule Entry</DialogTitle>
              <DialogDescription>
                Update the schedule entry details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              editForm.submitForm(handleSaveCellEdit);
            }} className="space-y-4">
              <FormField
                label="Subject"
                name="subject"
                type="select"
                options={subjectOptions}
                {...editForm.getFieldProps('subject')}
                required
              />
              <FormField
                label="Teacher"
                name="teacher"
                type="select"
                options={teacherOptions}
                {...editForm.getFieldProps('teacher')}
                required
              />
              <FormField
                label="Room"
                name="room"
                type="select"
                options={roomOptions}
                {...editForm.getFieldProps('room')}
                required
              />
              <FormField
                label="Duration (minutes)"
                name="duration"
                type="number"
                min="30"
                max="180"
                step="30"
                {...editForm.getFieldProps('duration')}
                required
              />
              <FormField
                label="Type"
                name="type"
                type="select"
                options={[
                  { value: 'regular', label: 'Regular Class' },
                  { value: 'lab', label: 'Laboratory' },
                  { value: 'flexible', label: 'Flexible (Multiple Teachers)' }
                ]}
                {...editForm.getFieldProps('type')}
                required
              />
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={editForm.isSubmitting} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editForm.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingCell(null);
                    editForm.resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
