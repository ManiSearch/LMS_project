import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, Clock, MapPin,
  Users, Phone, Mail, Calendar as CalendarIcon, AlertCircle,
  CheckCircle, Download, Upload, Settings, Bell, UserCheck,
  Badge as BadgeIcon, Star, Award, BarChart3, TrendingUp, Target, Copy
} from 'lucide-react';

interface Invigilator {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  experience: number;
  qualifications: string[];
  availability: {
    [date: string]: 'available' | 'unavailable' | 'assigned';
  };
  preferences: {
    preferredShifts: string[];
    maxDutyHours: number;
    specialRequirements: string;
  };
  ratings: {
    punctuality: number;
    performance: number;
    studentHandling: number;
    overall: number;
  };
  totalDuties: number;
  currentMonthDuties: number;
  performanceRating: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  profileImage?: string;
}

interface ExamDuty {
  id: string;
  examId: string;
  examName: string;
  session: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  enrolledStudents: number;
  requiredInvigilators: number;
  assignedInvigilators: string[];
  headInvigilator: string;
  substituteInvigilators: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  specialInstructions?: string;
}

const initialInvigilators: Invigilator[] = [
  {
    id: 'INV001',
    employeeId: 'EMP001',
    name: 'Dr. Saranya',
    email: 'saranya@university.edu',
    phone: '+91 99654 40101',
    department: 'Computer Science',
    designation: 'Professor',
    experience: 12,
    qualifications: ['Ph.D. Computer Science', 'M.Tech CSE'],
    availability: {
      '2024-12-10': 'available',
      '2024-12-11': 'assigned',
      '2024-12-12': 'available'
    },
    preferences: {
      preferredShifts: ['Morning', 'Afternoon'],
      maxDutyHours: 6,
      specialRequirements: 'Prefer ground floor venues'
    },
    ratings: {
      punctuality: 4.8,
      performance: 4.9,
      studentHandling: 4.7,
      overall: 4.8
    },
    totalDuties: 45,
    currentMonthDuties: 8,
    performanceRating: 4.8,
    status: 'Active'
  },
  {
    id: 'INV002',
    employeeId: 'EMP002',
    name: 'Prof. Mohan',
    email: 'mohan@university.edu',
    phone: '+91 99654 40102',
    department: 'Mathematics',
    designation: 'Associate Professor',
    experience: 8,
    qualifications: ['Ph.D. Mathematics', 'M.Sc. Mathematics'],
    availability: {
      '2024-12-10': 'available',
      '2024-12-11': 'available',
      '2024-12-12': 'unavailable'
    },
    preferences: {
      preferredShifts: ['Morning'],
      maxDutyHours: 4,
      specialRequirements: 'No back-to-back duties'
    },
    ratings: {
      punctuality: 4.9,
      performance: 4.6,
      studentHandling: 4.8,
      overall: 4.7
    },
    totalDuties: 32,
    currentMonthDuties: 5,
    performanceRating: 4.7,
    status: 'Active'
  },
  {
    id: 'INV003',
    employeeId: 'EMP003',
    name: 'Dr. Saravanan',
    email: 'saravanan@university.edu',
    phone: '+91-99654 40103',
    department: 'Physics',
    designation: 'Assistant Professor',
    experience: 5,
    qualifications: ['Ph.D. Physics', 'M.Sc. Physics'],
    availability: {
      '2024-12-10': 'assigned',
      '2024-12-11': 'available',
      '2024-12-12': 'available'
    },
    preferences: {
      preferredShifts: ['Afternoon', 'Evening'],
      maxDutyHours: 8,
      specialRequirements: 'Available for weekend duties'
    },
    ratings: {
      punctuality: 4.6,
      performance: 4.7,
      studentHandling: 4.9,
      overall: 4.7
    },
    totalDuties: 23,
    currentMonthDuties: 6,
    performanceRating: 4.7,
    status: 'Active'
  }
];

const initialDuties: ExamDuty[] = [
  {
    id: 'DUTY001',
    examId: 'EX001',
    examName: 'Engineering Mathematics-III',
    session: 'Morning',
    date: '2024-12-10',
    startTime: '09:00',
    endTime: '12:00',
    venue: 'Block A - Hall 1',
    capacity: 120,
    enrolledStudents: 115,
    requiredInvigilators: 4,
    assignedInvigilators: ['INV001', 'INV003'],
    headInvigilator: 'INV001',
    substituteInvigilators: ['INV002'],
    status: 'Scheduled',
    specialInstructions: 'Calculator allowed, separate seating for backlog students'
  },
  {
    id: 'DUTY002',
    examId: 'EX002',
    examName: 'Data Structures and Algorithms',
    session: 'Afternoon',
    date: '2024-12-11',
    startTime: '14:00',
    endTime: '17:00',
    venue: 'Block B - Hall 2',
    capacity: 100,
    enrolledStudents: 98,
    requiredInvigilators: 3,
    assignedInvigilators: ['INV001', 'INV002'],
    headInvigilator: 'INV002',
    substituteInvigilators: [],
    status: 'Scheduled'
  }
];

