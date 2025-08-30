import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exportAllReports } from '@/utils/reportUtilits';
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  FileText,
  Users,
  UserCheck,
  TrendingUp,
  Calendar,
  Award,
  MessageSquare,
  Video,
  ClipboardList,
  ArrowRight,
  Download,
  Loader2
} from 'lucide-react';

interface ModuleReportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  reportCount: number;
  subReports: {
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    count: number;
  }[];
}

const moduleReportCategories: ModuleReportCategory[] = [
  {
    id: 'academics',
    title: 'Academic Management',
    description: 'Comprehensive academic performance and curriculum analysis',
    icon: GraduationCap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    reportCount: 8,
    subReports: [
      { name: 'Students', description: 'Student enrollment and performance', icon: Users, count: 12 },
      { name: 'Attendance', description: 'Student attendance tracking', icon: UserCheck, count: 8 },
      { name: 'Scholarships', description: 'Scholarship programs and recipients', icon: Award, count: 5 },
      { name: 'Lesson Plans', description: 'Curriculum and lesson planning', icon: BookOpen, count: 15 },
      { name: 'Calendar', description: 'Academic calendar and events', icon: Calendar, count: 6 },
      { name: 'Timetable', description: 'Class schedules and timetables', icon: ClipboardList, count: 10 },
      { name: 'Feedback', description: 'Student and faculty feedback', icon: MessageSquare, count: 9 },
      { name: 'Notifications', description: 'Academic notifications and alerts', icon: BarChart3, count: 7 }
    ]
  },
  {
    id: 'lms',
    title: 'Learning Management System',
    description: 'Online learning analytics and course management',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    reportCount: 6,
    subReports: [
      { name: 'Courses', description: 'Course enrollment and completion', icon: BookOpen, count: 14 },
      { name: 'Lessons', description: 'Lesson delivery and engagement', icon: Video, count: 18 },
      { name: 'Assessments', description: 'Online assessments and quizzes', icon: FileText, count: 22 },
      { name: 'Assignments', description: 'Assignment submissions and grading', icon: ClipboardList, count: 16 },
      { name: 'Cohorts', description: 'Student group management', icon: Users, count: 8 },
      { name: 'Certificates', description: 'Course completion certificates', icon: Award, count: 11 }
    ]
  },
  {
    id: 'examinations',
    title: 'Examination System',
    description: 'Comprehensive examination management and analysis',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    reportCount: 7,
    subReports: [
      { name: 'Planning', description: 'Exam scheduling and planning', icon: Calendar, count: 9 },
      { name: 'Question Bank', description: 'Question repository and management', icon: BookOpen, count: 25 },
      { name: 'Paper Generation', description: 'Automated paper generation', icon: FileText, count: 13 },
      { name: 'Hall Tickets', description: 'Hall ticket generation and management', icon: UserCheck, count: 8 },
      { name: 'Invigilators', description: 'Invigilation duty assignment', icon: Users, count: 6 },
      { name: 'Evaluation', description: 'Answer sheet evaluation and grading', icon: TrendingUp, count: 19 },
      { name: 'Results', description: 'Result compilation and analysis', icon: BarChart3, count: 11 }
    ]
  },
  {
    id: 'staff',
    title: 'Staff Management',
    description: 'Faculty and staff analytics and performance reports',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    reportCount: 4,
    subReports: [
      { name: 'Allotment', description: 'Subject and workload allocation', icon: ClipboardList, count: 7 },
      { name: 'Roles', description: 'Role assignments and permissions', icon: UserCheck, count: 5 },
      { name: 'Performance', description: 'Faculty performance evaluation', icon: TrendingUp, count: 8 },
      { name: 'Workload', description: 'Teaching load distribution', icon: BarChart3, count: 6 }
    ]
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'User activity and system usage analytics',
    icon: UserCheck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    reportCount: 3,
    subReports: [
      { name: 'Admins', description: 'Administrative user analytics', icon: Users, count: 4 },
      { name: 'Faculty', description: 'Faculty user engagement', icon: GraduationCap, count: 12 },
      { name: 'Students', description: 'Student user activity', icon: Users, count: 15 }
    ]
  }
];

export default function ReportsDashboard() {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleModuleClick = (moduleId: string) => {
    navigate(`/reports/${moduleId}`);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await exportAllReports(moduleReportCategories.map(module => ({
        id: module.id,
        title: module.title,
        reportCount: module.reportCount
      })));
    } finally {
      setIsExporting(false);
    }
  };

  const totalReports = moduleReportCategories.reduce((sum, module) => sum + module.reportCount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Access comprehensive reports and analytics across all system modules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {totalReports} Total Report Types
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Modules</p>
                <p className="text-3xl font-bold">{moduleReportCategories.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Report Types</p>
                <p className="text-3xl font-bold">{totalReports}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Generated Today</p>
                <p className="text-3xl font-bold">47</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Automated</p>
                <p className="text-3xl font-bold">89%</p>
              </div>
              <UserCheck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Select Module for Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleReportCategories.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card 
                key={module.id}
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-opacity-50 ${module.bgColor}`}
                onClick={() => handleModuleClick(module.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${module.color}`} />
                      <span>{module.title}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Available Reports</span>
                      <Badge variant="secondary">{module.reportCount} types</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {module.subReports.slice(0, 4).map((subReport, index) => {
                        const SubIcon = subReport.icon;
                        return (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <SubIcon className="h-3 w-3" />
                            <span className="truncate">{subReport.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {module.subReports.length > 4 && (
                      <p className="text-xs text-muted-foreground">
                        +{module.subReports.length - 4} more report types
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Report Activity</CardTitle>
          <CardDescription>
            Recently generated reports across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Academic Performance Analysis', module: 'Academics', time: '2 minutes ago', user: 'Dr. Smith' },
              { name: 'Course Completion Report', module: 'LMS', time: '15 minutes ago', user: 'Prof. Johnson' },
              { name: 'Exam Results Summary', module: 'Examinations', time: '1 hour ago', user: 'Admin' },
              { name: 'Faculty Workload Analysis', module: 'Staff', time: '3 hours ago', user: 'HR Manager' },
              { name: 'Student Enrollment Report', module: 'Users', time: '5 hours ago', user: 'Registrar' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.module} • Generated by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
