import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { hasModuleAccess } from '@/utils/modulePermissions';
import WorkflowProgress from '@/components/WorkflowProgress';
import {
  BarChart3, TrendingUp, Users, Award, Search, Filter, Eye, BookOpen,
  Clock, CheckCircle, AlertCircle, Brain, Video, FileText, Target,
  GraduationCap, Calendar, Activity, PieChart, LineChart, BarChart
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

// Enhanced interfaces for comprehensive progress tracking
interface StudentProgress {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  course: string;
  department: string;
  institution: string;
  semester: number;
  academicYear: string;
  
  // Assignment metrics
  assignmentsCompleted: number;
  totalAssignments: number;
  assignmentScore: number;
  
  // Assessment metrics
  assessmentsCompleted: number;
  totalAssessments: number;
  assessmentScore: number;
  
  // Video metrics
  videosWatched: number;
  totalVideos: number;
  videoWatchTime: number; // in minutes
  
  // Course completion
  courseProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
  
  // Overall metrics
  overallScore: number;
  timeSpent: number;
  lastActivity: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  
  // Parent-child relationship
  parentId?: string;
  
  // Faculty assignment
  assignedFacultyId?: string;
}

interface DepartmentStats {
  id: string;
  name: string;
  totalStudents: number;
  activeStudents: number;
  avgCourseCompletion: number;
  avgAssignmentCompletion: number;
  avgAssessmentScore: number;
  totalVideoHours: number;
  atRiskStudents: number;
}

interface InstitutionStats {
  id: string;
  name: string;
  totalStudents: number;
  totalDepartments: number;
  totalCourses: number;
  avgProgress: number;
  departments: DepartmentStats[];
}

interface FacultyData {
  id: string;
  name: string;
  department: string;
  coursesHandled: string[];
  studentsCount: number;
  avgStudentProgress: number;
}

// Mock data for demonstration
const mockStudentProgress: StudentProgress[] = [
  {
    id: '1',
    studentId: 'TN2401001',
    studentName: 'Arjun Kumar',
    email: 'arjun@example.com',
    course: 'Computer Science Engineering',
    department: 'CSE',
    institution: 'ABC Engineering College',
    semester: 6,
    academicYear: '2023-24',
    assignmentsCompleted: 12,
    totalAssignments: 15,
    assignmentScore: 88,
    assessmentsCompleted: 8,
    totalAssessments: 10,
    assessmentScore: 92,
    videosWatched: 45,
    totalVideos: 50,
    videoWatchTime: 320,
    courseProgress: 85,
    lessonsCompleted: 34,
    totalLessons: 40,
    overallScore: 89,
    timeSpent: 450,
    lastActivity: '2024-02-20',
    riskLevel: 'Low',
    parentId: 'P001',
    assignedFacultyId: 'F001'
  },
  {
    id: '2',
    studentId: 'TN2401002',
    studentName: 'Priya Sharma',
    email: 'priya@example.com',
    course: 'AI & Data Science',
    department: 'AIDS',
    institution: 'ABC Engineering College',
    semester: 4,
    academicYear: '2023-24',
    assignmentsCompleted: 8,
    totalAssignments: 12,
    assignmentScore: 75,
    assessmentsCompleted: 5,
    totalAssessments: 8,
    assessmentScore: 78,
    videosWatched: 28,
    totalVideos: 35,
    videoWatchTime: 180,
    courseProgress: 65,
    lessonsCompleted: 20,
    totalLessons: 32,
    overallScore: 76,
    timeSpent: 280,
    lastActivity: '2024-02-18',
    riskLevel: 'Medium',
    parentId: 'P002',
    assignedFacultyId: 'F002'
  },
  {
    id: '3',
    studentId: 'TN2401003',
    studentName: 'Vikram Singh',
    email: 'vikram@example.com',
    course: 'Mechanical Engineering',
    department: 'MECH',
    institution: 'ABC Engineering College',
    semester: 8,
    academicYear: '2023-24',
    assignmentsCompleted: 18,
    totalAssignments: 20,
    assignmentScore: 94,
    assessmentsCompleted: 12,
    totalAssessments: 12,
    assessmentScore: 91,
    videosWatched: 60,
    totalVideos: 60,
    videoWatchTime: 420,
    courseProgress: 95,
    lessonsCompleted: 48,
    totalLessons: 50,
    overallScore: 93,
    timeSpent: 520,
    lastActivity: '2024-02-21',
    riskLevel: 'Low',
    parentId: 'P003',
    assignedFacultyId: 'F003'
  }
];

const mockDepartmentStats: DepartmentStats[] = [
  {
    id: 'CSE',
    name: 'Computer Science Engineering',
    totalStudents: 120,
    activeStudents: 115,
    avgCourseCompletion: 78,
    avgAssignmentCompletion: 82,
    avgAssessmentScore: 85,
    totalVideoHours: 2400,
    atRiskStudents: 8
  },
  {
    id: 'AIDS',
    name: 'AI & Data Science',
    totalStudents: 80,
    activeStudents: 76,
    avgCourseCompletion: 72,
    avgAssignmentCompletion: 75,
    avgAssessmentScore: 78,
    totalVideoHours: 1600,
    atRiskStudents: 12
  },
  {
    id: 'MECH',
    name: 'Mechanical Engineering',
    totalStudents: 100,
    activeStudents: 98,
    avgCourseCompletion: 85,
    avgAssignmentCompletion: 88,
    avgAssessmentScore: 87,
    totalVideoHours: 2000,
    atRiskStudents: 5
  }
];

const mockInstitutionStats: InstitutionStats = {
  id: 'INST001',
  name: 'ABC Engineering College',
  totalStudents: 300,
  totalDepartments: 3,
  totalCourses: 45,
  avgProgress: 78,
  departments: mockDepartmentStats
};

const mockFacultyData: FacultyData[] = [
  {
    id: 'F001',
    name: 'Dr. Rajesh Kumar',
    department: 'CSE',
    coursesHandled: ['Data Structures', 'Algorithms', 'Database Systems'],
    studentsCount: 40,
    avgStudentProgress: 82
  },
  {
    id: 'F002',
    name: 'Dr. Priya Nair',
    department: 'AIDS',
    coursesHandled: ['Machine Learning', 'Data Analytics', 'Python Programming'],
    studentsCount: 35,
    avgStudentProgress: 75
  },
  {
    id: 'F003',
    name: 'Dr. Arun Menon',
    department: 'MECH',
    coursesHandled: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer'],
    studentsCount: 45,
    avgStudentProgress: 88
  }
];

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Progress() {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  // Check module access
  if (!user?.role || !hasModuleAccess(user.role as any, 'lms')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">You don't have permission to view progress data.</p>
        </div>
      </div>
    );
  }

  // Role-based data filtering
  const getFilteredData = useMemo(() => {
    switch (user?.role) {
      case 'super-admin':
      case 'admin':
        return {
          students: mockStudentProgress,
          departments: mockDepartmentStats,
          institutions: [mockInstitutionStats],
          faculty: mockFacultyData,
          showAllData: true
        };
      
      case 'principal':
      case 'institution':
        return {
          students: mockStudentProgress.filter(s => s.institution === user.institution),
          departments: mockDepartmentStats,
          institutions: [mockInstitutionStats],
          faculty: mockFacultyData,
          showInstitutionData: true
        };
      
      case 'hod':
        const hodDepartment = user.department || 'CSE';
        return {
          students: mockStudentProgress.filter(s => s.department === hodDepartment),
          departments: mockDepartmentStats.filter(d => d.id === hodDepartment),
          institutions: [],
          faculty: mockFacultyData.filter(f => f.department === hodDepartment),
          showDepartmentData: true
        };
      
      case 'faculty':
        const facultyId = user.id || 'F001';
        return {
          students: mockStudentProgress.filter(s => s.assignedFacultyId === facultyId),
          departments: [],
          institutions: [],
          faculty: mockFacultyData.filter(f => f.id === facultyId),
          showFacultyData: true
        };
      
      case 'student':
        const studentId = user.id || 'TN2401001';
        return {
          students: mockStudentProgress.filter(s => s.studentId === studentId),
          departments: [],
          institutions: [],
          faculty: [],
          showStudentData: true
        };
      
      case 'parent':
        const parentId = user.id || 'P001';
        return {
          students: mockStudentProgress.filter(s => s.parentId === parentId),
          departments: [],
          institutions: [],
          faculty: [],
          showParentData: true
        };
      
      default:
        return {
          students: [],
          departments: [],
          institutions: [],
          faculty: [],
          showAllData: false
        };
    }
  }, [user?.role, user?.id, user?.department, user?.institution]);

  const {
    students,
    departments,
    institutions,
    faculty,
    showAllData,
    showInstitutionData,
    showDepartmentData,
    showFacultyData,
    showStudentData,
    showParentData
  } = getFilteredData;

  // Transform student data for workflow progress component
  const getWorkflowData = () => {
    if (students.length === 0) return null;

    const student = students[0]; // For individual student/parent view
    return {
      courseProgress: student.courseProgress,
      assignmentsCompleted: student.assignmentsCompleted,
      totalAssignments: student.totalAssignments,
      assessmentsCompleted: student.assessmentsCompleted,
      totalAssessments: student.totalAssessments,
      videosWatched: student.videosWatched,
      totalVideos: student.totalVideos,
      overallScore: student.overallScore,
      isEnrolled: true, // Assume enrolled if data exists
      hasFeedback: student.riskLevel !== 'High', // Simple logic for demo
      isCertified: student.courseProgress >= 95 && student.overallScore >= 85
    };
  };

  // Calculate aggregate statistics
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const avgCourseProgress = totalStudents > 0 
      ? Math.round(students.reduce((sum, s) => sum + s.courseProgress, 0) / totalStudents)
      : 0;
    const avgAssignmentCompletion = totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + (s.assignmentsCompleted / s.totalAssignments * 100), 0) / totalStudents)
      : 0;
    const avgAssessmentScore = totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + s.assessmentScore, 0) / totalStudents)
      : 0;
    const totalVideoHours = Math.round(students.reduce((sum, s) => sum + s.videoWatchTime, 0) / 60);
    const atRiskStudents = students.filter(s => s.riskLevel === 'High').length;
    const activeStudents = students.filter(s => {
      const lastActivity = new Date(s.lastActivity);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastActivity >= weekAgo;
    }).length;

    return {
      totalStudents,
      activeStudents,
      avgCourseProgress,
      avgAssignmentCompletion,
      avgAssessmentScore,
      totalVideoHours,
      atRiskStudents
    };
  }, [students]);

  // Chart data preparation
  const chartData = useMemo(() => {
    const departmentProgressData = departments.map(dept => ({
      name: dept.name,
      'Course Completion': dept.avgCourseCompletion,
      'Assignment Completion': dept.avgAssignmentCompletion,
      'Assessment Score': dept.avgAssessmentScore
    }));

    // Performance Status data - different for student vs admin views
    let performanceData = [];

    if (showStudentData || showParentData) {
      // For individual student/parent view - show personal performance breakdown
      const student = students[0];
      if (student) {
        performanceData = [
          { name: 'Assignments', value: student.assignmentScore, color: '#10b981' },
          { name: 'Assessments', value: student.assessmentScore, color: '#3b82f6' },
          { name: 'Course Progress', value: student.courseProgress, color: '#8b5cf6' },
          { name: 'Overall Score', value: student.overallScore, color: '#f59e0b' }
        ];
      } else {
        // Fallback data for student view
        performanceData = [
          { name: 'Assignments', value: 85, color: '#10b981' },
          { name: 'Assessments', value: 78, color: '#3b82f6' },
          { name: 'Course Progress', value: 72, color: '#8b5cf6' },
          { name: 'Overall Score', value: 80, color: '#f59e0b' }
        ];
      }
    } else {
      // For admin/faculty views - show risk level distribution
      const lowRisk = students.filter(s => s.riskLevel === 'Low').length;
      const mediumRisk = students.filter(s => s.riskLevel === 'Medium').length;
      const highRisk = students.filter(s => s.riskLevel === 'High').length;

      if (lowRisk + mediumRisk + highRisk > 0) {
        performanceData = [
          { name: 'Low Risk', value: lowRisk, color: '#10b981' },
          { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b' },
          { name: 'High Risk', value: highRisk, color: '#ef4444' }
        ];
      } else {
        // Fallback data for admin view when no students
        performanceData = [
          { name: 'Low Risk', value: 75, color: '#10b981' },
          { name: 'Medium Risk', value: 20, color: '#f59e0b' },
          { name: 'High Risk', value: 5, color: '#ef4444' }
        ];
      }
    }

    // Progress trend data - make it dynamic based on actual data
    let trendData = [];
    if (students.length > 0) {
      const avgProgress = Math.round(students.reduce((sum, s) => sum + s.courseProgress, 0) / students.length);
      trendData = [
        { week: 'Week 1', progress: Math.max(10, avgProgress - 20) },
        { week: 'Week 2', progress: Math.max(20, avgProgress - 10) },
        { week: 'Week 3', progress: Math.max(30, avgProgress - 5) },
        { week: 'Week 4', progress: avgProgress }
      ];
    } else {
      trendData = [
        { week: 'Week 1', progress: 65 },
        { week: 'Week 2', progress: 70 },
        { week: 'Week 3', progress: 72 },
        { week: 'Week 4', progress: 78 }
      ];
    }

    return {
      departmentProgressData,
      riskLevelData: performanceData, // Renamed for clarity but keeping same property name for compatibility
      progressTrendData: trendData
    };
  }, [students, departments, showStudentData, showParentData]);

  const renderDashboardHeader = () => (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-8 shadow-lg mb-8 flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Target className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {showStudentData ? 'My Learning Progress' :
             showParentData ? "Child's Learning Progress" :
             showFacultyData ? 'My Students Progress' :
             showDepartmentData ? 'Department Progress Dashboard' :
             showInstitutionData ? 'Institution Progress Dashboard' :
             'Overall Learning Progress Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            {showStudentData ? 'Track your learning journey through our comprehensive workflow system' :
             showParentData ? "Monitor your child's academic progress through each learning stage" :
             showFacultyData ? 'Monitor student progress through the complete learning workflow' :
             showDepartmentData ? 'Track department-wide learning workflows and student performance' :
             showInstitutionData ? 'Monitor institution-wide learning workflows and department performance' :
             'Comprehensive overview of learning workflows across all institutions'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!showStudentData && !showParentData && (
          <>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48 bg-white shadow-sm">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white shadow-sm">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="semester">This Semester</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
    </div>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100 uppercase tracking-wide">
                {showStudentData || showParentData ? 'Course Progress' : 'Total Students'}
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {showStudentData || showParentData
                  ? `${stats.avgCourseProgress}%`
                  : stats.totalStudents.toLocaleString()}
              </p>
              <p className="text-xs text-blue-100 mt-1">
                {showStudentData || showParentData
                  ? 'overall completion'
                  : `${stats.activeStudents} active this week`}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              {showStudentData || showParentData ?
                <GraduationCap className="h-8 w-8 text-white" /> :
                <Users className="h-8 w-8 text-white" />
              }
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100 uppercase tracking-wide">
                {showStudentData || showParentData ? 'Assignment Score' : 'Assignment Completion'}
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {showStudentData || showParentData
                  ? `${students[0]?.assignmentScore || 0}%`
                  : `${stats.avgAssignmentCompletion}%`}
              </p>
              <p className="text-xs text-green-100 mt-1">
                {showStudentData || showParentData
                  ? `${students[0]?.assignmentsCompleted || 0}/${students[0]?.totalAssignments || 0} completed`
                  : 'average completion rate'}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-100 uppercase tracking-wide">
                {showStudentData || showParentData ? 'Assessment Score' : 'Assessment Average'}
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {showStudentData || showParentData
                  ? `${students[0]?.assessmentScore || 0}%`
                  : `${stats.avgAssessmentScore}%`}
              </p>
              <p className="text-xs text-orange-100 mt-1">
                {showStudentData || showParentData
                  ? `${students[0]?.assessmentsCompleted || 0}/${students[0]?.totalAssessments || 0} completed`
                  : 'across all assessments'}
              </p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100 uppercase tracking-wide">
                {showStudentData || showParentData ? 'Videos Watched' : 'Video Engagement'}
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {showStudentData || showParentData
                  ? `${students[0]?.videosWatched || 0}/${students[0]?.totalVideos || 0}`
                  : `${stats.totalVideoHours}h`}
              </p>
              <p className="text-xs text-purple-100 mt-1">
                {showStudentData || showParentData
                  ? `${students[0]?.videoWatchTime || 0} minutes watched`
                  : 'total watch time'}
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Video className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Department Performance Chart */}
      {!showStudentData && !showParentData && departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Department Performance
            </CardTitle>
            <CardDescription>
              Comparison of completion rates across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={chartData.departmentProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Course Completion" fill="#8884d8" />
                <Bar dataKey="Assignment Completion" fill="#82ca9d" />
                <Bar dataKey="Assessment Score" fill="#ffc658" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Risk Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            {showStudentData || showParentData ? 'Performance Status' : 'Student Risk Levels'}
          </CardTitle>
          <CardDescription>
            {showStudentData || showParentData 
              ? 'Your current academic standing' 
              : 'Distribution of students by risk level'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.riskLevelData && chartData.riskLevelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.riskLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => {
                    if (showStudentData || showParentData) {
                      return `${name}: ${value}%`;
                    } else {
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => {
                    if (showStudentData || showParentData) {
                      return [`${value}%`, name];
                    } else {
                      return [value, `${name} Students`];
                    }
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data available</p>
                <p className="text-sm">Performance data will appear here once available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Progress Trend
          </CardTitle>
          <CardDescription>
            {showStudentData || showParentData 
              ? 'Your learning progress over time' 
              : 'Average progress trend across students'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.progressTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="progress" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional chart space */}
      {showAllData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Engagement Metrics
            </CardTitle>
            <CardDescription>
              Student engagement across different activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Video Completion</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <ProgressBar value={85} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assignment Submission</span>
                <span className="text-sm text-muted-foreground">92%</span>
              </div>
              <ProgressBar value={92} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Discussion Participation</span>
                <span className="text-sm text-muted-foreground">68%</span>
              </div>
              <ProgressBar value={68} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quiz Attempts</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <ProgressBar value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStudentTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {showFacultyData ? 'My Students' : 
           showDepartmentData ? 'Department Students' :
           showInstitutionData ? 'Institution Students' :
           'All Students'}
        </CardTitle>
        <CardDescription>
          Detailed progress tracking for individual students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course Progress</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Assessments</TableHead>
                <TableHead>Videos</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.slice(0, 10).map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-sm text-muted-foreground">{student.course}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{student.courseProgress}%</span>
                      </div>
                      <ProgressBar value={student.courseProgress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{student.assignmentScore}%</div>
                      <div className="text-sm text-muted-foreground">
                        {student.assignmentsCompleted}/{student.totalAssignments}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{student.assessmentScore}%</div>
                      <div className="text-sm text-muted-foreground">
                        {student.assessmentsCompleted}/{student.totalAssessments}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{student.videosWatched}/{student.totalVideos}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.videoWatchTime}m
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      student.riskLevel === 'Low' ? 'secondary' :
                      student.riskLevel === 'Medium' ? 'default' : 'destructive'
                    }>
                      {student.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(student.lastActivity).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {renderDashboardHeader()}
      {renderStatsCards()}

      {/* Learning Workflow Progress */}
      {(showStudentData || showParentData) && (
        <WorkflowProgress
          studentData={getWorkflowData()}
          userRole={user?.role || 'student'}
          showDetails={true}
        />
      )}

      {/* Compact workflow for faculty/admin views */}
      {(showFacultyData || showDepartmentData || showInstitutionData || showAllData) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkflowProgress
            studentData={null} // Show default stages for overview
            userRole={user?.role || 'faculty'}
            compact={false}
            showDetails={false}
          />

          {/* Sample student workflow for comparison */}
          {students.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Student Progress</CardTitle>
                <CardDescription>
                  Example workflow progress for {students[0]?.studentName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowProgress
                  studentData={getWorkflowData()}
                  userRole={user?.role || 'faculty'}
                  compact={true}
                  showDetails={false}
                />
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{students[0]?.courseProgress}%</div>
                    <div className="text-xs text-muted-foreground">Course Progress</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{students[0]?.overallScore}%</div>
                    <div className="text-xs text-muted-foreground">Overall Score</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">
                      {students[0]?.assignmentsCompleted}/{students[0]?.totalAssignments}
                    </div>
                    <div className="text-xs text-muted-foreground">Assignments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {renderCharts()}
      
      {/* Student Detail Table - shown for non-student roles */}
      {!showStudentData && !showParentData && students.length > 0 && renderStudentTable()}
      
      {/* Individual Student/Parent View */}
      {(showStudentData || showParentData) && students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {showParentData ? `${students[0].studentName}'s Detailed Progress` : 'My Detailed Progress'}
            </CardTitle>
            <CardDescription>
              Comprehensive breakdown of learning activities and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Course Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Course:</span>
                        <span className="font-medium">{students[0].course}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{students[0].department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Semester:</span>
                        <span className="font-medium">{students[0].semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Academic Year:</span>
                        <span className="font-medium">{students[0].academicYear}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Overall Score:</span>
                        <span className="font-medium text-lg">{students[0].overallScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Spent:</span>
                        <span className="font-medium">{Math.round(students[0].timeSpent / 60)}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Activity:</span>
                        <span className="font-medium">
                          {new Date(students[0].lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Level:</span>
                        <Badge variant={
                          students[0].riskLevel === 'Low' ? 'secondary' :
                          students[0].riskLevel === 'Medium' ? 'default' : 'destructive'
                        }>
                          {students[0].riskLevel}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="assignments">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold text-blue-600">
                        {students[0].assignmentScore}%
                      </div>
                      <div className="text-xl font-semibold">Assignment Performance</div>
                      <div className="text-muted-foreground">
                        {students[0].assignmentsCompleted} out of {students[0].totalAssignments} assignments completed
                      </div>
                      <ProgressBar 
                        value={(students[0].assignmentsCompleted / students[0].totalAssignments) * 100} 
                        className="h-4 max-w-md mx-auto" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="assessments">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold text-green-600">
                        {students[0].assessmentScore}%
                      </div>
                      <div className="text-xl font-semibold">Assessment Performance</div>
                      <div className="text-muted-foreground">
                        {students[0].assessmentsCompleted} out of {students[0].totalAssessments} assessments completed
                      </div>
                      <ProgressBar 
                        value={(students[0].assessmentsCompleted / students[0].totalAssessments) * 100} 
                        className="h-4 max-w-md mx-auto" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="videos">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold text-purple-600">
                        {students[0].videosWatched}/{students[0].totalVideos}
                      </div>
                      <div className="text-xl font-semibold">Videos Watched</div>
                      <div className="text-muted-foreground">
                        {students[0].videoWatchTime} minutes of video content consumed
                      </div>
                      <ProgressBar 
                        value={(students[0].videosWatched / students[0].totalVideos) * 100} 
                        className="h-4 max-w-md mx-auto" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
