import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import {
  BarChart3, Download, Filter, FileText, Calendar, Users, GraduationCap,
  Clock, TrendingUp, Award, BookOpen, UserCheck, AlertCircle, CheckCircle,
  Eye, Plus, Search, Settings, FileSpreadsheet, FileImage, Archive,
  Target, PieChart, LineChart, Activity, School, MapPin, Phone, Mail, Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'

// Mock user context with role-based permissions
const userProfiles = {
  Student: {
    role: 'Student',
    id: 1,
    name: 'Raj Kumar',
    studentId: 'STU2024001',
    department: 'Computer Science',
    program: 'B.Tech CSE',
    semester: 3,
    class: 'CSE-A',
    academicYear: '2023-24'
  },
  Admin: {
    role: 'Admin',
    id: 2,
    name: 'Dr. Manikandan S',
    department: 'Administration',
    academicYear: '2023-24'
  },
  Faculty: {
    role: 'Faculty',
    id: 3,
    name: 'Prof. Sunita Sharma',
    department: 'Computer Science',
    assignedClasses: ['CSE-A', 'CSE-B'],
    subjects: ['Data Structures', 'Algorithms'],
    academicYear: '2023-24'
  },
  Parent: {
    role: 'Parent',
    id: 4,
    name: 'Mrs. Priya',
    childId: 'STU2024001',
    childName: 'Raj Kumar',
    childClass: 'CSE-A',
    academicYear: '2023-24'
  }
};

// Role-based permissions matrix
const permissions = {
  Admin: {
    standardReports: true,
    dynamicReports: true,
    lessonPlanReport: true,
    timetableReport: true,
    absentReport: true,
    attendanceReport: true,
    studentDetailsReport: true,
    dropoutReport: true,
    scholarshipReport: true,
    createReports: true,
    viewAllData: true,
    downloadReports: true
  },
  Faculty: {
    standardReports: true,
    dynamicReports: false,
    lessonPlanReport: true, // Own class/subject only
    timetableReport: true, // Own timetable only
    absentReport: true, // Own class/subject only
    attendanceReport: true, // Own class/subject only
    studentDetailsReport: true, // Assigned students only
    dropoutReport: false,
    scholarshipReport: true, // If permitted
    createReports: false,
    viewAllData: false,
    downloadReports: true
  },
  Student: {
    standardReports: false,
    dynamicReports: false,
    lessonPlanReport: false,
    timetableReport: true, // Own timetable only
    absentReport: true, // Own record only
    attendanceReport: true, // Own percentage only
    studentDetailsReport: true, // Own profile only
    dropoutReport: false,
    scholarshipReport: true, // Own application status
    createReports: false,
    viewAllData: false,
    downloadReports: true
  },
  Parent: {
    standardReports: false,
    dynamicReports: false,
    lessonPlanReport: false,
    timetableReport: true, // Child's timetable only
    absentReport: true, // Child's record only
    attendanceReport: true, // Child's percentage only
    studentDetailsReport: true, // Child's profile only
    dropoutReport: false,
    scholarshipReport: true, // Child's status
    createReports: false,
    viewAllData: false,
    downloadReports: true
  }
};

// Mock data for reports
const mockReports = {
  lessonPlans: [
    { id: 1, subject: 'Data Structures', class: 'CSE-A', date: '2024-01-15', status: 'Completed', faculty: 'Prof. Sunita Sharma' },
    { id: 2, subject: 'Algorithms', class: 'CSE-B', date: '2024-01-16', status: 'Pending', faculty: 'Prof. Sunita Sharma' },
    { id: 3, subject: 'Database Systems', class: 'CSE-A', date: '2024-01-17', status: 'Completed', faculty: 'Dr. Manikandan' },
    {
      id: 4, subject: 'Data Structures', class: 'CSE-B', date: '2024-01-18', status: 'Completed', faculty: 'Ms. Meenakshi'
    },
    {
      id: 5, subject: 'Operating Systems', class: 'CSE-A', date: '2024-01-19', status: 'Pending', faculty: 'Mr. Dinesh Kumar'
    },
    {
      id: 6, subject: 'Computer Networks', class: 'CSE-C', date: '2024-01-19', status: 'Completed', faculty: 'Dr. Saravanan'
    },
    {
      id: 7, subject: 'Software Engineering', class: 'CSE-A', date: '2024-01-20', status: 'Completed', faculty: 'Ms. Divya Bharathi'
    },
    {
      id: 8, subject: 'Machine Learning', class: 'CSE-B', date: '2024-01-21', status: 'Pending', faculty: 'Mr. Aravind'
    },
    {
      id: 9, subject: 'Artificial Intelligence', class: 'CSE-C', date: '2024-01-21', status: 'Completed', faculty: 'Dr. Priya Dharshini'
    },
    {
      id: 10, subject: 'Database Systems', class: 'CSE-A', date: '2024-01-22', status: 'Completed', faculty: 'Dr. Manikandan'
    },
    {
      id: 11, subject: 'Web Technologies', class: 'CSE-B', date: '2024-01-22', status: 'Pending', faculty: 'Ms. Kavitha'
    },
    {
      id: 12, subject: 'Cloud Computing', class: 'CSE-C', date: '2024-01-23', status: 'Completed', faculty: 'Mr. Rajkumar'
    },
    {
      id: 13, subject: 'Cyber Security', class: 'CSE-A', date: '2024-01-24', status: 'Completed', faculty: 'Ms. Bhuvaneshwari'
    },
    {
      id: 14, subject: 'Big Data Analytics', class: 'CSE-B', date: '2024-01-24', status: 'Pending', faculty: 'Dr. Ramesh'
    },
    {
      id: 15, subject: 'Mobile App Development', class: 'CSE-C', date: '2024-01-25', status: 'Completed', faculty: 'Mr. Suresh'
    },
    {
      id: 16, subject: 'Software Testing', class: 'CSE-A', date: '2024-01-26', status: 'Completed', faculty: 'Ms. Swetha'
    },
    {
      id: 17, subject: 'Computer Graphics', class: 'CSE-B', date: '2024-01-26', status: 'Completed', faculty: 'Mr. Gokul'
    },
    {
      id: 18, subject: 'Compiler Design', class: 'CSE-C', date: '2024-01-27', status: 'Pending', faculty: 'Dr. Revathi'
    },
    {
      id: 19, subject: 'Design Patterns', class: 'CSE-A', date: '2024-01-27', status: 'Completed', faculty: 'Ms. Lavanya'
    },
    {
      id: 20, subject: 'Human Computer Interaction', class: 'CSE-B', date: '2024-01-28', status: 'Completed', faculty: 'Mr. Santhosh'
    },
    {
      id: 21, subject: 'Data Mining', class: 'CSE-C', date: '2024-01-28', status: 'Pending', faculty: 'Dr. Uma Devi'
    },
    {
      id: 22, subject: 'Natural Language Processing', class: 'CSE-A', date: '2024-01-29', status: 'Completed', faculty: 'Ms. Janani'
    },
    {
      id: 23, subject: 'Internet of Things', class: 'CSE-B', date: '2024-01-30', status: 'Completed', faculty: 'Mr. Vignesh'
    },
    {
      id: 24, subject: 'Ethical Hacking', class: 'CSE-C', date: '2024-01-30', status: 'Pending', faculty: 'Dr. Kavitha'
    },
    {
      id: 25, subject: 'Robotics', class: 'CSE-A', date: '2024-01-31', status: 'Completed', faculty: 'Mr. Mahesh'
    },
    {
      id: 26, subject: 'Blockchain Technology', class: 'CSE-B', date: '2024-01-31', status: 'Completed', faculty: 'Ms. Keerthana'
    },
    {
      id: 27, subject: 'Embedded Systems', class: 'CSE-C', date: '2024-02-01', status: 'Pending', faculty: 'Mr. Naveen Kumar'
    },
    {
      id: 28, subject: 'Virtual Reality', class: 'CSE-A', date: '2024-02-01', status: 'Completed', faculty: 'Dr. Deepika'
    }

  ],
  attendance: [
    { studentId: 'STU2024001', name: 'Raj Kumar', class: 'CSE-A', totalDays: 100, presentDays: 92, percentage: 92 },
    { studentId: 'STU2024002', name: 'Priya', class: 'CSE-A', totalDays: 100, presentDays: 88, percentage: 88 },
    { studentId: 'STU2024003', name: 'Kumar Raj', class: 'CSE-B', totalDays: 100, presentDays: 85, percentage: 85 }
  ],
  timetable: [
    { day: 'Monday', time: '09:00-10:00', subject: 'Data Structures', faculty: 'Prof. Sunita Sharma', room: 'Room 101' },
    { day: 'Monday', time: '10:00-11:00', subject: 'Algorithms', faculty: 'Prof. Sunita Sharma', room: 'Room 102' },
    { day: 'Tuesday', time: '09:00-10:00', subject: 'Database Systems', faculty: 'Dr. Manikandan', room: 'Room 103' }
  ],
  scholarships: [
    { studentId: 'STU2024001', name: 'Raj Kumar', scheme: 'Merit Scholarship', amount: 50000, status: 'Approved' },
    { studentId: 'STU2024002', name: 'Priya', scheme: 'Girl Child Education', amount: 35000, status: 'Under Review' },
    { studentId: 'STU2024003', name: 'Kumar Raj', scheme: 'SC/ST Scholarship', amount: 30000, status: 'Rejected' },
    { studentId: 'STU2024004', name: 'Meena Lakshmi', scheme: 'Merit Scholarship', amount: 40000, status: 'Approved' },
    { studentId: 'STU2024005', name: 'Arun Prakash', scheme: 'OBC Scholarship', amount: 25000, status: 'Pending' },
    { studentId: 'STU2024006', name: 'Divya Bharathi', scheme: 'Sports Scholarship', amount: 20000, status: 'Rejected' },
    { studentId: 'STU2024007', name: 'Rajkumar S', scheme: 'SC/ST Scholarship', amount: 30000, status: 'Approved' },
    { studentId: 'STU2024008', name: 'Sowmya Rani', scheme: 'Merit Scholarship', amount: 45000, status: 'Pending' },
    { studentId: 'STU2024009', name: 'Vignesh Kumar', scheme: 'Minority Scholarship', amount: 28000, status: 'Approved' },
    { studentId: 'STU2024010', name: 'Anitha Selvi', scheme: 'SC/ST Scholarship', amount: 30000, status: 'Rejected' },
    { studentId: 'STU2024011', name: 'Karthik Raja', scheme: 'Defense Quota Scholarship', amount: 35000, status: 'Approved' },
    { studentId: 'STU2024012', name: 'Lavanya Devi', scheme: 'Single Girl Child Scholarship', amount: 40000, status: 'Pending' },
    { studentId: 'STU2024013', name: 'Saravanan T', scheme: 'OBC Scholarship', amount: 25000, status: 'Rejected' }

  ]
};

export default function Reports() {
  const { user } = useAuth()
  const currentUser = user || userProfiles['Admin']; // Use current logged-in user

  // Normalize role to ensure it matches permissions object keys
  const normalizedRole = currentUser.role ?
    currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1).toLowerCase() :
    'Admin';
  const [selectedReportType, setSelectedReportType] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [filters, setFilters] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Check permissions
  const hasPermission = (action: string) => {
    return permissions[normalizedRole]?.[action] || false;
  };

  // Generate report function
  const generateReport = async (reportType: string, format: string) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const blob = new Blob([`${reportType} Report Data (${format} format)`], { 
        type: format === 'pdf' ? 'application/pdf' : 
              format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      setIsGenerating(false);
    }, 2000);
  };

  // Filter data based on role
  const getFilteredData = (dataType: string) => {
    const data = mockReports[dataType] || [];
    
    if (currentUser.role === 'Student') {
      return data.filter(item => item.studentId === currentUser.studentId);
    } else if (currentUser.role === 'Parent') {
      return data.filter(item => item.studentId === currentUser.childId);
    } else if (currentUser.role === 'Faculty') {
      return data.filter(item => 
        currentUser.assignedClasses?.includes(item.class) || 
        currentUser.subjects?.includes(item.subject)
      );
    }
    
    return data; // Admin sees all
  };

  return (
    <div className="space-y-6">


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Reports</h1>
          <p className="text-muted-foreground mt-2">
            Role-based reporting system ��� Current Role: <span className="font-semibold text-blue-600">{currentUser.role} - {currentUser.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {hasPermission('createReports') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Custom Report</DialogTitle>
                  <DialogDescription>Generate a custom report with specific parameters</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attendance">Attendance Report</SelectItem>
                          <SelectItem value="academic">Academic Performance</SelectItem>
                          <SelectItem value="timetable">Timetable Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Academic Year</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-24">2023-24</SelectItem>
                          <SelectItem value="2022-23">2022-23</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date From</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Date To</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Generate Report</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Permission Matrix Overview */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Available Reports for {currentUser.role}
          </CardTitle>
          <CardDescription>
            Based on your role, you have access to the following reporting features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(permissions[normalizedRole] || {}).map(([permission, hasAccess]) => (
              <div key={permission} className={`p-3 rounded-lg border ${hasAccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  {hasAccess ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm font-medium ${hasAccess ? 'text-green-900' : 'text-gray-500'}`}>
                    {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Reports Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="standard">
            <TabsList className="w-full h-14 bg-gradient-to-r from-blue-50 to-purple-50 rounded-none border-b">
              {hasPermission('standardReports') && (
                <TabsTrigger value="standard" className="flex-1 h-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Standard Reports
                </TabsTrigger>
              )}
              
              {hasPermission('lessonPlanReport') && (
                <TabsTrigger value="lesson-plans" className="flex-1 h-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Lesson Plans
                </TabsTrigger>
              )}
              
              {hasPermission('timetableReport') && (
                <TabsTrigger value="timetable" className="flex-1 h-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timetable
                </TabsTrigger>
              )}
              
              {hasPermission('attendanceReport') && (
                <TabsTrigger value="attendance" className="flex-1 h-full">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Attendance
                </TabsTrigger>
              )}
              
              {hasPermission('scholarshipReport') && (
                <TabsTrigger value="scholarships" className="flex-1 h-full">
                  <Award className="h-4 w-4 mr-2" />
                  Scholarships
                </TabsTrigger>
              )}
            </TabsList>

            {/* Standard Reports */}
            {hasPermission('standardReports') && (
              <TabsContent value="standard" className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Attendance Analytics
                      </CardTitle>
                      <CardDescription>Comprehensive attendance reporting and analytics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Access Level:</span>
                        <Badge className="bg-blue-600 text-white">
                          {currentUser.role === 'Admin' ? 'All Students' : 
                           currentUser.role === 'Faculty' ? 'Assigned Classes' :
                           currentUser.role === 'Student' ? 'Personal' : 'Child Only'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button size="sm" onClick={() => generateReport('attendance', 'pdf')}>
                          <FileText className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => generateReport('attendance', 'excel')}>
                          <FileSpreadsheet className="h-3 w-3 mr-1" />
                          Excel
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => generateReport('attendance', 'csv')}>
                          <FileText className="h-3 w-3 mr-1" />
                          CSV
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Student Details
                      </CardTitle>
                      <CardDescription>Student profile and academic information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Access Level:</span>
                        <Badge className="bg-green-600 text-white">
                          {currentUser.role === 'Admin' ? 'All Students' : 
                           currentUser.role === 'Faculty' ? 'Assigned Students' :
                           currentUser.role === 'Student' ? 'Own Profile' : 'Child Profile'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button size="sm" onClick={() => generateReport('student-details', 'pdf')}>
                          <FileText className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => generateReport('student-details', 'excel')}>
                          <FileSpreadsheet className="h-3 w-3 mr-1" />
                          Excel
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => generateReport('student-details', 'csv')}>
                          <FileText className="h-3 w-3 mr-1" />
                          CSV
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {hasPermission('dropoutReport') && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          Dropout Analysis
                        </CardTitle>
                        <CardDescription>Student dropout tracking and reporting</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Access Level:</span>
                          <Badge className="bg-red-600 text-white">Admin Only</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Button size="sm" onClick={() => generateReport('dropout', 'pdf')}>
                            <FileText className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => generateReport('dropout', 'excel')}>
                            <FileSpreadsheet className="h-3 w-3 mr-1" />
                            Excel
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => generateReport('dropout', 'csv')}>
                            <FileText className="h-3 w-3 mr-1" />
                            CSV
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Lesson Plans Reports */}
            {hasPermission('lessonPlanReport') && (
              <TabsContent value="lesson-plans" className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Lesson Plan Reports</h3>
                  <Button onClick={() => generateReport('lesson-plans', 'pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {getFilteredData('lessonPlans').map((plan) => (
                    <Card key={plan.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{plan.subject}</h4>
                            <p className="text-sm text-gray-600">Class: {plan.class} | Date: {plan.date}</p>
                            <p className="text-sm text-gray-600">Faculty: {plan.faculty}</p>
                          </div>
                          <Badge variant={plan.status === 'Completed' ? 'default' : 'secondary'}>
                            {plan.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Timetable Reports */}
            {hasPermission('timetableReport') && (
              <TabsContent value="timetable" className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {currentUser.role === 'Student' ? 'My Timetable' :
                     currentUser.role === 'Parent' ? `${currentUser.childName}'s Timetable` :
                     currentUser.role === 'Faculty' ? 'My Teaching Schedule' : 'All Timetables'}
                  </h3>
                  <Button onClick={() => generateReport('timetable', 'pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Timetable
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {getFilteredData('timetable').map((schedule, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Day</Label>
                            <p className="font-medium">{schedule.day}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Time</Label>
                            <p className="font-medium">{schedule.time}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Subject</Label>
                            <p className="font-medium">{schedule.subject}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Room</Label>
                            <p className="font-medium">{schedule.room}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Attendance Reports */}
            {hasPermission('attendanceReport') && (
              <TabsContent value="attendance" className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {currentUser.role === 'Student' ? 'My Attendance' :
                     currentUser.role === 'Parent' ? `${currentUser.childName}'s Attendance` :
                     'Attendance Reports'}
                  </h3>
                  <Button onClick={() => generateReport('attendance-detailed', 'excel')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {getFilteredData('attendance').map((record) => (
                    <Card key={record.studentId}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{record.name}</h4>
                            <p className="text-sm text-gray-600">Class: {record.class} | Student ID: {record.studentId}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{record.percentage}%</div>
                            <p className="text-sm text-gray-600">{record.presentDays}/{record.totalDays} days</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${record.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Scholarship Reports */}
            {hasPermission('scholarshipReport') && (
              <TabsContent value="scholarships" className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {currentUser.role === 'Student' ? 'My Scholarship Status' :
                     currentUser.role === 'Parent' ? `${currentUser.childName}'s Scholarship Status` :
                     'Scholarship Reports'}
                  </h3>
                  <Button onClick={() => generateReport('scholarships', 'pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {getFilteredData('scholarships').map((scholarship) => (
                    <Card key={scholarship.studentId}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{scholarship.name}</h4>
                            <p className="text-sm text-gray-600">Student ID: {scholarship.studentId}</p>
                            <p className="text-sm text-gray-600">Scheme: {scholarship.scheme}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">₹{scholarship.amount.toLocaleString('en-IN')}</div>
                            <Badge 
                              variant={scholarship.status === 'Approved' ? 'default' : 
                                      scholarship.status === 'Rejected' ? 'destructive' : 'secondary'}
                            >
                              {scholarship.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Generation Status */}
      {isGenerating && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              <div>
                <p className="font-medium text-orange-900">Generating Report...</p>
                <p className="text-sm text-orange-700">Please wait while we prepare your report for download.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {currentUser.role === 'Admin' ? '1,234' : 
                   currentUser.role === 'Faculty' ? '45' :
                   currentUser.role === 'Student' ? '1' : '1'}
                </p>
                <p className="text-sm text-gray-600">
                  {currentUser.role === 'Admin' ? 'Total Students' : 
                   currentUser.role === 'Faculty' ? 'My Students' :
                   'Student Records'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {currentUser.role === 'Admin' ? '156' : 
                   currentUser.role === 'Faculty' ? '12' :
                   currentUser.role === 'Student' ? '8' : '8'}
                </p>
                <p className="text-sm text-gray-600">Reports Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {currentUser.role === 'Admin' ? '89' : 
                   currentUser.role === 'Faculty' ? '5' :
                   currentUser.role === 'Student' ? '1' : '1'}
                </p>
                <p className="text-sm text-gray-600">Scholarships</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-gray-600">
                  {currentUser.role === 'Student' || currentUser.role === 'Parent' ? 
                   'Attendance Rate' : 'Avg Attendance'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
