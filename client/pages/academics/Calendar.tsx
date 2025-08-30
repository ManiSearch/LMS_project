import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/forms/FormField';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar as CalendarIcon, Plus, Download, Upload, Clock, MapPin, Users, Search, Eye, Edit, Trash2, 
  Bell, FileText, Filter, Repeat, ExternalLink, Globe, CalendarDays, ChevronLeft, ChevronRight, 
  Phone, Mail, MessageSquare, Settings, Shield, History, Star, AlertCircle, CheckCircle,
  BookOpen, GraduationCap, Trophy, School, Building, Zap, Target, Home, Archive,
  Paperclip, Calendar1, CalendarX, RotateCcw, Save, X, Coffee, Video
} from 'lucide-react';

// Event type configurations with colors and icons
const eventTypes = {
  Holiday: { color: 'bg-red-100 border-red-300 text-red-800', icon: Home, bgColor: 'bg-red-500', textColor: 'text-red-700' },
  Academic: { color: 'bg-blue-100 border-blue-300 text-blue-800', icon: BookOpen, bgColor: 'bg-blue-500', textColor: 'text-blue-700' },
  Examination: { color: 'bg-purple-100 border-purple-300 text-purple-800', icon: FileText, bgColor: 'bg-purple-500', textColor: 'text-purple-700' },
  'Co-curricular': { color: 'bg-green-100 border-green-300 text-green-800', icon: Trophy, bgColor: 'bg-green-500', textColor: 'text-green-700' },
  Meeting: { color: 'bg-orange-100 border-orange-300 text-orange-800', icon: Video, bgColor: 'bg-orange-500', textColor: 'text-orange-700' },
  Custom: { color: 'bg-gray-100 border-gray-300 text-gray-800', icon: Star, bgColor: 'bg-gray-500', textColor: 'text-gray-700' }
};

// Visibility levels
const visibilityLevels = {
  Global: 'All users across the institution',
  Program: 'Specific academic programs only',
  Department: 'Department-specific users only',
  Class: 'Specific class/section only'
};

// Academic years
const academicYears = [
  '2023-24', '2024-25', '2025-26', '2026-27'
];

// Role-based permissions
const getPermissions = (role: string) => {
  const permissions = {
    Admin: {
      viewAll: true,
      createHoliday: true,
      editHoliday: true,
      deleteHoliday: true,
      createEvent: true,
      editEvent: true,
      deleteEvent: true,
      recurringEvents: true,
      bulkUpload: true,
      exportData: true,
      viewAuditLog: true,
      viewAllPrograms: true
    },
    Faculty: {
      viewAll: true,
      createHoliday: false,
      editHoliday: false,
      deleteHoliday: false,
      createEvent: true,
      editEvent: true,
      deleteEvent: false,
      recurringEvents: false,
      bulkUpload: false,
      exportData: true,
      viewAuditLog: false,
      viewAllPrograms: false
    },
    Student: {
      viewAll: false,
      createHoliday: false,
      editHoliday: false,
      deleteHoliday: false,
      createEvent: false,
      editEvent: false,
      deleteEvent: false,
      recurringEvents: false,
      bulkUpload: false,
      exportData: true,
      viewAuditLog: false,
      viewAllPrograms: false
    },
    Parent: {
      viewAll: false,
      createHoliday: false,
      editHoliday: false,
      deleteHoliday: false,
      createEvent: false,
      editEvent: false,
      deleteEvent: false,
      recurringEvents: false,
      bulkUpload: false,
      exportData: true,
      viewAuditLog: false,
      viewAllPrograms: false
    }
  };
  return permissions[role] || permissions.Student;
};

