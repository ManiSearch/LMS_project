import { useState, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  academicService, 
  lmsService, 
  examService,
  dashboardService 
} from '@/services/mockApi';

// Custom hook for dashboard interactions
export function useDashboard() {
  const { state, showNotification, loadDashboardData } = useApp();
  const { user } = useAuth();
  const [localLoading, setLocalLoading] = useState<Record<string, boolean>>({});

  // Set loading state for specific actions
  const setActionLoading = useCallback((action: string, loading: boolean) => {
    setLocalLoading(prev => ({ ...prev, [action]: loading }));
  }, []);

  // Handle quick action clicks
  const handleQuickAction = useCallback(async (action: any) => {
    if (!user) return;

    setActionLoading(action.id, true);

    try {
      // Simulate different actions based on action type
      switch (action.title) {
        case 'Grade Assignments':
          await new Promise(resolve => setTimeout(resolve, 1000));
          showNotification({
            type: 'success',
            title: 'Assignments Graded',
            message: `${action.count} assignments have been graded successfully`,
            read: false
          });
          break;

        case 'Update Attendance':
          const attendanceResponse = await academicService.markAttendance(
            ['ST001', 'ST002', 'ST003'], 
            'present'
          );
          if (attendanceResponse.success) {
            showNotification({
              type: 'success',
              title: 'Attendance Updated',
              message: attendanceResponse.message || 'Attendance updated successfully',
              read: false
            });
          }
          break;

        case 'Submit Assignment':
          await new Promise(resolve => setTimeout(resolve, 800));
          showNotification({
            type: 'success',
            title: 'Assignment Submitted',
            message: 'Your assignment has been submitted successfully',
            read: false
          });
          break;

        case 'Check Grades':
          await new Promise(resolve => setTimeout(resolve, 600));
          showNotification({
            type: 'info',
            title: 'Grades Available',
            message: 'New grades are available for 3 subjects',
            read: false
          });
          break;

        case 'Approve New Faculty':
          await new Promise(resolve => setTimeout(resolve, 1200));
          showNotification({
            type: 'success',
            title: 'Faculty Approved',
            message: `${action.count} faculty members have been approved`,
            read: false
          });
          break;

        default:
          showNotification({
            type: 'info',
            title: 'Action Completed',
            message: `${action.title} action has been processed`,
            read: false
          });
      }

      // Reload dashboard data to reflect changes
      await loadDashboardData();

    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Action Failed',
        message: `Failed to complete ${action.title}. Please try again.`,
        read: false
      });
    } finally {
      setActionLoading(action.id, false);
    }
  }, [user, showNotification, loadDashboardData, setActionLoading]);

  // Handle module card interactions
  const handleModuleClick = useCallback(async (module: any, submodule?: any) => {
    if (!user) return;

    const moduleKey = `${module.title}_${submodule?.title || 'main'}`;
    setActionLoading(moduleKey, true);

    try {
      // Simulate loading module data
      await new Promise(resolve => setTimeout(resolve, 300));

      if (submodule) {
        showNotification({
          type: 'info',
          title: `${submodule.title} Accessed`,
          message: `Loading ${submodule.title} module...`,
          read: false
        });
      } else {
        showNotification({
          type: 'info',
          title: `${module.title} Module`,
          message: `Accessing ${module.title} module...`,
          read: false
        });
      }

    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Access Failed',
        message: 'Failed to access module. Please try again.',
        read: false
      });
    } finally {
      setActionLoading(moduleKey, false);
    }
  }, [user, showNotification, setActionLoading]);

  // Handle course enrollment
  const handleCourseEnroll = useCallback(async (courseId: string) => {
    if (!user) return;

    setActionLoading(`enroll_${courseId}`, true);

    try {
      const response = await lmsService.enrollInCourse(courseId);
      
      if (response.success) {
        showNotification({
          type: 'success',
          title: 'Enrollment Successful',
          message: response.message || 'Successfully enrolled in course',
          read: false
        });
        
        // Reload dashboard to update stats
        await loadDashboardData();
      } else {
        showNotification({
          type: 'error',
          title: 'Enrollment Failed',
          message: response.error || 'Failed to enroll in course',
          read: false
        });
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Enrollment Error',
        message: 'An error occurred during enrollment',
        read: false
      });
    } finally {
      setActionLoading(`enroll_${courseId}`, false);
    }
  }, [user, showNotification, loadDashboardData, setActionLoading]);

  // Handle exam scheduling (for faculty/admin)
  const handleExamSchedule = useCallback(async (examData: any) => {
    if (!user || !['admin', 'faculty'].includes(user.role)) return;

    setActionLoading('schedule_exam', true);

    try {
      const response = await examService.scheduleExam(examData);
      
      if (response.success) {
        showNotification({
          type: 'success',
          title: 'Exam Scheduled',
          message: response.message || 'Exam scheduled successfully',
          read: false
        });
        
        await loadDashboardData();
      } else {
        showNotification({
          type: 'error',
          title: 'Scheduling Failed',
          message: response.error || 'Failed to schedule exam',
          read: false
        });
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Scheduling Error',
        message: 'An error occurred while scheduling the exam',
        read: false
      });
    } finally {
      setActionLoading('schedule_exam', false);
    }
  }, [user, showNotification, loadDashboardData, setActionLoading]);

  // Handle data refresh
  const handleRefresh = useCallback(async () => {
    setActionLoading('refresh', true);
    
    try {
      await loadDashboardData();
      showNotification({
        type: 'success',
        title: 'Data Refreshed',
        message: 'Dashboard data has been updated',
        read: false
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh dashboard data',
        read: false
      });
    } finally {
      setActionLoading('refresh', false);
    }
  }, [loadDashboardData, showNotification, setActionLoading]);

  // Check if action is loading
  const isActionLoading = useCallback((actionId: string | number) => {
    return localLoading[actionId] || false;
  }, [localLoading]);

  return {
    // State
    dashboardStats: state.dashboardStats,
    quickActions: state.quickActions,
    recentActivities: state.recentActivities,
    loading: state.loading,
    
    // Actions
    handleQuickAction,
    handleModuleClick,
    handleCourseEnroll,
    handleExamSchedule,
    handleRefresh,
    
    // Loading states
    isActionLoading,
    
    // Utilities
    setActionLoading
  };
}

// Hook for sidebar interactions
export function useSidebar() {
  const { state, toggleSidebar } = useApp();
  
  return {
    sidebarCollapsed: state.sidebarCollapsed,
    toggleSidebar
  };
}

// Hook for modal interactions
export function useModal() {
  const { state, openModal, closeModal } = useApp();
  
  return {
    activeModal: state.activeModal,
    openModal,
    closeModal
  };
}
