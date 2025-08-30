import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type UserRole =
  | "super-admin"
  | "admin"
  | "principal"
  | "faculty"
  | "institution"
  | "hod"
  | "staff"
  | "student"
  | "parent";
import { fakeAuth } from "@/services/fakeAuth";
import { can, currentUserCan, PERMISSIONS } from "@/utils/permissions.js";

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  institution: string;
  institutionId?: string;
  institutionCode?: string;
  selectedInstitutionId?: string;
  selectedInstitutionCode?: string;
  department: string;
  studentId?: string;
  isHOD?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, context?: any) => Promise<User>;
  logout: () => Promise<void>;
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = fakeAuth.getCurrentUser();
        const authStatus = fakeAuth.isAuthenticated();

        if (currentUser && authStatus) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          // Clear any stale data
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for session expiration events
    const handleSessionExpired = () => {
      console.log("Session expired event received, logging out user");
      logout();
    };

    window.addEventListener('sessionExpired', handleSessionExpired);
    initializeAuth();

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    context?: any,
  ): Promise<User> => {
    setIsLoading(true);
    try {
      const userData = await fakeAuth.login(email, password, context);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await fakeAuth.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Permission checking functions
  const checkPermission = (permission: string): boolean => {
    return user?.role ? can(user.role, permission) : false;
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user?.role ? roles.includes(user.role) : false;
  };

  const refreshUser = (): void => {
    const currentUser = fakeAuth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    can: checkPermission,
    hasRole,
    hasAnyRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Additional hooks for common permission checks
export const usePermissions = () => {
  const { user, can: checkPermission } = useAuth();

  return {
    can: checkPermission,
    currentRole: user?.role,
    currentUser: user,
    isAdmin: checkPermission(PERMISSIONS.SYSTEM_ADMIN),
    isAcademicAdmin: checkPermission(PERMISSIONS.ACADEMIC_ADMIN),
    isStaff: user?.role === "staff",
    isStudent: user?.role === "student",
    isPrincipal: user?.role === "principal",
    isSuperAdmin: user?.role === "super_admin",
  };
};

// Hook for role-based rendering
export const useRoleBasedAccess = () => {
  const { user, can: checkPermission, hasRole, hasAnyRole } = useAuth();

  const canManageUsers = checkPermission(PERMISSIONS.USER_MANAGEMENT);
  const canManagePrograms = checkPermission(PERMISSIONS.PROGRAM_MANAGEMENT);
  const canManageCourses = checkPermission(PERMISSIONS.COURSE_MANAGEMENT);
  const canCreateContent = checkPermission(PERMISSIONS.CREATE_CONTENT);
  const canManageExams = checkPermission(PERMISSIONS.EXAM_ADMIN);
  const canViewReports = checkPermission(PERMISSIONS.ACADEMIC_REPORTS);

  return {
    user,
    checkPermission,
    hasRole,
    hasAnyRole,
    canManageUsers,
    canManagePrograms,
    canManageCourses,
    canCreateContent,
    canManageExams,
    canViewReports,
  };
};
