import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ResizeObserverErrorBoundary from '@/components/ResizeObserverErrorBoundary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  BarChart3, PieChart, TrendingUp, TrendingDown, Download,
  FileText, Calendar as CalendarIcon, Filter, Search, Users,
  GraduationCap, Award, AlertCircle, CheckCircle, Clock,
  Target, BookOpen, MapPin, Settings, Printer, Share,
  Eye, Edit, RefreshCw, Zap, Star, ThumbsUp, ThumbsDown,
  Plus
} from 'lucide-react';
import { Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from 'recharts';

interface ReportData {
  examStatistics: {
    totalExams: number;
    completedExams: number;
    scheduledExams: number;
    cancelledExams: number;
    totalStudents: number;
    totalSubjects: number;
    averagePassRate: number;
    averageCGPA: number;
  };
  performanceMetrics: {
    subjectWisePerformance: Array<{
      subject: string;
      subjectCode: string;
      totalStudents: number;
      passCount: number;
      failCount: number;
      passRate: number;
      averageMarks: number;
      highestMarks: number;
      lowestMarks: number;
      standardDeviation: number;
    }>;
    gradeDistribution: Array<{
      grade: string;
      count: number;
      percentage: number;
    }>;
    semesterWisePerformance: Array<{
      semester: string;
      academicYear: string;
      totalStudents: number;
      passRate: number;
      averageCGPA: number;
    }>;
  };
  attendanceAnalytics: {
    overallAttendance: number;
    subjectWiseAttendance: Array<{
      subject: string;
      attendance: number;
      correlation: number; // Correlation with performance
    }>;
    monthlyTrends: Array<{
      month: string;
      attendance: number;
      performance: number;
    }>;
  };
  facultyMetrics: {
    facultyPerformance: Array<{
      facultyName: string;
      subjectsTaught: number;
      totalStudents: number;
      averagePassRate: number;
      studentRating: number;
      paperEvaluated: number;
    }>;
    invigilatorStats: Array<{
      name: string;
      dutiesCompleted: number;
      punctualityScore: number;
      performanceRating: number;
    }>;
  };
  institutionalMetrics: {
    departmentComparison: Array<{
      department: string;
      totalStudents: number;
      passRate: number;
      averageCGPA: number;
      ranking: number;
    }>;
    yearOverYearTrends: Array<{
      year: string;
      passRate: number;
      averageCGPA: number;
      studentCount: number;
    }>;
  };
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: 'Performance' | 'Attendance' | 'Faculty' | 'Institutional' | 'Custom';
  parameters: {
    dateRange: {
      from: string;
      to: string;
    };
    programs: string[];
    semesters: string[];
    subjects: string[];
    examTypes: string[];
  };
  metrics: string[];
  visualizations: string[];
  scheduleType: 'One-time' | 'Daily' | 'Weekly' | 'Monthly';
  recipients: string[];
  status: 'Active' | 'Inactive' | 'Draft';
  createdBy: string;
  createdDate: string;
  lastGenerated?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const mockReportData: ReportData = {
  examStatistics: {
    totalExams: 156,
    completedExams: 142,
    scheduledExams: 14,
    cancelledExams: 2,
    totalStudents: 2450,
    totalSubjects: 48,
    averagePassRate: 87.5,
    averageCGPA: 7.85
  },
  performanceMetrics: {
    subjectWisePerformance: [
      {
        subject: 'Engineering Mathematics-III',
        subjectCode: 'MA301',
        totalStudents: 115,
        passCount: 98,
        failCount: 17,
        passRate: 85.2,
        averageMarks: 74.5,
        highestMarks: 97,
        lowestMarks: 23,
        standardDeviation: 15.2
      },
      {
        subject: 'Data Structures',
        subjectCode: 'CS302',
        totalStudents: 108,
        passCount: 102,
        failCount: 6,
        passRate: 94.4,
        averageMarks: 81.3,
        highestMarks: 99,
        lowestMarks: 42,
        standardDeviation: 12.8
      },
      {
        subject: 'Computer Organization',
        subjectCode: 'CS303',
        totalStudents: 108,
        passCount: 89,
        failCount: 19,
        passRate: 82.4,
        averageMarks: 69.7,
        highestMarks: 95,
        lowestMarks: 18,
        standardDeviation: 18.3
      }
    ],
    gradeDistribution: [
      { grade: 'A+', count: 245, percentage: 10.0 },
      { grade: 'A', count: 490, percentage: 20.0 },
      { grade: 'B+', count: 735, percentage: 30.0 },
      { grade: 'B', count: 588, percentage: 24.0 },
      { grade: 'C+', count: 245, percentage: 10.0 },
      { grade: 'C', count: 98, percentage: 4.0 },
      { grade: 'F', count: 49, percentage: 2.0 }
    ],
    semesterWisePerformance: [
      {
        semester: '1st Semester',
        academicYear: '2023-24',
        totalStudents: 580,
        passRate: 92.4,
        averageCGPA: 8.1
      },
      {
        semester: '2nd Semester',
        academicYear: '2023-24',
        totalStudents: 572,
        passRate: 89.7,
        averageCGPA: 7.9
      },
      {
        semester: '3rd Semester',
        academicYear: '2023-24',
        totalStudents: 545,
        passRate: 85.1,
        averageCGPA: 7.6
      }
    ]
  },
  attendanceAnalytics: {
    overallAttendance: 78.5,
    subjectWiseAttendance: [
      { subject: 'Mathematics', attendance: 82.3, correlation: 0.75 },
      { subject: 'Computer Science', attendance: 85.7, correlation: 0.68 },
      { subject: 'Physics', attendance: 74.2, correlation: 0.72 },
      { subject: 'Electronics', attendance: 79.8, correlation: 0.69 }
    ],
    monthlyTrends: [
      { month: 'Sep', attendance: 85, performance: 78 },
      { month: 'Oct', attendance: 82, performance: 81 },
      { month: 'Nov', attendance: 76, performance: 74 },
      { month: 'Dec', attendance: 73, performance: 72 },
      { month: 'Jan', attendance: 79, performance: 76 },
      { month: 'Feb', attendance: 84, performance: 83 }
    ]
  },
  facultyMetrics: {
    facultyPerformance: [
      {
        facultyName: 'Dr.Mahesh',
        subjectsTaught: 3,
        totalStudents: 245,
        averagePassRate: 94.2,
        studentRating: 4.7,
        paperEvaluated: 156
      },
      {
        facultyName: 'Prof. Karthi',
        subjectsTaught: 2,
        totalStudents: 198,
        averagePassRate: 89.5,
        studentRating: 4.4,
        paperEvaluated: 132
      },
      {
        facultyName: 'Dr. Senthil',
        subjectsTaught: 2,
        totalStudents: 187,
        averagePassRate: 91.8,
        studentRating: 4.6,
        paperEvaluated: 145
      }
    ],
    invigilatorStats: [
      {
        name: 'Dr. Mahesh',
        dutiesCompleted: 45,
        punctualityScore: 4.8,
        performanceRating: 4.9
      },
      {
        name: 'Prof. Karthi',
        dutiesCompleted: 32,
        punctualityScore: 4.9,
        performanceRating: 4.6
      }
    ]
  },
  institutionalMetrics: {
    departmentComparison: [
      {
        department: 'Computer Science',
        totalStudents: 650,
        passRate: 92.3,
        averageCGPA: 8.2,
        ranking: 1
      },
      {
        department: 'Electronics',
        totalStudents: 580,
        passRate: 89.7,
        averageCGPA: 7.9,
        ranking: 2
      },
      {
        department: 'Mechanical',
        totalStudents: 720,
        passRate: 86.1,
        averageCGPA: 7.6,
        ranking: 3
      },
      {
        department: 'Civil',
        totalStudents: 500,
        passRate: 84.8,
        averageCGPA: 7.4,
        ranking: 4
      }
    ],
    yearOverYearTrends: [
      { year: '2020-21', passRate: 82.4, averageCGPA: 7.2, studentCount: 2100 },
      { year: '2021-22', passRate: 85.1, averageCGPA: 7.5, studentCount: 2250 },
      { year: '2022-23', passRate: 87.8, averageCGPA: 7.8, studentCount: 2380 },
      { year: '2023-24', passRate: 89.2, averageCGPA: 8.0, studentCount: 2450 }
    ]
  }
};

const initialCustomReports: CustomReport[] = [
  {
    id: 'CR001',
    name: 'Monthly Performance Dashboard',
    description: 'Comprehensive monthly performance analysis for all departments',
    type: 'Performance',
    parameters: {
      dateRange: { from: '2024-01-01', to: '2024-12-31' },
      programs: ['B.Tech Computer Science', 'B.Tech Electronics'],
      semesters: ['All'],
      subjects: ['All'],
      examTypes: ['Regular', 'Supplementary']
    },
    metrics: ['Pass Rate', 'Average CGPA', 'Grade Distribution'],
    visualizations: ['Bar Chart', 'Line Graph', 'Pie Chart'],
    scheduleType: 'Monthly',
    recipients: ['dean@university.edu', 'hod@cse.university.edu'],
    status: 'Active',
    createdBy: 'Dr. Academic Officer',
    createdDate: '2024-01-15',
    lastGenerated: '2024-11-01'
  },
  {
    id: 'CR002',
    name: 'Faculty Performance Review',
    description: 'Quarterly faculty performance and student feedback analysis',
    type: 'Faculty',
    parameters: {
      dateRange: { from: '2024-01-01', to: '2024-03-31' },
      programs: ['All'],
      semesters: ['All'],
      subjects: ['All'],
      examTypes: ['All']
    },
    metrics: ['Student Pass Rate', 'Rating', 'Workload Distribution'],
    visualizations: ['Rating Chart', 'Performance Matrix'],
    scheduleType: 'Monthly',
    recipients: ['hr@university.edu'],
    status: 'Active',
    createdBy: 'HR Manager',
    createdDate: '2024-02-01'
  }
];

export default function Reports() {
  const { user } = useAuth();
  const [reportData] = useState<ReportData>(mockReportData);
  const [customReports, setCustomReports] = useState<CustomReport[]>(initialCustomReports);
  const [selectedReport, setSelectedReport] = useState<CustomReport | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('passRate');
  const [showCreateReportDialog, setShowCreateReportDialog] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Form state for creating custom reports
  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    type: 'Performance',
    scheduleType: 'One-time',
    recipients: '',
    selectedMetrics: [],
    selectedVisualizations: []
  });

  const handleCreateReport = () => {
    const report: CustomReport = {
      id: `CR${String(customReports.length + 1).padStart(3, '0')}`,
      ...newReport,
      parameters: {
        dateRange: {
          from: format(dateRange.from, 'yyyy-MM-dd'),
          to: format(dateRange.to, 'yyyy-MM-dd')
        },
        programs: [selectedProgram],
        semesters: ['All'],
        subjects: ['All'],
        examTypes: ['All']
      },
      metrics: newReport.selectedMetrics,
      visualizations: newReport.selectedVisualizations,
      recipients: newReport.recipients.split(',').map(email => email.trim()),
      status: 'Active',
      createdBy: user?.name || 'System',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setCustomReports([...customReports, report]);
    setShowCreateReportDialog(false);
    setNewReport({
      name: '',
      description: '',
      type: 'Performance',
      scheduleType: 'One-time',
      recipients: '',
      selectedMetrics: [],
      selectedVisualizations: []
    });
  };

  const generateReport = (reportId: string) => {
    setCustomReports(customReports.map(r => 
      r.id === reportId 
        ? { ...r, lastGenerated: new Date().toISOString().split('T')[0] }
        : r
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Draft': 'bg-yellow-100 text-yellow-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reportData.examStatistics.totalExams}</div>
          <p className="text-xs text-muted-foreground">
            {reportData.examStatistics.completedExams} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overall Pass Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reportData.examStatistics.averagePassRate}%</div>
          <p className="text-xs text-muted-foreground">
            {reportData.examStatistics.totalStudents} students
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reportData.examStatistics.averageCGPA}</div>
          <p className="text-xs text-muted-foreground">
            Institution wide
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reportData.examStatistics.totalSubjects}</div>
          <p className="text-xs text-muted-foreground">
            Across all programs
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Overall grade distribution across all students</CardDescription>
        </CardHeader>
        <CardContent>
          <ResizeObserverErrorBoundary>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={reportData.performanceMetrics.gradeDistribution}
                  dataKey="count"
                  nameKey="grade"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                >
                  {reportData.performanceMetrics.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ResizeObserverErrorBoundary>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
          <CardDescription>Pass rates by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.performanceMetrics.subjectWisePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="subjectCode" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === 'passRate' ? '%' : ''}`, 
                  name === 'passRate' ? 'Pass Rate' : 'Average Marks'
                ]}
                labelFormatter={(label) => `Subject: ${label}`}
              />
              <Legend />
              <Bar dataKey="passRate" fill="#3b82f6" name="Pass Rate (%)" />
              <Bar dataKey="averageMarks" fill="#10b981" name="Average Marks" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderTrendAnalysis = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Year-over-Year Trends</CardTitle>
        <CardDescription>Performance trends over academic years</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={reportData.institutionalMetrics.yearOverYearTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="passRate"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Pass Rate (%)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="averageCGPA"
              stroke="#10b981"
              strokeWidth={3}
              name="Average CGPA"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examination Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive reporting and analytics for examination management and performance tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Examination Data</DialogTitle>
                <DialogDescription>
                  Choose data sets and format for export
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Data Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="performance" defaultChecked />
                      <Label htmlFor="performance" className="text-sm">Performance Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="attendance" />
                      <Label htmlFor="attendance" className="text-sm">Attendance Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="faculty" />
                      <Label htmlFor="faculty" className="text-sm">Faculty Metrics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="institutional" />
                      <Label htmlFor="institutional" className="text-sm">Institutional Data</Label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="xlsx">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select defaultValue="current">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current Semester</SelectItem>
                        <SelectItem value="academic">Full Academic Year</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Additional Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-charts" />
                      <Label htmlFor="include-charts" className="text-sm">Include charts and visualizations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="detailed-breakdown" />
                      <Label htmlFor="detailed-breakdown" className="text-sm">Include detailed breakdown</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="anonymize" />
                      <Label htmlFor="anonymize" className="text-sm">Anonymize student data</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <PermissionGuard permission="exams.reports.create" fallback={null}>
            <Dialog open={showCreateReportDialog} onOpenChange={setShowCreateReportDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Custom Report</DialogTitle>
                  <DialogDescription>
                    Set up a custom report with specific metrics and scheduling.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="reportName">Report Name</Label>
                    <Input
                      id="reportName"
                      value={newReport.name}
                      onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                      placeholder="Monthly Performance Dashboard"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="reportDescription">Description</Label>
                    <Input
                      id="reportDescription"
                      value={newReport.description}
                      onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                      placeholder="Comprehensive performance analysis..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select value={newReport.type} onValueChange={(value) => setNewReport({...newReport, type: value as 'Performance' | 'Attendance' | 'Faculty' | 'Institutional' | 'Custom'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Performance">Performance</SelectItem>
                        <SelectItem value="Attendance">Attendance</SelectItem>
                        <SelectItem value="Faculty">Faculty</SelectItem>
                        <SelectItem value="Institutional">Institutional</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduleType">Schedule</Label>
                    <Select value={newReport.scheduleType} onValueChange={(value) => setNewReport({...newReport, scheduleType: value as 'One-time' | 'Daily' | 'Weekly' | 'Monthly'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="One-time">One-time</SelectItem>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="recipients">Recipients (comma-separated emails)</Label>
                    <Input
                      id="recipients"
                      value={newReport.recipients}
                      onChange={(e) => setNewReport({...newReport, recipients: e.target.value})}
                      placeholder="dean@university.edu, hod@cse.university.edu"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Metrics to Include</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Pass Rate', 'Average CGPA', 'Grade Distribution', 'Attendance', 'Faculty Performance', 'Trends'].map(metric => (
                        <div key={metric} className="flex items-center space-x-2">
                          <Checkbox
                            id={metric}
                            checked={newReport.selectedMetrics.includes(metric)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewReport({
                                  ...newReport,
                                  selectedMetrics: [...newReport.selectedMetrics, metric]
                                });
                              } else {
                                setNewReport({
                                  ...newReport,
                                  selectedMetrics: newReport.selectedMetrics.filter(m => m !== metric)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={metric} className="text-sm">{metric}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateReportDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateReport}>
                    Create Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="institutional">Institutional</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverviewCards()}
          {renderPerformanceCharts()}
          {renderTrendAnalysis()}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
                <CardDescription>Performance ranking by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.institutionalMetrics.departmentComparison.map((dept, index) => (
                    <div key={dept.department} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold">
                          {dept.ranking}
                        </div>
                        <div>
                          <div className="font-medium">{dept.department}</div>
                          <div className="text-sm text-muted-foreground">{dept.totalStudents} students</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{dept.passRate}%</div>
                        <div className="text-sm text-muted-foreground">CGPA: {dept.averageCGPA}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Best Performing Subject</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Data Structures</div>
                      <div className="text-sm text-muted-foreground">94.4% pass rate</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Needs Attention</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Computer Organization</div>
                      <div className="text-sm text-muted-foreground">82.4% pass rate</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Top Faculty Rating</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Dr. Sarah Wilson</div>
                      <div className="text-sm text-muted-foreground">4.7/5 rating</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Total Evaluations</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">433 papers</div>
                      <div className="text-sm text-muted-foreground">This semester</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Subject Performance</CardTitle>
              <CardDescription>
                Comprehensive analysis of subject-wise performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Average Marks</TableHead>
                    <TableHead>Highest</TableHead>
                    <TableHead>Lowest</TableHead>
                    <TableHead>Std Dev</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.performanceMetrics.subjectWisePerformance.map((subject) => (
                    <TableRow key={subject.subjectCode}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{subject.subject}</div>
                          <div className="text-sm text-muted-foreground">{subject.subjectCode}</div>
                        </div>
                      </TableCell>
                      <TableCell>{subject.totalStudents}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{subject.passRate}%</span>
                          <Progress value={subject.passRate} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{subject.averageMarks.toFixed(1)}</TableCell>
                      <TableCell>{subject.highestMarks}</TableCell>
                      <TableCell>{subject.lowestMarks}</TableCell>
                      <TableCell>{subject.standardDeviation.toFixed(1)}</TableCell>
                      <TableCell>
                        {subject.passRate >= 90 ? (
                          <Badge className="bg-green-100 text-green-800">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Excellent
                          </Badge>
                        ) : subject.passRate >= 80 ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            Good
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Needs Attention
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Semester-wise Performance Trends</CardTitle>
              <CardDescription>
                Performance progression across semesters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.performanceMetrics.semesterWisePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="passRate" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Pass Rate (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="averageCGPA" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Average CGPA"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.attendanceAnalytics.overallAttendance}%</div>
                <p className="text-xs text-muted-foreground">Institution average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attendance-Performance Correlation</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.72</div>
                <p className="text-xs text-muted-foreground">Strong positive correlation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">&lt;75% attendance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Trends</CardTitle>
                <CardDescription>Attendance vs Performance correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.attendanceAnalytics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Attendance (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Performance (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Attendance</CardTitle>
                <CardDescription>Attendance rates and performance correlation by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.attendanceAnalytics.subjectWiseAttendance.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-sm text-muted-foreground">
                          {subject.attendance}% | Correlation: {subject.correlation.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={subject.attendance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faculty" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Faculty Performance Overview</CardTitle>
                <CardDescription>Teaching effectiveness and student outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.facultyMetrics.facultyPerformance.map((faculty) => (
                      <TableRow key={faculty.facultyName}>
                        <TableCell className="font-medium">{faculty.facultyName}</TableCell>
                        <TableCell>{faculty.subjectsTaught}</TableCell>
                        <TableCell>{faculty.totalStudents}</TableCell>
                        <TableCell>
                          <span className="font-medium">{faculty.averagePassRate}%</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{faculty.studentRating}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invigilator Performance</CardTitle>
                <CardDescription>Duty completion and performance ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Duties</TableHead>
                      <TableHead>Punctuality</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.facultyMetrics.invigilatorStats.map((invigilator) => (
                      <TableRow key={invigilator.name}>
                        <TableCell className="font-medium">{invigilator.name}</TableCell>
                        <TableCell>{invigilator.dutiesCompleted}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-green-400 text-green-400" />
                            <span>{invigilator.punctualityScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                            <span>{invigilator.performanceRating}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="institutional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Rankings</CardTitle>
                <CardDescription>Performance-based department comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.institutionalMetrics.departmentComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="passRate" fill="#3b82f6" name="Pass Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
                <CardDescription>4-year performance trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.institutionalMetrics.yearOverYearTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="passRate" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Pass Rate (%)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="averageCGPA" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Average CGPA"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Institutional benchmarks and targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89.2%</div>
                  <div className="text-sm text-muted-foreground">Current Pass Rate</div>
                  <div className="text-xs text-green-600">+2.4% from last year</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">8.0</div>
                  <div className="text-sm text-muted-foreground">Average CGPA</div>
                  <div className="text-xs text-blue-600">+0.2 from last year</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2,450</div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                  <div className="text-xs text-purple-600">+2.9% growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">78.5%</div>
                  <div className="text-sm text-muted-foreground">Attendance Rate</div>
                  <div className="text-xs text-orange-600">-1.2% from target</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Automated and scheduled reports for specific metrics and stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Last Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground">{report.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>{report.scheduleType}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.lastGenerated || 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateReport(report.id)}
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>View Report - {report.name}</DialogTitle>
                                <DialogDescription>
                                  Detailed view of custom report configuration and results
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Report Configuration</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div><strong>Type:</strong> {report.type}</div>
                                      <div><strong>Schedule:</strong> {report.scheduleType}</div>
                                      <div><strong>Created:</strong> {report.createdDate}</div>
                                      <div><strong>Last Generated:</strong> {report.lastGenerated || 'Never'}</div>
                                      <div><strong>Status:</strong> <Badge className={getStatusBadge(report.status)}>{report.status}</Badge></div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Parameters</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div><strong>Date Range:</strong> {report.parameters.dateRange.from} to {report.parameters.dateRange.to}</div>
                                      <div><strong>Programs:</strong> {report.parameters.programs.join(', ')}</div>
                                      <div><strong>Metrics:</strong> {report.metrics.join(', ')}</div>
                                      <div><strong>Recipients:</strong> {report.recipients.length} users</div>
                                    </CardContent>
                                  </Card>
                                </div>
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Report Preview</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                      <div className="p-4 border rounded">
                                        <div className="text-2xl font-bold text-blue-600">87.5%</div>
                                        <div className="text-sm text-muted-foreground">Overall Pass Rate</div>
                                      </div>
                                      <div className="p-4 border rounded">
                                        <div className="text-2xl font-bold text-green-600">7.85</div>
                                        <div className="text-sm text-muted-foreground">Average CGPA</div>
                                      </div>
                                      <div className="p-4 border rounded">
                                        <div className="text-2xl font-bold text-purple-600">2,450</div>
                                        <div className="text-sm text-muted-foreground">Total Students</div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Custom Report - {report.name}</DialogTitle>
                                <DialogDescription>
                                  Modify report configuration and parameters
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <Label htmlFor="edit-name">Report Name</Label>
                                  <Input
                                    id="edit-name"
                                    defaultValue={report.name}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    defaultValue={report.description}
                                  />
                                </div>
                                <div>
                                  <Label>Report Type</Label>
                                  <Select defaultValue={report.type}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Performance">Performance</SelectItem>
                                      <SelectItem value="Attendance">Attendance</SelectItem>
                                      <SelectItem value="Faculty">Faculty</SelectItem>
                                      <SelectItem value="Institutional">Institutional</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Schedule Type</Label>
                                  <Select defaultValue={report.scheduleType}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="One-time">One-time</SelectItem>
                                      <SelectItem value="Daily">Daily</SelectItem>
                                      <SelectItem value="Weekly">Weekly</SelectItem>
                                      <SelectItem value="Monthly">Monthly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-2">
                                  <Label>Recipients</Label>
                                  <Textarea
                                    defaultValue={report.recipients.join(', ')}
                                    placeholder="email1@example.com, email2@example.com"
                                  />
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Select defaultValue={report.status}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Active">Active</SelectItem>
                                      <SelectItem value="Inactive">Inactive</SelectItem>
                                      <SelectItem value="Draft">Draft</SelectItem>
                                    </SelectContent>
                                  </Select>
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
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Download Report - {report.name}</DialogTitle>
                                <DialogDescription>
                                  Generate and download the custom report
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
                                      <SelectItem value="pdf">PDF Report</SelectItem>
                                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                                      <SelectItem value="csv">CSV Data</SelectItem>
                                      <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Report Options</Label>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <input type="checkbox" id="include-summary" defaultChecked />
                                      <Label htmlFor="include-summary" className="text-sm">Include executive summary</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <input type="checkbox" id="include-charts" defaultChecked />
                                      <Label htmlFor="include-charts" className="text-sm">Include charts and graphs</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <input type="checkbox" id="include-raw-data" />
                                      <Label htmlFor="include-raw-data" className="text-sm">Include raw data tables</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <input type="checkbox" id="include-recommendations" />
                                      <Label htmlFor="include-recommendations" className="text-sm">Include recommendations</Label>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Delivery Method</Label>
                                  <Select defaultValue="download">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="download">Direct Download</SelectItem>
                                      <SelectItem value="email">Email to Recipients</SelectItem>
                                      <SelectItem value="both">Download & Email</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button>
                                  <Download className="h-4 w-4 mr-2" />
                                  Generate Report
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
      </Tabs>
    </div>
  );
}
