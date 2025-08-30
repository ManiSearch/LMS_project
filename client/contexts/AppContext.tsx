import React, { createContext, useContext, useReducer, useEffect } from "react";
import { dashboardService, notificationService } from "@/services/mockApi";

// Types
interface Notification {
  id: number;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppState {
  loading: boolean;
  notifications: Notification[];
  unreadCount: number;
  dashboardStats: any;
  quickActions: any[];
  sidebarCollapsed: boolean;
  activeModal: string | null;
  recentActivities: any[];
  error: string | null;
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Action functions
  loadDashboardData: (user?: any) => Promise<void>;
  markNotificationAsRead: (id: number) => Promise<void>;
  toggleSidebar: () => void;
  openModal: (modalType: string) => void;
  closeModal: () => void;
  showNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => void;
  clearError: () => void;
}

// Action types
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DASHBOARD_STATS"; payload: any }
  | { type: "SET_QUICK_ACTIONS"; payload: any[] }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "MARK_NOTIFICATION_READ"; payload: number }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_COLLAPSED"; payload: boolean }
  | { type: "OPEN_MODAL"; payload: string }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_RECENT_ACTIVITIES"; payload: any[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

// Initial state
const initialState: AppState = {
  loading: false,
  notifications: [],
  unreadCount: 0,
  dashboardStats: {},
  quickActions: [],
  sidebarCollapsed: false,
  activeModal: null,
  recentActivities: [],
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_DASHBOARD_STATS":
      return { ...state, dashboardStats: action.payload };

    case "SET_QUICK_ACTIONS":
      return { ...state, quickActions: action.payload };

    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
      };

    case "MARK_NOTIFICATION_READ":
      const updatedNotifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n,
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      };

    case "ADD_NOTIFICATION":
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };

    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case "SET_SIDEBAR_COLLAPSED":
      return { ...state, sidebarCollapsed: action.payload };

    case "OPEN_MODAL":
      return { ...state, activeModal: action.payload };

    case "CLOSE_MODAL":
      return { ...state, activeModal: null };

    case "SET_RECENT_ACTIVITIES":
      return { ...state, recentActivities: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load dashboard data with user parameter
  const loadDashboardData = async (user?: any) => {
    if (!user) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      // Load dashboard stats
      const statsResponse = await dashboardService.getStats(user.role);
      if (statsResponse.success) {
        dispatch({ type: "SET_DASHBOARD_STATS", payload: statsResponse.data });
        if (statsResponse.data?.recentActivities) {
          dispatch({
            type: "SET_RECENT_ACTIVITIES",
            payload: statsResponse.data.recentActivities,
          });
        }
      }

      // Load quick actions
      const actionsResponse = await dashboardService.getQuickActions(user.role);
      if (actionsResponse.success) {
        dispatch({
          type: "SET_QUICK_ACTIONS",
          payload: actionsResponse.data || [],
        });
      }

      // Load notifications
      const notificationsResponse = await notificationService.getNotifications(
        user.id,
      );
      if (notificationsResponse.success) {
        dispatch({
          type: "SET_NOTIFICATIONS",
          payload: notificationsResponse.data || [],
        });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load dashboard data" });
      console.error("Error loading dashboard data:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id: number) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response.success) {
        dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  // Open modal
  const openModal = (modalType: string) => {
    dispatch({ type: "OPEN_MODAL", payload: modalType });
  };

  // Close modal
  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  // Show notification (for user feedback)
  const showNotification = (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });

    // Auto-remove success notifications after 5 seconds
    if (notification.type === "success") {
      setTimeout(() => {
        dispatch({
          type: "MARK_NOTIFICATION_READ",
          payload: newNotification.id,
        });
      }, 5000);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Initialize app data - can be called from components when user is available

  // Handle window resize for sidebar responsiveness
  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse sidebar on tablet and mobile screens (below 1280px)
      if (window.innerWidth < 1280) {
        dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: true });
      } else {
        // Auto-expand on desktop if no user preference set
        const userPreference = localStorage.getItem("sidebarCollapsed");
        if (userPreference === null) {
          dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: false });
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save sidebar state preference
  useEffect(() => {
    const currentState = state.sidebarCollapsed;
    if (window.innerWidth >= 1280) {
      localStorage.setItem("sidebarCollapsed", currentState.toString());
    }
  }, [state.sidebarCollapsed]);

  const contextValue: AppContextType = {
    state,
    dispatch,
    loadDashboardData,
    markNotificationAsRead,
    toggleSidebar,
    openModal,
    closeModal,
    showNotification,
    clearError,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Export the context for advanced usage
export { AppContext };
