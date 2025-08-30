import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { downloadReport, generateReport, exportAllModuleReports, type ReportItem } from '@/utils/reportUtilits';
import {
  ArrowLeft,
  Search,
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  ClipboardList,
  MessageSquare,
  Filter,
  SortAsc,
  Loader2
} from 'lucide-react';

interface AcademicReportItem extends ReportItem {
  icon: React.ComponentType<any>;
}

const academicReports: AcademicReportItem[] = [
  // Students Reports
  { 
    id: 'student-enrollment', 
    name: 'Student Enrollment Report', 
    description: 'Comprehensive student enrollment statistics by department, course, and semester',
    category: 'Students',
    icon: Users,
    lastGenerated: '2 hours ago',
    generatedBy: 'Registrar Office',
    downloadCount: 45,
    size: '2.3 MB',
    format: 'PDF'
  },
  { 
    id: 'student-performance', 
    name: 'Student Performance Analysis', 
    description: 'Academic performance trends and grade distribution analysis',
    category: 'Students',
    icon: TrendingUp,
    lastGenerated: '1 day ago',
    generatedBy: 'Academic Office',
    downloadCount: 32,
    size: '1.8 MB',
    format: 'Excel'
  },
  { 
    id: 'student-demographics', 
    name: 'Student Demographics Report', 
    description: 'Student population demographics and diversity statistics',
    category: 'Students',
    icon: BarChart3,
    lastGenerated: '3 days ago',
    generatedBy: 'Admin',
    downloadCount: 28,
    size: '1.2 MB',
    format: 'PDF'
  },

  // Attendance Reports
  { 
    id: 'attendance-summary', 
    name: 'Attendance Summary Report', 
    description: 'Overall attendance statistics across all classes and departments',
    category: 'Attendance',
    icon: UserCheck,
    lastGenerated: '1 hour ago',
    generatedBy: 'Faculty Coordinator',
    downloadCount: 67,
    size: '3.1 MB',
    format: 'Excel'
  },
  { 
    id: 'attendance-trends', 
    name: 'Attendance Trends Analysis', 
    description: 'Monthly and weekly attendance patterns and trends',
    category: 'Attendance',
    icon: TrendingUp,
    lastGenerated: '6 hours ago',
    generatedBy: 'Data Analyst',
    downloadCount: 23,
    size: '2.7 MB',
    format: 'PDF'
  },

  // Scholarships Reports
  { 
    id: 'scholarship-recipients', 
    name: 'Scholarship Recipients Report', 
    description: 'List of scholarship recipients and award distributions',
    category: 'Scholarships',
    icon: Award,
    lastGenerated: '2 days ago',
    generatedBy: 'Financial Aid Office',
    downloadCount: 18,
    size: '1.5 MB',
    format: 'Excel'
  },
  { 
    id: 'scholarship-budget', 
    name: 'Scholarship Budget Analysis', 
    description: 'Budget allocation and utilization for scholarship programs',
    category: 'Scholarships',
    icon: BarChart3,
    lastGenerated: '1 week ago',
    generatedBy: 'Finance Manager',
    downloadCount: 12,
    size: '900 KB',
    format: 'PDF'
  },

  // Lesson Plans Reports
  { 
    id: 'curriculum-coverage', 
    name: 'Curriculum Coverage Report', 
    description: 'Subject-wise curriculum completion and coverage analysis',
    category: 'Lesson Plans',
    icon: BookOpen,
    lastGenerated: '4 hours ago',
    generatedBy: 'Curriculum Head',
    downloadCount: 56,
    size: '4.2 MB',
    format: 'Excel'
  },
  { 
    id: 'lesson-plan-compliance', 
    name: 'Lesson Plan Compliance', 
    description: 'Faculty compliance with submitted lesson plans and schedules',
    category: 'Lesson Plans',
    icon: ClipboardList,
    lastGenerated: '1 day ago',
    generatedBy: 'Academic Coordinator',
    downloadCount: 34,
    size: '2.1 MB',
    format: 'PDF'
  },

  // Calendar Reports
  { 
    id: 'academic-calendar', 
    name: 'Academic Calendar Report', 
    description: 'Complete academic calendar with events, holidays, and important dates',
    category: 'Calendar',
    icon: Calendar,
    lastGenerated: '5 days ago',
    generatedBy: 'Academic Office',
    downloadCount: 89,
    size: '1.7 MB',
    format: 'PDF'
  },

  // Timetable Reports
  { 
    id: 'class-schedule', 
    name: 'Class Schedule Report', 
    description: 'Comprehensive class schedules and room allocation',
    category: 'Timetable',
    icon: ClipboardList,
    lastGenerated: '12 hours ago',
    generatedBy: 'Timetable Coordinator',
    downloadCount: 78,
    size: '3.5 MB',
    format: 'Excel'
  },
  { 
    id: 'faculty-workload', 
    name: 'Faculty Workload Distribution', 
    description: 'Teaching load distribution across faculty members',
    category: 'Timetable',
    icon: TrendingUp,
    lastGenerated: '1 day ago',
    generatedBy: 'HR Department',
    downloadCount: 41,
    size: '1.9 MB',
    format: 'PDF'
  },

  // Feedback Reports
  { 
    id: 'student-feedback', 
    name: 'Student Feedback Analysis', 
    description: 'Student feedback on courses, faculty, and facilities',
    category: 'Feedback',
    icon: MessageSquare,
    lastGenerated: '3 hours ago',
    generatedBy: 'Quality Assurance',
    downloadCount: 52,
    size: '2.8 MB',
    format: 'Excel'
  },
  { 
    id: 'faculty-feedback', 
    name: 'Faculty Feedback Report', 
    description: 'Faculty feedback on infrastructure, support, and resources',
    category: 'Feedback',
    icon: MessageSquare,
    lastGenerated: '2 days ago',
    generatedBy: 'Academic Head',
    downloadCount: 29,
    size: '1.6 MB',
    format: 'PDF'
  },

  // Notifications Reports
  { 
    id: 'notification-delivery', 
    name: 'Notification Delivery Report', 
    description: 'Academic notification delivery statistics and engagement rates',
    category: 'Notifications',
    icon: BarChart3,
    lastGenerated: '8 hours ago',
    generatedBy: 'IT Admin',
    downloadCount: 35,
    size: '1.3 MB',
    format: 'Excel'
  }
];

