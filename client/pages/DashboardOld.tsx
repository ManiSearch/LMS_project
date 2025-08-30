import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ResizeObserverErrorBoundary from '@/components/ResizeObserverErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { mockStats, mockStudents, mockCourses, mockExams, mockAttendanceData, mockExamResults } from '@/mock/data';
import {
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Settings
} from 'lucide-react';
import { Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function Dashboard() {
  const { user, switchRole } = useAuth();
  const { state } = useApp();
  const {
    dashboardStats,
    quickActions,
    recentActivities,
    loading,
    handleQuickAction,
    handleModuleClick,
    handleRefresh,
    isActionLoading
  } = useDashboard();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState(false);

  // Get module context from navigation state
  const selectedModule = location.state?.selectedModule;
  const moduleData = location.state?.moduleData;

  // Handle refresh with visual feedback
  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="stat-card stat-card-primary cursor-pointer" onClick={() => handleModuleClick({ title: 'Student Management' })}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Students</p>
              <div className="text-3xl font-bold text-blue-900 mt-2">
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  (dashboardStats.totalStudents || mockStats.totalStudents).toLocaleString()
                )}
              </div>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Faculty</p>
              <div className="text-3xl font-bold text-green-900 mt-2">{mockStats.totalFaculty}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +3 new this semester
              </p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Active Courses</p>
              <div className="text-3xl font-bold text-orange-900 mt-2">{mockStats.totalCourses}</div>
              <p className="text-xs text-orange-600 mt-1">
                Across all programs
              </p>
            </div>
            <div className="p-3 bg-orange-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Pass Rate</p>
              <div className="text-3xl font-bold text-purple-900 mt-2">{mockStats.passRate}%</div>
              <p className="text-xs text-purple-600 mt-1 flex items-center">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2.1% from last year
              </p>
            </div>
            <div className="p-3 bg-purple-600 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="section-card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
            <p className="text-sm text-gray-600">Monthly attendance rates</p>
          </div>
          <ResizeObserverErrorBoundary>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={mockAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{fill: '#3b82f6', strokeWidth: 2, r: 4}}
                />
              </LineChart>
            </ResponsiveContainer>
          </ResizeObserverErrorBoundary>
        </div>

        <div className="section-card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Exam Results</h3>
            <p className="text-sm text-gray-600">Pass/Fail rates by subject</p>
          </div>
          <ResizeObserverErrorBoundary>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={mockExamResults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pass" fill="#10b981" name="Pass" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fail" fill="#ef4444" name="Fail" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ResizeObserverErrorBoundary>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-600">Common administrative tasks</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button className="btn-primary h-auto p-4 flex flex-col items-center gap-3">
            <Users className="h-6 w-6" />
            <span>Manage Students</span>
          </button>
          <button className="btn-secondary h-auto p-4 flex flex-col items-center gap-3">
            <Calendar className="h-6 w-6" />
            <span>Schedule Exams</span>
          </button>
          <button className="btn-secondary h-auto p-4 flex flex-col items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderFacultyDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Data Structures</span>
                <Badge>45 students</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Algorithms</span>
                <Badge>38 students</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Database Systems</span>
                <Badge>42 students</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Data Structures</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - Room 101</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Algorithms</p>
                  <p className="text-sm text-muted-foreground">2:00 PM - Room 203</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-success" />
                <div>
                  <p className="font-medium">Assignment graded</p>
                  <p className="text-sm text-muted-foreground">CS301 - 25 submissions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-warning" />
                <div>
                  <p className="font-medium">Attendance pending</p>
                  <p className="text-sm text-muted-foreground">Mark today's attendance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{course.name}</span>
                    <Badge variant="secondary">{course.credits} credits</Badge>
                  </div>
                  <Progress value={Math.random() * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockExams.slice(0, 2).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{exam.subject}</p>
                    <p className="text-sm text-muted-foreground">{exam.date}</p>
                  </div>
                  <Badge>{exam.duration} min</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">8.2</div>
              <p className="text-sm text-muted-foreground">Current CGPA</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">87%</div>
              <p className="text-sm text-muted-foreground">Attendance</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24</div>
              <p className="text-sm text-muted-foreground">Credits Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderParentDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Child's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Overall Grade</span>
                <Badge variant="default">A-</Badge>
              </div>
              <div className="flex justify-between">
                <span>Attendance</span>
                <span className="font-medium">91%</span>
              </div>
              <div className="flex justify-between">
                <span>Assignments</span>
                <span className="font-medium">18/20</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                <div>
                  <p className="font-medium">Assignment Due</p>
                  <p className="text-sm text-muted-foreground">Math homework due tomorrow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Exam Result</p>
                  <p className="text-sm text-muted-foreground">Science test: 85%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Parent-Teacher Meet</p>
                  <p className="text-sm text-muted-foreground">March 20, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Mid-term Exams</p>
                  <p className="text-sm text-muted-foreground">March 25-30, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderQuickAccessCards = () => {
    const quickAccessItems = {
      admin: [
        {
          title: 'Core System',
          icon: Settings,
          description: 'Institution setup & user management',
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          submodules: [
            { title: 'Entity Setup', href: '/master/entity-setup', icon: '🏢' },
            { title: 'Academic Year Setup', href: '/master/academic-year-setup', icon: '📅' },
            { title: 'Program Setup', href: '/master/program-setup', icon: '🎓' },
            { title: 'Stream & Course Mapping', href: '/master/stream-course-mapping', icon: '🔗' },
            { title: 'Term & Semester Setup', href: '/master/term-semester-setup', icon: '📆' },
            { title: 'Subject Master', href: '/master/subject-master-setup', icon: '📖' },
            { title: 'Registration Forms', href: '/master/registration-form-setup', icon: '📝' },
            { title: 'User Roles & Permissions', href: '/master/user-role-permissions-setup', icon: '🔐' }
          ]
        },
        {
          title: 'Academics',
          icon: BookOpen,
          description: 'Academic management & curriculum',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          submodules: [
            { title: 'Students', href: '/academics/students', icon: '👨‍🎓' },
            { title: 'Curriculum', href: '/academics/curriculum', icon: '📚' },
            { title: 'Timetable', href: '/academics/timetable', icon: '📅' },
            { title: 'Lesson Plans', href: '/academics/lesson-plans', icon: '📝' },
            { title: 'Attendance', href: '/academics/attendance', icon: '✅' },
            { title: 'Feedback', href: '/academics/feedback', icon: '💬' },
            { title: 'Scholarships', href: '/academics/scholarships', icon: '🏆' },
            { title: 'Dropouts', href: '/academics/dropouts', icon: '⚠️' },
            { title: 'Calendar', href: '/academics/calendar', icon: '📆' }
          ]
        },
        {
          title: 'Learning Management',
          icon: GraduationCap,
          description: 'Digital learning & courses',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          submodules: [
            { title: 'Courses', href: '/lms/courses', icon: '📖' },
            { title: 'Assignments', href: '/lms/assignments', icon: '📄' },
            { title: 'Assessments', href: '/lms/assessments', icon: '📊' },
            { title: 'Progress', href: '/lms/progress', icon: '📈' },
            { title: 'Lessons', href: '/lms/lessons', icon: '🎬' },
            { title: 'Cohorts', href: '/lms/cohorts', icon: '👥' },
            { title: 'Discussion Forums', href: '/lms/discussion-forums', icon: '💭' },
            { title: 'Certificates', href: '/lms/certificates', icon: '🏅' },
            { title: 'Virtual Classrooms', href: '/lms/virtual-classrooms', icon: '���' },
            { title: 'Reports', href: '/lms/reports', icon: '📋' }
          ]
        },
        {
          title: 'Examinations',
          icon: FileText,
          description: 'Exam management & evaluation',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          submodules: [
            { title: 'Planning', href: '/exams/planning', icon: '📋' },
            { title: 'Eligibility', href: '/exams/eligibility', icon: '✓' },
            { title: 'Hall Tickets', href: '/exams/halltickets', icon: '🎫' },
            { title: 'Question Bank', href: '/exams/question-bank', icon: '❓' },
            { title: 'Paper Blueprint', href: '/exams/paper-blueprint', icon: '📐' },
            { title: 'Paper Generation', href: '/exams/paper-generation', icon: '📄' },
            { title: 'Invigilators', href: '/exams/invigilators', icon: '👮' },
            { title: 'Seating Plan', href: '/exams/seating-plan', icon: '🪑' },
            { title: 'Evaluation', href: '/exams/evaluation', icon: '📝' },
            { title: 'Results', href: '/exams/results', icon: '📊' },
            { title: 'Revaluation', href: '/exams/revaluation', icon: '🔄' },
            { title: 'Transcripts', href: '/exams/transcripts', icon: '����' },
            { title: 'Reports', href: '/exams/reports', icon: '📈' }
          ]
        }
      ],
      faculty: [
        {
          title: 'Academics',
          icon: BookOpen,
          description: 'Manage students & curriculum',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          submodules: [
            { title: 'Students', href: '/academics/students', icon: '👨‍🎓' },
            { title: 'Curriculum', href: '/academics/curriculum', icon: '📚' },
            { title: 'Timetable', href: '/academics/timetable', icon: '📅' },
            { title: 'Lesson Plans', href: '/academics/lesson-plans', icon: '📝' },
            { title: 'Attendance', href: '/academics/attendance', icon: '✅' },
            { title: 'Feedback', href: '/academics/feedback', icon: '💬' }
          ]
        },
        {
          title: 'Learning Management',
          icon: GraduationCap,
          description: 'Courses & assignments',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          submodules: [
            { title: 'Courses', href: '/lms/courses', icon: '📖' },
            { title: 'Assignments', href: '/lms/assignments', icon: '📄' },
            { title: 'Assessments', href: '/lms/assessments', icon: '📊' },
            { title: 'Progress', href: '/lms/progress', icon: '📈' },
            { title: 'Lessons', href: '/lms/lessons', icon: '🎬' },
            { title: 'Cohorts', href: '/lms/cohorts', icon: '👥' },
            { title: 'Discussion Forums', href: '/lms/discussion-forums', icon: '💭' },
            { title: 'Certificates', href: '/lms/certificates', icon: '🏅' },
            { title: 'Virtual Classrooms', href: '/lms/virtual-classrooms', icon: '���' },
            { title: 'Reports', href: '/lms/reports', icon: '��' }
          ]
        },
        {
          title: 'Examinations',
          icon: FileText,
          description: 'Exam planning & evaluation',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          submodules: [
            { title: 'Planning', href: '/exams/planning', icon: '📋' },
            { title: 'Eligibility', href: '/exams/eligibility', icon: '✓' },
            { title: 'Hall Tickets', href: '/exams/halltickets', icon: '🎫' },
            { title: 'Question Bank', href: '/exams/question-bank', icon: '❓' },
            { title: 'Paper Blueprint', href: '/exams/paper-blueprint', icon: '📐' },
            { title: 'Paper Generation', href: '/exams/paper-generation', icon: '📄' },
            { title: 'Evaluation', href: '/exams/evaluation', icon: '📝' },
            { title: 'Reports', href: '/exams/reports', icon: '📈' }
          ]
        }
      ],
      student: [
        {
          title: 'Learning Management',
          icon: GraduationCap,
          description: 'My courses & assignments',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          submodules: [
            { title: 'Courses', href: '/lms/courses', icon: '📖' },
            { title: 'Assignments', href: '/lms/assignments', icon: '📄' },
            { title: 'Assessments', href: '/lms/assessments', icon: '📊' },
            { title: 'Progress', href: '/lms/progress', icon: '📈' },
            { title: 'Lessons', href: '/lms/lessons', icon: '🎬' },
            { title: 'Discussion Forums', href: '/lms/discussion-forums', icon: '💭' },
            { title: 'Certificates', href: '/lms/certificates', icon: '🏅' },
            { title: 'Virtual Classrooms', href: '/lms/virtual-classrooms', icon: '💻' }
          ]
        },
        {
          title: 'Examinations',
          icon: FileText,
          description: 'Exams & results',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          submodules: [
            { title: 'Eligibility', href: '/exams/eligibility', icon: '✓' },
            { title: 'Hall Tickets', href: '/exams/halltickets', icon: '🎫' },
            { title: 'Results', href: '/exams/results', icon: '📊' },
            { title: 'Revaluation', href: '/exams/revaluation', icon: '🔄' },
            { title: 'Transcripts', href: '/exams/transcripts', icon: '📜' }
          ]
        }
      ],
      parent: [
        {
          title: 'Academics',
          icon: Calendar,
          description: 'Events & schedules',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          submodules: [
            { title: 'Timetable', href: '/academics/timetable', icon: '📅' },
            { title: 'Feedback', href: '/academics/feedback', icon: '💬' },
            { title: 'Calendar', href: '/academics/calendar', icon: '📆' }
          ]
        },
        {
          title: 'Examinations',
          icon: FileText,
          description: "Child's exam results",
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          submodules: [
            { title: 'Results', href: '/exams/results', icon: '📊' }
          ]
        }
      ]
    };

    const items = quickAccessItems[user?.role as keyof typeof quickAccessItems] || [];

    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {items.map((item) => (
          <div key={item.title} className="section-card hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-600 rounded-xl">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {item.submodules.slice(0, 8).map((submodule, index) => (
                <Link
                  key={submodule.href}
                  to={submodule.href}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200"
                  onClick={(e) => {
                    handleModuleClick(item, submodule);
                  }}
                >
                  <span className="text-lg">{submodule.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                    {submodule.title}
                  </span>
                  {isActionLoading(`${item.title}_${submodule.title}`) && (
                    <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full ml-auto" />
                  )}
                </Link>
              ))}
              {item.submodules.length > 8 && (
                <div className="flex items-center justify-center p-3 rounded-lg bg-gray-100 text-sm text-gray-500">
                  +{item.submodules.length - 8} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render interactive quick actions
  const renderQuickActions = () => {
    if (!quickActions.length) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Tasks that need your attention
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  action.urgent && "border-orange-200 bg-orange-50"
                )}
                onClick={() => handleQuickAction(action)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{action.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{action.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {action.count > 0 && (
                          <Badge variant={action.urgent ? "destructive" : "secondary"}>
                            {action.count}
                          </Badge>
                        )}
                        {action.urgent && (
                          <Badge variant="outline" className="text-orange-600">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isActionLoading(action.id) && (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render recent activities
  const renderRecentActivities = () => {
    if (!recentActivities.length) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest updates and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                <div className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  activity.type === 'user_login' && "bg-green-500",
                  activity.type === 'exam_created' && "bg-blue-500",
                  activity.type === 'student_enrolled' && "bg-purple-500",
                  activity.type === 'assignment_submitted' && "bg-orange-500",
                  activity.type === 'grade_posted' && "bg-yellow-500"
                )} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderModuleDashboard = () => {
    if (!moduleData) return null;

    // Master Setup module shows all modules
    if (selectedModule === 'master-setup') {
      const allModules = [
        { id: 'academic-operation', title: 'Academic Operation' },
        { id: 'admission', title: 'Admission' },
        { id: 'student-support', title: 'Student Support' },
        { id: 'lms', title: 'LMS' },
        { id: 'examination', title: 'Examination' },
        { id: 'alumni-management', title: 'Alumni Management' },
        { id: 'hostel', title: 'Hostel' },
        { id: 'library', title: 'Library' },
        { id: 'procurement', title: 'Procurement' },
        { id: 'asset-management', title: 'Asset Management' },
        { id: 'finance-management', title: 'Finance Management' },
        { id: 'hrms', title: 'HRMS' },
        { id: 'payroll', title: 'Payroll' },
        { id: 'affiliation', title: 'Affiliation' },
        { id: 'gte', title: 'GTE' },
        { id: 'research', title: 'Research' }
      ];

      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Master Setup Control Panel
              </CardTitle>
              <CardDescription>
                Full access to all system modules - {user?.role} privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allModules.map((module) => (
                  <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-sm">{module.title}</h4>
                      <Badge variant="outline" className="mt-2 text-xs">
                        Full Access
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Regular module dashboard
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Module: {moduleData.title}</CardTitle>
            <CardDescription>{moduleData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium">Module Dashboard</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {moduleData.title} specific content will be displayed here
              </p>
              <Badge variant="outline" className="mt-3">
                Coming Soon
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
            {moduleData ? `${moduleData.title} Dashboard` : 'Dashboard'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, {user?.name?.split(' ')[0]}!
            {moduleData
              ? ` Managing ${moduleData.title} module with your ${user?.role} access.`
              : ` Here's what's happening with your ${user?.role} account.`
            }
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing || loading}
          className="w-full sm:w-auto"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-4 sm:p-6">
                <Skeleton className="h-24 sm:h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        renderQuickAccessCards()
      )}

      {renderQuickActions()}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          {selectedModule ? renderModuleDashboard() : (
            <>
              {user?.role === 'super-admin' && renderAdminDashboard()}
              {(user?.role === 'admin' || user?.role === 'institution' || user?.role === 'principal') && renderAdminDashboard()}
              {(user?.role === 'faculty' || user?.role === 'hod') && renderFacultyDashboard()}
              {user?.role === 'student' && renderStudentDashboard()}
              {(user?.role === 'parent' || user?.role === 'staff') && renderParentDashboard()}
            </>
          )}
        </div>

        <div>
          {renderRecentActivities()}
        </div>
      </div>
    </div>
  );
}
