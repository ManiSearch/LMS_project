// Mock API services to simulate real-world backend interactions
import { mockStats, mockStudents, mockCourses, mockExams } from '@/mock/data';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API response structure
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Dashboard Services
export const dashboardService = {
  async getStats(role: string): Promise<ApiResponse<any>> {
    await delay(300);
    try {
      const roleBasedStats = {
        admin: {
          totalStudents: mockStats.totalStudents,
          totalFaculty: mockStats.totalFaculty,
          totalCourses: mockStats.totalCourses,
          passRate: mockStats.passRate,
          recentActivities: [
            { id: 1, type: 'user_login', message: 'New faculty member logged in', time: '2 minutes ago' },
            { id: 2, type: 'exam_created', message: 'Mid-term exam scheduled', time: '1 hour ago' },
            { id: 3, type: 'student_enrolled', message: '5 new students enrolled', time: '3 hours ago' }
          ]
        },
        faculty: {
          myClasses: 6,
          totalStudents: 180,
          pendingGrades: 23,
          upcomingClasses: 4,
          recentActivities: [
            { id: 1, type: 'assignment_submitted', message: '12 new assignments submitted', time: '30 minutes ago' },
            { id: 2, type: 'class_scheduled', message: 'Physics lab session updated', time: '2 hours ago' }
          ]
        },
        student: {
          currentCGPA: 8.2,
          attendanceRate: 87,
          creditsCompleted: 24,
          upcomingExams: 3,
          recentActivities: [
            { id: 1, type: 'assignment_due', message: 'Math assignment due tomorrow', time: '1 hour ago' },
            { id: 2, type: 'grade_posted', message: 'Physics test result available', time: '4 hours ago' }
          ]
        },
        parent: {
          childGrade: 'A-',
          attendanceRate: 91,
          assignmentsCompleted: '18/20',
          upcomingEvents: 2,
          recentActivities: [
            { id: 1, type: 'grade_update', message: 'Math test score: 92%', time: '2 hours ago' },
            { id: 2, type: 'meeting_scheduled', message: 'Parent-teacher meeting on Friday', time: '1 day ago' }
          ]
        }
      };

      return {
        success: true,
        data: roleBasedStats[role as keyof typeof roleBasedStats] || roleBasedStats.student
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch dashboard statistics'
      };
    }
  },

  async getQuickActions(role: string): Promise<ApiResponse<any[]>> {
    await delay(200);
    try {
      const actions = {
        admin: [
          { id: 1, title: 'Approve New Faculty', icon: '👩‍🏫', urgent: true, count: 3 },
          { id: 2, title: 'Review Applications', icon: '📋', urgent: false, count: 12 },
          { id: 3, title: 'System Backup', icon: '💾', urgent: true, count: 1 }
        ],
        faculty: [
          { id: 1, title: 'Grade Assignments', icon: '📝', urgent: true, count: 23 },
          { id: 2, title: 'Update Attendance', icon: '✅', urgent: false, count: 6 },
          { id: 3, title: 'Schedule Makeup Class', icon: '📅', urgent: false, count: 2 }
        ],
        student: [
          { id: 1, title: 'Submit Assignment', icon: '📄', urgent: true, count: 2 },
          { id: 2, title: 'Check Grades', icon: '📊', urgent: false, count: 3 },
          { id: 3, title: 'Join Discussion', icon: '💬', urgent: false, count: 5 }
        ],
        parent: [
          { id: 1, title: 'Review Progress', icon: '📈', urgent: false, count: 1 },
          { id: 2, title: 'Schedule Meeting', icon: '🤝', urgent: false, count: 1 }
        ]
      };

      return {
        success: true,
        data: actions[role as keyof typeof actions] || []
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch quick actions'
      };
    }
  }
};

// Academic Services
export const academicService = {
  async getStudents(page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    await delay(400);
    try {
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedStudents = mockStudents.slice(start, end);
      
      return {
        success: true,
        data: {
          students: paginatedStudents,
          total: mockStudents.length,
          page,
          totalPages: Math.ceil(mockStudents.length / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch students data'
      };
    }
  },

  async markAttendance(studentIds: string[], status: 'present' | 'absent' | 'late'): Promise<ApiResponse<any>> {
    await delay(600);
    try {
      // Simulate attendance marking
      const result = {
        markedCount: studentIds.length,
        status,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: result,
        message: `Attendance marked for ${studentIds.length} students as ${status}`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to mark attendance'
      };
    }
  }
};

// LMS Services
export const lmsService = {
  async getCourses(userId?: string): Promise<ApiResponse<any>> {
    await delay(350);
    try {
      return {
        success: true,
        data: {
          courses: mockCourses,
          enrolledCount: mockCourses.filter(c => c.enrolled).length,
          totalAvailable: mockCourses.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch courses'
      };
    }
  },

  async enrollInCourse(courseId: string): Promise<ApiResponse<any>> {
    await delay(800);
    try {
      const course = mockCourses.find(c => c.id === courseId);
      if (!course) {
        return {
          success: false,
          error: 'Course not found'
        };
      }

      return {
        success: true,
        data: { courseId, courseName: course.name },
        message: `Successfully enrolled in ${course.name}`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to enroll in course'
      };
    }
  }
};

// Exam Services
export const examService = {
  async getExams(role: string): Promise<ApiResponse<any>> {
    await delay(400);
    try {
      const roleBasedExams = role === 'student' 
        ? mockExams.filter(exam => exam.status === 'upcoming' || exam.status === 'completed')
        : mockExams;

      return {
        success: true,
        data: {
          exams: roleBasedExams,
          upcoming: roleBasedExams.filter(e => e.status === 'upcoming').length,
          completed: roleBasedExams.filter(e => e.status === 'completed').length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch exams'
      };
    }
  },

  async scheduleExam(examData: any): Promise<ApiResponse<any>> {
    await delay(700);
    try {
      const newExam = {
        id: `exam_${Date.now()}`,
        ...examData,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        data: newExam,
        message: `Exam "${examData.subject}" scheduled successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to schedule exam'
      };
    }
  }
};

// Notification Services
export const notificationService = {
  async getNotifications(userId: string): Promise<ApiResponse<any[]>> {
    await delay(250);
    try {
      const notifications = [
        {
          id: 1,
          type: 'info',
          title: 'System Maintenance',
          message: 'Scheduled maintenance tonight from 2 AM to 4 AM',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: 2,
          type: 'success',
          title: 'Grades Published',
          message: 'Mid-term exam results are now available',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: 3,
          type: 'warning',
          title: 'Assignment Due',
          message: 'Physics assignment due in 2 days',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          read: false
        }
      ];

      return {
        success: true,
        data: notifications
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch notifications'
      };
    }
  },

  async markAsRead(notificationId: number): Promise<ApiResponse<any>> {
    await delay(200);
    try {
      return {
        success: true,
        data: { notificationId },
        message: 'Notification marked as read'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to mark notification as read'
      };
    }
  }
};

// User Services
export const userService = {
  async updateProfile(userData: any): Promise<ApiResponse<any>> {
    await delay(600);
    try {
      return {
        success: true,
        data: userData,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    await delay(800);
    try {
      // Simulate password validation
      if (oldPassword === newPassword) {
        return {
          success: false,
          error: 'New password must be different from current password'
        };
      }

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to change password'
      };
    }
  }
};
