import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormField } from '@/components/forms/FormField';
import { useFormHandler, useAcademicHandlers, useLMSHandlers, useExamHandlers } from '@/hooks/useFormHandlers';
import { validationRules, toastHelpers, simulateAsyncOperation } from '@/utils/formUtils';
import { 
  Users, 
  Plus, 
  BookOpen, 
  FileText, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Save,
  X,
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

// Mock dashboard data
const initialDashboardData = {
  stats: {
    totalStudents: 1248,
    totalCourses: 45,
    upcomingExams: 8,
    assignmentsPending: 23
  },
  quickActions: [
    { id: 1, title: 'Grade Assignments', count: 15, urgent: true, icon: '📝' },
    { id: 2, title: 'Schedule Exam', count: 3, urgent: false, icon: '📅' },
    { id: 3, title: 'Update Attendance', count: 6, urgent: true, icon: '✅' },
    { id: 4, title: 'Review Applications', count: 8, urgent: false, icon: '📋' }
  ],
  recentActivities: [
    { id: 1, type: 'assignment', message: '15 new assignments submitted', time: '2 hours ago' },
    { id: 2, type: 'exam', message: 'Physics exam scheduled for next week', time: '4 hours ago' },
    { id: 3, type: 'student', message: '3 new students enrolled', time: '1 day ago' }
  ],
  notifications: [
    { id: 1, type: 'warning', title: 'Attendance Below Threshold', message: '5 students have attendance below 75%', read: false },
    { id: 2, type: 'info', title: 'New Course Available', message: 'Advanced Mathematics course is now open for enrollment', read: false },
    { id: 3, type: 'success', title: 'Exam Results Published', message: 'Mid-term exam results are available', read: true }
  ]
};

export default function InteractiveDashboardDemo() {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQuickActionDialog, setShowQuickActionDialog] = useState(false);
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);

  const { studentHandlers, attendanceHandlers } = useAcademicHandlers();
  const { courseHandlers, assignmentHandlers } = useLMSHandlers();
  const { examHandlers } = useExamHandlers();

  // Quick action form handler
  const quickActionForm = useFormHandler(
    ['actionType', 'notes'],
    {},
    {
      actionType: [validationRules.required],
      notes: [validationRules.minLength(5)]
    }
  );

  // Exam scheduling form handler
  const examForm = useFormHandler(
    ['subject', 'date', 'duration', 'totalMarks', 'room'],
    {},
    {
      subject: [validationRules.required],
      date: [validationRules.required],
      duration: [validationRules.required, validationRules.positiveNumber],
      totalMarks: [validationRules.required, validationRules.positiveNumber],
      room: [validationRules.required]
    }
  );

  // Course creation form handler
  const courseForm = useFormHandler(
    ['name', 'description', 'instructor', 'credits', 'maxEnrollment'],
    {},
    {
      name: [validationRules.required, validationRules.minLength(3)],
      description: [validationRules.required, validationRules.minLength(10)],
      instructor: [validationRules.required],
      credits: [validationRules.required, validationRules.positiveNumber],
      maxEnrollment: [validationRules.required, validationRules.positiveNumber]
    }
  );

  // Handle quick action execution
  const handleQuickAction = async (action: any) => {
    try {
      let result;
      
      switch (action.title) {
        case 'Grade Assignments':
          result = await assignmentHandlers.grade('sub123', 85, 'Good work!');
          break;
        case 'Schedule Exam':
          setSelectedAction(action);
          setShowExamDialog(true);
          return;
        case 'Update Attendance':
          result = await attendanceHandlers.markAttendance('class123', [
            { studentId: 'st1', status: 'present' },
            { studentId: 'st2', status: 'present' },
            { studentId: 'st3', status: 'absent' }
          ]);
          break;
        case 'Review Applications':
          result = await simulateAsyncOperation(
            async () => ({ reviewed: action.count }),
            'Reviewing applications...',
            `${action.count} applications reviewed`
          );
          break;
        default:
          result = await simulateAsyncOperation(
            async () => ({ completed: true }),
            `Processing ${action.title}...`,
            `${action.title} completed successfully`
          );
      }

      // Update the action count
      setDashboardData(prev => ({
        ...prev,
        quickActions: prev.quickActions.map(qa => 
          qa.id === action.id ? { ...qa, count: Math.max(0, qa.count - 1) } : qa
        )
      }));

    } catch (error) {
      console.error('Quick action failed:', error);
    }
  };

  // Handle exam scheduling
  const handleScheduleExam = async (formData: any) => {
    try {
      const result = await examHandlers.schedule(formData);
      
      // Update dashboard stats
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          upcomingExams: prev.stats.upcomingExams + 1
        },
        recentActivities: [
          {
            id: Date.now(),
            type: 'exam',
            message: `${formData.subject} exam scheduled for ${formData.date}`,
            time: 'Just now'
          },
          ...prev.recentActivities.slice(0, 4)
        ]
      }));

      setShowExamDialog(false);
      examForm.resetForm();
    } catch (error) {
      console.error('Failed to schedule exam:', error);
    }
  };

  // Handle course creation
  const handleCreateCourse = async (formData: any) => {
    try {
      const result = await courseHandlers.create(formData);
      
      // Update dashboard stats
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalCourses: prev.stats.totalCourses + 1
        },
        recentActivities: [
          {
            id: Date.now(),
            type: 'course',
            message: `New course "${formData.name}" created`,
            time: 'Just now'
          },
          ...prev.recentActivities.slice(0, 4)
        ]
      }));

      setShowCourseDialog(false);
      courseForm.resetForm();
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  // Handle data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await simulateAsyncOperation(
        async () => {
          // Simulate fetching fresh data
          return { refreshed: true };
        },
        'Refreshing dashboard...',
        'Dashboard refreshed successfully',
        1500
      );
      
      // Simulate updated stats
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalStudents: prev.stats.totalStudents + Math.floor(Math.random() * 5),
          assignmentsPending: Math.max(0, prev.stats.assignmentsPending - Math.floor(Math.random() * 3))
        }
      }));
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle notification dismiss
  const handleDismissNotification = (notificationId: number) => {
    setDashboardData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    }));
    toastHelpers.info('Notification marked as read');
  };

  // Auto-refresh data every 30 seconds (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          assignmentsPending: Math.max(0, prev.stats.assignmentsPending + Math.floor(Math.random() * 2) - 1)
        }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const subjectOptions = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' }
  ];

  const instructorOptions = [
    { value: 'Dr. Smith', label: 'Dr. Smith' },
    { value: 'Prof. Johnson', label: 'Prof. Johnson' },
    { value: 'Ms. Davis', label: 'Ms. Davis' },
    { value: 'Mr. Wilson', label: 'Mr. Wilson' }
  ];

  const roomOptions = [
    { value: 'Room 101', label: 'Room 101' },
    { value: 'Room 102', label: 'Room 102' },
    { value: 'Lab 201', label: 'Lab 201' },
    { value: 'Auditorium', label: 'Auditorium' }
  ];

  return (
    <>
      <Toaster />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interactive Dashboard Demo</h1>
            <p className="text-muted-foreground">
              Complete example with functional forms, real-time updates, and interactive features.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            
            <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>
                    Add a new course to the curriculum
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  courseForm.submitForm(handleCreateCourse);
                }} className="space-y-4">
                  <FormField
                    label="Course Name"
                    name="name"
                    {...courseForm.getFieldProps('name')}
                    required
                  />
                  <FormField
                    label="Description"
                    name="description"
                    type="textarea"
                    {...courseForm.getFieldProps('description')}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Instructor"
                      name="instructor"
                      type="select"
                      options={instructorOptions}
                      {...courseForm.getFieldProps('instructor')}
                      required
                    />
                    <FormField
                      label="Credits"
                      name="credits"
                      type="number"
                      {...courseForm.getFieldProps('credits')}
                      required
                    />
                  </div>
                  <FormField
                    label="Max Enrollment"
                    name="maxEnrollment"
                    type="number"
                    {...courseForm.getFieldProps('maxEnrollment')}
                    required
                  />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={courseForm.isSubmitting} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {courseForm.isSubmitting ? 'Creating...' : 'Create Course'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCourseDialog(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toastHelpers.info('Students module accessed')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toastHelpers.info('Courses module accessed')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">Across all programs</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toastHelpers.info('Exams module accessed')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.upcomingExams}</div>
              <p className="text-xs text-muted-foreground">Next 2 weeks</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toastHelpers.info('Assignments module accessed')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboardData.stats.assignmentsPending}</div>
              <p className="text-xs text-muted-foreground">Require grading</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Click on any action to execute it immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.quickActions.map((action) => (
                  <Card 
                    key={action.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      action.urgent ? 'border-orange-200 bg-orange-50' : ''
                    }`}
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Click to dismiss notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.notifications.filter(n => !n.read).map((notification) => (
                  <div 
                    key={notification.id} 
                    className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleDismissNotification(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        {notification.type === 'info' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                        {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {dashboardData.notifications.filter(n => !n.read).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">All caught up!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Live feed of system activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === 'assignment' ? 'bg-blue-500' : 
                    activity.type === 'exam' ? 'bg-red-500' : 
                    activity.type === 'student' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exam Scheduling Dialog */}
        <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Exam</DialogTitle>
              <DialogDescription>
                Create a new exam schedule
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              examForm.submitForm(handleScheduleExam);
            }} className="space-y-4">
              <FormField
                label="Subject"
                name="subject"
                type="select"
                options={subjectOptions}
                {...examForm.getFieldProps('subject')}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Date"
                  name="date"
                  type="date"
                  {...examForm.getFieldProps('date')}
                  required
                />
                <FormField
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  {...examForm.getFieldProps('duration')}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Total Marks"
                  name="totalMarks"
                  type="number"
                  {...examForm.getFieldProps('totalMarks')}
                  required
                />
                <FormField
                  label="Room"
                  name="room"
                  type="select"
                  options={roomOptions}
                  {...examForm.getFieldProps('room')}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={examForm.isSubmitting} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {examForm.isSubmitting ? 'Scheduling...' : 'Schedule Exam'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowExamDialog(false)}>
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
