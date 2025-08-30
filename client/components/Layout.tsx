import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  hasModuleAccess,
  ModuleType,
  isValidModuleId,
  canAccessAllModulesInContext,
} from "@/utils/modulePermissions";
import { useApp } from "@/contexts/AppContext";
import { useSidebar } from "@/hooks/useDashboard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationSystem from "@/components/NotificationSystem";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  Settings,
  Menu,
  X,
  School,
  UserCheck,
  Calendar,
  ClipboardList,
  Award,
  MessageSquare,
  Video,
  BarChart3,
  FileQuestion,
  MapPin,
  Trophy,
  ChevronDown,
  TrendingUp,
  Building,
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: any;
  href?: string;
  children?: MenuItem[];
  module?: string;
  allowedRoles?: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    allowedRoles: [
      "super-admin",
      "admin",
      "institution",
      "principal",
      "hod",
      "faculty",
      "staff",
      "student",
      "parent",
    ],
  },
  {
    title: "Core System",
    icon: Settings,
    allowedRoles: ["super-admin"],
    children: [
      // Master Setup (AM01-AM02)
      {
        title: "Entity Setup",
        icon: School,
        href: "/master/entity-setup",
        allowedRoles: ["super-admin"],
      },
      {
        title: "Academic Year Setup",
        icon: Calendar,
        href: "/master/academic-year-setup",
        allowedRoles: ["super-admin"],
      },
      {
        title: "Program Setup",
        icon: GraduationCap,
        href: "/master/program-setup",
        allowedRoles: ["super-admin"],
      },
      {
        title: "Program Allotment",
        icon: Building,
        href: "/master/program-allotment",
        allowedRoles: ["super-admin"],
      },
      {
        title: " Program& Course Mapping",
        icon: BookOpen,
        href: "/master/stream-course-mapping",
        allowedRoles: ["super-admin"],
      },
      {
        title: "Term & Semester Setup",
        icon: Calendar,
        href: "/master/term-semester-setup",
        allowedRoles: ["super-admin", "admin"],
      },
      {
        title: "Course Master",
        icon: BookOpen,
        href: "/master/subject-master-setup",
        allowedRoles: ["super-admin"],
      },
      // {
      //   title: "Registration Forms",
      //   icon: FileText,
      //   href: "/master/registration-form-setup",
      //   allowedRoles: ["super-admin"],
      // },
      // Staff Allotment (AM13-AM14)
      {
        title: "Faculty Members",
        icon: GraduationCap,
        href: "/users/faculty",
        allowedRoles: ["super-admin"],
      },
      {
        title: "Student Records",
        icon: Users,
        href: "/users/students",
        allowedRoles: ["super-admin"],
      },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    allowedRoles: ["super-admin"],
    children: [
      {
        title: "Administrators",
        icon: UserCheck,
        href: "/users/admins",
        allowedRoles: ["super-admin"],
      },
      {
        title: "User Roles & Permissions",
        icon: Settings,
        href: "/master/user-role-permissions-setup",
        allowedRoles: ["super-admin"],
      },
      {
        title: "System Permissions",
        icon: Settings,
        href: "/settings/permissions",
        allowedRoles: ["super-admin"],
      },
    ],
  },
  {
    title: "Academics",
    icon: BookOpen,
    module: "academic-operation",
    allowedRoles: [
      "super-admin",
      "admin",
      "institution",
      "principal",
      "hod",
      "faculty",
      "staff",
      "student",
      "parent",
    ],
    children: [
      {
        title: "Students",
        icon: Users,
        href: "/academics/students",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
        ],
      },
      {
        title: "Faculties",
        icon: GraduationCap,
        href: "/academics/faculties",
        allowedRoles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Staff Roles",
        icon: UserCheck,
        href: "/staff/roles",
        allowedRoles: ["super-admin", "admin", "principal", "institution"],
      },
      {
        title: "Faculty Assignments",
        icon: Users,
        href: "/staff/allotment",
        allowedRoles: ["super-admin", "admin", "principal", "institution"],
      },
      {
        title: "Curriculum",
        icon: BookOpen,
        href: "/academics/curriculum",
        allowedRoles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Courses",
        icon: BookOpen,
        href: "/academics/courses",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty"
        ],
      },
      {
        title: "Timetable",
        icon: Calendar,
        href: "/academics/timetable",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "staff",
          "student",
          "parent",
        ],
      },
      {
        title: "Lesson Plans",
        icon: ClipboardList,
        href: "/academics/lesson-plans",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Session Plans",
        icon: Video,
        href: "/academics/session-plans",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Attendance",
        icon: UserCheck,
        href: "/academics/attendance",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "staff",
          "student",
          "parent",
        ],
      },
      {
        title: "Feedback",
        icon: MessageSquare,
        href: "/academics/feedback",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      // {
      //   title: "Scholarships",
      //   icon: Award,
      //   href: "/academics/scholarships",
      //   allowedRoles: [
      //     "super-admin",
      //     "admin",
      //     "institution",
      //     "principal",
      //     "hod",
      //     "faculty",
      //     "staff",
      //     "student",
      //   ],
      // },
      // {
      //   title: "Dropouts",
      //   icon: Users,
      //   href: "/academics/dropouts",
      //   allowedRoles: ["super-admin", "admin", "institution", "principal"],
      // },
      {
        title: "Calendar",
        icon: Calendar,
        href: "/academics/calendar",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "staff",
          "student",
          "parent",
        ],
      },
      // {
      //   title: "Reports",
      //   icon: BarChart3,
      //   href: "/academics/reports",
      //   allowedRoles: [
      //     "super-admin",
      //     "admin",
      //     "institution",
      //     "principal",
      //     "hod",
      //     "faculty",
      //     "staff",
      //     "student",
      //   ],
      // },
      // Communication (AM22-AM28)
      {
        title: "Notifications",
        icon: MessageSquare,
        href: "/academics/notifications",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      // Service Request (AM30-AM32)
      {
        title: "Service Requests",
        icon: ClipboardList,
        href: "/academics/service-requests",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "staff",
          "student",
        ],
      },
    ],
  },
  {
    title: "Learning Management",
    icon: GraduationCap,
    module: "lms",
    allowedRoles: [
      "super-admin",
      "admin",
      "institution",
      "principal",
      "hod",
      "faculty",
      "staff",
      "student",
      "parent",
    ],
    children: [
      {
        title: "Courses",
        icon: BookOpen,
        href: "/lms/courses",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "staff",
          "student",
          "parent",
        ],
      },
      {
        title: "Assignments",
        icon: ClipboardList,
        href: "/lms/assignments",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Assessments",
        icon: FileText,
        href: "/lms/assessments",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Progress",
        icon: BarChart3,
        href: "/lms/progress",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "staff",
          "student",
          "parent",
        ],
      },
      {
        title: "Lessons",
        icon: BookOpen,
        href: "/lms/lessons",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
          "parent",
        ],
      },
      {
        title: "Sessions",
        icon: Video,
        href: "/lms/sessions",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Cohorts",
        icon: Users,
        href: "/lms/cohorts",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Discussion Forums",
        icon: MessageSquare,
        href: "/lms/discussion-forums",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Certificates",
        icon: Award,
        href: "/lms/certificates",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Virtual Classrooms",
        icon: Video,
        href: "/lms/virtual-classrooms",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Skills",
        icon: Video,
        href: "/lms/skills",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Proctoring",
        icon: Video,
        href: "/lms/proctoring",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student"
        ],
      },
      // {
      //   title: "Reports",
      //   icon: BarChart3,
      //   href: "/lms/reports",
      //   allowedRoles: [
      //     "super-admin",
      //     "admin",
      //     "institution",
      //     "principal",
      //     "hod",
      //     "faculty",
      //   ],
      // },
    ],
  },
  {
    title: "Examinations",
    icon: FileText,
    module: "examination",
    allowedRoles: [
      "super-admin",
      "admin",
      "institution",
      "principal",
      "hod",
      "faculty",
      "staff",
      "student",
    ],
    children: [
      {
        title: "Planning",
        icon: Calendar,
        href: "/exams/planning",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Eligibility",
        icon: UserCheck,
        href: "/exams/eligibility",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Hall Tickets",
        icon: FileText,
        href: "/exams/halltickets",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Question Bank",
        icon: FileQuestion,
        href: "/exams/question-bank",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Paper Blueprint",
        icon: ClipboardList,
        href: "/exams/paper-blueprint",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Paper Generation",
        icon: FileText,
        href: "/exams/paper-generation",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Invigilators",
        icon: Users,
        href: "/exams/invigilators",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Seating Plan",
        icon: MapPin,
        href: "/exams/seating-plan",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Evaluation",
        icon: ClipboardList,
        href: "/exams/evaluation",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Results",
        icon: BarChart3,
        href: "/exams/results",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Revaluation",
        icon: FileText,
        href: "/exams/revaluation",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Transcripts",
        icon: Trophy,
        href: "/exams/transcripts",
        allowedRoles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      // {
      //   title: "Reports",
      //   icon: BarChart3,
      //   href: "/exams/reports",
      //   allowedRoles: [
      //     "super-admin",
      //     "admin",
      //     "institution",
      //     "principal",
      //     "hod",
      //     "faculty",
      //     "student",
      //   ],
      // },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/reports",
    allowedRoles: [
      "super-admin",
      "admin",
      "institution",
      "principal",
      "hod",
      "faculty",
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Dashboard",
    "Academics",
    "Learning Management",
    "Examinations",
  ]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Always call hooks to maintain consistent hook order
  let appState, showNotification;

  // Handle AppContext safely
  let appContext;
  try {
    appContext = useApp();
  } catch (error) {
    console.warn("AppContext not yet available:", error);
    appContext = null;
  }

  // Set values with fallbacks
  if (appContext) {
    appState = appContext.state;
    showNotification = appContext.showNotification;
  } else {
    appState = { sidebarCollapsed: false };
    showNotification = () =>
      console.warn("showNotification called before AppContext ready");
  }

  // Get selected module from location state
  let selectedModule = location.state?.selectedModule;
  let scopedToModule = location.state?.scopedToModule;

  // Fallback: try to infer from URL if not in state
  if (!scopedToModule || !selectedModule) {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      const possibleModule = pathSegments[0];

      // Check if this is a module-specific URL
      if (possibleModule === "lms") {
        scopedToModule = true;
        selectedModule = "lms";
      } else if (possibleModule === "academics") {
        scopedToModule = true;
        selectedModule = "academic-operation";
      } else if (possibleModule === "exams") {
        scopedToModule = true;
        selectedModule = "examination";
      }
    }
  }

  // Handle menu item click with feedback
  const handleMenuItemClick = (item: MenuItem) => {
    if (item.href) {
      console.log("🔍 Navigation click:", {
        title: item.title,
        href: item.href,
        userRole: user?.role,
        allowedRoles: item.allowedRoles,
      });

      showNotification({
        type: "info",
        title: `Navigating to ${item.title}`,
        message: `Loading ${item.title} module...`,
        read: false,
      });
    }
  };

  // Filter menu items based on user role, module access, and selected module scope
  const filterMenuItemsByRole = (
    items: MenuItem[],
    userRole: UserRole,
  ): MenuItem[] => {
    return items
      .filter((item) => {
        // If no allowed roles specified, show to all
        if (!item.allowedRoles) return true;

        // Check if user role is allowed, including institution/principal combination
        const hasRoleAccess =
          item.allowedRoles.includes(userRole) ||
          (item.allowedRoles.includes("institution") &&
            userRole === "principal") ||
          (item.allowedRoles.includes("principal") &&
            userRole === "institution");

        if (!hasRoleAccess) return false;

        // Additional module-level access check
        if (item.module && isValidModuleId(item.module)) {
          const hasModAccess = hasModuleAccess(
            userRole,
            item.module as ModuleType,
          );
          if (!hasModAccess) return false;
        }

        // If item has children, filter them too
        if (item.children) {
          const filteredChildren = filterMenuItemsByRole(
            item.children,
            userRole,
          );
          // Only show parent if it has visible children or if it's explicitly allowed
          const parentHasAccess =
            item.allowedRoles.includes(userRole) ||
            (item.allowedRoles.includes("institution") &&
              userRole === "principal") ||
            (item.allowedRoles.includes("principal") &&
              userRole === "institution");
          return filteredChildren.length > 0 || parentHasAccess;
        }

        return true;
      })
      .map((item) => {
        // Filter children if they exist
        if (item.children) {
          return {
            ...item,
            children: filterMenuItemsByRole(item.children, userRole),
          };
        }
        return item;
      });
  };

  const filteredMenuItems = user
    ? filterMenuItemsByRole(menuItems, user.role)
    : [];

  const toggleExpanded = (title: string) => {
    const isCurrentlyExpanded = expandedItems.includes(title);

    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );

    // Provide audio/visual feedback
    showNotification({
      type: "info",
      title: `${title} Menu`,
      message: `${isCurrentlyExpanded ? "Collapsed" : "Expanded"} ${title} menu`,
      read: false,
    });
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isActive = item.href === location.pathname;
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <button
            className={cn(
              "w-full flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-700 rounded-lg transition-colors",
              sidebarCollapsed
                ? "justify-center p-3"
                : "justify-between px-3 py-2.5",
            )}
            onClick={() => toggleExpanded(item.title)}
            title={sidebarCollapsed ? item.title : undefined}
          >
            <div
              className={cn(
                "flex items-center",
                sidebarCollapsed ? "" : "gap-3",
              )}
            >
              <item.icon
                className={cn(
                  "flex-shrink-0",
                  sidebarCollapsed ? "h-6 w-6" : "h-5 w-5",
                )}
              />
              {!sidebarCollapsed && (
                <span className="truncate">{item.title}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform text-gray-400 flex-shrink-0",
                  isExpanded && "rotate-180",
                )}
              />
            )}
          </button>
          {isExpanded && !sidebarCollapsed && (
            <div className="ml-4 space-y-1 border-l border-gray-200 pl-4">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        to={item.href!}
        className={cn(
          "flex items-center text-sm font-medium rounded-lg transition-colors",
          sidebarCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5",
          level > 0
            ? "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            : "text-gray-700 hover:text-blue-700 hover:bg-gray-50",
          isActive && "bg-blue-50 text-blue-700 font-semibold",
        )}
        onClick={() => handleMenuItemClick(item)}
        title={sidebarCollapsed ? item.title : undefined}
      >
        <item.icon
          className={cn(
            "flex-shrink-0",
            sidebarCollapsed ? "h-6 w-6" : "h-5 w-5",
          )}
        />
        {!sidebarCollapsed && <span className="truncate">{item.title}</span>}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Fixed Sidebar - Always Visible */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          // Responsive width system - always visible
          sidebarCollapsed
            ? "w-16 sm:w-20" // Collapsed: 64px on mobile, 80px on sm+
            : "w-64 sm:w-72 lg:w-80", // Expanded: 256px mobile, 288px sm, 320px lg+
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
          <div
            className={cn(
              "flex items-center gap-2 sm:gap-3",
              sidebarCollapsed && "justify-center w-full",
            )}
          >
            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
              <School
                className={cn(
                  "text-white",
                  sidebarCollapsed
                    ? "h-6 w-6 sm:h-7 sm:w-7"
                    : "h-5 w-5 sm:h-6 sm:w-6",
                )}
              />
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                DOTE ERP
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
          <nav
            className={cn("space-y-1 sm:space-y-2", sidebarCollapsed && "px-1")}
          >
            {filteredMenuItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>

        {/* User Menu */}
        <div className="p-2 sm:p-4 border-t flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3",
                  sidebarCollapsed ? "justify-center p-3" : "justify-start",
                )}
              >
                <Avatar
                  className={cn(
                    sidebarCollapsed
                      ? "h-8 w-8 sm:h-9 sm:w-9"
                      : "h-7 w-7 sm:h-8 sm:w-8",
                  )}
                >
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium truncate">
                        {user?.name}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {user?.role}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile-settings")}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/help-support")}>
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  showNotification({
                    type: "success",
                    title: "Signed Out",
                    message: "You have been successfully signed out",
                    read: false,
                  });
                  logout();
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content - Always offset by sidebar */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300",
          // Offset main content by sidebar width
          sidebarCollapsed ? "ml-16 sm:ml-20" : "ml-64 sm:ml-72 lg:ml-80",
        )}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 capitalize">
                {user?.role} Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationSystem />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile-settings")}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    showNotification({
                      type: "success",
                      title: "Signed Out",
                      message: "You have been successfully signed out",
                      read: false,
                    });
                    logout();
                  }}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