export default function Calendar() {
  const { user } = useAuth();
  const currentUser = user || { role: 'Student', name: 'Unknown User', department: 'General', program: 'General' };
  
  // Normalize role
  const userRole = currentUser?.role || 'Student';
  const normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
  const permissions = getPermissions(normalizedRole);

  // State management
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2025-26');
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showUpcoming, setShowUpcoming] = useState(false);

  // Dialog states
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateHolidayOpen, setIsCreateHolidayOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isRecurringSetupOpen, setIsRecurringSetupOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Form states
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    type: 'Academic',
    visibility: 'Global',
    department: currentUser.department || 'All',
    program: currentUser.program || 'All',
    academicYear: selectedAcademicYear,
    location: '',
    organizer: currentUser.name || '',
    recurring: false,
    recurringType: 'yearly',
    maxRecurrence: 5,
    notes: ''
  });

  const [holidayFormData, setHolidayFormData] = useState({
    name: '',
    description: '',
    date: '',
    type: 'National',
    academicYear: selectedAcademicYear,
    recurring: false,
    category: 'Public Holiday'
  });

  // Audit log state
  const [auditLog, setAuditLog] = useState([]);

  // Form handlers
  const { handleSubmit: handleEventSubmit, isSubmitting: isEventSubmitting } = useFormHandler(
    ['title', 'description', 'startDate', 'endDate', 'type', 'visibility'],
    eventFormData
  );

  const { handleSubmit: handleHolidaySubmit, isSubmitting: isHolidaySubmitting } = useFormHandler(
    ['name', 'description', 'date', 'type'],
    holidayFormData
  );

  // Mock data initialization with comprehensive role-based content
  useEffect(() => {
    const mockEvents = [
      // Academic Events
      {
        id: 1,
        title: 'Mid-Term Examinations',
        description: 'Mid-term examinations for all courses',
        startDate: '2024-08-15',
        endDate: '2024-08-20',
        startTime: '09:00',
        endTime: '17:00',
        type: 'Examination',
        visibility: 'Global',
        department: 'All',
        program: 'All',
        academicYear: '2024-25',
        location: 'Main Campus',
        organizer: 'Academic Office',
        recurring: false,
        createdBy: 'Dr. Academic Head',
        createdAt: '2024-01-15T10:00:00',
        lastModified: '2024-01-15T10:00:00'
      },
      {
        id: 2,
        title: 'Science Fair',
        description: 'Annual science fair and competition',
        startDate: '2024-08-10',
        endDate: '2024-08-12',
        startTime: '10:00',
        endTime: '18:00',
        type: 'Co-curricular',
        visibility: 'Program',
        department: 'Engineering',
        program: 'B.Tech',
        academicYear: '2024-25',
        location: 'Science Building',
        organizer: 'Dr. Science Head',
        recurring: true,
        createdBy: 'Prof. Innovation',
        createdAt: '2024-01-10T14:30:00',
        lastModified: '2024-01-10T14:30:00'
      },
      {
        id: 3,
        title: 'Faculty Meeting',
        description: 'Monthly faculty development session',
        startDate: '2024-08-25',
        endDate: '2024-08-25',
        startTime: '14:00',
        endTime: '16:00',
        type: 'Meeting',
        visibility: 'Department',
        department: 'Computer Science',
        program: 'All',
        academicYear: '2024-25',
        location: 'Conference Hall A',
        organizer: 'Head of Department',
        recurring: true,
        createdBy: 'HR Manager',
        createdAt: '2024-01-20T11:15:00',
        lastModified: '2024-01-20T11:15:00'
      },
      {
        id: 4,
        title: 'Student Orientation',
        description: 'Orientation program for new students',
        startDate: '2024-08-05',
        endDate: '2024-08-05',
        startTime: '09:00',
        endTime: '17:00',
        type: 'Academic',
        visibility: 'Global',
        department: 'All',
        program: 'All',
        academicYear: '2024-25',
        location: 'Main Auditorium',
        organizer: 'Student Affairs',
        recurring: false,
        createdBy: 'Dean Student Affairs',
        createdAt: '2024-07-01T09:00:00',
        lastModified: '2024-07-01T09:00:00'
      },
      {
        id: 5,
        title: 'Research Symposium',
        description: 'Annual research paper presentation',
        startDate: '2024-08-30',
        endDate: '2024-08-30',
        startTime: '10:00',
        endTime: '16:00',
        type: 'Academic',
        visibility: 'Global',
        department: 'All',
        program: 'All',
        academicYear: '2024-25',
        location: 'Research Center',
        organizer: 'Research Department',
        recurring: true,
        createdBy: 'Research Director',
        createdAt: '2024-06-15T10:00:00',
        lastModified: '2024-06-15T10:00:00'
      },
      {
        id: 6,
        title: 'Sports Meet',
        description: 'Inter-department sports competition',
        startDate: '2024-08-22',
        endDate: '2024-08-24',
        startTime: '08:00',
        endTime: '18:00',
        type: 'Co-curricular',
        visibility: 'Global',
        department: 'All',
        program: 'All',
        academicYear: '2024-25',
        location: 'Sports Complex',
        organizer: 'Sports Committee',
        recurring: true,
        createdBy: 'Sports Coordinator',
        createdAt: '2024-07-10T12:00:00',
        lastModified: '2024-07-10T12:00:00'
      },
      {
        id: 7,
        title: 'Parent-Teacher Meeting',
        description: 'Monthly parent-teacher interaction',
        startDate: '2024-08-28',
        endDate: '2024-08-28',
        startTime: '10:00',
        endTime: '15:00',
        type: 'Meeting',
        visibility: 'Global',
        department: 'All',
        program: 'All',
        academicYear: '2024-25',
        location: 'Classrooms',
        organizer: 'Academic Coordinator',
        recurring: true,
        createdBy: 'Academic Head',
        createdAt: '2024-07-20T11:00:00',
        lastModified: '2024-07-20T11:00:00'
      },
      {
    id: 8,
    title: 'Mid-Term Examinations',
    description: 'Mid-term examinations for all courses',
    startDate: '2025-08-15',
    endDate: '2025-08-20',
    startTime: '09:00',
    endTime: '17:00',
    type: 'Examination',
    visibility: 'Global',
    department: 'All',
    program: 'All',
    academicYear: '2025-26',
    location: 'Main Campus',
    organizer: 'Academic Office',
    recurring: false,
    createdBy: 'Dr. Academic Head',
    createdAt: '2025-01-15T10:00:00',
    lastModified: '2025-01-15T10:00:00'
  },
  {
    id: 9,
    title: 'Science Fair',
    description: 'Annual science fair and competition',
    startDate: '2025-08-10',
    endDate: '2025-08-12',
    startTime: '10:00',
    endTime: '18:00',
    type: 'Co-curricular',
    visibility: 'Program',
    department: 'Engineering',
    program: 'B.Tech',
    academicYear: '2025-26',
    location: 'Science Building',
    organizer: 'Dr. Science Head',
    recurring: true,
    createdBy: 'Prof. Innovation',
    createdAt: '2025-01-10T14:30:00',
    lastModified: '2025-01-10T14:30:00'
  },
  {
    id: 10,
    title: 'Faculty Meeting',
    description: 'Monthly faculty development session',
    startDate: '2025-08-25',
    endDate: '2025-08-25',
    startTime: '14:00',
    endTime: '16:00',
    type: 'Meeting',
    visibility: 'Department',
    department: 'Computer Science',
    program: 'All',
    academicYear: '2025-26',
    location: 'Conference Hall A',
    organizer: 'Head of Department',
    recurring: true,
    createdBy: 'HR Manager',
    createdAt: '2025-01-20T11:15:00',
    lastModified: '2025-01-20T11:15:00'
  },
  {
    id: 11,
    title: 'Student Orientation',
    description: 'Orientation program for new students',
    startDate: '2025-09-05',
    endDate: '2025-09-15',
    startTime: '09:00',
    endTime: '17:00',
    type: 'Academic',
    visibility: 'Global',
    department: 'All',
    program: 'All',
    academicYear: '2025-26',
    location: 'Main Auditorium',
    organizer: 'Student Affairs',
    recurring: false,
    createdBy: 'Dean Student Affairs',
    createdAt: '2025-07-01T09:00:00',
    lastModified: '2025-07-01T09:00:00'
  },
  {
    id: 12,
    title: 'Research Symposium',
    description: 'Annual research paper presentation',
    startDate: '2025-09-10',
    endDate: '2025-09-20',
    startTime: '10:00',
    endTime: '16:00',
    type: 'Academic',
    visibility: 'Global',
    department: 'All',
    program: 'All',
    academicYear: '2025-26',
    location: 'Research Center',
    organizer: 'Research Department',
    recurring: true,
    createdBy: 'Research Director',
    createdAt: '2025-06-15T10:00:00',
    lastModified: '2025-06-15T10:00:00'
  },
  {
    id: 13,
    title: 'Sports Meet',
    description: 'Inter-department sports competition',
    startDate: '2025-09-22',
    endDate: '2025-09-24',
    startTime: '08:00',
    endTime: '18:00',
    type: 'Co-curricular',
    visibility: 'Global',
    department: 'All',
    program: 'All',
    academicYear: '2025-26',
    location: 'Sports Complex',
    organizer: 'Sports Committee',
    recurring: true,
    createdBy: 'Sports Coordinator',
    createdAt: '2025-07-10T12:00:00',
    lastModified: '2025-07-10T12:00:00'
  },
  {
    id: 14,
    title: 'Parent-Teacher Meeting',
    description: 'Monthly parent-teacher interaction',
    startDate: '2025-09-28',
    endDate: '2025-09-28',
    startTime: '10:00',
    endTime: '15:00',
    type: 'Meeting',
    visibility: 'Global',
    department: 'All',
    program: 'All',
    academicYear: '2025-26',
    location: 'Classrooms',
    organizer: 'Academic Coordinator',
    recurring: true,
    createdBy: 'Academic Head',
    createdAt: '2025-07-20T11:00:00',
    lastModified: '2025-07-20T11:00:00'
  }
    ];

    const mockHolidays = [
      {
        id: 1,
        name: 'Independence Day',
        description: 'National holiday celebrating independence',
        date: '2024-08-15',
        type: 'National',
        academicYear: '2024-25',
        recurring: true,
        category: 'Public Holiday',
        createdBy: 'System Admin',
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        name: 'Raksha Bandhan',
        description: 'Festival of sibling love',
        date: '2024-08-19',
        type: 'National',
        academicYear: '2024-25',
        recurring: true,
        category: 'Religious Holiday',
        createdBy: 'System Admin',
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 3,
        name: 'Janmashtami',
        description: 'Birth of Lord Krishna',
        date: '2024-08-26',
        type: 'National',
        academicYear: '2024-25',
        recurring: true,
        category: 'Religious Holiday',
        createdBy: 'System Admin',
        createdAt: '2024-01-01T00:00:00'
      }
    ];

    setEvents(mockEvents);
    setHolidays(mockHolidays);
    setFilteredEvents(mockEvents);

    // Mock audit log
    const mockAuditLog = [
      {
        id: 1,
        action: 'Event Created',
        entityType: 'Event',
        entityId: 1,
        entityName: 'Mid-Term Examinations',
        user: 'Dr. Academic Head',
        timestamp: '2024-01-15T10:00:00',
        changes: 'Created new examination event for all programs'
      },
      {
        id: 2,
        action: 'Holiday Added',
        entityType: 'Holiday',
        entityId: 1,
        entityName: 'Independence Day',
        user: 'System Admin',
        timestamp: '2024-01-01T00:00:00',
        changes: 'Added national holiday with recurring setting'
      }
    ];
    setAuditLog(mockAuditLog);
  }, []);

  // Filter events based on role and permissions
  useEffect(() => {
    let filtered = [...events];

    // Role-based filtering
    if (!permissions.viewAllPrograms) {
      if (normalizedRole === 'Student') {
        filtered = filtered.filter(event => 
          event.visibility === 'Global' ||
          (event.visibility === 'Program' && event.program === currentUser.program) ||
          (event.visibility === 'Department' && event.department === currentUser.department)
        );
      } else if (normalizedRole === 'Parent') {
        filtered = filtered.filter(event => 
          event.visibility === 'Global' ||
          event.program === currentUser.childProgram ||
          event.department === currentUser.childDepartment
        );
      } else if (normalizedRole === 'Faculty') {
        filtered = filtered.filter(event => 
          event.visibility === 'Global' ||
          event.department === currentUser.department
        );
      }
    }

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEventType !== 'All') {
      filtered = filtered.filter(event => event.type === selectedEventType);
    }

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(event => event.department === selectedDepartment);
    }

    if (selectedProgram !== 'All') {
      filtered = filtered.filter(event => event.program === selectedProgram);
    }

    if (selectedAcademicYear !== 'All') {
      filtered = filtered.filter(event => event.academicYear === selectedAcademicYear);
    }

    if (showUpcoming) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(event => event.startDate >= today);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedEventType, selectedDepartment, selectedProgram, selectedAcademicYear, showUpcoming, permissions, normalizedRole, currentUser]);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => {
      const eventStart = event.startDate;
      const eventEnd = event.endDate;
      return dateString >= eventStart && dateString <= eventEnd;
    });
  };

  const getHolidaysForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return holidays.filter(holiday => holiday.date === dateString);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const dayHolidays = getHolidaysForDate(date);
      const isCurrentDay = isToday(date);
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-1 overflow-hidden cursor-pointer hover:bg-gray-50 ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`font-medium text-sm mb-1 ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {/* Holidays */}
            {dayHolidays.map((holiday, index) => (
              <div 
                key={`holiday-${index}`} 
                className="text-xs px-1 py-0.5 bg-red-100 text-red-700 rounded truncate"
                title={holiday.name}
              >
                🏠 {holiday.name}
              </div>
            ))}
            {/* Events */}
            {dayEvents.slice(0, 2).map((event, index) => {
              const eventConfig = eventTypes[event.type];
              const Icon = eventConfig?.icon || Star;
              return (
                <div 
                  key={`event-${index}`} 
                  className={`text-xs px-1 py-0.5 rounded truncate flex items-center gap-1 ${eventConfig?.color || 'bg-gray-100'}`}
                  title={`${event.title} - ${event.startTime || 'All day'}`}
                >
                  <Icon className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{event.title}</span>
                </div>
              );
            })}
            {/* Show "+X more" if there are more events */}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 px-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Event handlers (keeping the existing logic)
  const handleCreateEvent = async (formData: any) => {
    if (!permissions.createEvent) {
      alert('You do not have permission to create events');
      return;
    }

    try {
      await handleEventSubmit(async () => {
        const newEvent = {
          id: Date.now(),
          ...eventFormData,
          createdBy: currentUser.name,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };

        setEvents(prev => [...prev, newEvent]);
        
        const auditEntry = {
          id: Date.now(),
          action: 'Event Created',
          entityType: 'Event',
          entityId: newEvent.id,
          entityName: newEvent.title,
          user: currentUser.name,
          timestamp: new Date().toISOString(),
          changes: `Created new ${newEvent.type} event: ${newEvent.title}`
        };
        setAuditLog(prev => [auditEntry, ...prev]);

        setIsCreateEventOpen(false);
        resetEventForm();
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleCreateHoliday = async (formData: any) => {
    if (!permissions.createHoliday) {
      alert('You do not have permission to create holidays');
      return;
    }

    try {
      await handleHolidaySubmit(async () => {
        const newHoliday = {
          id: Date.now(),
          ...holidayFormData,
          createdBy: currentUser.name,
          createdAt: new Date().toISOString()
        };

        setHolidays(prev => [...prev, newHoliday]);
        
        const auditEntry = {
          id: Date.now(),
          action: 'Holiday Created',
          entityType: 'Holiday',
          entityId: newHoliday.id,
          entityName: newHoliday.name,
          user: currentUser.name,
          timestamp: new Date().toISOString(),
          changes: `Added new ${newHoliday.type} holiday: ${newHoliday.name}`
        };
        setAuditLog(prev => [auditEntry, ...prev]);

        setIsCreateHolidayOpen(false);
        resetHolidayForm();
      });
    } catch (error) {
      console.error('Error creating holiday:', error);
    }
  };

  const resetEventForm = () => {
    setEventFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      type: 'Academic',
      visibility: 'Global',
      department: currentUser.department || 'All',
      program: currentUser.program || 'All',
      academicYear: selectedAcademicYear,
      location: '',
      organizer: currentUser.name || '',
      recurring: false,
      recurringType: 'yearly',
      maxRecurrence: 5,
      notes: ''
    });
  };

  const resetHolidayForm = () => {
    setHolidayFormData({
      name: '',
      description: '',
      date: '',
      type: 'National',
      academicYear: selectedAcademicYear,
      recurring: false,
      category: 'Public Holiday'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Manage academic events, holidays, and meetings • Role: <span className="font-semibold text-blue-600">{normalizedRole}</span> • 
            Academic Year: <span className="font-semibold text-green-600">{selectedAcademicYear}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {permissions.createEvent && (
            <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>Add a new event to the academic calendar</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Event Title"
                      value={eventFormData.title}
                      onChange={(value) => setEventFormData(prev => ({ ...prev, title: value }))}
                      placeholder="Enter event title"
                      required
                    />
                    <div className="space-y-2">
                      <Label>Event Type</Label>
                      <Select value={eventFormData.type} onValueChange={(value) => setEventFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Examination">Examination</SelectItem>
                          <SelectItem value="Co-curricular">Co-curricular</SelectItem>
                          <SelectItem value="Meeting">Meeting</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <FormField
                    label="Description"
                    value={eventFormData.description}
                    onChange={(value) => setEventFormData(prev => ({ ...prev, description: value }))}
                    placeholder="Event description"
                    type="textarea"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Start Date"
                      value={eventFormData.startDate}
                      onChange={(value) => setEventFormData(prev => ({ ...prev, startDate: value }))}
                      type="date"
                      required
                    />
                    <FormField
                      label="End Date"
                      value={eventFormData.endDate}
                      onChange={(value) => setEventFormData(prev => ({ ...prev, endDate: value }))}
                      type="date"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Start Time"
                      value={eventFormData.startTime}
                      onChange={(value) => setEventFormData(prev => ({ ...prev, startTime: value }))}
                      type="time"
                    />
                    <FormField
                      label="End Time"
                      value={eventFormData.endTime}
                      onChange={(value) => setEventFormData(prev => ({ ...prev, endTime: value }))}
                      type="time"
                    />
                  </div>

                  <FormField
                    label="Location"
                    value={eventFormData.location}
                    onChange={(value) => setEventFormData(prev => ({ ...prev, location: value }))}
                    placeholder="Event location"
                  />

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateEvent}
                      disabled={isEventSubmitting || !eventFormData.title || !eventFormData.startDate}
                    >
                      {isEventSubmitting ? 'Creating...' : 'Create Event'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {permissions.createHoliday && (
            <Dialog open={isCreateHolidayOpen} onOpenChange={setIsCreateHolidayOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  <Home className="h-4 w-4 mr-2" />
                  Add Holiday
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Holiday</DialogTitle>
                  <DialogDescription>Add a holiday to the academic calendar</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <FormField
                    label="Holiday Name"
                    value={holidayFormData.name}
                    onChange={(value) => setHolidayFormData(prev => ({ ...prev, name: value }))}
                    placeholder="Enter holiday name"
                    required
                  />

                  <FormField
                    label="Description"
                    value={holidayFormData.description}
                    onChange={(value) => setHolidayFormData(prev => ({ ...prev, description: value }))}
                    placeholder="Holiday description"
                    type="textarea"
                  />

                  <FormField
                    label="Date"
                    value={holidayFormData.date}
                    onChange={(value) => setHolidayFormData(prev => ({ ...prev, date: value }))}
                    type="date"
                    required
                  />

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateHolidayOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateHoliday}
                      disabled={isHolidaySubmitting || !holidayFormData.name || !holidayFormData.date}
                    >
                      {isHolidaySubmitting ? 'Adding...' : 'Add Holiday'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Events</p>
                <p className="text-2xl font-bold text-blue-700">{filteredEvents.length}</p>
              </div>
              <div className="bg-blue-500 p-2 rounded-lg">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Meetings</p>
                <p className="text-2xl font-bold text-green-700">
                  {filteredEvents.filter(e => e.type === 'Meeting').length}
                </p>
              </div>
              <div className="bg-green-500 p-2 rounded-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Exams</p>
                <p className="text-2xl font-bold text-purple-700">
                  {filteredEvents.filter(e => e.type === 'Examination').length}
                </p>
              </div>
              <div className="bg-purple-500 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Holidays</p>
                <p className="text-2xl font-bold text-red-700">{holidays.length}</p>
              </div>
              <div className="bg-red-500 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Events</SelectItem>
                  <SelectItem value="Holiday">Holidays</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Examination">Exams</SelectItem>
                  <SelectItem value="Co-curricular">Co-curricular</SelectItem>
                  <SelectItem value="Meeting">Meetings</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="p-3 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Body */}
          <div className="grid grid-cols-7">
            {renderCalendarGrid()}
          </div>
        </CardContent>
      </Card>

      {/* Event Types Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(eventTypes).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${config.bgColor}`}></div>
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{type}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details Dialog */}
      {selectedDate && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </DialogTitle>
              <DialogDescription>Events and holidays for this date</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Holidays for selected date */}
              {getHolidaysForDate(selectedDate).map((holiday, index) => (
                <Card key={index} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="h-4 w-4 text-red-600" />
                      <h3 className="font-semibold text-red-700">{holiday.name}</h3>
                      <Badge variant="outline" className="text-red-600">Holiday</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{holiday.description}</p>
                  </CardContent>
                </Card>
              ))}
              
              {/* Events for selected date */}
              {getEventsForDate(selectedDate).map((event, index) => {
                const eventConfig = eventTypes[event.type];
                const Icon = eventConfig?.icon || Star;
                return (
                  <Card key={index} className={`border-l-4 border-l-${eventConfig?.bgColor?.replace('bg-', '') || 'gray-500'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4" />
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="text-sm text-gray-500">
                        <p><Clock className="h-3 w-3 inline mr-1" />
                          {event.startTime ? `${event.startTime} - ${event.endTime}` : 'All day'}
                        </p>
                        {event.location && (
                          <p><MapPin className="h-3 w-3 inline mr-1" />{event.location}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {getEventsForDate(selectedDate).length === 0 && getHolidaysForDate(selectedDate).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarX className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No events or holidays on this date</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