export default function AcademicsReports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const categories = ['All', ...Array.from(new Set(academicReports.map(report => report.category)))];

  const filteredReports = academicReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBackToDashboard = () => {
    navigate('/reports');
  };

  const handleDownload = async (report: AcademicReportItem) => {
    setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: true }));
    try {
      await downloadReport(report);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: false }));
    }
  };

  const handleGenerate = async (report: AcademicReportItem) => {
    setLoadingStates(prev => ({ ...prev, [`generate-${report.id}`]: true }));
    try {
      await generateReport(report);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`generate-${report.id}`]: false }));
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await exportAllModuleReports('Academic Management', academicReports);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academic Management Reports</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive reports for all academic sub-modules and activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {filteredReports.length} Reports Available
          </Badge>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={handleExportAll}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting ? 'Exporting...' : 'Export All'}
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <Button variant="outline" size="sm">
          <SortAsc className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.slice(1).map(category => {
          const categoryReports = academicReports.filter(report => report.category === category);
          return (
            <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCategory(category)}>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">{category}</p>
                <p className="text-2xl font-bold">{categoryReports.length}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-sm">{report.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="text-sm">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p>Last Generated</p>
                    <p className="font-medium text-foreground">{report.lastGenerated}</p>
                  </div>
                  <div>
                    <p>Generated By</p>
                    <p className="font-medium text-foreground">{report.generatedBy}</p>
                  </div>
                  <div>
                    <p>Downloads</p>
                    <p className="font-medium text-foreground">{report.downloadCount}</p>
                  </div>
                  <div>
                    <p>Size & Format</p>
                    <p className="font-medium text-foreground">{report.size} • {report.format}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(report)}
                    disabled={loadingStates[`download-${report.id}`]}
                  >
                    {loadingStates[`download-${report.id}`] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {loadingStates[`download-${report.id}`] ? 'Downloading...' : 'Download'}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleGenerate(report)}
                    disabled={loadingStates[`generate-${report.id}`]}
                  >
                    {loadingStates[`generate-${report.id}`] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <BarChart3 className="h-4 w-4 mr-2" />
                    )}
                    {loadingStates[`generate-${report.id}`] ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No reports found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find the reports you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
