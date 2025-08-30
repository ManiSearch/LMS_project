import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Construction,
  Sparkles,
  Settings,
  Grid3X3,
  Users,
  BookOpen,
  Monitor,
  FileText,
  Building,
  Package,
  DollarSign,
  Award,
  Library,
  ShoppingCart,
  UserCheck,
  CreditCard,
  Building2,
  PenTool,
  FlaskConical,
  GraduationCap,
  ChevronRight,
  Calendar,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  MapPin,
  RefreshCw,
  ClipboardList,
  FileQuestion,
  Trophy,
  Video,
  School
} from "lucide-react";
import { hasModuleAccess, getRoleDisplayName } from "@/utils/modulePermissions";
import { UserRole } from "@/contexts/AuthContext";

// Module configuration with quick actions
const moduleConfigs = {
  "lms": {
    id: "lms",
    title: "Learning Management System",
    description: "Complete learning management system with courses and content",
    icon: Monitor,
    gradient: "from-green-500 to-green-600",
    color: "text-green-600",
    bgColor: "bg-green-50",
    quickActions: [
      { title: 'Courses', icon: BookOpen, href: '/lms/courses', description: 'Create and manage courses', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Assignments', icon: ClipboardList, href: '/lms/assignments', description: 'Course assignments and submissions', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Assessments', icon: FileQuestion, href: '/lms/assessments', description: 'Quizzes and examinations', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Progress', icon: TrendingUp, href: '/lms/progress', description: 'Student learning progress tracking', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Lessons', icon: BookOpen, href: '/lms/lessons', description: 'Interactive lesson content', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Cohorts', icon: Users, href: '/lms/cohorts', description: 'Student groups and batches', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Discussion Forums', icon: MessageSquare, href: '/lms/discussion-forums', description: 'Course discussions and Q&A', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Certificates', icon: Award, href: '/lms/certificates', description: 'Digital certificates and badges', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Virtual Classroom', icon: Video, href: '/lms/virtual-classrooms', description: 'Online classes and meetings', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Proctoring', icon: Shield, href: '/lms/proctoring', description: 'Online exam supervision', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Reports', icon: FileText, href: '/lms/reports', description: 'Learning analytics and reports', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Sessions', icon: Calendar, href: '/lms/sessions', description: 'Live learning sessions', roles: ['super-admin', 'admin', 'faculty', 'institution', 'principal', 'student'] }
    ]
  },
  "exams": {
    id: "examination",
    title: "Examination System",
    description: "Comprehensive examination management and evaluation",
    icon: ClipboardList,
    gradient: "from-purple-500 to-purple-600",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    quickActions: [
      { title: 'Planning', icon: Calendar, href: '/exams/planning', description: 'Exam schedule and planning', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Eligibility', icon: UserCheck, href: '/exams/eligibility', description: 'Student exam eligibility', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Hall Tickets', icon: FileText, href: '/exams/halltickets', description: 'Generate and manage hall tickets', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Question Bank', icon: FileQuestion, href: '/exams/question-bank', description: 'Question repository management', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Paper Blueprint', icon: ClipboardList, href: '/exams/paper-blueprint', description: 'Exam paper structure and design', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Paper Generation', icon: FileText, href: '/exams/paper-generation', description: 'Automated paper generation', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Invigilators', icon: Users, href: '/exams/invigilators', description: 'Exam supervision management', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Seating Plan', icon: MapPin, href: '/exams/seating-plan', description: 'Exam seating arrangements', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Evaluation', icon: ClipboardList, href: '/exams/evaluation', description: 'Answer sheet evaluation', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Results', icon: Trophy, href: '/exams/results', description: 'Exam results and analytics', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Revaluation', icon: RefreshCw, href: '/exams/revaluation', description: 'Result revaluation process', roles: ['super-admin', 'admin', 'institution', 'principal', 'student'] },
      { title: 'Transcripts', icon: Trophy, href: '/exams/transcripts', description: 'Official academic transcripts', roles: ['super-admin', 'admin', 'institution', 'principal', 'student'] },
      { title: 'Reports', icon: FileText, href: '/exams/reports', description: 'Examination analytics and reports', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] }
    ]
  },
  "academics": {
    id: "academic-operation",
    title: "Academic Management",
    description: "Comprehensive academic administration and student management",
    icon: GraduationCap,
    gradient: "from-blue-500 to-blue-600",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    quickActions: [
      { title: 'Students', icon: Users, href: '/academics/students', description: 'Manage student records and profiles', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Curriculum', icon: BookOpen, href: '/academics/curriculum', description: 'Design and manage curriculum', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Timetable', icon: Calendar, href: '/academics/timetable', description: 'Schedule management and planning', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student', 'parent'] },
      { title: 'Attendance', icon: CheckCircle, href: '/academics/attendance', description: 'Track student attendance', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Lesson Plans', icon: FileText, href: '/academics/lesson-plans', description: 'Create and manage lesson plans', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Feedback', icon: MessageSquare, href: '/academics/feedback', description: 'Student and course feedback', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student'] },
      { title: 'Scholarships', icon: Award, href: '/academics/scholarships', description: 'Scholarship programs and awards', roles: ['super-admin', 'admin', 'institution', 'principal', 'student'] },
      { title: 'Dropouts', icon: AlertTriangle, href: '/academics/dropouts', description: 'Semester dropout management', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Calendar', icon: Calendar, href: '/academics/calendar', description: 'Academic calendar and events', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'student', 'parent'] },
      { title: 'Notifications', icon: MessageSquare, href: '/academics/notifications', description: 'System notifications and alerts', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Reports', icon: FileText, href: '/academics/reports', description: 'Academic performance reports', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty'] },
      { title: 'Service Requests', icon: MessageSquare, href: '/academics/service-requests', description: 'Student service requests', roles: ['super-admin', 'admin', 'institution', 'principal', 'hod', 'faculty', 'staff', 'student'] }
    ]
  },
  "master-setup": {
    id: "master-setup",
    title: "Master Setup & Configuration",
    description: "Complete system configuration and master data management",
    icon: Settings,
    gradient: "from-orange-500 to-orange-600",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    quickActions: [
      { title: 'Entity Setup', icon: Building, href: '/master/entity-setup', description: 'Organization structure and institutional setup', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Academic Year Setup', icon: Calendar, href: '/master/academic-year-setup', description: 'Academic year configuration and management', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Program Setup', icon: GraduationCap, href: '/master/program-setup', description: 'Academic programs, degrees, and courses', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Stream Course Mapping', icon: Settings, href: '/master/stream-course-mapping', description: 'Course and stream relationships mapping', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Term/Semester Setup', icon: Calendar, href: '/master/term-semester-setup', description: 'Academic term and semester configuration', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Subject Master Setup', icon: BookOpen, href: '/master/subject-master-setup', description: 'Subject and curriculum master data', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Registration Form Setup', icon: FileText, href: '/master/registration-form-setup', description: 'Student registration forms and fields', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'User Role Permissions', icon: Shield, href: '/master/user-role-permissions-setup', description: 'Role-based access control and permissions', roles: ['super-admin', 'admin'] },
      { title: 'Staff Roles', icon: Users, href: '/staff/roles', description: 'Staff roles and responsibilities definition', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Staff Allotment', icon: Calendar, href: '/staff/allotment', description: 'Staff assignments and scheduling', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Administrators', icon: Shield, href: '/users/admins', description: 'System administrators management', roles: ['super-admin', 'admin'] },
      { title: 'Faculty', icon: School, href: '/users/faculty', description: 'Faculty members and teaching staff', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Students', icon: GraduationCap, href: '/users/students', description: 'Student accounts and profiles', roles: ['super-admin', 'admin', 'institution', 'principal'] },
      { title: 'Permissions', icon: Shield, href: '/settings/permissions', description: 'Global permission management', roles: ['super-admin'] }
    ]
  }
};

// Function to detect module from URL
function getModuleFromPath(pathname: string): string | null {
  if (pathname.startsWith('/lms')) return 'lms';
  if (pathname.startsWith('/exams')) return 'exams';
  if (pathname.startsWith('/academics')) return 'academics';
  if (pathname.startsWith('/master')) return 'master-setup';
  return null;
}

export default function ModuleDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentPath = location.pathname;
  const moduleKey = getModuleFromPath(currentPath);
  
  const moduleConfig = moduleKey ? moduleConfigs[moduleKey as keyof typeof moduleConfigs] : null;
  const userRole = user?.role as UserRole;

  // Filter quick actions based on user role
  const getFilteredQuickActions = (quickActions: any[], userRole: string | undefined) => {
    if (!userRole) return [];
    return quickActions.filter(action => action.roles.includes(userRole));
  };

  // Check permissions
  const hasAccess = moduleConfig && userRole && hasModuleAccess(userRole, moduleConfig.id);

  if (!moduleConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Module</h2>
            <p className="text-gray-600 mb-4">
              The requested module could not be found.
            </p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modules
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-lg">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the{" "}
              <strong>{moduleConfig.title}</strong> module.
            </p>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your role:{" "}
                  <Badge variant="outline">
                    {getRoleDisplayName(userRole)}
                  </Badge>
                </AlertDescription>
              </Alert>
              <Button onClick={() => navigate("/")} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Module Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IconComponent = moduleConfig.icon;
  const filteredQuickActions = getFilteredQuickActions(moduleConfig.quickActions, userRole);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${moduleConfig.gradient} opacity-10`}></div>
        <Card className="relative border-none shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${moduleConfig.gradient} text-white shadow-lg`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{moduleConfig.title}</h1>
                  <p className="text-muted-foreground mt-1">{moduleConfig.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      Module Dashboard
                    </Badge>
                    <Badge variant="outline">
                      {user?.role?.toUpperCase()} Access
                    </Badge>
                    {moduleConfig.id === 'master-setup' && (
                      <Badge variant="destructive">
                        Core System Configuration
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Main Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Special handling for Master Setup */}
      {moduleConfig.id === 'master-setup' && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900">System Foundation Module</h3>
                <p className="text-orange-800 mt-1">
                  This module contains the core configuration that affects the entire ERP system.
                  Changes here will impact all other modules. Please proceed with caution and ensure
                  proper backup before making modifications.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    System Critical
                  </Badge>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    Requires Admin Access
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            {user?.role === 'student' ? 'Available Features' : 'Quick Actions'}
            <Badge variant="outline" className="ml-2">
              {filteredQuickActions.length} Available
            </Badge>
          </CardTitle>
          <CardDescription>
            {moduleConfig.id === 'master-setup'
              ? `Configure system-wide settings and master data for ${moduleConfig.title}`
              : `Access key features and tools for ${moduleConfig.title} based on your role (${user?.role})`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredQuickActions.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
              moduleConfig.id === 'master-setup' ? 'xl:grid-cols-2' : 'xl:grid-cols-4'
            } gap-4`}>
              {filteredQuickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Card className={`group hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-primary/20 ${
                    moduleConfig.id === 'master-setup' ? 'min-h-[120px]' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${moduleConfig.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                          <action.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                            {action.description}
                          </p>
                          {moduleConfig.id === 'master-setup' && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              System Configuration
                            </Badge>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Actions Available</h3>
                <p className="text-muted-foreground">
                  Your current role ({user?.role}) doesn't have access to any actions in this module.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module-specific analytics or additional info */}
      {moduleConfig.id === 'master-setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { item: 'Entity Structure', status: 'Configured', color: 'text-green-600' },
                  { item: 'Academic Calendar', status: 'Active', color: 'text-green-600' },
                  { item: 'User Roles', status: 'Configured', color: 'text-green-600' },
                  { item: 'Programs & Streams', status: 'In Progress', color: 'text-orange-600' }
                ].map((config, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{config.item}</span>
                    <Badge variant="outline" className={config.color}>
                      {config.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { item: 'Role-Based Access', status: 'Active', users: '7 roles' },
                  { item: 'Permission Matrix', status: 'Configured', users: '247 permissions' },
                  { item: 'Module Access', status: 'Secured', users: '8 modules' },
                  { item: 'Data Protection', status: 'Enabled', users: 'GDPR Compliant' }
                ].map((security, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">{security.item}</span>
                      <p className="text-xs text-muted-foreground">{security.users}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {security.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