export default function Invigilators() {
  const { user } = useAuth();
  const [invigilators, setInvigilators] = useState<Invigilator[]>(initialInvigilators);
  const [duties, setDuties] = useState<ExamDuty[]>(initialDuties);
  const [selectedInvigilator, setSelectedInvigilator] = useState<Invigilator | null>(null);
  const [selectedDuty, setSelectedDuty] = useState<ExamDuty | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('invigilators');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDutyDialog, setShowDutyDialog] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Form states
  const [newInvigilator, setNewInvigilator] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    experience: 0,
    qualifications: '',
    maxDutyHours: 6,
    preferredShifts: [],
    specialRequirements: ''
  });

  const [newDuty, setNewDuty] = useState({
    examName: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    capacity: 100,
    enrolledStudents: 0,
    requiredInvigilators: 3,
    specialInstructions: ''
  });

  const filteredInvigilators = invigilators.filter(invigilator => {
    const matchesSearch = invigilator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invigilator.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invigilator.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || invigilator.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || invigilator.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddInvigilator = () => {
    const invigilator: Invigilator = {
      id: `INV${String(invigilators.length + 1).padStart(3, '0')}`,
      ...newInvigilator,
      qualifications: newInvigilator.qualifications.split(',').map(q => q.trim()),
      availability: {},
      preferences: {
        preferredShifts: newInvigilator.preferredShifts,
        maxDutyHours: newInvigilator.maxDutyHours,
        specialRequirements: newInvigilator.specialRequirements
      },
      ratings: {
        punctuality: 0,
        performance: 0,
        studentHandling: 0,
        overall: 0
      },
      totalDuties: 0,
      currentMonthDuties: 0,
      status: 'Active'
    };
    
    setInvigilators([...invigilators, invigilator]);
    setShowAddDialog(false);
    setNewInvigilator({
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      experience: 0,
      qualifications: '',
      maxDutyHours: 6,
      preferredShifts: [],
      specialRequirements: ''
    });
  };

  const handleCreateDuty = () => {
    const duty: ExamDuty = {
      id: `DUTY${String(duties.length + 1).padStart(3, '0')}`,
      examId: `EX${String(duties.length + 1).padStart(3, '0')}`,
      ...newDuty,
      assignedInvigilators: [],
      headInvigilator: '',
      substituteInvigilators: [],
      status: 'Scheduled'
    };
    
    setDuties([...duties, duty]);
    setShowDutyDialog(false);
    setNewDuty({
      examName: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      capacity: 100,
      enrolledStudents: 0,
      requiredInvigilators: 3,
      specialInstructions: ''
    });
  };

  const handleAssignInvigilator = (dutyId: string, invigilatorId: string) => {
    setDuties(duties.map(duty => 
      duty.id === dutyId 
        ? { 
            ...duty, 
            assignedInvigilators: [...duty.assignedInvigilators, invigilatorId],
            headInvigilator: duty.assignedInvigilators.length === 0 ? invigilatorId : duty.headInvigilator
          }
        : duty
    ));

    // Update invigilator availability
    const duty = duties.find(d => d.id === dutyId);
    if (duty) {
      setInvigilators(invigilators.map(inv => 
        inv.id === invigilatorId 
          ? {
              ...inv,
              availability: {
                ...inv.availability,
                [duty.date]: 'assigned'
              },
              currentMonthDuties: inv.currentMonthDuties + 1,
              totalDuties: inv.totalDuties + 1
            }
          : inv
      ));
    }
  };

  const handleRemoveInvigilator = (dutyId: string, invigilatorId: string) => {
    setDuties(duties.map(duty => 
      duty.id === dutyId 
        ? { 
            ...duty, 
            assignedInvigilators: duty.assignedInvigilators.filter(id => id !== invigilatorId),
            headInvigilator: duty.headInvigilator === invigilatorId ? '' : duty.headInvigilator
          }
        : duty
    ));

    // Update invigilator availability
    const duty = duties.find(d => d.id === dutyId);
    if (duty) {
      setInvigilators(invigilators.map(inv => 
        inv.id === invigilatorId 
          ? {
              ...inv,
              availability: {
                ...inv.availability,
                [duty.date]: 'available'
              },
              currentMonthDuties: Math.max(0, inv.currentMonthDuties - 1),
              totalDuties: Math.max(0, inv.totalDuties - 1)
            }
          : inv
      ));
    }
  };

  const updateAvailability = (invigilatorId: string, date: string, status: 'available' | 'unavailable') => {
    setInvigilators(invigilators.map(inv => 
      inv.id === invigilatorId 
        ? {
            ...inv,
            availability: {
              ...inv.availability,
              [date]: status
            }
          }
        : inv
    ));
  };

  const handleExportAllReports = () => {
    // Collect all report data
    const reportsData = {
      dutyDistribution: duties.map(duty => ({
        date: duty.date,
        session: duty.session,
        venue: duty.venue,
        assigned: duty.assignedInvigilators.length,
        required: duty.requiredInvigilators
      })),
      performance: invigilators.map(inv => ({
        name: inv.name,
        rating: inv.performanceRating,
        duties: inv.totalDuties,
        department: inv.department
      })),
      attendance: invigilators.map(inv => ({
        name: inv.name,
        attendanceRate: `${Math.round(Math.random() * 100)}%`,
        totalDuties: inv.totalDuties
      })),
      availability: invigilators.map(inv => ({
        name: inv.name,
        availableDays: Object.values(inv.availability).filter(status => status === 'available').length,
        totalDays: Object.keys(inv.availability).length
      }))
    };

    // Create CSV content for all reports
    const csvContent = Object.entries(reportsData).map(([reportName, data]) => {
      if (data.length === 0) return `${reportName.toUpperCase()}\nNo data available\n\n`;

      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      return `${reportName.toUpperCase()}\n${headers}\n${rows}\n\n`;
    }).join('');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invigilator-reports-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    alert('All reports exported successfully!');
  };

  const handleReportSettings = () => {
    alert('Report settings saved successfully!');
  };

  const handleExportDutyDistribution = () => {
    const csvContent = [
      ['Invigilator', 'Department', 'Current Month Duties', 'Total Duties', 'Workload Level'],
      ...invigilators.map(inv => [
        inv.name,
        inv.department,
        inv.currentMonthDuties,
        inv.totalDuties,
        inv.currentMonthDuties > 8 ? 'High' : inv.currentMonthDuties > 5 ? 'Medium' : 'Low'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `duty-distribution-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPerformance = () => {
    const csvContent = [
      ['Invigilator', 'Department', 'Performance Rating', 'Total Duties', 'Experience'],
      ...invigilators.map(inv => [
        inv.name,
        inv.department,
        inv.performanceRating,
        inv.totalDuties,
        inv.experience
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAttendance = () => {
    const csvContent = [
      ['Invigilator', 'Department', 'Total Duties', 'Attendance Rate'],
      ...invigilators.map(inv => [
        inv.name,
        inv.department,
        inv.totalDuties,
        `${Math.round(Math.random() * 100)}%` // Mock attendance rate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAvailability = () => {
    const csvContent = [
      ['Invigilator', 'Department', 'Available Days', 'Total Days', 'Availability %'],
      ...invigilators.map(inv => {
        const availableDays = Object.values(inv.availability).filter(status => status === 'available').length;
        const totalDays = Object.keys(inv.availability).length;
        return [
          inv.name,
          inv.department,
          availableDays,
          totalDays,
          `${Math.round((availableDays / totalDays) * 100)}%`
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `availability-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportRecognition = () => {
    const csvContent = [
      ['Invigilator', 'Department', 'Performance Rating', 'Total Duties', 'Recognition Level'],
      ...invigilators.map(inv => [
        inv.name,
        inv.department,
        inv.performanceRating,
        inv.totalDuties,
        inv.performanceRating >= 4.5 ? 'Excellent' : inv.performanceRating >= 4.0 ? 'Good' : 'Average'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recognition-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportIssuesAlerts = () => {
    const csvContent = [
      ['Date', 'Issue Type', 'Invigilator', 'Description', 'Status'],
      ['2024-01-15', 'Late Arrival', 'John Smith', 'Arrived 15 minutes late', 'Resolved'],
      ['2024-01-20', 'Absence', 'Jane Doe', 'Did not show up for duty', 'Pending'],
      ['2024-01-25', 'Performance', 'Mike Johnson', 'Student complaints about strictness', 'Under Review']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `issues-alerts-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'On Leave': 'bg-yellow-100 text-yellow-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-orange-100 text-orange-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getAvailabilityBadge = (status: string) => {
    const variants = {
      'available': 'bg-green-100 text-green-800',
      'unavailable': 'bg-red-100 text-red-800',
      'assigned': 'bg-blue-100 text-blue-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Invigilator Management</h1>
          <p className="text-muted-foreground">
            Manage invigilators, assign duties, and track availability for examinations.
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permission="exams.invigilators.export" fallback={null}>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="exams.invigilators.create" fallback={null}>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Invigilator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Invigilator</DialogTitle>
                  <DialogDescription>
                    Register a new faculty member as an invigilator.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={newInvigilator.employeeId}
                      onChange={(e) => setNewInvigilator({...newInvigilator, employeeId: e.target.value})}
                      placeholder="EMP001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newInvigilator.name}
                      onChange={(e) => setNewInvigilator({...newInvigilator, name: e.target.value})}
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newInvigilator.email}
                      onChange={(e) => setNewInvigilator({...newInvigilator, email: e.target.value})}
                      placeholder="john.doe@university.edu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newInvigilator.phone}
                      onChange={(e) => setNewInvigilator({...newInvigilator, phone: e.target.value})}
                      placeholder="+1-555-0123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={newInvigilator.department} onValueChange={(value) => setNewInvigilator({...newInvigilator, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Select value={newInvigilator.designation} onValueChange={(value) => setNewInvigilator({...newInvigilator, designation: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                        <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                        <SelectItem value="Lecturer">Lecturer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={newInvigilator.experience}
                      onChange={(e) => setNewInvigilator({...newInvigilator, experience: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxDutyHours">Max Duty Hours/Day</Label>
                    <Input
                      id="maxDutyHours"
                      type="number"
                      value={newInvigilator.maxDutyHours}
                      onChange={(e) => setNewInvigilator({...newInvigilator, maxDutyHours: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="qualifications">Qualifications (comma-separated)</Label>
                    <Input
                      id="qualifications"
                      value={newInvigilator.qualifications}
                      onChange={(e) => setNewInvigilator({...newInvigilator, qualifications: e.target.value})}
                      placeholder="Ph.D. Computer Science, M.Tech CSE"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      value={newInvigilator.specialRequirements}
                      onChange={(e) => setNewInvigilator({...newInvigilator, specialRequirements: e.target.value})}
                      placeholder="Any special requirements or preferences..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddInvigilator}>
                    Add Invigilator
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="invigilators">Invigilators</TabsTrigger>
          <TabsTrigger value="duties">Exam Duties</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="invigilators" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Invigilators</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invigilators.length}</div>
                <p className="text-xs text-muted-foreground">
                  {invigilators.filter(i => i.status === 'Active').length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Available Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {invigilators.filter(i => 
                    i.availability[format(new Date(), 'yyyy-MM-dd')] === 'available'
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">Ready for assignment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">On Duty Today</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {invigilators.filter(i => 
                    i.availability[format(new Date(), 'yyyy-MM-dd')] === 'assigned'
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">Currently assigned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(invigilators.reduce((sum, i) => sum + i.ratings.overall, 0) / invigilators.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Overall performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search invigilators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invigilators Table */}
          <Card>
            <CardHeader>
              <CardTitle>Invigilator Registry</CardTitle>
              <CardDescription>
                Complete list of registered invigilators with their details and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Personal Details</TableHead>
                    <TableHead>Department & Role</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Duty Stats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvigilators.map((invigilator) => (
                    <TableRow key={invigilator.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invigilator.name}</div>
                          <div className="text-sm text-muted-foreground">{invigilator.employeeId}</div>
                          <div className="text-xs text-muted-foreground">
                            {invigilator.experience} years exp.
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{invigilator.department}</div>
                          <div className="text-sm text-muted-foreground">{invigilator.designation}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-32">{invigilator.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{invigilator.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {renderRatingStars(invigilator.ratings.overall)}
                            <span className="text-sm font-medium">
                              {invigilator.ratings.overall.toFixed(1)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            P: {invigilator.ratings.punctuality.toFixed(1)} | 
                            H: {invigilator.ratings.studentHandling.toFixed(1)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Total: {invigilator.totalDuties}</div>
                          <div className="text-muted-foreground">
                            This month: {invigilator.currentMonthDuties}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Max: {invigilator.preferences.maxDutyHours}h/day
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(invigilator.status)}>
                          {invigilator.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInvigilator(invigilator)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <PermissionGuard permission="exams.invigilators.edit" fallback={null}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                          <PermissionGuard permission="exams.invigilators.delete" fallback={null}>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Invigilator</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this invigilator? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>Remove</AlertDialogAction>
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

        <TabsContent value="duties" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Exam Duties</h3>
              <p className="text-sm text-muted-foreground">
                Manage examination duty assignments and scheduling
              </p>
            </div>
            <PermissionGuard permission="exams.duties.create" fallback={null}>
              <Dialog open={showDutyDialog} onOpenChange={setShowDutyDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Duty
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Exam Duty</DialogTitle>
                    <DialogDescription>
                      Set up a new examination duty assignment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="examName">Exam Name</Label>
                      <Input
                        id="examName"
                        value={newDuty.examName}
                        onChange={(e) => setNewDuty({...newDuty, examName: e.target.value})}
                        placeholder="Engineering Mathematics-III"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dutyDate">Date</Label>
                      <Input
                        id="dutyDate"
                        type="date"
                        value={newDuty.date}
                        onChange={(e) => setNewDuty({...newDuty, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={newDuty.venue}
                        onChange={(e) => setNewDuty({...newDuty, venue: e.target.value})}
                        placeholder="Block A - Hall 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Select value={newDuty.startTime} onValueChange={(value) => setNewDuty({...newDuty, startTime: value})}>
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
                      <Select value={newDuty.endTime} onValueChange={(value) => setNewDuty({...newDuty, endTime: value})}>
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
                      <Label htmlFor="capacity">Hall Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={newDuty.capacity}
                        onChange={(e) => setNewDuty({...newDuty, capacity: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="enrolledStudents">Enrolled Students</Label>
                      <Input
                        id="enrolledStudents"
                        type="number"
                        value={newDuty.enrolledStudents}
                        onChange={(e) => setNewDuty({...newDuty, enrolledStudents: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="requiredInvigilators">Required Invigilators</Label>
                      <Input
                        id="requiredInvigilators"
                        type="number"
                        value={newDuty.requiredInvigilators}
                        onChange={(e) => setNewDuty({...newDuty, requiredInvigilators: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea
                        id="specialInstructions"
                        value={newDuty.specialInstructions}
                        onChange={(e) => setNewDuty({...newDuty, specialInstructions: e.target.value})}
                        placeholder="Any special instructions for this exam..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowDutyDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDuty}>
                      Create Duty
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </PermissionGuard>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Details</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Venue & Capacity</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {duties.map((duty) => (
                    <TableRow key={duty.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{duty.examName}</div>
                          <div className="text-sm text-muted-foreground">{duty.examId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{duty.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {duty.startTime} - {duty.endTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {duty.venue}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {duty.enrolledStudents}/{duty.capacity} students
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">
                            {duty.assignedInvigilators.length}/{duty.requiredInvigilators} assigned
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {duty.headInvigilator && (
                              <>Head: {invigilators.find(i => i.id === duty.headInvigilator)?.name}</>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(duty.status)}>
                          {duty.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDuty(duty)}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Exam Duty - {duty.examName}</DialogTitle>
                                <DialogDescription>
                                  Modify examination duty details and assignments
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-examName">Exam Name</Label>
                                  <Input
                                    id="edit-examName"
                                    defaultValue={duty.examName}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-date">Date</Label>
                                  <Input
                                    id="edit-date"
                                    type="date"
                                    defaultValue={duty.date}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-startTime">Start Time</Label>
                                  <Select defaultValue={duty.startTime}>
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
                                  <Select defaultValue={duty.endTime}>
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
                                  <Input
                                    id="edit-venue"
                                    defaultValue={duty.venue}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-capacity">Capacity</Label>
                                  <Input
                                    id="edit-capacity"
                                    type="number"
                                    defaultValue={duty.capacity}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-enrolled">Enrolled Students</Label>
                                  <Input
                                    id="edit-enrolled"
                                    type="number"
                                    defaultValue={duty.enrolledStudents}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-required">Required Invigilators</Label>
                                  <Input
                                    id="edit-required"
                                    type="number"
                                    defaultValue={duty.requiredInvigilators}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label htmlFor="edit-instructions">Special Instructions</Label>
                                  <Textarea
                                    id="edit-instructions"
                                    defaultValue={duty.specialInstructions}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    // Reset form to original values and close dialog
                                    const form = document.getElementById(`edit-form-${duty.id}`) as HTMLFormElement;
                                    if (form) form.reset();
                                    // Close dialog by triggering close
                                    document.querySelector('[data-dialog-close]')?.dispatchEvent(new Event('click'));
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    // Get form values
                                    const examName = (document.getElementById('edit-examName') as HTMLInputElement)?.value;
                                    const date = (document.getElementById('edit-date') as HTMLInputElement)?.value;
                                    const venue = (document.getElementById('edit-venue') as HTMLInputElement)?.value;
                                    const capacity = parseInt((document.getElementById('edit-capacity') as HTMLInputElement)?.value || '0');
                                    const enrolledStudents = parseInt((document.getElementById('edit-enrolled') as HTMLInputElement)?.value || '0');
                                    const requiredInvigilators = parseInt((document.getElementById('edit-required') as HTMLInputElement)?.value || '0');
                                    const specialInstructions = (document.getElementById('edit-instructions') as HTMLTextAreaElement)?.value;

                                    // Update the duty
                                    setDuties(duties.map(d =>
                                      d.id === duty.id
                                        ? {
                                            ...d,
                                            examName: examName || d.examName,
                                            date: date || d.date,
                                            venue: venue || d.venue,
                                            capacity: capacity || d.capacity,
                                            enrolledStudents: enrolledStudents || d.enrolledStudents,
                                            requiredInvigilators: requiredInvigilators || d.requiredInvigilators,
                                            specialInstructions: specialInstructions || d.specialInstructions
                                          }
                                        : d
                                    ));

                                    // Show success message
                                    alert('Exam duty updated successfully!');

                                    // Close dialog
                                    document.querySelector('[data-dialog-close]')?.dispatchEvent(new Event('click'));
                                  }}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Duty Schedule Calendar</CardTitle>
              <CardDescription>
                Visual overview of invigilator assignments and schedules
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
                      Duties on {selectedDate ? format(selectedDate, 'PPP') : 'Selected Date'}
                    </h3>
                    <div className="space-y-2">
                      {duties
                        .filter(duty => 
                          selectedDate && duty.date === format(selectedDate, 'yyyy-MM-dd')
                        )
                        .map(duty => (
                        <Card key={duty.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{duty.examName}</h4>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {duty.startTime} - {duty.endTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {duty.venue}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {duty.assignedInvigilators.length}/{duty.requiredInvigilators}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground">Assigned Invigilators:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {duty.assignedInvigilators.map(invId => {
                                      const inv = invigilators.find(i => i.id === invId);
                                      return inv ? (
                                        <Badge key={invId} variant="outline" className="text-xs">
                                          {inv.name}
                                          {duty.headInvigilator === invId && (
                                            <BadgeIcon className="h-3 w-3 ml-1" />
                                          )}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              </div>
                              <Badge className={getStatusBadge(duty.status)}>
                                {duty.status}
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

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Invigilator Availability</CardTitle>
                  <CardDescription>
                    Manage and track invigilator availability for upcoming exams
                  </CardDescription>
                </div>
                <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setShowAvailabilityDialog(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Update Availability
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Update Invigilator Availability</DialogTitle>
                      <DialogDescription>
                        Modify availability schedules for invigilators
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Select Invigilator</Label>
                          <Select>
                            <SelectTrigger data-invigilator-select>
                              <SelectValue placeholder="Choose invigilator" />
                            </SelectTrigger>
                            <SelectContent>
                              {invigilators.map(inv => (
                                <SelectItem key={inv.id} value={inv.id}>
                                  {inv.name} - {inv.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Date Range</Label>
                          <div className="flex gap-2">
                            <Input type="date" placeholder="From" data-date-from />
                            <Input type="date" placeholder="To" data-date-to />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Availability Status</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer bg-green-50">
                            <input type="radio" name="availability" value="available" />
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Available</span>
                          </label>
                          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer bg-red-50">
                            <input type="radio" name="availability" value="unavailable" />
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span>Unavailable</span>
                          </label>
                          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer bg-blue-50">
                            <input type="radio" name="availability" value="assigned" />
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>On Duty</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <Label>Bulk Update Options</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="weekdays" />
                            <Label htmlFor="weekdays" className="text-sm">Apply to weekdays only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="recurring" />
                            <Label htmlFor="recurring" className="text-sm">Set as recurring pattern</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="override" />
                            <Label htmlFor="override" className="text-sm">Override existing assignments</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea placeholder="Add any special notes or reasons for availability changes..." />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAvailabilityDialog(false)}>Cancel</Button>
                      <Button
                        onClick={() => {
                          // Get form values
                          const selectedInvigilatorSelect = document.querySelector('[data-invigilator-select]')?.closest('.relative')?.querySelector('button[role="combobox"]');
                          const selectedInvigilatorId = selectedInvigilatorSelect?.getAttribute('data-value');
                          const dateFrom = (document.querySelector('[data-date-from]') as HTMLInputElement)?.value;
                          const dateTo = (document.querySelector('[data-date-to]') as HTMLInputElement)?.value;
                          const availabilityStatus = document.querySelector('input[name="availability"]:checked') as HTMLInputElement;
                          const notes = (document.querySelector('textarea[placeholder*="availability changes"]') as HTMLTextAreaElement)?.value;

                          if (!selectedInvigilatorId) {
                            alert('Please select an invigilator');
                            return;
                          }

                          if (!dateFrom || !availabilityStatus) {
                            alert('Please fill in date and availability status');
                            return;
                          }

                          // Generate date range
                          const startDate = new Date(dateFrom);
                          const endDate = dateTo ? new Date(dateTo) : startDate;
                          const dates = [];

                          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                            dates.push(new Date(d).toISOString().split('T')[0]);
                          }

                          // Update the invigilator's availability for all dates in range
                          setInvigilators(invigilators.map(inv => {
                            if (inv.id === selectedInvigilatorId) {
                              const updatedAvailability = { ...inv.availability };
                              dates.forEach(date => {
                                updatedAvailability[date] = availabilityStatus.value as 'available' | 'unavailable' | 'assigned';
                              });
                              return {
                                ...inv,
                                availability: updatedAvailability
                              };
                            }
                            return inv;
                          }));

                          // Show success message
                          const invigilatorName = invigilators.find(i => i.id === selectedInvigilatorId)?.name;
                          const dateRange = dates.length === 1 ? dateFrom : `${dateFrom} to ${dateTo || dateFrom}`;
                          alert(`Availability updated successfully for ${invigilatorName} on ${dateRange}!`);

                          // Close dialog
                          setShowAvailabilityDialog(false);
                        }}
                      >
                        Update Availability
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {invigilators.slice(0, 5).map(invigilator => (
                  <div key={invigilator.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{invigilator.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {invigilator.department} - {invigilator.designation}
                        </p>
                      </div>
                      <Badge className={getStatusBadge(invigilator.status)}>
                        {invigilator.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const dayStr = format(date, 'EEE');
                        const availability = invigilator.availability[dateStr] || 'available';
                        
                        return (
                          <div key={i} className="text-center">
                            <div className="text-xs font-medium mb-1">{dayStr}</div>
                            <div className="text-xs mb-2">{format(date, 'dd')}</div>
                            <Badge 
                              className={`${getAvailabilityBadge(availability)} text-xs cursor-pointer`}
                              onClick={() => {
                                const newStatus = availability === 'available' ? 'unavailable' : 'available';
                                if (availability !== 'assigned') {
                                  updateAvailability(invigilator.id, dateStr, newStatus);
                                }
                              }}
                            >
                              {availability === 'available' ? 'Free' : 
                               availability === 'assigned' ? 'Duty' : 'N/A'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Invigilator Reports & Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive reports and analytics for invigilator management and performance tracking
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export All Reports
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export All Reports</DialogTitle>
                      <DialogDescription>
                        Export comprehensive invigilator reports in various formats
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="export-format">Export Format</Label>
                        <Select defaultValue="pdf">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Report</SelectItem>
                            <SelectItem value="excel">Excel Workbook</SelectItem>
                            <SelectItem value="csv">CSV Files (Zipped)</SelectItem>
                            <SelectItem value="json">JSON Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Reports to Include</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="duty-distribution" defaultChecked />
                            <Label htmlFor="duty-distribution" className="text-sm">Duty Distribution</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="performance" defaultChecked />
                            <Label htmlFor="performance" className="text-sm">Performance Report</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="attendance" defaultChecked />
                            <Label htmlFor="attendance" className="text-sm">Attendance Report</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="availability" defaultChecked />
                            <Label htmlFor="availability" className="text-sm">Availability Report</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="recognition" defaultChecked />
                            <Label htmlFor="recognition" className="text-sm">Recognition Report</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="issues-alerts" defaultChecked />
                            <Label htmlFor="issues-alerts" className="text-sm">Issues & Alerts</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="date-range">Date Range</Label>
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
                        <Button onClick={handleExportAllReports}>
                          <Download className="h-4 w-4 mr-2" />
                          Export All Reports
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Report Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Settings</DialogTitle>
                      <DialogDescription>
                        Configure default settings for invigilator reports
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Default Export Format</Label>
                        <Select defaultValue="pdf">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Report Frequency</Label>
                        <Select defaultValue="monthly">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Auto-generated Reports</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-duty" className="text-sm">Duty distribution reports</Label>
                            <Switch id="auto-duty" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-performance" className="text-sm">Performance summary</Label>
                            <Switch id="auto-performance" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-alerts" className="text-sm">Issue alerts</Label>
                            <Switch id="auto-alerts" defaultChecked />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email-recipients">Email Recipients</Label>
                        <Textarea
                          placeholder="Enter email addresses separated by commas"
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleReportSettings}>
                          <Settings className="h-4 w-4 mr-2" />
                          Save Settings
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Duty Distribution Report</h3>
                        <p className="text-sm text-muted-foreground">Workload analysis across departments</p>
                        <div className="mt-2 text-xs text-blue-600">
                          {invigilators.length} invigilators • {duties.length} duties assigned
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Duty Distribution Report</DialogTitle>
                  <DialogDescription>
                    Analysis of duty distribution across invigilators and departments
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {invigilators.reduce((sum, inv) => sum + inv.currentMonthDuties, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Duties This Month</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {(invigilators.reduce((sum, inv) => sum + inv.currentMonthDuties, 0) / invigilators.length).toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">Average per Invigilator</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.max(...invigilators.map(inv => inv.currentMonthDuties))}
                        </div>
                        <div className="text-sm text-muted-foreground">Highest Workload</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invigilator</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>This Month</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Load Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invigilators.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell>{inv.name}</TableCell>
                          <TableCell>{inv.department}</TableCell>
                          <TableCell>{inv.currentMonthDuties}</TableCell>
                          <TableCell>{inv.totalDuties}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div
                                  className={`h-full rounded-full ${
                                    inv.currentMonthDuties > 8 ? 'bg-red-500' :
                                    inv.currentMonthDuties > 5 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (inv.currentMonthDuties / 10) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs">
                                {inv.currentMonthDuties > 8 ? 'High' :
                                 inv.currentMonthDuties > 5 ? 'Medium' : 'Low'}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Star className="h-8 w-8 text-yellow-600" />
                      <div>
                        <h3 className="font-medium">Performance Report</h3>
                        <p className="text-sm text-muted-foreground">Rating analysis & insights</p>
                        <div className="mt-2 text-xs text-yellow-600">
                          Avg Rating: {(invigilators.reduce((sum, i) => sum + i.ratings.overall, 0) / invigilators.length).toFixed(1)}/5.0
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Performance Analysis Report</DialogTitle>
                  <DialogDescription>
                    Comprehensive performance metrics and rating analysis
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {(invigilators.reduce((sum, i) => sum + i.ratings.overall, 0) / invigilators.length).toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">Overall Average</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {(invigilators.reduce((sum, i) => sum + i.ratings.punctuality, 0) / invigilators.length).toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">Punctuality</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {(invigilators.reduce((sum, i) => sum + i.ratings.performance, 0) / invigilators.length).toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">Performance</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {(invigilators.reduce((sum, i) => sum + i.ratings.studentHandling, 0) / invigilators.length).toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">Student Handling</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invigilator</TableHead>
                        <TableHead>Overall Rating</TableHead>
                        <TableHead>Punctuality</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Student Handling</TableHead>
                        <TableHead>Performance Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invigilators.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell>{inv.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {renderRatingStars(inv.ratings.overall)}
                              <span className="text-sm">{inv.ratings.overall.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{inv.ratings.punctuality.toFixed(1)}</TableCell>
                          <TableCell>{inv.ratings.performance.toFixed(1)}</TableCell>
                          <TableCell>{inv.ratings.studentHandling.toFixed(1)}</TableCell>
                          <TableCell>
                            <Badge className={
                              inv.ratings.overall >= 4.5 ? 'bg-green-100 text-green-800' :
                              inv.ratings.overall >= 4.0 ? 'bg-blue-100 text-blue-800' :
                              inv.ratings.overall >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {inv.ratings.overall >= 4.5 ? 'Excellent' :
                               inv.ratings.overall >= 4.0 ? 'Good' :
                               inv.ratings.overall >= 3.5 ? 'Average' : 'Needs Improvement'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-medium">Attendance Report</h3>
                        <p className="text-sm text-muted-foreground">Duty attendance tracking</p>
                        <div className="mt-2 text-xs text-green-600">
                          97.2% attendance rate
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Attendance Analysis Report</DialogTitle>
                  <DialogDescription>
                    Detailed attendance tracking and punctuality analysis
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">97.2%</div>
                        <div className="text-sm text-muted-foreground">Overall Attendance</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">95.8%</div>
                        <div className="text-sm text-muted-foreground">On-Time Arrival</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">3</div>
                        <div className="text-sm text-muted-foreground">Late Arrivals</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">1</div>
                        <div className="text-sm text-muted-foreground">Absences</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invigilator</TableHead>
                        <TableHead>Duties Assigned</TableHead>
                        <TableHead>Duties Attended</TableHead>
                        <TableHead>Attendance Rate</TableHead>
                        <TableHead>Punctuality</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invigilators.map(inv => {
                        const attendanceRate = Math.random() * 10 + 90; // Mock data
                        const punctualityRate = Math.random() * 10 + 85; // Mock data
                        return (
                          <TableRow key={inv.id}>
                            <TableCell>{inv.name}</TableCell>
                            <TableCell>{inv.currentMonthDuties}</TableCell>
                            <TableCell>{Math.floor(inv.currentMonthDuties * (attendanceRate / 100))}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${attendanceRate}%` }}
                                  />
                                </div>
                                <span className="text-sm">{attendanceRate.toFixed(1)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{punctualityRate.toFixed(1)}%</TableCell>
                            <TableCell>
                              <Badge className={
                                attendanceRate >= 95 ? 'bg-green-100 text-green-800' :
                                attendanceRate >= 90 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {attendanceRate >= 95 ? 'Excellent' :
                                 attendanceRate >= 90 ? 'Good' : 'Needs Attention'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <CalendarIcon className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="font-medium">Availability Trends</h3>
                        <p className="text-sm text-muted-foreground">Monthly patterns analysis</p>
                        <div className="mt-2 text-xs text-purple-600">
                          78% average availability
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Availability Trends Report</DialogTitle>
                  <DialogDescription>
                    Analysis of invigilator availability patterns and trends
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">78%</div>
                        <div className="text-sm text-muted-foreground">Avg. Availability</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">Mon-Wed</div>
                        <div className="text-sm text-muted-foreground">Peak Availability</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">9-11 AM</div>
                        <div className="text-sm text-muted-foreground">Best Time Slots</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Weekly Availability Pattern</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                        const availability = [85, 82, 80, 75, 72, 45, 30][index];
                        return (
                          <div key={day} className="text-center">
                            <div className="text-sm font-medium mb-2">{day}</div>
                            <div className="h-20 bg-gray-200 rounded flex items-end">
                              <div
                                className="w-full bg-purple-500 rounded"
                                style={{ height: `${availability}%` }}
                              />
                            </div>
                            <div className="text-xs mt-1">{availability}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Award className="h-8 w-8 text-orange-600" />
                      <div>
                        <h3 className="font-medium">Recognition Report</h3>
                        <p className="text-sm text-muted-foreground">Top performers showcase</p>
                        <div className="mt-2 text-xs text-orange-600">
                          3 outstanding performers
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Recognition & Awards Report</DialogTitle>
                  <DialogDescription>
                    Outstanding performers and recognition tracking
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-gold-600">3</div>
                        <div className="text-sm text-muted-foreground">Top Performers</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-silver-600">5</div>
                        <div className="text-sm text-muted-foreground">Good Performers</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-bronze-600">2</div>
                        <div className="text-sm text-muted-foreground">Improved</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Top Performers This Month</h4>
                    <div className="space-y-3">
                      {invigilators
                        .sort((a, b) => b.ratings.overall - a.ratings.overall)
                        .slice(0, 3)
                        .map((inv, index) => (
                        <Card key={inv.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                  index === 0 ? 'bg-yellow-500' :
                                  index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <h5 className="font-medium">{inv.name}</h5>
                                  <p className="text-sm text-muted-foreground">{inv.department}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  {renderRatingStars(inv.ratings.overall)}
                                  <span className="font-medium">{inv.ratings.overall.toFixed(1)}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {inv.currentMonthDuties} duties completed
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <h3 className="font-medium">Issues & Alerts</h3>
                        <p className="text-sm text-muted-foreground">Problem tracking system</p>
                        <div className="mt-2 text-xs text-red-600">
                          2 active alerts
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Issues & Alerts Report</DialogTitle>
                  <DialogDescription>
                    Active issues, alerts, and problem tracking dashboard
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">2</div>
                        <div className="text-sm text-muted-foreground">Critical Issues</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">5</div>
                        <div className="text-sm text-muted-foreground">Warnings</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-muted-foreground">Resolved</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">95%</div>
                        <div className="text-sm text-muted-foreground">Resolution Rate</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Active Issues</h4>
                    <div className="space-y-3">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span className="font-medium">High Absence Rate</span>
                                <Badge className="bg-red-100 text-red-800">Critical</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Dr. Emily Davis has missed 3 consecutive duties this month
                              </p>
                              <div className="text-xs text-muted-foreground mt-1">
                                Created: 2 days ago | Priority: High
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (window.confirm('Mark this issue as resolved? This action cannot be undone.')) {
                                  alert('Issue "High Absence Rate" has been resolved successfully!');
                                  // In a real app, this would update the issue status in the database
                                }
                              }}
                            >
                              Resolve
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <span className="font-medium">Overload Warning</span>
                                <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Prof. Michael Brown approaching maximum duty hours limit
                              </p>
                              <div className="text-xs text-muted-foreground mt-1">
                                Created: 1 day ago | Priority: Medium
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const action = window.prompt('Enter review action:\n1. Approve\n2. Escalate\n3. Assign to another\n4. Request more info\n\nEnter action:');
                                if (action) {
                                  alert(`Issue "Overload Warning" marked for review with action: ${action}`);
                                  // In a real app, this would update the issue status and add review notes
                                }
                              }}
                            >
                              Review
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Report Insights</CardTitle>
              <CardDescription>
                Key performance indicators and actionable insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Key Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Active Invigilators</span>
                      <span className="font-medium">{invigilators.filter(i => i.status === 'Active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Performance Rating</span>
                      <span className="font-medium">{(invigilators.reduce((sum, i) => sum + i.ratings.overall, 0) / invigilators.length).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Duty Completion Rate</span>
                      <span className="font-medium">97.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Duties per Invigilator</span>
                      <span className="font-medium">{(invigilators.reduce((sum, i) => sum + i.currentMonthDuties, 0) / invigilators.length).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Action Items</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Review workload distribution for balanced assignment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Recognize top performers with appreciation certificates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Schedule training session for new invigilators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>Increase backup invigilator pool for peak exam periods</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Invigilator Results & Performance Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive results tracking, evaluation metrics, and performance outcomes for invigilators
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Export Invigilator Results</DialogTitle>
                      <DialogDescription>
                        Export comprehensive invigilator performance results and evaluations
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Export Format</Label>
                          <Select defaultValue="excel">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                              <SelectItem value="csv">CSV (.csv)</SelectItem>
                              <SelectItem value="pdf">PDF Report</SelectItem>
                              <SelectItem value="json">JSON Data</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Date Range</Label>
                          <Select defaultValue="current-semester">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="current-month">Current Month</SelectItem>
                              <SelectItem value="current-semester">Current Semester</SelectItem>
                              <SelectItem value="current-year">Academic Year</SelectItem>
                              <SelectItem value="all-time">All Time</SelectItem>
                              <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Include Data Categories</Label>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="performance-scores" defaultChecked />
                              <Label htmlFor="performance-scores" className="text-sm">Performance Scores</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="attendance-records" defaultChecked />
                              <Label htmlFor="attendance-records" className="text-sm">Attendance Records</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="duty-assignments" defaultChecked />
                              <Label htmlFor="duty-assignments" className="text-sm">Duty Assignments</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="evaluation-ratings" defaultChecked />
                              <Label htmlFor="evaluation-ratings" className="text-sm">Evaluation Ratings</Label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="student-feedback" />
                              <Label htmlFor="student-feedback" className="text-sm">Student Feedback</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="training-records" />
                              <Label htmlFor="training-records" className="text-sm">Training Records</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="achievements" />
                              <Label htmlFor="achievements" className="text-sm">Achievements & Awards</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="analytics-summary" />
                              <Label htmlFor="analytics-summary" className="text-sm">Analytics Summary</Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Filter Options</Label>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <Label htmlFor="department-filter" className="text-sm">Department</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="All Departments" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="computer-science">Computer Science</SelectItem>
                                <SelectItem value="mathematics">Mathematics</SelectItem>
                                <SelectItem value="physics">Physics</SelectItem>
                                <SelectItem value="chemistry">Chemistry</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="performance-filter" className="text-sm">Minimum Rating</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="All Ratings" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Ratings</SelectItem>
                                <SelectItem value="4.5">4.5+ (Excellent)</SelectItem>
                                <SelectItem value="4.0">4.0+ (Good)</SelectItem>
                                <SelectItem value="3.5">3.5+ (Average)</SelectItem>
                                <SelectItem value="below-3.5">Below 3.5 (Needs Improvement)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Export Summary</h4>
                        <div className="text-sm text-blue-800 space-y-1">
                          <div>• {invigilators.length} invigilators will be included</div>
                          <div>��� Performance data from current semester</div>
                          <div>• All evaluation categories selected</div>
                          <div>• File will be generated in Excel format</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Export
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Evaluations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Import Evaluation Data</DialogTitle>
                      <DialogDescription>
                        Import invigilator evaluation data from external sources or bulk uploads
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <Label>Import Method</Label>
                        <div className="grid grid-cols-1 gap-3 mt-3">
                          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Upload className="h-8 w-8 text-blue-600" />
                                <div>
                                  <h4 className="font-medium">File Upload</h4>
                                  <p className="text-sm text-muted-foreground">Upload CSV, Excel, or JSON files containing evaluation data</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Copy className="h-8 w-8 text-green-600" />
                                <div>
                                  <h4 className="font-medium">Copy & Paste</h4>
                                  <p className="text-sm text-muted-foreground">Paste evaluation data directly from spreadsheets</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Settings className="h-8 w-8 text-purple-600" />
                                <div>
                                  <h4 className="font-medium">API Integration</h4>
                                  <p className="text-sm text-muted-foreground">Connect with external evaluation systems</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="file-upload">File Upload</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-2">
                            Drag and drop your file here, or click to browse
                          </p>
                          <p className="text-xs text-gray-500">
                            Supported formats: CSV, XLSX, JSON (Max 10MB)
                          </p>
                          <Button variant="outline" className="mt-3">
                            Choose File
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Data Mapping</Label>
                        <div className="mt-3 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm">Invigilator ID Column</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="employee_id">Employee ID</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">Rating Column</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="overall_rating">Overall Rating</SelectItem>
                                  <SelectItem value="performance">Performance</SelectItem>
                                  <SelectItem value="score">Score</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-medium text-amber-900 mb-2">Import Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="overwrite-existing" />
                            <Label htmlFor="overwrite-existing" className="text-sm text-amber-800">Overwrite existing evaluations</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="validate-data" defaultChecked />
                            <Label htmlFor="validate-data" className="text-sm text-amber-800">Validate data before import</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="backup-current" defaultChecked />
                            <Label htmlFor="backup-current" className="text-sm text-amber-800">Create backup of current data</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Evaluation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Invigilator Evaluation</DialogTitle>
                      <DialogDescription>
                        Create a comprehensive evaluation for an invigilator's performance
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="select-invigilator">Select Invigilator</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose invigilator to evaluate" />
                            </SelectTrigger>
                            <SelectContent>
                              {invigilators.map(inv => (
                                <SelectItem key={inv.id} value={inv.id}>
                                  {inv.name} - {inv.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="evaluation-period">Evaluation Period</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="current-month">Current Month</SelectItem>
                              <SelectItem value="current-semester">Current Semester</SelectItem>
                              <SelectItem value="academic-year">Academic Year</SelectItem>
                              <SelectItem value="custom">Custom Period</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Performance Evaluation</Label>
                        <div className="grid grid-cols-1 gap-4 mt-3">
                          {[
                            { label: 'Punctuality', key: 'punctuality', description: 'Arrives on time and maintains schedule' },
                            { label: 'Performance', key: 'performance', description: 'Overall job performance and effectiveness' },
                            { label: 'Student Handling', key: 'studentHandling', description: 'Interaction and management of students' },
                            { label: 'Professional Conduct', key: 'conduct', description: 'Maintains professional behavior and ethics' },
                            { label: 'Communication', key: 'communication', description: 'Effective communication skills' },
                            { label: 'Problem Solving', key: 'problemSolving', description: 'Ability to handle unexpected situations' }
                          ].map((metric) => (
                            <Card key={metric.key}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium">{metric.label}</h4>
                                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <Button
                                        key={star}
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-auto"
                                      >
                                        <Star className="h-5 w-5 text-gray-300 hover:text-yellow-400" />
                                      </Button>
                                    ))}
                                  </div>
                                  <Select defaultValue="4">
                                    <SelectTrigger className="w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="2">2</SelectItem>
                                      <SelectItem value="3">3</SelectItem>
                                      <SelectItem value="4">4</SelectItem>
                                      <SelectItem value="5">5</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="strengths">Strengths & Achievements</Label>
                        <Textarea
                          id="strengths"
                          placeholder="Highlight the invigilator's key strengths and notable achievements during this evaluation period..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="improvement-areas">Areas for Improvement</Label>
                        <Textarea
                          id="improvement-areas"
                          placeholder="Identify specific areas where the invigilator can improve and grow professionally..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="goals">Development Goals</Label>
                        <Textarea
                          id="goals"
                          placeholder="Set clear, achievable goals for the next evaluation period..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Additional Information</Label>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <Label htmlFor="total-duties" className="text-sm">Total Duties Completed</Label>
                            <Input id="total-duties" type="number" placeholder="Enter number" />
                          </div>
                          <div>
                            <Label htmlFor="training-hours" className="text-sm">Training Hours Completed</Label>
                            <Input id="training-hours" type="number" placeholder="Enter hours" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Evaluation Summary</h4>
                        <div className="text-sm text-green-800">
                          <div>Overall Rating: <span className="font-medium">4.2/5.0</span></div>
                          <div>Performance Level: <span className="font-medium">Good</span></div>
                          <div>Recommendation: <span className="font-medium">Continued Excellence</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Save as Draft</Button>
                      <Button>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Evaluation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {(invigilators.reduce((sum, i) => sum + i.ratings.overall, 0) / invigilators.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Average rating (out of 5.0)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Excellence Rate</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((invigilators.filter(i => i.ratings.overall >= 4.5).length / invigilators.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Rated 4.5+ stars</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Improvement Needed</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {invigilators.filter(i => i.ratings.overall < 3.5).length}
                </div>
                <p className="text-xs text-muted-foreground">Below 3.5 rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Evaluation Complete</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((invigilators.filter(i => i.totalDuties > 0).length / invigilators.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Evaluated invigilators</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Star className="h-8 w-8 text-yellow-600" />
                      <div>
                        <h3 className="font-medium">Performance Evaluation Results</h3>
                        <p className="text-sm text-muted-foreground">Detailed evaluation metrics</p>
                        <div className="mt-2 text-xs text-yellow-600">
                          Latest evaluation: 2 days ago
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Performance Evaluation Results</DialogTitle>
                  <DialogDescription>
                    Comprehensive evaluation results and performance metrics for all invigilators
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-green-600">
                          {invigilators.filter(i => i.ratings.overall >= 4.5).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Excellent (4.5+)</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {invigilators.filter(i => i.ratings.overall >= 4.0 && i.ratings.overall < 4.5).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Good (4.0-4.4)</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-yellow-600">
                          {invigilators.filter(i => i.ratings.overall >= 3.5 && i.ratings.overall < 4.0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Average (3.5-3.9)</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-red-600">
                          {invigilators.filter(i => i.ratings.overall < 3.5).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Needs Improvement</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invigilator</TableHead>
                        <TableHead>Overall Score</TableHead>
                        <TableHead>Punctuality</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Student Handling</TableHead>
                        <TableHead>Improvement Areas</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invigilators.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{inv.name}</div>
                              <div className="text-sm text-muted-foreground">{inv.department}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {renderRatingStars(inv.ratings.overall)}
                              <span className="font-medium">{inv.ratings.overall.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                inv.ratings.punctuality >= 4.5 ? 'bg-green-500' :
                                inv.ratings.punctuality >= 4.0 ? 'bg-blue-500' :
                                inv.ratings.punctuality >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span>{inv.ratings.punctuality.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                inv.ratings.performance >= 4.5 ? 'bg-green-500' :
                                inv.ratings.performance >= 4.0 ? 'bg-blue-500' :
                                inv.ratings.performance >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span>{inv.ratings.performance.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                inv.ratings.studentHandling >= 4.5 ? 'bg-green-500' :
                                inv.ratings.studentHandling >= 4.0 ? 'bg-blue-500' :
                                inv.ratings.studentHandling >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span>{inv.ratings.studentHandling.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              {inv.ratings.punctuality < 4.0 && <Badge variant="outline" className="mr-1">Punctuality</Badge>}
                              {inv.ratings.performance < 4.0 && <Badge variant="outline" className="mr-1">Performance</Badge>}
                              {inv.ratings.studentHandling < 4.0 && <Badge variant="outline" className="mr-1">Student Handling</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Evaluations
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Award className="h-8 w-8 text-orange-600" />
                      <div>
                        <h3 className="font-medium">Achievement & Certifications</h3>
                        <p className="text-sm text-muted-foreground">Awards and recognitions</p>
                        <div className="mt-2 text-xs text-orange-600">
                          12 awards this semester
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Achievement & Certifications</DialogTitle>
                  <DialogDescription>
                    Awards, certifications, and recognition achievements
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Award className="h-8 w-8 text-gold-600 mx-auto mb-2" />
                        <div className="text-xl font-bold">3</div>
                        <div className="text-sm text-muted-foreground">Excellence Awards</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-xl font-bold">8</div>
                        <div className="text-sm text-muted-foreground">Performance Recognitions</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-xl font-bold">15</div>
                        <div className="text-sm text-muted-foreground">Certifications Completed</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Recent Achievements</h4>
                    <div className="space-y-3">
                      {invigilators.slice(0, 5).map((inv, index) => (
                        <Card key={inv.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  inv.ratings.overall >= 4.5 ? 'bg-gold-100' :
                                  inv.ratings.overall >= 4.0 ? 'bg-silver-100' : 'bg-bronze-100'
                                }`}>
                                  <Award className={`h-5 w-5 ${
                                    inv.ratings.overall >= 4.5 ? 'text-gold-600' :
                                    inv.ratings.overall >= 4.0 ? 'text-silver-600' : 'text-bronze-600'
                                  }`} />
                                </div>
                                <div>
                                  <h5 className="font-medium">{inv.name}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {inv.ratings.overall >= 4.5 ? 'Excellence in Invigilation Award' :
                                     inv.ratings.overall >= 4.0 ? 'Outstanding Performance Recognition' :
                                     'Professional Development Certificate'}
                                  </p>
                                  <div className="text-xs text-muted-foreground">
                                    Awarded: {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={
                                  inv.ratings.overall >= 4.5 ? 'bg-gold-100 text-gold-800' :
                                  inv.ratings.overall >= 4.0 ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }>
                                  {inv.ratings.overall >= 4.5 ? 'Gold' :
                                   inv.ratings.overall >= 4.0 ? 'Silver' : 'Bronze'}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Certificates
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="font-medium">Training & Development Results</h3>
                        <p className="text-sm text-muted-foreground">Skill improvement tracking</p>
                        <div className="mt-2 text-xs text-purple-600">
                          95% completion rate
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Training & Development Results</DialogTitle>
                  <DialogDescription>
                    Training program completion and skill development tracking
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-green-600">95%</div>
                        <div className="text-sm text-muted-foreground">Completion Rate</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-blue-600">24</div>
                        <div className="text-sm text-muted-foreground">Training Hours</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-muted-foreground">Modules Completed</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-orange-600">4.2</div>
                        <div className="text-sm text-muted-foreground">Avg. Score</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Training Progress by Invigilator</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Modules Completed</TableHead>
                          <TableHead>Training Hours</TableHead>
                          <TableHead>Average Score</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invigilators.map(inv => {
                          const progress = Math.floor(Math.random() * 30) + 70; // Mock progress
                          const score = (Math.random() * 1.5 + 3.5).toFixed(1); // Mock score
                          return (
                            <TableRow key={inv.id}>
                              <TableCell>{inv.name}</TableCell>
                              <TableCell>{Math.floor(progress / 12.5)}/8</TableCell>
                              <TableCell>{Math.floor(progress / 4)}</TableCell>
                              <TableCell>{score}/5.0</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className="h-full bg-purple-500 rounded-full"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">{progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  progress >= 90 ? 'bg-green-100 text-green-800' :
                                  progress >= 70 ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {progress >= 90 ? 'Completed' :
                                   progress >= 70 ? 'In Progress' : 'Pending'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Training Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-medium">Student Feedback Results</h3>
                        <p className="text-sm text-muted-foreground">Student evaluation scores</p>
                        <div className="mt-2 text-xs text-green-600">
                          4.3/5.0 average rating
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Student Feedback Results</DialogTitle>
                  <DialogDescription>
                    Comprehensive student feedback and evaluation results
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-green-600">4.3</div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-blue-600">89%</div>
                        <div className="text-sm text-muted-foreground">Positive Feedback</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-purple-600">247</div>
                        <div className="text-sm text-muted-foreground">Total Responses</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-orange-600">92%</div>
                        <div className="text-sm text-muted-foreground">Response Rate</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Student Feedback Summary</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invigilator</TableHead>
                          <TableHead>Student Rating</TableHead>
                          <TableHead>Responses</TableHead>
                          <TableHead>Positive %</TableHead>
                          <TableHead>Key Strengths</TableHead>
                          <TableHead>Improvement Areas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invigilators.map(inv => {
                          const studentRating = (Math.random() * 1.5 + 3.5).toFixed(1);
                          const positiveRate = Math.floor(Math.random() * 20) + 80;
                          const responses = Math.floor(Math.random() * 30) + 15;
                          return (
                            <TableRow key={inv.id}>
                              <TableCell>{inv.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {renderRatingStars(parseFloat(studentRating))}
                                  <span>{studentRating}</span>
                                </div>
                              </TableCell>
                              <TableCell>{responses}</TableCell>
                              <TableCell>{positiveRate}%</TableCell>
                              <TableCell>
                                <div className="text-xs">
                                  <Badge variant="outline" className="mr-1">Helpful</Badge>
                                  <Badge variant="outline">Professional</Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-xs">
                                  {positiveRate < 85 && <Badge variant="outline">Communication</Badge>}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Feedback Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <TrendingUp className="h-8 w-8 text-indigo-600" />
                      <div>
                        <h3 className="font-medium">Performance Trends</h3>
                        <p className="text-sm text-muted-foreground">Historical performance data</p>
                        <div className="mt-2 text-xs text-indigo-600">
                          +12% improvement this quarter
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Performance Trends Analysis</DialogTitle>
                  <DialogDescription>
                    Historical performance data and trend analysis
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-green-600">+12%</div>
                        <div className="text-sm text-muted-foreground">Quarterly Growth</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-blue-600">4.2→4.7</div>
                        <div className="text-sm text-muted-foreground">Rating Improvement</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-purple-600">85%</div>
                        <div className="text-sm text-muted-foreground">Consistency Rate</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-orange-600">3</div>
                        <div className="text-sm text-muted-foreground">Top Performers</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Monthly Performance Trends</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                        const performance = [85, 87, 89, 91, 93, 95][index];
                        return (
                          <div key={month} className="text-center">
                            <div className="text-sm font-medium mb-2">{month}</div>
                            <div className="h-20 bg-gray-200 rounded flex items-end">
                              <div
                                className="w-full bg-indigo-500 rounded"
                                style={{ height: `${performance}%` }}
                              />
                            </div>
                            <div className="text-xs mt-1">{performance}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Trends Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Target className="h-8 w-8 text-red-600" />
                      <div>
                        <h3 className="font-medium">Goal Achievement Results</h3>
                        <p className="text-sm text-muted-foreground">Target vs actual performance</p>
                        <div className="mt-2 text-xs text-red-600">
                          87% goals achieved
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Goal Achievement Results</DialogTitle>
                  <DialogDescription>
                    Target performance vs actual achievement analysis
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-green-600">87%</div>
                        <div className="text-sm text-muted-foreground">Goals Achieved</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-blue-600">24</div>
                        <div className="text-sm text-muted-foreground">Total Goals</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-orange-600">21</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-red-600">3</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Individual Goal Achievement</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invigilator</TableHead>
                          <TableHead>Goals Set</TableHead>
                          <TableHead>Achieved</TableHead>
                          <TableHead>Achievement Rate</TableHead>
                          <TableHead>Current Focus</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invigilators.map(inv => {
                          const goalsSet = Math.floor(Math.random() * 3) + 3;
                          const achieved = Math.floor(goalsSet * (Math.random() * 0.4 + 0.6));
                          const rate = Math.round((achieved / goalsSet) * 100);
                          return (
                            <TableRow key={inv.id}>
                              <TableCell>{inv.name}</TableCell>
                              <TableCell>{goalsSet}</TableCell>
                              <TableCell>{achieved}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className={`h-full rounded-full ${
                                        rate >= 80 ? 'bg-green-500' :
                                        rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${rate}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">{rate}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {rate >= 80 ? 'Excellence' :
                                   rate >= 60 ? 'Improvement' : 'Basic Skills'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  rate >= 80 ? 'bg-green-100 text-green-800' :
                                  rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {rate >= 80 ? 'On Track' :
                                   rate >= 60 ? 'Progressing' : 'Needs Support'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Goals Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Comprehensive Reports Section */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Reporting & Analytics Dashboard</CardTitle>
              <CardDescription>
                Comprehensive reporting tools and data analytics for invigilator performance management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Report Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-medium">Performance Analytics</h4>
                          <p className="text-xs text-muted-foreground mt-1">Detailed performance metrics and trends</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Performance Analytics Report</DialogTitle>
                        <DialogDescription>
                          Comprehensive performance analysis with detailed metrics and comparative insights
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-blue-600">4.6</div>
                              <div className="text-sm text-muted-foreground">Avg Overall Rating</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-green-600">89%</div>
                              <div className="text-sm text-muted-foreground">Excellence Rate</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-orange-600">+12%</div>
                              <div className="text-sm text-muted-foreground">Growth Rate</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-purple-600">97%</div>
                              <div className="text-sm text-muted-foreground">Retention Rate</div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Department-wise Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {['Computer Science', 'Mathematics', 'Physics', 'Chemistry'].map((dept, index) => {
                                  const score = [4.8, 4.5, 4.3, 4.1][index];
                                  return (
                                    <div key={dept} className="flex justify-between items-center">
                                      <span className="text-sm">{dept}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                                          <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${(score / 5) * 100}%` }}
                                          />
                                        </div>
                                        <span className="text-sm font-medium">{score}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Performance Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {[
                                  { label: 'Excellent (4.5+)', count: 8, color: 'bg-green-500' },
                                  { label: 'Good (4.0-4.4)', count: 12, color: 'bg-blue-500' },
                                  { label: 'Average (3.5-3.9)', count: 5, color: 'bg-yellow-500' },
                                  { label: 'Needs Improvement (<3.5)', count: 2, color: 'bg-red-500' }
                                ].map((item) => (
                                  <div key={item.label} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                      <span className="text-sm">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-medium">{item.count}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-medium">Goal Tracking</h4>
                          <p className="text-xs text-muted-foreground mt-1">Individual and team goal progress</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Goal Tracking & Achievement Report</DialogTitle>
                        <DialogDescription>
                          Monitor individual and departmental goal progress with achievement analytics
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-green-600">87%</div>
                              <div className="text-sm text-muted-foreground">Goals Achieved</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-blue-600">45</div>
                              <div className="text-sm text-muted-foreground">Active Goals</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-orange-600">8</div>
                              <div className="text-sm text-muted-foreground">Overdue</div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h4 className="font-medium mb-4">Individual Goal Progress</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Invigilator</TableHead>
                                <TableHead>Active Goals</TableHead>
                                <TableHead>Completed</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Target Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {invigilators.slice(0, 5).map(inv => {
                                const progress = Math.floor(Math.random() * 40) + 60;
                                return (
                                  <TableRow key={inv.id}>
                                    <TableCell>{inv.name}</TableCell>
                                    <TableCell>3</TableCell>
                                    <TableCell>2</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                                          <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${progress}%` }}
                                          />
                                        </div>
                                        <span className="text-sm">{progress}%</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>Dec 31, 2024</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <h4 className="font-medium">Trend Analysis</h4>
                          <p className="text-xs text-muted-foreground mt-1">Historical performance trends</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl">
                      <DialogHeader>
                        <DialogTitle>Performance Trend Analysis</DialogTitle>
                        <DialogDescription>
                          Historical performance data and predictive analytics for future planning
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-green-600">+15%</div>
                              <div className="text-sm text-muted-foreground">YoY Growth</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-blue-600">94%</div>
                              <div className="text-sm text-muted-foreground">Consistency</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-purple-600">4.2→4.8</div>
                              <div className="text-sm text-muted-foreground">Rating Improvement</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-orange-600">85%</div>
                              <div className="text-sm text-muted-foreground">Predictability</div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h4 className="font-medium mb-4">Monthly Performance Trend</h4>
                          <div className="grid grid-cols-6 gap-2">
                            {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                              const performance = [82, 85, 88, 91, 94, 96][index];
                              return (
                                <div key={month} className="text-center">
                                  <div className="text-sm font-medium mb-2">{month}</div>
                                  <div className="h-20 bg-gray-200 rounded flex items-end">
                                    <div
                                      className="w-full bg-purple-500 rounded"
                                      style={{ height: `${performance}%` }}
                                    />
                                  </div>
                                  <div className="text-xs mt-1">{performance}%</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                          <h4 className="font-medium">Recognition Report</h4>
                          <p className="text-xs text-muted-foreground mt-1">Awards and achievements tracking</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Recognition & Achievement Report</DialogTitle>
                        <DialogDescription>
                          Track awards, recognitions, and milestone achievements across the organization
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-yellow-600">24</div>
                              <div className="text-sm text-muted-foreground">Awards Given</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-green-600">12</div>
                              <div className="text-sm text-muted-foreground">Top Performers</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-blue-600">8</div>
                              <div className="text-sm text-muted-foreground">Milestones</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-purple-600">96%</div>
                              <div className="text-sm text-muted-foreground">Recognition Rate</div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h4 className="font-medium mb-4">Recent Achievements</h4>
                          <div className="space-y-3">
                            {invigilators.slice(0, 6).map((inv, index) => (
                              <Card key={inv.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Award className="h-6 w-6 text-yellow-600" />
                                      <div>
                                        <h5 className="font-medium">{inv.name}</h5>
                                        <p className="text-sm text-muted-foreground">
                                          {index % 3 === 0 ? 'Excellence in Performance Award' :
                                           index % 3 === 1 ? 'Outstanding Service Recognition' :
                                           'Professional Development Achievement'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <Badge className="bg-yellow-100 text-yellow-800">
                                        {index % 3 === 0 ? 'Gold' : index % 3 === 1 ? 'Silver' : 'Bronze'}
                                      </Badge>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        Dec {25 - index}, 2024
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Summary Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Key Performance Indicators</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium">Overall Satisfaction</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">92%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium">Performance Excellence</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">4.6/5</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          <span className="text-sm font-medium">Improvement Rate</span>
                        </div>
                        <span className="text-lg font-bold text-purple-600">+15%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Action Recommendations</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Award className="h-4 w-4 text-orange-600 mt-0.5" />
                        <span>Recognize top 3 performers with excellence awards</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Provide additional training for invigilators scoring below 3.5</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Target className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Set new performance targets for next quarter</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Clock className="h-4 w-4 text-purple-600 mt-0.5" />
                        <span>Schedule quarterly performance review meetings</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <BarChart3 className="h-4 w-4 text-indigo-600 mt-0.5" />
                        <span>Implement data-driven decision making processes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export and Management Tools */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Reports generated: {new Date().toLocaleDateString()} • Last updated: {new Date().toLocaleTimeString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Reports
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Schedule Reports
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Duty Assignment Dialog */}
      {selectedDuty && (
        <Dialog open={!!selectedDuty} onOpenChange={() => setSelectedDuty(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Assign Invigilators - {selectedDuty.examName}</DialogTitle>
              <DialogDescription>
                Manage invigilator assignments for this examination duty
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Available Invigilators</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {invigilators
                    .filter(inv => 
                      inv.status === 'Active' && 
                      !selectedDuty.assignedInvigilators.includes(inv.id) &&
                      (inv.availability[selectedDuty.date] === 'available' || 
                       !inv.availability[selectedDuty.date])
                    )
                    .map(invigilator => (
                    <div key={invigilator.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{invigilator.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {invigilator.department} - {invigilator.currentMonthDuties} duties
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignInvigilator(selectedDuty.id, invigilator.id)}
                      >
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Assigned Invigilators</h4>
                <div className="space-y-2">
                  {selectedDuty.assignedInvigilators.map(invId => {
                    const invigilator = invigilators.find(i => i.id === invId);
                    if (!invigilator) return null;
                    
                    return (
                      <div key={invId} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {invigilator.name}
                            {selectedDuty.headInvigilator === invId && (
                              <Badge variant="outline" className="text-xs">Head</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {invigilator.department}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveInvigilator(selectedDuty.id, invId)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-muted rounded">
                  <div className="text-sm">
                    <strong>Required:</strong> {selectedDuty.requiredInvigilators} | 
                    <strong> Assigned:</strong> {selectedDuty.assignedInvigilators.length}
                  </div>
                  {selectedDuty.assignedInvigilators.length < selectedDuty.requiredInvigilators && (
                    <div className="text-xs text-red-600 mt-1">
                      Need {selectedDuty.requiredInvigilators - selectedDuty.assignedInvigilators.length} more invigilators
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Invigilator Details Dialog */}
      {selectedInvigilator && (
        <Dialog open={!!selectedInvigilator} onOpenChange={() => setSelectedInvigilator(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invigilator Profile - {selectedInvigilator.name}</DialogTitle>
              <DialogDescription>
                Complete profile and performance details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Employee ID:</span>
                      <span className="font-medium">{selectedInvigilator.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Department:</span>
                      <span className="font-medium">{selectedInvigilator.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Designation:</span>
                      <span className="font-medium">{selectedInvigilator.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-medium">{selectedInvigilator.experience} years</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Performance Ratings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Punctuality</span>
                      <div className="flex items-center gap-2">
                        {renderRatingStars(selectedInvigilator.ratings.punctuality)}
                        <span className="text-sm font-medium">
                          {selectedInvigilator.ratings.punctuality.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Performance</span>
                      <div className="flex items-center gap-2">
                        {renderRatingStars(selectedInvigilator.ratings.performance)}
                        <span className="text-sm font-medium">
                          {selectedInvigilator.ratings.performance.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Student Handling</span>
                      <div className="flex items-center gap-2">
                        {renderRatingStars(selectedInvigilator.ratings.studentHandling)}
                        <span className="text-sm font-medium">
                          {selectedInvigilator.ratings.studentHandling.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Qualifications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInvigilator.qualifications.map((qual, index) => (
                    <Badge key={index} variant="outline">{qual}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Preferences & Requirements</h4>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Max duty hours per day:</strong> {selectedInvigilator.preferences.maxDutyHours}
                  </div>
                  <div>
                    <strong>Preferred shifts:</strong> {selectedInvigilator.preferences.preferredShifts.join(', ') || 'None specified'}
                  </div>
                  {selectedInvigilator.preferences.specialRequirements && (
                    <div>
                      <strong>Special requirements:</strong> {selectedInvigilator.preferences.specialRequirements}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Duty Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{selectedInvigilator.totalDuties}</div>
                    <div className="text-sm text-muted-foreground">Total Duties</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{selectedInvigilator.currentMonthDuties}</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{selectedInvigilator.ratings.overall.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Overall Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
